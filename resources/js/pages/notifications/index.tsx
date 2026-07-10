import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Bell,
    BellOff,
    CalendarDays,
    CheckCheck,
    FileText,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import EmptyState from '@/components/empty-state';
import Heading from '@/components/heading';
import PageTransition from '@/components/page-transition';
import { Button } from '@/components/ui/button';
import { fadeSlideUp, staggerContainer } from '@/lib/motion';
import { dashboard } from '@/routes';
import { destroy, index, read, readAll } from '@/routes/notifications';
import type { Notification, NotificationType } from '@/types/notification';

const iconsByType: Record<NotificationType, LucideIcon> = {
    application_status: Bell,
    interview_scheduled: CalendarDays,
    new_application: FileText,
};

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;

/**
 * `2026-07-10T09:00:00+00:00` → "2 hours ago", in the viewer's own locale.
 * Falls back to an empty string when the timestamp is missing.
 */
function relativeTime(timestamp: string | null): string {
    if (timestamp === null) {
        return '';
    }

    const formatter = new Intl.RelativeTimeFormat(undefined, {
        numeric: 'auto',
    });

    // Negative: the notification is in the past, which is always the case here.
    const seconds = (new Date(timestamp).getTime() - Date.now()) / 1000;
    const absolute = Math.abs(seconds);

    if (absolute < MINUTE) {
        return formatter.format(Math.round(seconds), 'second');
    }

    if (absolute < HOUR) {
        return formatter.format(Math.round(seconds / MINUTE), 'minute');
    }

    if (absolute < DAY) {
        return formatter.format(Math.round(seconds / HOUR), 'hour');
    }

    if (absolute < WEEK) {
        return formatter.format(Math.round(seconds / DAY), 'day');
    }

    return formatter.format(Math.round(seconds / WEEK), 'week');
}

function NotificationCard({ notification }: { notification: Notification }) {
    const isUnread = notification.read_at === null;
    const Icon = iconsByType[notification.data.type] ?? Bell;

    // Reading a notification is a side effect of opening it, so mark it first
    // and only then follow its url. An already-read one navigates straight away.
    const open = () => {
        if (!isUnread) {
            router.visit(notification.data.url);

            return;
        }

        router.patch(
            read(notification.id).url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => router.visit(notification.data.url),
            },
        );
    };

    const remove = () => {
        router.delete(destroy(notification.id).url, {
            preserveScroll: true,
        });
    };

    return (
        <div
            className={`relative rounded-xl border transition-colors ${
                isUnread
                    ? 'border-l-2 border-sidebar-border/70 border-l-primary bg-primary/5 dark:border-sidebar-border dark:border-l-primary'
                    : 'border-sidebar-border/70 dark:border-sidebar-border'
            }`}
        >
            <button
                type="button"
                onClick={open}
                className="flex w-full items-start gap-4 p-4 pr-12 text-left"
                data-test="notification-open-button"
            >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2">
                        <p className="font-medium">{notification.data.title}</p>

                        {isUnread && (
                            <span className="size-1.5 rounded-full bg-primary" />
                        )}
                    </div>

                    <p className="mt-0.5 text-sm text-pretty text-muted-foreground">
                        {notification.data.message}
                    </p>

                    <p className="mt-1.5 text-xs text-muted-foreground">
                        {relativeTime(notification.created_at)}
                    </p>
                </div>
            </button>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={remove}
                aria-label="Delete notification"
                className="absolute top-3 right-3"
                data-test="notification-delete-button"
            >
                <X className="size-4 text-muted-foreground" />
            </Button>
        </div>
    );
}

export default function Notifications({
    notifications,
}: {
    notifications: Notification[];
}) {
    const unreadCount = notifications.filter(
        (notification) => notification.read_at === null,
    ).length;

    const markAllAsRead = () => {
        router.patch(readAll().url, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Notifications" />

            <PageTransition className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Notifications"
                        description="Updates on your applications, interviews, and jobs"
                    />

                    {unreadCount > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                            data-test="mark-all-read-button"
                        >
                            <CheckCheck className="size-4" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <EmptyState
                        icon={BellOff}
                        title="Nothing yet"
                        description="Updates on your applications, interviews, and jobs will show up here."
                        action={{
                            label: 'Back to dashboard',
                            href: dashboard(),
                        }}
                    />
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-3"
                    >
                        {notifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                variants={fadeSlideUp}
                            >
                                <NotificationCard notification={notification} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </PageTransition>
        </>
    );
}

Notifications.layout = {
    breadcrumbs: [
        {
            title: 'Notifications',
            href: index(),
        },
    ],
};
