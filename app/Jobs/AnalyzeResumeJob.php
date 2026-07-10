<?php

namespace App\Jobs;

use App\Models\Resume;
use App\Models\ResumeAnalysis;
use App\Services\ResumeAnalysisService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Runs the AI over one resume, off the request cycle.
 *
 * The payload is a resume *id*, never the model. Serializing an Eloquent model
 * would freeze a snapshot of its attributes into the queue table, and the row
 * the worker eventually acts on could be minutes stale — or deleted. An id is
 * a few bytes, and re-fetching guarantees the job sees the resume as it is now.
 */
class AnalyzeResumeJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /**
     * Seconds to wait before the 2nd and 3rd attempts.
     *
     * @var array<int, int>
     */
    public array $backoff = [10, 30, 60];

    /** Gemini is slow but not this slow; past two minutes something is wrong. */
    public int $timeout = 120;

    public function __construct(public readonly int $resumeId) {}

    public function handle(ResumeAnalysisService $analyses): void
    {
        $resume = Resume::find($this->resumeId);

        // The candidate deleted the resume while the job sat in the queue.
        // Nothing to analyze, and nothing worth failing over.
        if ($resume === null) {
            return;
        }

        // The service owns every status transition (pending → processing →
        // completed/failed) and rethrows as ResumeAnalysisException, which is
        // what lets the queue count the attempt and back off.
        $analyses->analyze($resume);
    }

    /**
     * Called once, after the final attempt has been exhausted.
     */
    public function failed(?Throwable $exception): void
    {
        // The service already wrote `failed` on the way out of each attempt.
        // This is the backstop for the paths it cannot cover — a timeout, or a
        // worker killed mid-flight — so the row never sticks on `processing`.
        ResumeAnalysis::query()
            ->where('resume_id', $this->resumeId)
            ->update(['status' => 'failed', 'analyzed_at' => now()]);

        Log::error('Resume analysis job failed.', [
            'resume_id' => $this->resumeId,
            'exception' => $exception?->getMessage(),
        ]);
    }
}
