<?php

namespace App\Providers;

use App\Events\ResumeAnalysisCompleted;
use App\Listeners\ResumeMemoryListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        ResumeAnalysisCompleted::class => [
            ResumeMemoryListener::class,
        ],
    ];
}