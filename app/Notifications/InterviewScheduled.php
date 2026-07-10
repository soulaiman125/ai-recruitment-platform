<?php

namespace App\Notifications;

use App\Models\Application;
use App\Models\Company;
use App\Models\Interview;
use App\Models\JobPosting;
use Carbon\Carbon;
use Illuminate\Notifications\Notification;

class InterviewScheduled extends Notification
{
    public function __construct(private readonly Interview $interview) {}

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
        /** @var Application|null $application */
        $application = $this->interview->application;
        /** @var JobPosting|null $job */
        $job = $application?->jobPosting;
        /** @var Company|null $company */
        $company = $job?->company;

        $jobTitle = $job === null ? __('a job') : $job->title;
        $companyName = $company === null ? __('a company') : $company->name;
        $type = $this->interview->type;

        // The candidate's browser renders this in their own timezone, so the
        // payload carries an unambiguous ISO-8601 instant rather than a
        // pre-formatted, server-locale string. `Carbon::parse` accepts both the
        // Carbon instance the cast produces and the raw string the analyser
        // infers from the column.
        $scheduledAt = Carbon::parse($this->interview->scheduled_at)->toIso8601String();

        return [
            'type' => 'interview_scheduled',
            'title' => __('Interview scheduled'),
            'message' => __('You have a :type interview for :job at :company.', [
                'type' => $type,
                'job' => $jobTitle,
                'company' => $companyName,
            ]),
            'url' => route('candidate.interviews.index'),
            'interview_id' => $this->interview->id,
            'job_title' => $jobTitle,
            'company_name' => $company?->name,
            'scheduled_at' => $scheduledAt,
            'interview_type' => $type,
        ];
    }
}
