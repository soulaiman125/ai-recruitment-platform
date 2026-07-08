<?php

namespace App\Services;

use App\Models\JobPosting;
use App\Models\Resume;
use App\Models\ResumeAnalysis;
use App\Services\AI\AiProvider;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;
use Throwable;

class ResumeAnalysisService
{
    /**
     * Below this many characters a PDF is almost certainly a scanned image with
     * no text layer, and there is nothing for the model to read.
     */
    private const MIN_USABLE_CHARS = 40;

    public function __construct(
        private readonly AiProvider $provider,
        private readonly Parser $parser,
    ) {}

    /**
     * Analyze a resume and persist the result, optionally against the job it
     * targets. Throws {@see ResumeAnalysisException} with a message safe to show
     * the candidate, having first recorded the failure on the analysis row.
     *
     * @throws ResumeAnalysisException
     */
    public function analyze(Resume $resume, ?JobPosting $job = null): ResumeAnalysis
    {
        // A re-analysis reuses the existing row, so a resume never accumulates
        // more than the one analysis its `hasOne` promises.
        $analysis = ResumeAnalysis::firstOrCreate(['resume_id' => $resume->id], ['status' => 'pending']);

        $analysis->update([
            'status' => 'processing',
            'ai_provider' => $this->provider->name(),
        ]);

        try {
            $text = $this->resumeText($resume);

            $result = $this->provider->analyzeResume($text, $job?->description);

            $analysis->update([
                ...$result,
                'status' => 'completed',
                'analyzed_at' => now(),
            ]);
        } catch (Throwable $e) {
            // The row records the attempt so the UI can offer a retry, and the
            // real cause goes to the log rather than to the candidate.
            $analysis->update([
                'status' => 'failed',
                'analyzed_at' => now(),
            ]);

            Log::error('Resume analysis failed.', [
                'resume_id' => $resume->id,
                'provider' => $this->provider->name(),
                'exception' => $e,
            ]);

            throw new ResumeAnalysisException($this->friendlyMessage($e), previous: $e);
        }

        return $analysis;
    }

    /**
     * Score how well a resume fits a job posting, or null when there is nothing
     * to score against. A scoring failure is deliberately swallowed: the score
     * is a nice-to-have on someone's job application, never a reason to fail it.
     */
    public function matchScore(Resume $resume, JobPosting $job): ?int
    {
        $description = trim((string) $job->description);

        /** @var ResumeAnalysis|null $analysis */
        $analysis = $resume->analysis;

        // Only a completed analysis guarantees `parsed_text` is populated, and
        // a job with no description gives the model nothing to match against.
        if ($analysis?->status !== 'completed' || $description === '') {
            return null;
        }

        $text = trim((string) $resume->parsed_text);

        if ($text === '') {
            return null;
        }

        try {
            return $this->provider->matchResumeToJob($text, $description);
        } catch (Throwable $e) {
            Log::warning('Match scoring failed.', [
                'resume_id' => $resume->id,
                'job_posting_id' => $job->id,
                'provider' => $this->provider->name(),
                'exception' => $e,
            ]);

            return null;
        }
    }

    /**
     * The resume's text, extracted from the PDF and cached on the row the first
     * time. Extraction is the slow, failure-prone half of an analysis, so a
     * re-analysis never pays for it twice.
     *
     * @throws ResumeAnalysisException
     */
    private function resumeText(Resume $resume): string
    {
        $cached = trim((string) $resume->parsed_text);

        if ($cached !== '') {
            return $cached;
        }

        $disk = Storage::disk('public');

        if (! $disk->exists($resume->file_path)) {
            throw new ResumeAnalysisException(__('The file for this resume is missing.'));
        }

        try {
            $text = $this->parser->parseFile($disk->path($resume->file_path))->getText();
        } catch (Throwable $e) {
            throw new ResumeAnalysisException(
                __('We could not read this PDF. Try re-exporting it and uploading it again.'),
                previous: $e,
            );
        }

        $text = $this->normalize($text);

        // A text layer this thin means a scan or an image-only export. Sending
        // it would burn a call to have the model describe an empty page.
        if (mb_strlen($text) < self::MIN_USABLE_CHARS) {
            throw new ResumeAnalysisException(
                __('We could not find any text in this PDF. It looks like a scanned image rather than a text document.')
            );
        }

        $resume->update(['parsed_text' => $text]);

        return $text;
    }

    /**
     * pdfparser emits ligatures, non-breaking spaces, and a lot of vertical
     * whitespace. Collapsing it keeps the prompt cheap and readable, and any
     * remaining garbage is passed through for the model to do its best with.
     */
    private function normalize(string $text): string
    {
        $text = str_replace(["\u{00A0}", "\r\n", "\r"], [' ', "\n", "\n"], $text);

        // Trailing spaces on every line, then runs of 3+ blank lines.
        $text = (string) preg_replace('/[ \t]+$/m', '', $text);
        $text = (string) preg_replace('/\n{3,}/', "\n\n", $text);
        $text = (string) preg_replace('/[ \t]{2,}/', ' ', $text);

        return trim($text);
    }

    /**
     * Extraction failures already carry a message written for the candidate.
     * Anything else — a provider outage, a malformed completion — becomes one.
     */
    private function friendlyMessage(Throwable $e): string
    {
        return $e instanceof ResumeAnalysisException
            ? $e->getMessage()
            : __('The AI service could not analyze this resume right now. Please try again in a moment.');
    }
}
