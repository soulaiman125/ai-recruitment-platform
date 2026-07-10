<?php

namespace App\Http\Controllers\Recruiter;

use App\Concerns\DispatchesNotifications;
use App\Concerns\ScopesRecruiterJobs;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\CandidateProfile;
use App\Models\JobPosting;
use App\Models\Resume;
use App\Models\User;
use App\Notifications\ApplicationStatusChanged;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ApplicationController extends Controller
{
    use DispatchesNotifications;
    use ScopesRecruiterJobs;

    /**
     * List the applications received by one of the recruiter's job postings.
     */
    public function index(JobPosting $job): Response
    {
        $this->authorizeJob($job);

        $applications = $job->applications()
            // Eager load both levels so the table never queries per row.
            ->with(['candidate.user', 'resume', 'interviews' => fn ($query) => $query->orderBy('scheduled_at')])
            ->latest('applied_at')
            ->get();

        return Inertia::render('recruiter/jobs/applications/index', [
            'job' => $job,
            'applications' => $applications,
        ]);
    }

    /**
     * Update the status and recruiter notes of one received application.
     */
    public function updateStatus(Request $request, JobPosting $job, Application $application): RedirectResponse
    {
        $this->authorizeJob($job);

        // Route model binding resolves any application id, so make sure this
        // one really hangs off the job we just authorized.
        abort_unless($application->job_posting_id === $job->id, 404);

        // `recruiter_notes` is absent from the validated data when the request
        // omits it, so changing a status from the table never wipes the notes.
        $data = $request->validate([
            'status' => ['required', 'in:'.implode(',', Application::STATUSES)],
            'recruiter_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $statusChanged = $application->status !== $data['status'];

        $application->update($data);

        // Only a real status change is worth pinging the candidate about —
        // saving recruiter notes alone must stay silent.
        if ($statusChanged) {
            /** @var CandidateProfile|null $candidate */
            $candidate = $application->candidate;
            /** @var User|null $recipient */
            $recipient = $candidate?->user;

            $this->notifyQuietly($recipient, new ApplicationStatusChanged($application));
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application updated.')]);

        return back();
    }

    /**
     * Download the resume attached to one received application.
     */
    public function resume(JobPosting $job, Application $application): StreamedResponse
    {
        $this->authorizeJob($job);

        // Recruiters only ever reach a resume through an application on a job
        // they own, so a resume is never exposed across companies.
        abort_unless($application->job_posting_id === $job->id, 404);

        /** @var Resume|null $resume */
        $resume = $application->resume;

        abort_if($resume === null, 404);

        $disk = Storage::disk('public');

        abort_unless($disk->exists($resume->file_path), 404);

        return $disk->download($resume->file_path, $resume->original_name);
    }
}
