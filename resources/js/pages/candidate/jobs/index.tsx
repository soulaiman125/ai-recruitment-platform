import { Head, Link, router } from '@inertiajs/react';
import { MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { index, show } from '@/routes/candidate/jobs';
import type { JobPostingWithCompany } from '@/types/job';

type JobsBrowseProps = {
    jobs: JobPostingWithCompany[];
    filters: {
        search: string;
    };
};

function JobCard({ job }: { job: JobPostingWithCompany }) {
    return (
        <Link href={show(job.slug)} className="group" data-test="job-card-link">
            <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                    <CardTitle className="line-clamp-2">{job.title}</CardTitle>

                    <CardDescription>{job.company.name}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                    {job.location && (
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="size-3.5 shrink-0" />
                            {job.location}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                        {job.employment_type && (
                            <Badge variant="secondary">
                                {job.employment_type}
                            </Badge>
                        )}

                        {job.work_mode && (
                            <Badge variant="outline">{job.work_mode}</Badge>
                        )}
                    </div>

                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {job.description}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}

export default function JobsBrowse({ jobs, filters }: JobsBrowseProps) {
    const [search, setSearch] = useState(filters.search);

    // Debounce the query so typing does not fire a request per keystroke.
    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(index().url, search === '' ? {} : { search }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, filters.search]);

    return (
        <>
            <Head title="Browse Jobs" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Browse Jobs"
                    description="Find the openings that match your profile"
                />

                <div className="relative w-full md:max-w-sm">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by title or location"
                        aria-label="Search jobs"
                        className="pl-9"
                        data-test="job-search-input"
                    />
                </div>

                {jobs.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 py-16 text-center dark:border-sidebar-border">
                        <p className="font-medium">No jobs found</p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {filters.search === ''
                                ? 'There are no published openings right now. Check back soon.'
                                : `Nothing matches “${filters.search}”. Try a different title or location.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

JobsBrowse.layout = {
    breadcrumbs: [
        {
            title: 'Browse Jobs',
            href: index(),
        },
    ],
};
