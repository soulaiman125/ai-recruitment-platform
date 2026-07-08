<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Models\CandidateProfile;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    /**
     * List the applications submitted by the authenticated candidate.
     */
    public function index(): Response
    {
        $applications = $this->candidateProfile()
            ->applications()
            // Eager load both levels so the table never queries per row.
            ->with('jobPosting.company')
            ->latest('applied_at')
            ->get();

        return Inertia::render('candidate/applications/index', [
            'applications' => $applications,
        ]);
    }

    /**
     * Apply the authenticated candidate to the given job posting.
     */
    public function store(StoreApplicationRequest $request, JobPosting $job): RedirectResponse
    {
        // Candidates must never apply to drafts, paused, or closed postings.
        abort_unless($job->status === 'published', 404);

        $profile = $this->candidateProfile();

        // The unique index on (job_posting_id, candidate_profile_id) is the
        // backstop; check first so a double submit gets a toast, not a 500.
        $alreadyApplied = $profile->applications()
            ->where('job_posting_id', $job->id)
            ->exists();

        if ($alreadyApplied) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('You have already applied to this job.')]);

            return back();
        }

        $profile->applications()->create([
            ...$request->validated(),
            'job_posting_id' => $job->id,
            // Resumes are not implemented yet, so applications carry none.
            'resume_id' => null,
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application submitted.')]);

        return to_route('candidate.jobs.show', $job);
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
