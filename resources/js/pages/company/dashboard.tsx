import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Briefcase, CalendarCheck, FileText, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DashboardHeader from '@/components/dashboard-header';
import StatCard from '@/components/stat-card';
import { staggerContainer } from '@/lib/motion';
import type { CompanyStats } from '@/types/company';

type Recruiter = {
    id: number;
    name: string | null;
    jobs_count: number;
};

const cards: {
    key: keyof CompanyStats;
    label: string;
    icon: LucideIcon;
    context: string;
}[] = [
    { key: 'recruiters', label: 'Recruiters', icon: Users, context: 'On your team' },
    {
        key: 'active_jobs',
        label: 'Active Jobs',
        icon: Briefcase,
        context: 'Published',
    },
    {
        key: 'applications',
        label: 'Applications',
        icon: FileText,
        context: 'Received',
    },
    {
        key: 'interviews',
        label: 'Interviews',
        icon: CalendarCheck,
        context: 'Scheduled',
    },
];

/** First letters of the first two words, for the roster avatars. */
function initials(name: string): string {
    return (
        name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join('')
            .toUpperCase() || '?'
    );
}

export default function CompanyDashboard({
    stats,
    recruiters_list,
}: {
    stats: CompanyStats;
    recruiters_list: Recruiter[];
}) {
    return (
        <>
            <Head title="Company Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DashboardHeader subtitle="Your company at a glance — team, jobs, and hiring activity" />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid auto-rows-min gap-4 md:grid-cols-4"
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

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="font-medium">Recruiters</p>

                        {recruiters_list.length === 0 ? (
                            <p className="mt-4 text-sm text-muted-foreground">
                                No recruiters on your team yet.
                            </p>
                        ) : (
                            <div className="mt-4 flex flex-col gap-3">
                                {recruiters_list.map((recruiter) => (
                                    <div
                                        key={recruiter.id}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                            {initials(recruiter.name ?? '?')}
                                        </div>

                                        <p className="min-w-0 flex-1 truncate text-sm font-medium">
                                            {recruiter.name ?? '—'}
                                        </p>

                                        <span className="shrink-0 text-sm text-muted-foreground">
                                            {recruiter.jobs_count} job
                                            {recruiter.jobs_count === 1
                                                ? ''
                                                : 's'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
