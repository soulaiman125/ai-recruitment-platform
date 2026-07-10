import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Search, SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import EmptyState from '@/components/empty-state';
import Heading from '@/components/heading';
import JobCard from '@/components/job-card';
import PageTransition from '@/components/page-transition';
import { Input } from '@/components/ui/input';
import { fadeSlideUp, staggerContainer } from '@/lib/motion';
import { index } from '@/routes/candidate/jobs';
import type { JobPostingWithCompany } from '@/types/job';

type JobsBrowseProps = {
    jobs: JobPostingWithCompany[];
    savedJobIds: number[];
    filters: {
        search: string;
    };
};

export default function JobsBrowse({
    jobs,
    savedJobIds,
    filters,
}: JobsBrowseProps) {
    const [search, setSearch] = useState(filters.search);

    // Membership test per card, so the grid stays linear rather than quadratic.
    const savedIds = new Set(savedJobIds);

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

            <PageTransition className="flex h-full flex-1 flex-col gap-4 p-4">
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
                    <EmptyState
                        icon={SearchX}
                        title="No jobs found"
                        description={
                            filters.search === ''
                                ? 'There are no published openings right now. Check back soon.'
                                : `Nothing matches “${filters.search}”. Try a different title or location.`
                        }
                    />
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {jobs.map((job) => (
                            <motion.div
                                key={job.id}
                                variants={fadeSlideUp}
                                className="h-full"
                            >
                                <JobCard
                                    job={job}
                                    isSaved={savedIds.has(job.id)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </PageTransition>
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
