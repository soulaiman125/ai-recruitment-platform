<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\CandidateProfile;
use App\Models\Company;
use App\Models\Interview;
use App\Models\JobPosting;
use App\Models\ResumeAnalysis;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Users registered per day over the last 14 days. A single query pulls
        // the timestamps; the days are grouped and the gaps filled with zero in
        // PHP so the chart receives a dense, gap-free series.
        $since = now()->startOfDay()->subDays(13);

        $counts = User::query()
            ->where('created_at', '>=', $since)
            ->get(['created_at'])
            ->groupBy(fn (User $user) => $user->created_at->toDateString())
            ->map
            ->count();

        $usersSeries = collect(range(0, 13))
            ->map(function (int $offset) use ($since, $counts): array {
                $day = $since->copy()->addDays($offset)->toDateString();

                return ['date' => $day, 'count' => (int) ($counts[$day] ?? 0)];
            })
            ->all();

        // Each KPI is a single aggregate query, so the platform dashboard never
        // fans out into per-row lookups no matter how large the tables grow.
        return Inertia::render('admin/dashboard', [
            'users_series' => $usersSeries,
            'stats' => [
                'users' => User::query()->count(),
                'companies' => Company::query()->count(),
                'published_jobs' => JobPosting::query()->where('status', 'published')->count(),
                'applications' => Application::query()->count(),
                'analyses' => ResumeAnalysis::query()->where('status', 'completed')->count(),
                'interviews' => Interview::query()->where('status', 'scheduled')->count(),
            ],

            // The two lists are capped at five rows and eager-load the relations
            // they read, so the "recent activity" payload stays N+1 free.
            'latest_users' => User::query()
                ->with('roles:id,name')
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'email', 'created_at'])
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'roles' => $user->getRoleNames(),
                ]),

            'latest_applications' => Application::query()
                ->with(['candidate.user:id,name', 'jobPosting:id,title'])
                ->latest('applied_at')
                ->take(5)
                ->get(['id', 'candidate_profile_id', 'job_posting_id', 'applied_at'])
                ->map(function (Application $application): array {
                    /** @var CandidateProfile|null $candidate */
                    $candidate = $application->candidate;
                    /** @var User|null $applicant */
                    $applicant = $candidate?->user;
                    /** @var JobPosting|null $job */
                    $job = $application->jobPosting;

                    return [
                        'id' => $application->id,
                        'candidate_name' => $applicant?->name,
                        'job_title' => $job?->title,
                        'applied_at' => $application->applied_at,
                    ];
                }),
        ]);
    }
}
