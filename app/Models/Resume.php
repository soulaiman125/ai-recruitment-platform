<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Resume extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_profile_id',
        'title',
        'file_path',
        'original_name',
        'mime_type',
        'file_size',
        'parsed_text',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(CandidateProfile::class, 'candidate_profile_id');
    }

    public function analysis(): HasOne
    {
        return $this->hasOne(ResumeAnalysis::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}