<?php

namespace App\Services\AI;

use Illuminate\Support\Str;

/**
 * Everything that is identical whatever the vendor: the prompts, the defensive
 * JSON parsing, and the normalization that guarantees the shape callers rely on.
 * Subclasses only have to turn a prompt into a completion.
 *
 * @phpstan-import-type AnalysisResult from AiProvider
 */
abstract class AbstractAiProvider implements AiProvider
{
    /**
     * Resumes are usually 2 pages, but a PDF of scanned junk can be enormous.
     * Cap the prompt so one bad upload cannot blow up the context or the bill.
     */
    protected const MAX_RESUME_CHARS = 20000;

    /** A job description is bounded by the form, but never trust that here. */
    protected const MAX_JOB_CHARS = 8000;

    /**
     * Turn a prompt into the model's raw completion text.
     *
     * @throws AiProviderException
     */
    abstract protected function complete(string $prompt): string;

    /**
     * @return AnalysisResult
     */
    public function analyzeResume(string $resumeText, ?string $jobContext = null): array
    {
        $decoded = $this->decodeJson(
            $this->complete($this->analysisPrompt($resumeText, $jobContext))
        );

        return $this->normalizeAnalysis($decoded);
    }

    public function matchResumeToJob(string $resumeText, string $jobDescription): int
    {
        $decoded = $this->decodeJson(
            $this->complete($this->matchPrompt($resumeText, $jobDescription))
        );

        return $this->toScore($decoded['match_score'] ?? null);
    }

    /**
     * The analysis prompt. Three things keep the output parseable: the response
     * is pinned to one JSON object, every key is declared mandatory (so we never
     * branch on missing keys), and empty arrays stand in for nulls.
     */
    protected function analysisPrompt(string $resumeText, ?string $jobContext): string
    {
        $prompt = <<<'PROMPT'
        You are an expert technical recruiter reviewing a candidate's resume.

        OUTPUT RULES
        - Respond with a single raw JSON object and nothing else.
        - No markdown, no ``` fences, no commentary before or after the JSON.
        - Every key in the schema must be present on every response. Never omit a key.
        - Use an empty array [] when you find nothing for an array key. Never use null.
        - Use the string "Not specified" when a string field is absent from the resume.
        - Base every statement strictly on the resume text. Never invent an employer,
          a date, a degree, or a technology that does not appear in it.
        - Write the prose in English, in the third person, without naming the candidate.

        SCHEMA
        {
          "extracted_skills": ["string"],
          "extracted_experience": [
            {"title": "string", "company": "string", "duration": "string", "highlights": ["string"]}
          ],
          "extracted_education": [
            {"degree": "string", "institution": "string", "year": "string"}
          ],
          "overall_score": 0,
          "summary": "string",
          "strengths": ["string"],
          "weaknesses": ["string"],
          "recommendations": ["string"]
        }

        FIELD RULES
        - extracted_skills: concrete technologies, tools, and languages. Deduplicated, at most 25.
        - extracted_experience: most recent role first, at most 10 roles.
        - extracted_education: at most 5 entries.
        - summary: 2 to 3 sentences on who this candidate is professionally.
        - strengths: 3 to 5 items, one sentence each.
        - weaknesses: 2 to 4 items, one sentence each. Be candid but constructive.
        - recommendations: 3 to 5 concrete, actionable improvements to the resume itself.

        SCORING RUBRIC for overall_score (integer, 0 to 100)
        - 90-100: exceptional. Deep expertise with measurable, quantified impact.
        - 75-89:  strong. Clearly hireable, well evidenced.
        - 60-74:  solid, with some visible gaps.
        - 40-59:  junior, or thin evidence for the claims made.
        - 0-39:   little relevant professional signal.
        PROMPT;

        if ($jobContext !== null && trim($jobContext) !== '') {
            $job = $this->clamp($jobContext, self::MAX_JOB_CHARS);

            // Anchoring the score and the advice to a concrete role turns a
            // generic review into a targeted one.
            $prompt .= <<<PROMPT


            TARGET ROLE
            Judge overall_score, weaknesses, and recommendations against the requirements
            of the role below rather than against a generic bar.
            <<<ROLE
            {$job}
            ROLE

            PROMPT;
        }

        $resume = $this->clamp($resumeText, self::MAX_RESUME_CHARS);

        // The delimiters stop resume prose from reading as further instructions.
        $prompt .= <<<PROMPT


        RESUME
        <<<RESUME
        {$resume}
        RESUME
        PROMPT;

        return $prompt;
    }

    /**
     * The match prompt. Asking for a wrapper object rather than a bare integer
     * lets the exact same decoder handle both calls.
     */
    protected function matchPrompt(string $resumeText, string $jobDescription): string
    {
        $resume = $this->clamp($resumeText, self::MAX_RESUME_CHARS);
        $job = $this->clamp($jobDescription, self::MAX_JOB_CHARS);

        return <<<PROMPT
        You are an expert technical recruiter scoring how well one resume fits one job.

        OUTPUT RULES
        - Respond with a single raw JSON object and nothing else.
        - No markdown, no ``` fences, no commentary before or after the JSON.
        - The object has exactly one key, "match_score", an integer from 0 to 100.

        SCHEMA
        {"match_score": 0}

        SCORING RUBRIC
        - 85-100: meets or exceeds nearly every stated requirement.
        - 70-84:  strong overlap, only minor gaps.
        - 50-69:  partial overlap, notable gaps in required skills or seniority.
        - 25-49:  weak overlap, most requirements unmet.
        - 0-24:   unrelated field or experience level.

        JOB DESCRIPTION
        <<<ROLE
        {$job}
        ROLE

        RESUME
        <<<RESUME
        {$resume}
        RESUME
        PROMPT;
    }

