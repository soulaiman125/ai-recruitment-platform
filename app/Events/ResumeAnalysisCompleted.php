<?php

namespace App\Events;

use App\Models\Resume;
use App\Models\ResumeAnalysis;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ResumeAnalysisCompleted
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Resume $resume,
        public readonly ResumeAnalysis $analysis,
    ) {}
}