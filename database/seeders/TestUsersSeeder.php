<?php

namespace Database\Seeders;

use App\Models\CandidateProfile;
use App\Models\Company;
use App\Models\RecruiterProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        // ── Company user (مدير الشركة) ──
        $companyUser = User::firstOrCreate(
            ['email' => 'company@airecrute.com'],
            ['name' => 'Acme Company', 'password' => Hash::make('password'), 'email_verified_at' => now()]
        );
        $companyUser->assignRole('company');

        // نصاوبو الشركة
        $company = Company::firstOrCreate(
            ['slug' => 'acme'],
            ['name' => 'Acme Inc', 'industry' => 'Technology', 'location' => 'Tanger, Morocco', 'is_active' => true]
        );

        // ── Recruiter user ──
        $recruiterUser = User::firstOrCreate(
            ['email' => 'recruiter@airecrute.com'],
            ['name' => 'Sara Recruiter', 'password' => Hash::make('password'), 'email_verified_at' => now()]
        );
        $recruiterUser->assignRole('recruiter');

        RecruiterProfile::firstOrCreate(
            ['user_id' => $recruiterUser->id],
            ['company_id' => $company->id, 'job_title' => 'HR Manager', 'is_admin' => true]
        );

        // ── Candidate user ──
        $candidateUser = User::firstOrCreate(
            ['email' => 'candidate@airecrute.com'],
            ['name' => 'Ahmed Candidate', 'password' => Hash::make('password'), 'email_verified_at' => now()]
        );
        $candidateUser->assignRole('candidate');

        CandidateProfile::firstOrCreate(
            ['user_id' => $candidateUser->id],
            ['title' => 'Full-Stack Developer', 'location' => 'Tanger, Morocco', 'experience_level' => 'junior', 'is_open_to_work' => true]
        );
    }
}