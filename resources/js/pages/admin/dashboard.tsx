import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Building2,
    CalendarCheck,
    FileText,
    Sparkles,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ActivityChart from '@/components/activity-chart';
import type {ActivityPoint} from '@/components/activity-chart';
import DashboardHeader from '@/components/dashboard-header';
import StatCard from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { staggerContainer } from '@/lib/motion';
import type {
    AdminLatestApplication,
    AdminLatestUser,
    AdminStats,
} from '@/types/admin';

type DashboardProps = {
    stats: AdminStats;
    latest_users: AdminLatestUser[];
    latest_applications: AdminLatestApplication[];
    users_series: ActivityPoint[];
};

const cards: {
    key: keyof AdminStats;
    label: string;
    icon: LucideIcon;
    context: string;
}[] = [
    { key: 'users', label: 'Total Users', icon: Users, context: 'Across all roles' },
    { key: 'companies', label: 'Companies', icon: Building2, context: 'Registered' },
    {
        key: 'published_jobs',
        label: 'Published Jobs',
        icon: Briefcase,
        context: 'Live openings',
    },
    {
        key: 'applications',
        label: 'Applications',
        icon: FileText,
        context: 'All-time',
    },
    {
        key: 'analyses',
        label: 'Analyses Completed',
        icon: Sparkles,
        context: 'AI-processed',
    },
    {
        key: 'interviews',
        label: 'Interviews Scheduled',
        icon: CalendarCheck,
        context: 'Upcoming',
    },
];

export default function AdminDashboard({
    stats,
    latest_users,
    latest_applications,
    users_series,
}: DashboardProps) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DashboardHeader subtitle="Platform overview — users, companies, and hiring activity" />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid auto-rows-min gap-4 md:grid-cols-3"
                >
                    {cards.map((card) => (
                        <StatCard
                            key={card.key}
                            icon={card.icon}
                            label={card.label}
                            value={stats[card.key]}
                            context={card.context}
                        />
                    ))}
                </motion.div>

                <ActivityChart
                    title="New users"
                    description="Registrations over the last 14 days"
                    data={users_series}
                />

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
