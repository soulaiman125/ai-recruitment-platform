<?php

namespace App\Jobs;

use App\Models\Application;
use App\Models\JobPosting;
use App\Models\Resume;
use App\Services\ResumeAnalysisService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Scores one application's resume against the job it targets.
 *
 * Dispatched by id rather than by model for the same reason as
 * {@see AnalyzeResumeJob}: a small payload, and a row read fresh at run time
 * rather than a snapshot taken at dispatch time.
 *
 * A missing score is not an error. `matchScore()` already returns null whenever
 * the analysis is unfinished, the description is empty, or the provider is
 * unreachable — an application is never held hostage to the AI being up.
 */
class ScoreApplicationJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /**
     * Seconds to wait before the 2nd and 3rd attempts.
     *
     * @var array<int, int>
     */
    public array $backoff = [10, 30, 60];

    public int $timeout = 120;

    public function __construct(
        public readonly int $applicationId,
        public readonly int $jobPostingId,
    ) {}

    public function handle(ResumeAnalysisService $analyses): void
    {
        $application = Application::find($this->applicationId);
        $job = JobPosting::find($this->jobPostingId);

        // Either side can vanish while the job waits in the queue.
        if ($application === null || $job === null) {
            return;
        }

        /** @var Resume|null $resume */
        $resume = $application->resume;

        // The candidate attached no resume, or deleted the one they attached.
        if ($resume === null) {
            return;
        }

        $score = $analyses->matchScore($resume, $job);

        if ($score !== null) {
            $application->update(['match_score' => $score]);
        }
    }

    /**
     * A score is a nice-to-have, so a permanent failure is logged and dropped.
     * The recruiter simply sees an unscored applicant, which their table
     * already renders and already sorts to the bottom.
     */
    public function failed(?Throwable $exception): void
    {
        Log::warning('Match scoring job failed.', [
            'application_id' => $this->applicationId,
            'job_posting_id' => $this->jobPostingId,
            'exception' => $exception?->getMessage(),
        ]);
    }
}
