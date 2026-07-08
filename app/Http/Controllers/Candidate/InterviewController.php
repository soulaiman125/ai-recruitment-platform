<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use App\Models\Interview;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InterviewController extends Controller
{
    /**
     * List the interviews scheduled for the authenticated candidate.
     */
    public function index(): Response
    {
        $profile = $this->candidateProfile();

        $interviews = Interview::query()
            // Only ever surface interviews on this candidate's own applications.
            ->whereHas('application', fn ($query) => $query->where('candidate_profile_id', $profile->id))
            // Eager load the whole chain the list renders, per row query free.
            ->with('application.jobPosting.company')
            // Upcoming interviews sort to the top, soonest first, past ones after.
            ->orderByRaw('CASE WHEN scheduled_at >= ? THEN 0 ELSE 1 END', [now()])
            ->orderBy('scheduled_at')
            ->get();

        return Inertia::render('candidate/interviews/index', [
            'interviews' => $interviews,
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
