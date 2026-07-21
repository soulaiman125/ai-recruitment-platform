<?php

namespace Database\Seeders;

use App\Models\JobPosting;
use Illuminate\Database\Seeder;

class JobPostingSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        JobPosting::factory()
            ->count(50)
            ->create();
    }
}