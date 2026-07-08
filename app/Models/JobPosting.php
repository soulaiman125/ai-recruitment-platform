<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPosting extends Model
{
    use HasFactory;

    public const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

    public const WORK_MODES = ['remote', 'onsite', 'hybrid'];

    public const EXPERIENCE_LEVELS = ['junior', 'mid', 'senior'];

    public const STATUSES = ['draft', 'published', 'paused', 'closed'];

    protected $fillable = [
        'company_id',
        'recruiter_profile_id',
        'title',
        'slug',
        'description',
        'requirements',
        'skills',
        'location',
        'employment_type',
        'work_mode',
        'experience_level',
        'salary_min',
        'salary_max',
        'status',
        'deadline',
    ];

    /**
     * كنستعملو الـ slug فـ الـ URL عوض الـ id.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
            // Serialize as Y-m-d so <input type="date"> can consume it directly.
            'deadline' => 'date:Y-m-d',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function recruiter(): BelongsTo
    {
        return $this->belongsTo(RecruiterProfile::class, 'recruiter_profile_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}