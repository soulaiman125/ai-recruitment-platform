<?php

namespace App\Notifications;

use App\Models\Application;
use App\Models\Company;
use App\Models\JobPosting;
use Illuminate\Notifications\Notification;

class ApplicationStatusChanged extends Notification
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
        /** @var Company|null $company */
        $company = $job?->company;

        $jobTitle = $job === null ? __('a job') : $job->title;
        $companyName = $company === null ? __('a company') : $company->name;
        $status = $this->application->status;

        return [
            'type' => 'application_status',
            'title' => __('Application update'),
            'message' => __('Your application for :job at :company is now :status.', [
                'job' => $jobTitle,
                'company' => $companyName,
                'status' => $status,
            ]),
            'url' => route('candidate.applications.index'),
            'application_id' => $this->application->id,
            'job_title' => $jobTitle,
            'company_name' => $company?->name,
            'status' => $status,
        ];
    }
}
