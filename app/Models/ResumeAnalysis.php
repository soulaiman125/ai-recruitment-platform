<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResumeAnalysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'resume_id',
        'extracted_skills',
        'extracted_experience',
        'extracted_education',
        'overall_score',
        'summary',
        'strengths',
        'weaknesses',
        'recommendations',
        'ai_provider',
        'status',
        'analyzed_at',
    ];

    protected function casts(): array
    {
        return [
            'extracted_skills' => 'array',
            'extracted_experience' => 'array',
            'extracted_education' => 'array',
            'strengths' => 'array',
            'weaknesses' => 'array',
            'recommendations' => 'array',
            'analyzed_at' => 'datetime',
        ];
    }

    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }
}