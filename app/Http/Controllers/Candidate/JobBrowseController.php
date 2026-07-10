<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class JobBrowseController extends Controller
{
    /**
     * List every published job posting, newest first.
     */
    public function index(Request $request): Response
    {
        $search = trim($request->string('search')->toString());

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
            ->latest()
            ->get();

        /** @var User $user */
        $user = Auth::user();

        $profile = $user->candidateProfile;

        return Inertia::render('candidate/jobs/index', [
            'jobs' => $jobs,
            // One extra query for the whole grid: each card looks its own id up
            // in this set, rather than the list carrying a per-row lookup.
            'savedJobIds' => $profile === null ? [] : $profile->savedJobs()
                ->pluck('job_postings.id')
                ->all(),
            'filters' => [
                'search' => $search,
            ],
        ]);
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
        ]);
    }
}
