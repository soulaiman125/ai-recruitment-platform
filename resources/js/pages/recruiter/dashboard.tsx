import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Briefcase, CalendarCheck, FileText, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Heading from '@/components/heading';
import StatCard from '@/components/stat-card';
import { staggerContainer } from '@/lib/motion';

type RecruiterStats = {
    jobs: number;
    published_jobs: number;
    new_applications: number;
    interviews: number;
};

const cards: { key: keyof RecruiterStats; label: string; icon: LucideIcon }[] =
    [
        { key: 'jobs', label: 'My Jobs', icon: Briefcase },
        { key: 'published_jobs', label: 'Published Jobs', icon: Send },
        { key: 'new_applications', label: 'New Applications', icon: FileText },
        { key: 'interviews', label: 'Interviews', icon: CalendarCheck },
    ];

export default function RecruiterDashboard({
    stats,
}: {
    stats: RecruiterStats;
}) {
    return (
        <>
            <Head title="Recruiter Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Recruiter Dashboard"
                    description="Manage job postings, applications, and interviews"
                />
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
                        />
                    ))}
                </motion.div>
            </div>
        </>
    );
}
