import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';

type RecruiterStats = {
    jobs: number;
    published_jobs: number;
    new_applications: number;
    interviews: number;
};

export default function RecruiterDashboard({
    stats,
}: {
    stats: RecruiterStats;
}) {
    return (
        <>
            <Head title="Recruiter Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading title="Recruiter Dashboard" description="Manage job postings, applications, and interviews" />
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">My Jobs</p>
                        <p className="mt-2 text-3xl font-bold">{stats.jobs}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Published Jobs</p>
                        <p className="mt-2 text-3xl font-bold">{stats.published_jobs}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">New Applications</p>
                        <p className="mt-2 text-3xl font-bold">{stats.new_applications}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Interviews</p>
                        <p className="mt-2 text-3xl font-bold">{stats.interviews}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
