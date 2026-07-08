import { Form, Head, Link } from '@inertiajs/react';
import JobPostingController from '@/actions/App/Http/Controllers/Recruiter/JobPostingController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/recruiter/jobs';
import type { JobPostingListItem, JobStatus } from '@/types/job';

const statusVariants: Record<
    JobStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    published: 'default',
    draft: 'secondary',
    paused: 'outline',
    closed: 'destructive',
};

function DeleteJobDialog({ job }: { job: JobPostingListItem }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" data-test="delete-job-button">
                    Delete
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Delete this job posting?</DialogTitle>

                <DialogDescription>
                    “{job.title}” and its {job.applications_count} application
                    {job.applications_count === 1 ? '' : 's'} will be
                    permanently deleted. This cannot be undone.
                </DialogDescription>

                <Form
                    {...JobPostingController.destroy.form(job.id)}
                    options={{
                        preserveScroll: true,
                    }}
                >
                    {({ processing }) => (
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>

                            <Button
                                variant="destructive"
                                disabled={processing}
                                asChild
                            >
                                <button
                                    type="submit"
                                    data-test="confirm-delete-job-button"
                                >
                                    Delete
                                </button>
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function JobsIndex({ jobs }: { jobs: JobPostingListItem[] }) {
    return (
        <>
            <Head title="Jobs" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title="Jobs"
                        description="Manage the openings you have posted"
                    />

                    <Button asChild>
                        <Link
                            href={JobPostingController.create()}
                            data-test="create-job-link"
                        >
                            Create job
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-4">Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Applications</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="pr-4 text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {jobs.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-10 text-center text-muted-foreground"
                                    >
                                        You have not posted any jobs yet.
                                    </TableCell>
                                </TableRow>
                            )}

                            {jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="pl-4 font-medium">
                                        {job.title}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={statusVariants[job.status]}
                                        >
                                            {job.status}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        {job.applications_count}
                                    </TableCell>

                                    <TableCell className="text-muted-foreground">
                                        {new Date(
                                            job.created_at,
                                        ).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell className="pr-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={JobPostingController.edit(
                                                        job.id,
                                                    )}
                                                >
                                                    Edit
                                                </Link>
                                            </Button>

                                            <Form
                                                {...JobPostingController.publish.form(
                                                    job.id,
                                                )}
                                                options={{
                                                    preserveScroll: true,
                                                }}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={processing}
                                                        asChild
                                                    >
                                                        <button
                                                            type="submit"
                                                            data-test="publish-job-button"
                                                        >
                                                            {job.status ===
                                                            'published'
                                                                ? 'Pause'
                                                                : 'Publish'}
                                                        </button>
                                                    </Button>
                                                )}
                                            </Form>

                                            <DeleteJobDialog job={job} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

JobsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Jobs',
            href: index(),
        },
    ],
};
