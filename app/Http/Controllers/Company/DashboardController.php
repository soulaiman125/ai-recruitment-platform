<?php

namespace App\Http\Controllers\Company;

use App\Concerns\ResolvesOwnedCompany;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Interview;
use App\Models\RecruiterProfile;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    use ResolvesOwnedCompany;

    public function index(): Response
    {
        $company = $this->ownedCompany();

        // Each KPI is a single aggregate query scoped to this company, so the
        // dashboard never fans out into per-row lookups.
        return Inertia::render('company/dashboard', [
            'stats' => [
                'recruiters' => $company->recruiters()->count(),
                'active_jobs' => $company->jobPostings()->where('status', 'published')->count(),
                'applications' => Application::query()
                    ->whereHas('jobPosting', fn ($query) => $query->where('company_id', $company->id))
                    ->count(),
                'interviews' => Interview::query()
                    ->where('status', 'scheduled')
                    ->whereHas('application.jobPosting', fn ($query) => $query->where('company_id', $company->id))
                    ->count(),
            ],

            // A short roster for the "Recruiters" mini-list. The user name is
            // eager-loaded and the posting tally comes from a withCount, so the
            // whole list resolves in one query and stays N+1 free.
            'recruiters_list' => RecruiterProfile::query()
                ->where('company_id', $company->id)
                ->with('user:id,name')
                ->withCount('jobPostings')
                ->take(6)
                ->get()
                ->map(function (RecruiterProfile $recruiter): array {
                    /** @var User|null $user */
                    $user = $recruiter->user;

                    return [
                        'id' => $recruiter->id,
                        'name' => $user?->name,
                        'jobs_count' => (int) $recruiter->getAttribute('job_postings_count'),
                    ];
                }),
        ]);
    }
}
