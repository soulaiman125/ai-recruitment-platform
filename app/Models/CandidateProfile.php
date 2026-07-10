<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CandidateProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'bio',
        'phone',
        'location',
        'avatar',
        'skills',
        'experience_level',
        'experience_years',
        'linkedin',
        'github',
        'portfolio',
        'is_open_to_work',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'is_open_to_work' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function resumes(): HasMany
    {
        return $this->hasMany(Resume::class);
    }

    /**
     * The postings this candidate bookmarked to apply to later.
     *
     * @return BelongsToMany<JobPosting, $this>
     */
    public function savedJobs(): BelongsToMany
    {
        return $this->belongsToMany(JobPosting::class, 'saved_jobs')
            ->withTimestamps();
    }
}