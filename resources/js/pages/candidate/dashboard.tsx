import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';

export default function CandidateDashboard() {
    return (
        <>
            <Head title="Candidate Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading title="Candidate Dashboard" description="Track your applications, resume analysis, and job matches" />
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="mt-2 text-3xl font-bold">—</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Saved Jobs</p>
                        <p className="mt-2 text-3xl font-bold">—</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Resume Score</p>
                        <p className="mt-2 text-3xl font-bold">—</p>
                    </div>
                </div>
            </div>
        </>
    );
}