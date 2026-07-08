<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPosting extends Model
{
    use HasFactory;

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

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
            'deadline' => 'date',
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