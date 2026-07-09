import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Briefcase, CalendarCheck, FileText, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Heading from '@/components/heading';
import StatCard from '@/components/stat-card';
import { staggerContainer } from '@/lib/motion';
import type { CompanyStats } from '@/types/company';

const cards: { key: keyof CompanyStats; label: string; icon: LucideIcon }[] = [
    { key: 'recruiters', label: 'Recruiters', icon: Users },
    { key: 'active_jobs', label: 'Active Jobs', icon: Briefcase },
    { key: 'applications', label: 'Applications', icon: FileText },
    { key: 'interviews', label: 'Interviews', icon: CalendarCheck },
];

export default function CompanyDashboard({ stats }: { stats: CompanyStats }) {
    return (
        <>
            <Head title="Company Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Company Dashboard"
                    description="Manage your company profile, recruiters, and statistics"
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
