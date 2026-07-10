<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Throwable;

trait DispatchesNotifications
{
    /**
     * Notify a user without ever letting the notification break the action that
     * triggered it.
     *
     * A candidate's application, a status change, or a scheduled interview is
     * already committed by the time we get here. If the notifiable is missing
     * (a deleted account) or the write fails, that is worth a log line — it is
     * not worth a 500 on an action that already succeeded.
     */
    protected function notifyQuietly(?User $user, Notification $notification): void
    {
        if ($user === null) {
            return;
        }

        try {
            $user->notify($notification);
        } catch (Throwable $exception) {
            Log::error('Failed to send notification.', [
                'notification' => $notification::class,
                'user_id' => $user->id,
                'exception' => $exception->getMessage(),
            ]);
        }
    }
}
