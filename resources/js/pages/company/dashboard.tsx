import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';

export default function CompanyDashboard() {
    return (
        <>
            <Head title="Company Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading title="Company Dashboard" description="Manage your company profile, recruiters, and statistics" />
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Recruiters</p>
                        <p className="mt-2 text-3xl font-bold">—</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Active Jobs</p>
                        <p className="mt-2 text-3xl font-bold">—</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="mt-2 text-3xl font-bold">—</p>
                    </div>
                </div>
            </div>
        </>
    );
}