    /**
     * Decode a completion that is supposed to be one JSON object, forgiving the
     * two things models do anyway: wrapping it in a fence, and padding it with a
     * sentence of preamble.
     *
     * @return array<string, mixed>
     *
     * @throws AiProviderException
     */
    protected function decodeJson(string $raw): array
    {
        $text = trim($raw);

        // ```json { ... } ``` — by far the most common violation of "no fences".
        if (preg_match('/```(?:json)?\s*(.*?)\s*```/is', $text, $matches) === 1) {
            $text = trim($matches[1]);
        }

        $decoded = json_decode($text, true);

        // Otherwise fall back to the outermost braces, which strips any prose
        // the model wrapped around the object.
        if (! is_array($decoded)) {
            $start = strpos($text, '{');
            $end = strrpos($text, '}');

            if ($start === false || $end === false || $end <= $start) {
                throw new AiProviderException('The model did not return a JSON object.');
            }

            $decoded = json_decode(substr($text, $start, $end - $start + 1), true);
        }

        if (! is_array($decoded)) {
            throw new AiProviderException('The model returned malformed JSON: '.json_last_error_msg());
        }

        /** @var array<string, mixed> $decoded */
        return $decoded;
    }

    /**
     * Coerce a decoded object into the exact shape the columns expect. The model
     * is instructed to always send every key, but a missing or mistyped one must
     * never reach the database, so each field is rebuilt from scratch here.
     *
     * @param  array<string, mixed>  $decoded
     * @return AnalysisResult
     */
    protected function normalizeAnalysis(array $decoded): array
    {
        return [
            'extracted_skills' => $this->toStringList($decoded['extracted_skills'] ?? null, 25),
            'extracted_experience' => $this->toObjectList($decoded['extracted_experience'] ?? null, 10),
            'extracted_education' => $this->toObjectList($decoded['extracted_education'] ?? null, 5),
            'overall_score' => $this->toScore($decoded['overall_score'] ?? null),
            'summary' => $this->toText($decoded['summary'] ?? null),
            'strengths' => $this->toStringList($decoded['strengths'] ?? null, 8),
            'weaknesses' => $this->toStringList($decoded['weaknesses'] ?? null, 8),
            'recommendations' => $this->toStringList($decoded['recommendations'] ?? null, 8),
        ];
    }

    /**
     * Clamp anything the model calls a score into the 0-100 the column allows.
     * A non-numeric score means the model ignored the schema, so it becomes 0
     * rather than an exception — the rest of the analysis is still worth having.
     */
    protected function toScore(mixed $value): int
    {
        if (! is_numeric($value)) {
            return 0;
        }

        return (int) max(0, min(100, round((float) $value)));
    }

    protected function toText(mixed $value): string
    {
        return is_string($value) ? trim($value) : '';
    }

    /**
     * @return list<string>
     */
    protected function toStringList(mixed $value, int $limit): array
    {
        if (! is_array($value)) {
            return [];
        }

        $items = [];

        foreach ($value as $item) {
            // Models occasionally send {"skill": "PHP"} where a string was asked
            // for. Take the first scalar rather than dropping the entry.
            if (is_array($item)) {
                $item = collect($item)->first(fn (mixed $leaf): bool => is_scalar($leaf));
            }

            if (! is_scalar($item)) {
                continue;
            }

            $text = trim((string) $item);

            if ($text !== '') {
                $items[] = $text;
            }
        }

        return array_slice(array_values(array_unique($items)), 0, $limit);
    }

    /**
     * @return list<array<string, mixed>>
     */
    protected function toObjectList(mixed $value, int $limit): array
    {
        if (! is_array($value)) {
            return [];
        }

        $items = [];

        foreach ($value as $item) {
            if (is_array($item) && $item !== []) {
                /** @var array<string, mixed> $item */
                $items[] = $item;
            }
        }

        return array_slice($items, 0, $limit);
    }

    /**
     * Truncate on a character budget. `Str::limit` never splits a multibyte
     * character, so the prompt stays valid UTF-8 whatever the PDF held.
     */
    protected function clamp(string $text, int $limit): string
    {
        return Str::limit(trim($text), $limit, '');
    }
}
