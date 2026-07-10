<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the form for editing the authenticated candidate's profile.
     */
    public function edit(): Response
    {
        return Inertia::render('candidate/profile/edit', [
            'profile' => $this->candidateProfile(),
        ]);
    }

    /**
     * Update the authenticated candidate's profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $profile = $this->candidateProfile();

        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'skills' => ['nullable', 'array', 'max:30'],
            'skills.*' => ['string', 'max:50'],
            'experience_level' => ['nullable', 'in:junior,mid,senior'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:60'],
            'linkedin' => ['nullable', 'url', 'max:255'],
            'github' => ['nullable', 'url', 'max:255'],
            'portfolio' => ['nullable', 'url', 'max:255'],
            'is_open_to_work' => ['boolean'],
        ]);

        // A tag input with every badge removed submits no `skills[]` entries at
        // all, so absence has to mean "cleared" rather than "untouched" —
        // otherwise the last skill could never be removed.
        $data['skills'] = $data['skills'] ?? [];

        // The checkbox rides on a hidden `1`/`0` input, so the cast gets a real
        // bool rather than the string the browser sends.
        $data['is_open_to_work'] = $request->boolean('is_open_to_work');

        // The avatar is uploaded elsewhere, so it stays untouched here.
        $profile->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return back();
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
