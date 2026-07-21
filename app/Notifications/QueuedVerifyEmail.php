<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Queued variant of Laravel's email verification notification so the
 * verification mail is dispatched to the queue instead of blocking the
 * registration request. All URL/signing behaviour is inherited unchanged.
 */
class QueuedVerifyEmail extends VerifyEmail implements ShouldQueue
{
    //
}
