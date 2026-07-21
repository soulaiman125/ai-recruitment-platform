<?php

namespace App\Services;

use App\Models\CandidateSkillProgress;
use App\Models\Resume;
use App\Models\ResumeAnalysis;

class SkillProgressService
{
    public function syncFromResume(Resume $resume, ResumeAnalysis $analysis): void
    {
        $skills = $analysis->extracted_skills;

        if (!is_array($skills) || empty($skills)) {
            return;
        }

        $candidateId = $resume->candidate->user_id;

        foreach ($skills as $skill) {

            $record = CandidateSkillProgress::firstOrNew([
                'candidate_id' => $candidateId,
                'skill_name'   => $skill,
            ]);

            $record->xp = ($record->xp ?? 0) + 10;
            $record->last_used_at = now();
            $record->level = $this->calculateLevel($record->xp);

            $record->save();
        }
    }

    private function calculateLevel(int $xp): int
    {
        return match (true) {
            $xp >= 500 => 4,
            $xp >= 300 => 3,
            $xp >= 150 => 2,
            default => 1,
        };
    }
}