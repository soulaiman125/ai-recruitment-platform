<?php

namespace App\Http\Controllers\Recruiter;

use App\Concerns\DispatchesNotifications;
use App\Concerns\ScopesRecruiterJobs;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\CandidateProfile;
use App\Models\Interview;
use App\Models\JobPosting;
use App\Models\User;
use App\Notifications\InterviewScheduled;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InterviewController extends Controller
{
    use DispatchesNotifications;
    use ScopesRecruiterJobs;

    /**
     * Schedule an interview for one of the recruiter's own applications.
     */
    public function store(Request $request, JobPosting $job, Application $application): RedirectResponse
    {
        $this->authorizeJob($job);

        // Route model binding resolves any application id, so make sure this
        // one really hangs off the job we just authorized.
        abort_unless($application->job_posting_id === $job->id, 404);

        $data = $request->validate([
            'type' => ['required', 'in:'.implode(',', Interview::TYPES)],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:480'],
            'location' => ['nullable', 'string', 'max:255'],
            'meeting_link' => ['nullable', 'url', 'max:2000'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        /** @var Interview $interview */
        $interview = $application->interviews()->create([
            ...$data,
            'scheduled_by' => Auth::id(),
            'status' => 'scheduled',
        ]);

        // Scheduling an interview moves the pipeline forward, but never drags an
        // already accepted or rejected application back to the interview stage.
        if (in_array($application->status, ['pending', 'reviewed'], true)) {
            $application->update(['status' => 'interview']);
        }

        /** @var CandidateProfile|null $candidate */
        $candidate = $application->candidate;
        /** @var User|null $recipient */
        $recipient = $candidate?->user;

        $this->notifyQuietly($recipient, new InterviewScheduled($interview));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Interview scheduled.')]);

        return back();
    }

    /**
     * Update the schedule, outcome, or feedback of a scheduled interview.
     */
    public function update(Request $request, JobPosting $job, Application $application, Interview $interview): RedirectResponse
    {
        $this->authorizeJob($job);

        // Walk the same chain the URL implies, so neither an application nor an
        // interview from another job can be reached by swapping ids.
        abort_unless($application->job_posting_id === $job->id, 404);
        abort_unless($interview->application_id === $application->id, 404);

        $data = $request->validate([
            'type' => ['required', 'in:'.implode(',', Interview::TYPES)],
            'scheduled_at' => ['required', 'date'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:480'],
            'location' => ['nullable', 'string', 'max:255'],
            'meeting_link' => ['nullable', 'url', 'max:2000'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', 'in:'.implode(',', Interview::STATUSES)],
            'feedback' => ['nullable', 'string', 'max:2000'],
        ]);

        $interview->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Interview updated.')]);

        return back();
    }

    /**
     * Delete a scheduled interview.
     */
    public function destroy(JobPosting $job, Application $application, Interview $interview): RedirectResponse
    {
        $this->authorizeJob($job);

        abort_unless($application->job_posting_id === $job->id, 404);
        abort_unless($interview->application_id === $application->id, 404);

        $interview->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Interview deleted.')]);

        return back();
    }
}
