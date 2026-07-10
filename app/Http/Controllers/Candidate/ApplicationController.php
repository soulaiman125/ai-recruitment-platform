<?php

namespace App\Http\Controllers\Candidate;

use App\Concerns\DispatchesNotifications;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Models\Application;
use App\Models\CandidateProfile;
use App\Models\JobPosting;
use App\Models\RecruiterProfile;
use App\Models\Resume;
use App\Models\User;
use App\Notifications\NewApplicationReceived;
use App\Services\ResumeAnalysisService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    use DispatchesNotifications;

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
    public function store(StoreApplicationRequest $request, JobPosting $job, ResumeAnalysisService $analyses): RedirectResponse
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

        // `resume_id` is absent when the candidate has no resume to attach, and
        // the request scopes it to their own resumes when they do.
        /** @var Application $application */
        $application = $profile->applications()->create([
            ...$request->validated(),
            'job_posting_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $this->scoreApplication($application, $job, $analyses);

        // After scoring, so the recruiter's notification carries the match score
        // rather than a null the analysis would have filled a moment later.
        /** @var RecruiterProfile|null $recruiter */
        $recruiter = $job->recruiter;
        /** @var User|null $recipient */
        $recipient = $recruiter?->user;

        $this->notifyQuietly($recipient, new NewApplicationReceived($application));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application submitted.')]);

        return to_route('candidate.jobs.show', $job);
    }

    /**
     * Score the attached resume against the job the candidate just applied to,
     * so the recruiter's table is ranked the moment they open it.
     *
     * The score is computed here rather than on demand because both inputs are
     * frozen at this point: the resume as attached, and the description as
     * published. `matchScore()` returns null — never throws — whenever there is
     * no completed analysis, no description, or the provider is down, so a
     * candidate's application is never held hostage to the AI being reachable.
     */
    private function scoreApplication(Application $application, JobPosting $job, ResumeAnalysisService $analyses): void
    {
        /** @var Resume|null $resume */
        $resume = $application->resume;

        if ($resume === null) {
            return;
        }

        $score = $analyses->matchScore($resume, $job);

        if ($score !== null) {
            $application->update(['match_score' => $score]);
        }
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
