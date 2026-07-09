import { Form, Head, router } from '@inertiajs/react';
import { Search, SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import JobPostingController from '@/actions/App/Http/Controllers/Admin/JobPostingController';
import EmptyState from '@/components/empty-state';
import Heading from '@/components/heading';
import PageTransition from '@/components/page-transition';
import Pagination from '@/components/pagination';
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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/admin/jobs';
import type { AdminJob } from '@/types/admin';
import { JOB_STATUSES } from '@/types/job';
import type { JobStatus } from '@/types/job';
import type { Paginated } from '@/types/pagination';

type JobsIndexProps = {
    jobs: Paginated<AdminJob>;
    filters: {
        search: string;
        status: string | null;
    };
};

const statusVariants: Record<
    JobStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    published: 'outline',
    draft: 'outline',
    paused: 'outline',
    closed: 'outline',
};

const statusClasses: Record<JobStatus, string> = {
    published:
        'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    draft: 'border-transparent bg-muted text-muted-foreground',
    paused: 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    closed: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
};

function queryFor(search: string, status: string | null) {
    const params: Record<string, string> = {};

    if (search !== '') {
        params.search = search;
    }

    if (status) {
        params.status = status;
    }

    return params;
}

function DeleteJobDialog({ job }: { job: AdminJob }) {
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
                    {...JobPostingController.destroy.form(job.slug)}
                    options={{ preserveScroll: true }}
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

export default function JobsIndex({ jobs, filters }: JobsIndexProps) {
    const [search, setSearch] = useState(filters.search);

    // Debounce the query so typing does not fire a request per keystroke.
    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(index().url, queryFor(search, filters.status), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, filters.search, filters.status]);

    const handleStatus = (value: string) => {
        router.get(
            index().url,
            queryFor(search, value === 'all' ? null : value),
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="Jobs" />

            <PageTransition className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Jobs"
                    description="Every job posting on the platform"
                />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by title"
                            aria-label="Search jobs"
                            className="pl-9"
                            data-test="job-search-input"
                        />
                    </div>

                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={handleStatus}
                    >
                        <SelectTrigger
                            className="w-full sm:w-44"
                            aria-label="Filter by status"
                            data-test="job-status-filter"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>

                            {JOB_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {jobs.data.length === 0 ? (
                    <EmptyState
                        icon={SearchX}
                        title="No jobs match your filters"
                        description="Try a different search term or status filter."
                    />
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">
                                        Title
                                    </TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Applications</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="pr-4 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {jobs.data.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell className="pl-4 font-medium">
                                            {job.title}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {job.company?.name ?? '—'}
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={
                                                    statusVariants[job.status]
                                                }
                                                className={
                                                    statusClasses[job.status]
                                                }
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
                                                <DeleteJobDialog job={job} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Pagination paginator={jobs} noun="jobs" />
            </PageTransition>
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
