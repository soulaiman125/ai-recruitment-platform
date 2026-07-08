<?php

namespace App\Concerns;

use App\Models\JobPosting;
use Illuminate\Contracts\Validation\ValidationRule;

trait JobPostingValidationRules
{
    /**
     * Get the validation rules used to validate job postings.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function jobPostingRules(): array
    {
        $salaryMax = ['nullable', 'numeric', 'min:0', 'max:99999999.99'];

        // Only compare against the floor when one was supplied, otherwise
        // `gte` would compare a number against null and throw.
        if ($this->filled('salary_min')) {
            $salaryMax[] = 'gte:salary_min';
        }

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'requirements' => ['nullable', 'string'],
            'skills' => ['nullable', 'array', 'max:25'],
            'skills.*' => ['required', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['nullable', 'in:'.implode(',', JobPosting::EMPLOYMENT_TYPES)],
            'work_mode' => ['nullable', 'in:'.implode(',', JobPosting::WORK_MODES)],
            'experience_level' => ['nullable', 'in:'.implode(',', JobPosting::EXPERIENCE_LEVELS)],
            'salary_min' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'salary_max' => $salaryMax,
            'deadline' => ['nullable', 'date'],
            'status' => ['nullable', 'in:'.implode(',', JobPosting::STATUSES)],
        ];
    }
}
