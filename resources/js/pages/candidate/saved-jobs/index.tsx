import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookmarkX } from 'lucide-react';
import EmptyState from '@/components/empty-state';
import Heading from '@/components/heading';
import JobCard from '@/components/job-card';
import PageTransition from '@/components/page-transition';
import { fadeSlideUp, staggerContainer } from '@/lib/motion';
import { index as candidateJobs } from '@/routes/candidate/jobs';
import { index } from '@/routes/candidate/saved-jobs';
import type { JobPostingWithCompany } from '@/types/job';

type SavedJobsProps = {
    jobs: JobPostingWithCompany[];
};

export default function SavedJobs({ jobs }: SavedJobsProps) {
    return (
        <>
            <Head title="Saved Jobs" />

            <PageTransition className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Saved Jobs"
                    description="The openings you bookmarked to apply to later"
                />

                {jobs.length === 0 ? (
                    <EmptyState
                        icon={BookmarkX}
                        title="No saved jobs yet"
                        description="Bookmark a job while you browse and it will wait for you here."
                        action={{
                            label: 'Browse jobs',
                            href: candidateJobs(),
                        }}
                    />
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {/* Every card here is saved by definition, so its
                            bookmark toggle acts as the unsave action and the
                            job drops off the grid on the redirect back. */}
                        {jobs.map((job) => (
                            <motion.div
                                key={job.id}
                                variants={fadeSlideUp}
                                className="h-full"
                            >
                                <JobCard job={job} isSaved />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </PageTransition>
        </>
    );
}

SavedJobs.layout = {
    breadcrumbs: [
        {
            title: 'Saved Jobs',
            href: index(),
        },
    ],
};
