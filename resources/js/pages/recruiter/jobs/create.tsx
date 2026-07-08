import { Form, Head, Link } from '@inertiajs/react';
import JobPostingController from '@/actions/App/Http/Controllers/Recruiter/JobPostingController';
import Heading from '@/components/heading';
import JobPostingFields from '@/components/job-posting-fields';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/recruiter/jobs';

export default function CreateJob() {
    return (
        <>
            <Head title="Create job" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Create job"
                    description="Publish a new opening for your company"
                />

                <Form
                    {...JobPostingController.store.form()}
                    className="max-w-3xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <JobPostingFields errors={errors} />

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="create-job-button"
                                >
                                    Create job
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

CreateJob.layout = {
    breadcrumbs: [
        {
            title: 'Jobs',
            href: index(),
        },
        {
            title: 'Create job',
            href: JobPostingController.create(),
        },
    ],
};
