import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';

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
                <Heading title="Candidate Dashboard" description="Track your applications, resume analysis, and job matches" />
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="mt-2 text-3xl font-bold">{stats.applications}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">In Interview</p>
                        <p className="mt-2 text-3xl font-bold">{stats.in_interview}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Resumes</p>
                        <p className="mt-2 text-3xl font-bold">{stats.resumes}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Resume Score</p>
                        <p className="mt-2 text-3xl font-bold">{stats.resume_score ?? '—'}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
