<?php

namespace App\Http\Controllers\Recruiter;

use App\Concerns\ScopesRecruiterJobs;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobPosting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    use ScopesRecruiterJobs;

    /**
     * List the applications received by one of the recruiter's job postings.
     */
    public function index(JobPosting $job): Response
    {
        $this->authorizeJob($job);

        $applications = $job->applications()
            // Eager load both levels so the table never queries per row.
            ->with('candidate.user')
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

        $application->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application updated.')]);

        return back();
    }
}
