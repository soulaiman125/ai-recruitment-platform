import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Briefcase, CalendarCheck, FileText, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ActivityChart from '@/components/activity-chart';
import type {ActivityPoint} from '@/components/activity-chart';
import DashboardHeader from '@/components/dashboard-header';
import StatCard from '@/components/stat-card';
import { staggerContainer } from '@/lib/motion';

type RecruiterStats = {
    jobs: number;
    published_jobs: number;
    new_applications: number;
    interviews: number;
};

type Card = {
    key: keyof RecruiterStats;
    label: string;
    icon: LucideIcon;
    context: string;
};

export default function RecruiterDashboard({
    stats,
    applications_series,
}: {
    stats: RecruiterStats;
    applications_series: ActivityPoint[];
}) {
    const cards: Card[] = [
        {
            key: 'jobs',
            label: 'My Jobs',
            icon: Briefcase,
            context: `${stats.published_jobs} published`,
        },
        {
            key: 'published_jobs',
            label: 'Published Jobs',
            icon: Send,
            context: 'Visible to candidates',
        },
        {
            key: 'new_applications',
            label: 'New Applications',
            icon: FileText,
            context: 'Awaiting review',
        },
        {
            key: 'interviews',
            label: 'Interviews',
            icon: CalendarCheck,
            context: 'Scheduled',
        },
    ];

    return (
        <>
            <Head title="Recruiter Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DashboardHeader subtitle="Your recruiting workspace — postings, applications, and interviews" />

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

                <ActivityChart
                    title="Applications received"
                    description="New applications over the last 14 days"
                    data={applications_series}
                />
            </div>
        </>
    );
}
