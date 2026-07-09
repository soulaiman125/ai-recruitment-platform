<?php

namespace App\Http\Controllers\Company;

use App\Concerns\ResolvesOwnedCompany;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Interview;
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
        ]);
    }
}
