<?php

namespace App\Services\AI;

/**
 * The contract every AI vendor implements, so swapping one for another is a
 * single line in `.env`. The keys of an analysis mirror the `resume_analyses`
 * columns one for one, which is what lets the service persist them blindly.
 *
 * @phpstan-type AnalysisResult array{
 *     extracted_skills: list<string>,
 *     extracted_experience: list<array<string, mixed>>,
 *     extracted_education: list<array<string, mixed>>,
 *     overall_score: int,
 *     summary: string,
 *     strengths: list<string>,
 *     weaknesses: list<string>,
 *     recommendations: list<string>,
 * }
 */
interface AiProvider
{
    /**
     * Score and break down a resume, optionally against the job it targets.
     *
     * @return AnalysisResult
     *
     * @throws AiProviderException
     */
    public function analyzeResume(string $resumeText, ?string $jobContext = null): array;

    /**
     * Score how well one resume fits one job description, from 0 to 100.
     *
     * @throws AiProviderException
     */
    public function matchResumeToJob(string $resumeText, string $jobDescription): int;

    /**
     * Complete a bounded JSON-only recruitment workflow through the configured
     * provider. All AI capability remains behind the existing vendor contract.
     *
     * @return array<string, mixed>
     *
     * @throws AiProviderException
     */
    public function completeJson(string $prompt): array;

    /**
     * The name persisted to `resume_analyses.ai_provider`.
     */
    public function name(): string;
}
