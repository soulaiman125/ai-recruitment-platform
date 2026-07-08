import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';

export default function RecruiterDashboard() {
    return (
        <>
            <Head title="Recruiter Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading title="Recruiter Dashboard" description="Manage job postings, applications, and interviews" />
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">My Jobs</p>
                        <p className="mt-2 text-3xl font-bold">—</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">New Applications</p>
                        <p className="mt-2 text-3xl font-bold">—</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Interviews</p>
                        <p className="mt-2 text-3xl font-bold">—</p>
                    </div>
                </div>
            </div>
        </>
    );
}