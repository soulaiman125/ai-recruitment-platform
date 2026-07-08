import { Form, Head, Link } from '@inertiajs/react';
import JobPostingController from '@/actions/App/Http/Controllers/Recruiter/JobPostingController';
import Heading from '@/components/heading';
import JobPostingFields from '@/components/job-posting-fields';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/recruiter/jobs';
import type { JobPosting } from '@/types/job';

export default function EditJob({ job }: { job: JobPosting }) {
    return (
        <>
            <Head title={`Edit ${job.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Edit job"
                    description="Update the details of this opening"
                />

                <Form
                    {...JobPostingController.update.form(job.slug)}
                    options={{
                        preserveScroll: true,
                    }}
                    className="max-w-3xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <JobPostingFields job={job} errors={errors} />

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-job-button"
                                >
                                    Save
                                </Button>

                                <Button variant="ghost" asChild>
                                    <Link href={index()}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EditJob.layout = {
    breadcrumbs: [
        {
            title: 'Jobs',
            href: index(),
        },
        {
            title: 'Edit job',
            href: index(),
        },
    ],
};
