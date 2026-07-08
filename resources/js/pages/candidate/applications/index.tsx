import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/candidate/applications';
import { show } from '@/routes/candidate/jobs';
import type {
    ApplicationStatus,
    ApplicationWithJob,
} from '@/types/application';

const statusVariants: Record<
    ApplicationStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    pending: 'secondary',
    reviewed: 'outline',
    interview: 'default',
    accepted: 'default',
    rejected: 'destructive',
};

/** Accepted is the one happy terminal state, so lift it out of the defaults. */
const statusClasses: Partial<Record<ApplicationStatus, string>> = {
    accepted: 'bg-emerald-600 text-white hover:bg-emerald-600/90',
};

export default function ApplicationsIndex({
    applications,
}: {
    applications: ApplicationWithJob[];
}) {
    return (
        <>
            <Head title="My Applications" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="My Applications"
                    description="Track the jobs you have applied to"
                />

                {applications.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 py-16 text-center dark:border-sidebar-border">
                        <p className="font-medium">No applications yet</p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Browse the open roles and apply to the ones that
                            match your profile.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Job</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="pr-4">
                                        Applied
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {applications.map((application) => (
                                    <TableRow key={application.id}>
                                        <TableCell className="pl-4 font-medium">
                                            <Link
                                                href={show(
                                                    application.job_posting
                                                        .slug,
                                                )}
                                                className="hover:underline"
                                                data-test="application-job-link"
                                            >
                                                {application.job_posting.title}
                                            </Link>
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {
                                                application.job_posting.company
                                                    .name
                                            }
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={
                                                    statusVariants[
                                                        application.status
                                                    ]
                                                }
                                                className={
                                                    statusClasses[
                                                        application.status
                                                    ]
                                                }
                                            >
                                                {application.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="pr-4 text-muted-foreground">
                                            {application.applied_at === null
                                                ? '—'
                                                : new Date(
                                                      application.applied_at,
                                                  ).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}

ApplicationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'My Applications',
            href: index(),
        },
    ],
};
