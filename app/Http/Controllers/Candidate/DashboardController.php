<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\CandidateProfile;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\ResumeAnalysis;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $profile = $this->candidateProfile();

        // The most recent application, with just the posting title and company
        // name eager-loaded, so the "Latest application" mini-card stays N+1
        // free. Null when the candidate has not applied anywhere yet.
        /** @var Application|null $latestApplication */
        $latestApplication = $profile->applications()
            ->with(['jobPosting:id,title,company_id', 'jobPosting.company:id,name'])
            ->latest('applied_at')
            ->first();

        $latestApplicationPayload = null;

        if ($latestApplication !== null) {
            /** @var JobPosting|null $job */
            $job = $latestApplication->jobPosting;
            /** @var Company|null $company */
            $company = $job?->company;

            $latestApplicationPayload = [
                'job_title' => $job?->title,
                'company_name' => $company?->name,
                'status' => $latestApplication->status,
                'applied_at' => $latestApplication->applied_at,
            ];
        }

        // Each KPI is a single aggregate query scoped to this candidate, so the
        // dashboard never fans out into per-row lookups.
        return Inertia::render('candidate/dashboard', [
            'stats' => [
                'applications' => $profile->applications()->count(),
                'in_interview' => $profile->applications()->where('status', 'interview')->count(),
                'resumes' => $profile->resumes()->count(),
                // The default resume wins, otherwise the most recent one; null
                // whenever none of the candidate's resumes has a completed
                // analysis yet.
                'resume_score' => ResumeAnalysis::query()
                    ->join('resumes', 'resumes.id', '=', 'resume_analyses.resume_id')
                    ->where('resumes.candidate_profile_id', $profile->id)
                    ->where('resume_analyses.status', 'completed')
                    ->orderByDesc('resumes.is_default')
                    ->orderByDesc('resumes.created_at')
                    ->value('resume_analyses.overall_score'),
            ],
            'latest_application' => $latestApplicationPayload,
        ]);
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
