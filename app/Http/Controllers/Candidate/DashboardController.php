<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
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
