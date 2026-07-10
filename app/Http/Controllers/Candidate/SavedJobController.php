<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SavedJobController extends Controller
{
    /**
     * List the postings the authenticated candidate bookmarked.
     */
    public function index(): Response
    {
        $jobs = $this->candidateProfile()
            ->savedJobs()
            // Eager load the company so the card grid never queries per row.
            ->with('company')
            // Newest bookmark first, which lives on the pivot rather than the
            // posting — a job saved today outranks one published today.
            ->orderByDesc('saved_jobs.created_at')
            ->get();

        return Inertia::render('candidate/saved-jobs/index', [
            'jobs' => $jobs,
        ]);
    }

    /**
     * Bookmark the given posting for the authenticated candidate.
     */
    public function store(JobPosting $job): RedirectResponse
    {
        // Candidates must never bookmark drafts, paused, or closed postings.
        abort_unless($job->status === 'published', 404);

        // A double click would otherwise hit the unique index and 500; this
        // makes a repeat save a no-op instead.
        $this->candidateProfile()->savedJobs()->syncWithoutDetaching([$job->id]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job saved.')]);

        return back();
    }

    /**
     * Remove the given posting from the authenticated candidate's bookmarks.
     */
    public function destroy(JobPosting $job): RedirectResponse
    {
        // Unsaving stays open even once a posting leaves `published`, so a job
        // that got closed can still be cleared off the saved list.
        $this->candidateProfile()->savedJobs()->detach($job->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job removed from saved.')]);

        return back();
    }

    /**
     * Resolve the authenticated user's candidate profile.
     */
    private function candidateProfile(): CandidateProfile
    {
        /** @var User $user */
        $user = Auth::user();

        $profile = $user->candidateProfile;

        abort_if($profile === null, 403, __('You do not have a candidate profile.'));

        return $profile;
    }
}
