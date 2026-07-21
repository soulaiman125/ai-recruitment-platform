<?php

namespace App\Http\Controllers\Candidate;

use App\Concerns\DispatchesNotifications;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Jobs\ScoreApplicationJob;
use App\Models\Application;
use App\Models\CandidateProfile;
use App\Models\JobPosting;
use App\Models\RecruiterProfile;
use App\Models\User;
use App\Notifications\NewApplicationReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\AI\Memory\MemoryService;

class ApplicationController extends Controller
{
    use DispatchesNotifications;

    public function __construct(
        private readonly MemoryService $memoryService
    ) {}
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

        // `resume_id` is absent when the candidate has no resume to attach, and
        // the request scopes it to their own resumes when they do.
        /** @var Application $application */
        $application = $profile->applications()->create([
            ...$request->validated(),
            'job_posting_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        // Scoring is a 5–15s Gemini round trip, so it happens on a worker. The
        // recruiter's table renders an unscored applicant until it lands, and
        // already sorts those to the bottom.
        if ($application->resume_id !== null) {
            ScoreApplicationJob::dispatch($application->id, $job->id);
        }

        /** @var RecruiterProfile|null $recruiter */
        $recruiter = $job->recruiter;
        /** @var User|null $recipient */
        $recipient = $recruiter?->user;

        $this->notifyQuietly($recipient, new NewApplicationReceived($application));

                    $this->memoryService->remember(
                candidateId: Auth::id(),
                category: 'APPLICATION',
                title: 'Job Application Submitted',
                content: 'Applied for: '.$job->title,
                importance: 9,
                metadata: [
                    'application_id' => $application->id,
                    'job_posting_id' => $job->id,
                    'status' => $application->status,
                ],
            );

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
