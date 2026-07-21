<?php

namespace App\Listeners;

use App\AI\Memory\MemoryService;
use App\Events\ResumeAnalysisCompleted;
use App\Services\SkillProgressService;

class ResumeMemoryListener
{
   public function __construct(
    private readonly MemoryService $memoryService,
    private readonly SkillProgressService $skillProgressService,
) {}
    public function handle(ResumeAnalysisCompleted $event): void
    {
        $resume = $event->resume;
        $analysis = $event->analysis;

        $this->memoryService->remember(
            candidateId: $resume->candidate->user_id,
            category: 'AI_ANALYSIS',
            title: 'Resume AI Analysis Completed',
            content: sprintf(
                'AI analyzed your resume. Overall score: %d. Found %d skills and generated %d recommendations.',
                $analysis->overall_score,
                count($analysis->extracted_skills ?? []),
                count($analysis->recommendations ?? []),
            ),
            importance: 10,
            metadata: [
                'resume_id' => $resume->id,
                'analysis_id' => $analysis->id,
                'overall_score' => $analysis->overall_score,
            ],
        );
        $this->skillProgressService->syncFromResume($resume, $analysis);
    }
}