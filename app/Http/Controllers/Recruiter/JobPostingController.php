<?php

namespace App\Http\Controllers\Recruiter;

use App\Concerns\ScopesRecruiterJobs;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobPostingRequest;
use App\Http\Requests\UpdateJobPostingRequest;
use App\Models\JobPosting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class JobPostingController extends Controller
{
    use ScopesRecruiterJobs;

    /**
     * List the job postings owned by the authenticated recruiter.
     */
    public function index(): Response
    {
        $jobs = $this->recruiterProfile()
            ->jobPostings()
            ->withCount('applications')
            ->latest()
            ->get();

        return Inertia::render('recruiter/jobs/index', [
            'jobs' => $jobs,
        ]);
    }

    /**
     * Show the form for creating a new job posting.
     */
    public function create(): Response
    {
        return Inertia::render('recruiter/jobs/create');
    }

    /**
     * Store a newly created job posting.
     */
    public function store(StoreJobPostingRequest $request): RedirectResponse
    {
        $profile = $this->recruiterProfile();

        $data = $request->validated();

        $profile->jobPostings()->create([
            ...$data,
            'company_id' => $profile->company_id,
            'slug' => $this->uniqueSlug($data['title']),
            'status' => $data['status'] ?? 'draft',
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job posting created.')]);

        return to_route('recruiter.jobs.index');
    }

    /**
     * Show the form for editing the given job posting.
     */
    public function edit(JobPosting $job): Response
    {
        $this->authorizeJob($job);

        return Inertia::render('recruiter/jobs/edit', [
            'job' => $job,
        ]);
    }

    /**
     * Update the given job posting.
     */
    public function update(UpdateJobPostingRequest $request, JobPosting $job): RedirectResponse
    {
        $this->authorizeJob($job);

        $data = $request->validated();

        // The slug is generated once on create so published URLs stay stable.
        $data['status'] ??= $job->status;

        $job->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job posting updated.')]);

        return to_route('recruiter.jobs.index');
    }

    /**
     * Delete the given job posting.
     */
    public function destroy(JobPosting $job): RedirectResponse
    {
        $this->authorizeJob($job);

        $job->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job posting deleted.')]);

        return to_route('recruiter.jobs.index');
    }

    /**
     * Toggle the given job posting between published and paused.
     */
    public function publish(JobPosting $job): RedirectResponse
    {
        $this->authorizeJob($job);

        $job->update([
            'status' => $job->status === 'published' ? 'paused' : 'published',
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $job->status === 'published'
                ? __('Job posting published.')
                : __('Job posting paused.'),
        ]);

        return to_route('recruiter.jobs.index');
    }

    /**
     * Build a slug from the title, suffixing it until it is unique.
     */
    private function uniqueSlug(string $title): string
    {
        // Str::slug() returns an empty string for titles with no latin
        // characters, which would collide on the unique index.
        $base = Str::slug($title) ?: 'job';

        $slug = $base;
        $suffix = 2;

        while (JobPosting::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
