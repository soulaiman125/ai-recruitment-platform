<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
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

        return Inertia::render('candidate/jobs/index', [
            'jobs' => $jobs,
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

        return Inertia::render('candidate/jobs/show', [
            'job' => $job,
        ]);
    }
}
