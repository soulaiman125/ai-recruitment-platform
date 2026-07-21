<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\User;
use App\Services\ResumeAnalysisService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class JobBrowseController extends Controller
{
    public function __construct(private readonly ResumeAnalysisService $analyses) {}
    /**
     * List every published job posting, newest first.
     */
    public function index(Request $request): Response
    {
        $search = trim($request->string('search')->toString());

        // An unknown company id simply matches nothing; an unknown enum value is
        // dropped. Bad query strings therefore narrow or no-op — they never
        // error, and they never widen the `published` scope.
        $companyId = $request->integer('company') ?: null;
        $employmentType = $this->oneOf($request, 'employment_type', JobPosting::EMPLOYMENT_TYPES);
        $workMode = $this->oneOf($request, 'work_mode', JobPosting::WORK_MODES);
        $experienceLevel = $this->oneOf($request, 'experience_level', JobPosting::EXPERIENCE_LEVELS);

        $jobs = JobPosting::query()
            ->with('company')
            ->where('status', 'published')
            ->when($search !== '', function (Builder $query) use ($search): void {
                /** @var Builder<JobPosting> $query */
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($companyId !== null, fn (Builder $query) => $query->where('company_id', $companyId))
            ->when($employmentType !== null, fn (Builder $query) => $query->where('employment_type', $employmentType))
            ->when($workMode !== null, fn (Builder $query) => $query->where('work_mode', $workMode))
            ->when($experienceLevel !== null, fn (Builder $query) => $query->where('experience_level', $experienceLevel))
            ->latest()
            ->get();

        // Only companies a candidate could actually reach from this page, so the
        // dropdown never offers a filter that returns nothing. One query.
        $companies = Company::query()
            ->whereHas('jobPostings', fn (Builder $query) => $query->where('status', 'published'))
            ->orderBy('name')
            ->get(['id', 'name']);

        /** @var User $user */
        $user = Auth::user();

        $profile = $user ? $user->candidateProfile : null;

        $resume = $profile?->resumes()->with('analysis')
            ->orderByDesc('is_default')
            ->latest()
            ->first();

        $aiMatches = [];
        if ($resume !== null) {
            $aiMatches = $this->analyses->batchMatchDetails($resume, $jobs);
        }

        foreach ($jobs as $job) {
            $job->setAttribute('ai_match', $aiMatches[$job->id] ?? null);
        }
        $jobs = $jobs->sortByDesc(function ($job) {
        return $job->ai_match['score'] ?? -1;
            })->values();

        return Inertia::render('candidate/jobs/index', [
            'jobs' => $jobs,
            // One extra query for the whole grid: each card looks its own id up
            // in this set, rather than the list carrying a per-row lookup.
            'savedJobIds' => $profile === null ? [] : $profile->savedJobs()
                ->pluck('job_postings.id')
                ->all(),
            'companies' => $companies,
            'filters' => [
                'search' => $search,
                'company' => $companyId,
                'employment_type' => $employmentType,
                'work_mode' => $workMode,
                'experience_level' => $experienceLevel,
            ],
            'aiMatches' => $aiMatches,
        ]);
    }

    /**
     * Read a query parameter only when it is one of the allowed values.
     *
     * Anything else — an empty string, a typo, an injected value — comes back
     * as null so the filter is skipped rather than rejected.
     *
     * @param  array<int, string>  $allowed
     */
    private function oneOf(Request $request, string $key, array $allowed): ?string
    {
        $value = $request->string($key)->toString();

        return in_array($value, $allowed, true) ? $value : null;
    }

    /**
     * Show the full details of a single published job posting.
     */
    public function show(JobPosting $job): Response
    {
        // Candidates must never reach drafts, paused, or closed postings.
        abort_unless($job->status === 'published', 404);

        $job->load('company');

        /** @var User $user */
        $user = Auth::user();

        $profile = $user->candidateProfile;

        $resume = $profile?->resumes()->with('analysis')
            ->orderByDesc('is_default')
            ->latest()
            ->first();
        $aiMatch = $resume === null ? null : $this->analyses->matchDetails($resume, $job);

        return Inertia::render('candidate/jobs/show', [
            'job' => $job,
            'hasApplied' => $profile !== null && $job->applications()
                ->where('candidate_profile_id', $profile->id)
                ->exists(),
            'isSaved' => $profile !== null && $job->savedBy()
                ->whereKey($profile->id)
                ->exists(),
            // The apply dialog preselects the first one, so the default resume
            // has to sort ahead of the rest.
            'resumes' => $profile === null ? [] : $profile->resumes()
                ->orderByDesc('is_default')
                ->latest()
                ->latest('id')
                ->get(),
            'ai_match' => $aiMatch,
        ]);
    }
}
