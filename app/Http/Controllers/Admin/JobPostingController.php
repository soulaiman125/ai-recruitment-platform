<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobPostingController extends Controller
{
    /**
     * List every job posting on the platform, with optional title/status filters.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = $request->input('status');

        $jobs = JobPosting::query()
            ->with('company:id,name')
            ->withCount('applications')
            ->when($search !== '', fn ($query) => $query->where('title', 'like', "%{$search}%"))
            ->when(
                in_array($status, JobPosting::STATUSES, true),
                fn ($query) => $query->where('status', $status)
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/jobs/index', [
            'jobs' => $jobs,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Delete a job posting as a moderation action.
     */
    public function destroy(JobPosting $job): RedirectResponse
    {
        $job->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job posting deleted.')]);

        return back();
    }
}
