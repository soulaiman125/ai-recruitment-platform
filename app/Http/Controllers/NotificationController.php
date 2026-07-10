<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * List the authenticated user's most recent notifications, read and unread.
     */
    public function index(Request $request): Response
    {
        $notifications = $this->user($request)
            ->notifications()
            ->latest()
            ->take(30)
            ->get()
            ->map(fn (DatabaseNotification $notification): array => [
                'id' => $notification->id,
                'data' => $notification->data,
                'read_at' => $notification->read_at?->toIso8601String(),
                'created_at' => $notification->created_at?->toIso8601String(),
            ]);

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Mark one of the authenticated user's notifications as read.
     */
    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        $this->ownedNotification($request, $id)->markAsRead();

        return back();
    }

    /**
     * Mark every unread notification of the authenticated user as read.
     */
    public function markAllAsRead(Request $request): RedirectResponse
    {
        $this->user($request)->unreadNotifications()->update(['read_at' => now()]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('All notifications marked as read.')]);

        return back();
    }

    /**
     * Delete one of the authenticated user's notifications.
     */
    public function destroy(Request $request, string $id): RedirectResponse
    {
        $this->ownedNotification($request, $id)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Notification deleted.')]);

        return back();
    }

    /**
     * Resolve a notification from the authenticated user's own notifications.
     *
     * Scoping the lookup to the relation — rather than looking the id up
     * globally and comparing afterwards — means another user's notification is
     * simply not found, and a guessed UUID leaks nothing.
     */
    private function ownedNotification(Request $request, string $id): DatabaseNotification
    {
        /** @var DatabaseNotification|null $notification */
        $notification = $this->user($request)->notifications()->whereKey($id)->first();

        abort_if($notification === null, 404);

        return $notification;
    }

    private function user(Request $request): User
    {
        /** @var User $user */
        $user = $request->user();

        return $user;
    }
}
