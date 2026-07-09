import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CalendarCheck, FileText, Files, Gauge } from 'lucide-react';
import Heading from '@/components/heading';
import StatCard from '@/components/stat-card';
import { staggerContainer } from '@/lib/motion';

type CandidateStats = {
    applications: number;
    in_interview: number;
    resumes: number;
    resume_score: number | null;
};

export default function CandidateDashboard({
    stats,
}: {
    stats: CandidateStats;
}) {
    return (
        <>
            <Head title="Candidate Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Candidate Dashboard"
                    description="Track your applications, resume analysis, and job matches"
                />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid auto-rows-min gap-4 md:grid-cols-4"
                >
                    <StatCard
                        icon={FileText}
                        label="Applications"
                        value={stats.applications}
                    />
                    <StatCard
                        icon={CalendarCheck}
                        label="In Interview"
                        value={stats.in_interview}
                    />
                    <StatCard
                        icon={Files}
                        label="Resumes"
                        value={stats.resumes}
                    />
                    <StatCard
                        icon={Gauge}
                        label="Resume Score"
                        value={stats.resume_score ?? '—'}
                    />
                </motion.div>
            </div>
        </>
    );
}
