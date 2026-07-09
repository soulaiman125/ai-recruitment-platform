<?php

namespace App\Http\Controllers\Recruiter;

use App\Concerns\ScopesRecruiterJobs;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Interview;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    use ScopesRecruiterJobs;

    public function index(): Response
    {
        $profile = $this->recruiterProfile();

        // Each KPI is a single aggregate query scoped to this recruiter's
        // postings, so the dashboard never fans out into per-row lookups.
        return Inertia::render('recruiter/dashboard', [
            'stats' => [
                'jobs' => $profile->jobPostings()->count(),
                'published_jobs' => $profile->jobPostings()->where('status', 'published')->count(),
                'new_applications' => Application::query()
                    ->where('status', 'pending')
                    ->whereHas('jobPosting', fn ($query) => $query->where('recruiter_profile_id', $profile->id))
                    ->count(),
                'interviews' => Interview::query()
                    ->where('status', 'scheduled')
                    ->whereHas('application.jobPosting', fn ($query) => $query->where('recruiter_profile_id', $profile->id))
                    ->count(),
            ],
        ]);
    }
}
