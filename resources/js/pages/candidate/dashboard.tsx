import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CalendarCheck,
    FileText,
    Files,
    Gauge,
    Search,
    Upload,
} from 'lucide-react';
import DashboardHeader from '@/components/dashboard-header';
import ScoreRing from '@/components/score-ring';
import StatCard from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { scoreTone } from '@/lib/analysis-status';
import {
    applicationStatusClasses,
    applicationStatusVariants,
} from '@/lib/application-status';
import { staggerContainer } from '@/lib/motion';
import { index as candidateJobs } from '@/routes/candidate/jobs';
import { index as candidateResumes } from '@/routes/candidate/resumes';
import type { ApplicationStatus } from '@/types/application';

type LatestApplication = {
    job_title: string | null;
    company_name: string | null;
    status: ApplicationStatus;
    applied_at: string | null;
};

type CandidateStats = {
    applications: number;
    in_interview: number;
    resumes: number;
    resume_score: number | null;
};

const readinessLabels: Record<ReturnType<typeof scoreTone>, string> = {
    strong: 'Looking strong',
    fair: 'Room to improve',
    weak: 'Needs work',
};

export default function CandidateDashboard({
    stats,
    latest_application,
}: {
    stats: CandidateStats;
    latest_application: LatestApplication | null;
}) {
    return (
        <>
            <Head title="Candidate Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <DashboardHeader subtitle="Track your applications, resume analysis, and job matches" />

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
                        context="Total submitted"
                    />
                    <StatCard
                        icon={CalendarCheck}
                        label="In Interview"
                        value={stats.in_interview}
                        context="Active stage"
                    />
                    <StatCard
                        icon={Files}
                        label="Resumes"
                        value={stats.resumes}
                        context="Uploaded"
                    />
                    <StatCard
                        icon={Gauge}
                        label="Resume Score"
                        value={stats.resume_score ?? '—'}
                        context="Best resume"
                    />
                </motion.div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Latest application */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="font-medium">Latest application</p>

                        {latest_application ? (
                            <div className="mt-4 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {latest_application.job_title ?? '—'}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {latest_application.company_name ?? '—'}
                                    </p>
                                    {latest_application.applied_at && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Applied{' '}
                                            {new Date(
                                                latest_application.applied_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                <Badge
                                    variant={
                                        applicationStatusVariants[
                                            latest_application.status
                                        ]
                                    }
                                    className={
                                        applicationStatusClasses[
                                            latest_application.status
                                        ]
                                    }
                                >
                                    {latest_application.status}
                                </Badge>
                            </div>
                        ) : (
                            <div className="mt-4 flex flex-col items-start gap-3">
                                <p className="text-sm text-muted-foreground">
                                    You haven’t applied to any jobs yet. Find a
                                    role that fits and apply in a couple of
                                    clicks.
                                </p>
                                <Button asChild size="sm">
                                    <Link href={candidateJobs()}>
                                        <Search className="size-4" />
                                        Browse jobs
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Resume readiness */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="font-medium">Resume readiness</p>

                        {stats.resume_score !== null ? (
                            <div className="mt-4 flex items-center gap-5">
                                <ScoreRing score={stats.resume_score} />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                        {
                                            readinessLabels[
                                                scoreTone(stats.resume_score)
                                            ]
                                        }
                                    </p>
                                    <p className="mt-1 text-sm text-pretty text-muted-foreground">
                                        Based on the AI analysis of your default
                                        resume.
                                    </p>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="mt-3"
                                    >
                                        <Link href={candidateResumes()}>
                                            View analysis
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 flex flex-col items-start gap-3">
                                <p className="text-sm text-muted-foreground">
                                    Upload a resume to get an instant AI score
                                    with feedback on your strengths and gaps.
                                </p>
                                <Button asChild size="sm">
                                    <Link href={candidateResumes()}>
                                        <Upload className="size-4" />
                                        Upload a resume
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
