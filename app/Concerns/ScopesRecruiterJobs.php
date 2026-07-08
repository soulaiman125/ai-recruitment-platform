<?php

namespace App\Concerns;

use App\Models\JobPosting;
use App\Models\RecruiterProfile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

trait ScopesRecruiterJobs
{
    /**
     * Resolve the authenticated user's recruiter profile.
     */
    protected function recruiterProfile(): RecruiterProfile
    {
        /** @var User $user */
        $user = Auth::user();

        $profile = $user->recruiterProfile;

        abort_if($profile === null, 403, __('You do not have a recruiter profile.'));

        return $profile;
    }

    /**
     * Ensure the job posting belongs to the authenticated recruiter.
     */
    protected function authorizeJob(JobPosting $job): void
    {
        abort_unless(
            $job->recruiter_profile_id === $this->recruiterProfile()->id,
            403
        );
    }
}
