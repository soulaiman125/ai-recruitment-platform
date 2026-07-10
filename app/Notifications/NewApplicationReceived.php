<?php

namespace App\Notifications;

use App\Models\Application;
use App\Models\CandidateProfile;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Notifications\Notification;

class NewApplicationReceived extends Notification
{
    public function __construct(private readonly Application $application) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        /** @var JobPosting|null $job */
        $job = $this->application->jobPosting;
        /** @var CandidateProfile|null $candidate */
        $candidate = $this->application->candidate;
        /** @var User|null $applicant */
        $applicant = $candidate?->user;

        $jobTitle = $job === null ? __('one of your jobs') : $job->title;
        $candidateName = $applicant === null ? __('A candidate') : $applicant->name;

        return [
            'type' => 'new_application',
            'title' => __('New application'),
            'message' => __(':candidate applied to :job.', [
                'candidate' => $candidateName,
                'job' => $jobTitle,
            ]),
            // Straight to the recruiter's applicant table for this posting. A
            // posting that vanished leaves the notification readable, not broken.
            'url' => $job === null
                ? route('recruiter.dashboard')
                : route('recruiter.jobs.applications.index', $job->slug),
            'application_id' => $this->application->id,
            'candidate_name' => $candidateName,
            'job_title' => $jobTitle,
            'job_slug' => $job?->slug,
            'match_score' => $this->application->match_score,
        ];
    }
}
