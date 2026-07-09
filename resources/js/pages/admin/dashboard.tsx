import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import type {
    AdminLatestApplication,
    AdminLatestUser,
    AdminStats,
} from '@/types/admin';

type DashboardProps = {
    stats: AdminStats;
    latest_users: AdminLatestUser[];
    latest_applications: AdminLatestApplication[];
};

const cards: { key: keyof AdminStats; label: string }[] = [
    { key: 'users', label: 'Total Users' },
    { key: 'companies', label: 'Companies' },
    { key: 'published_jobs', label: 'Published Jobs' },
    { key: 'applications', label: 'Applications' },
    { key: 'analyses', label: 'Analyses Completed' },
    { key: 'interviews', label: 'Interviews Scheduled' },
];

export default function AdminDashboard({
    stats,
    latest_users,
    latest_applications,
}: DashboardProps) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Admin Dashboard"
                    description="Manage users, companies, and platform settings"
                />

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {cards.map((card) => (
                        <div
                            key={card.key}
                            className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border"
                        >
                            <p className="text-sm text-muted-foreground">
                                {card.label}
                            </p>
                            <p className="mt-2 text-3xl font-bold">
                                {stats[card.key]}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="font-medium">Latest users</p>

                        <div className="mt-4 flex flex-col gap-3">
                            {latest_users.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No users yet.
                                </p>
                            )}

                            {latest_users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-sm text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 flex-wrap justify-end gap-1">
                                        {user.roles.map((role) => (
                                            <Badge
                                                key={role}
                                                variant="secondary"
                                            >
                                                {role}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="font-medium">Latest applications</p>

                        <div className="mt-4 flex flex-col gap-3">
                            {latest_applications.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No applications yet.
                                </p>
                            )}

                            {latest_applications.map((application) => (
                                <div
                                    key={application.id}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">
                                            {application.candidate_name ?? '—'}
                                        </p>
                                        <p className="truncate text-sm text-muted-foreground">
                                            {application.job_title ?? '—'}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-sm text-muted-foreground">
                                        {application.applied_at
                                            ? new Date(
                                                  application.applied_at,
                                              ).toLocaleDateString()
                                            : '—'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
