<?php

namespace App\AI\Memory;

use App\Models\CandidateMemory;
use App\Models\CandidateTimeline;

class MemoryService
{
    public function remember(
        int $candidateId,
        string $category,
        string $title,
        string $content,
        int $importance = 5,
        array $metadata = []
    ): void {

        CandidateMemory::create([
            'candidate_id' => $candidateId,
            'category' => $category,
            'title' => $title,
            'content' => $content,
            'importance' => $importance,
            'metadata' => $metadata,
        ]);

        CandidateTimeline::create([
            'candidate_id' => $candidateId,
            'event' => strtolower($category),
            'title' => $title,
            'description' => $content,
            'metadata' => $metadata,
        ]);
    }
}