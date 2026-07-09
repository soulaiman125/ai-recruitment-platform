import { Head, Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import EmptyState from '@/components/empty-state';
import Heading from '@/components/heading';
import PageTransition from '@/components/page-transition';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    applicationStatusClasses,
    applicationStatusVariants,
} from '@/lib/application-status';
import { index } from '@/routes/candidate/applications';
import { index as browseJobs, show } from '@/routes/candidate/jobs';
import type { ApplicationWithJob } from '@/types/application';

export default function ApplicationsIndex({
    applications,
}: {
    applications: ApplicationWithJob[];
}) {
    return (
        <>
            <Head title="My Applications" />

            <PageTransition className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="My Applications"
                    description="Track the jobs you have applied to"
                />

                {applications.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="No applications yet"
                        description="Browse the open roles and apply to the ones that match your profile."
                        action={{ label: 'Browse jobs', href: browseJobs() }}
                    />
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
                                                    applicationStatusVariants[
                                                        application.status
                                                    ]
                                                }
                                                className={
                                                    applicationStatusClasses[
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
            </PageTransition>
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
