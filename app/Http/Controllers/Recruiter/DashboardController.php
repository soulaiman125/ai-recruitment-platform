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

        // Applications received per day over the last 14 days, scoped to this
        // recruiter. A single query pulls the timestamps; the days are grouped
        // and the gaps filled with zero in PHP so the chart gets a dense series.
        $since = now()->startOfDay()->subDays(13);

        $counts = Application::query()
            ->whereHas('jobPosting', fn ($query) => $query->where('recruiter_profile_id', $profile->id))
            ->where('applied_at', '>=', $since)
            ->selectRaw('DATE(applied_at) as day, COUNT(*) as aggregate')
            ->groupBy('day')
            ->pluck('aggregate', 'day');

        $applicationsSeries = collect(range(0, 13))
            ->map(function (int $offset) use ($since, $counts): array {
                $day = $since->copy()->addDays($offset)->toDateString();

                return ['date' => $day, 'count' => (int) ($counts[$day] ?? 0)];
            })
            ->all();

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
            'applications_series' => $applicationsSeries,
        ]);
    }
}
