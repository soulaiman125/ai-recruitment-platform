<?php

namespace Database\Factories;

use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<JobPosting>
 */
class JobPostingFactory extends Factory
{
    protected $model = JobPosting::class;

    public function definition(): array
    {
        $title = fake()->randomElement([
            'Laravel Backend Developer',
            'React Frontend Developer',
            'Full Stack Developer',
            'AI Engineer',
            'Machine Learning Engineer',
            'DevOps Engineer',
            'Cloud Engineer',
            'Cybersecurity Analyst',
            'Flutter Mobile Developer',
            'Java Spring Boot Developer',
            'Python Backend Developer',
            'QA Automation Engineer',
            'UI/UX Designer',
            'Data Analyst',
            'Business Intelligence Developer',
            'IT Support Engineer',
            'Network Engineer',
            'PHP Developer',
            'Node.js Developer',
            'Software Engineer',
        ]);

        return [
            'company_id' => 1,
            'recruiter_profile_id' => 1,

            'title' => $title,

            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1000,9999),

            'description' => fake()->paragraphs(4, true),

            'requirements' => fake()->paragraphs(3, true),

            'skills' => fake()->randomElements([
                'Laravel',
                'PHP',
                'React',
                'Vue',
                'Node.js',
                'Java',
                'Spring Boot',
                'Python',
                'Docker',
                'Kubernetes',
                'Git',
                'REST API',
                'PostgreSQL',
                'MongoDB',
                'AWS',
                'Azure',
                'Linux',
                'CI/CD',
                'Redis',
                'Tailwind CSS'
            ], rand(4,8)),

            'location' => fake()->randomElement([
                'Tangier',
                'Casablanca',
                'Rabat',
                'Marrakech',
                'Remote',
            ]),

            'employment_type' => fake()->randomElement([
                'full-time',
                'part-time',
                'contract',
                'internship',
            ]),

            'work_mode' => fake()->randomElement([
                'remote',
                'hybrid',
                'onsite',
            ]),

            'experience_level' => fake()->randomElement([
                'junior',
                'mid',
                'senior',
            ]),

            'salary_min' => fake()->numberBetween(8000,18000),

            'salary_max' => fake()->numberBetween(20000,40000),

            'status' => 'published',

            'deadline' => now()->addDays(rand(20,90)),
        ];
    }
}