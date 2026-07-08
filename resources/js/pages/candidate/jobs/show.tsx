import { Form, Head } from '@inertiajs/react';
import { CalendarDays, Building2, MapPin } from 'lucide-react';
import { useState } from 'react';
import ApplicationController from '@/actions/App/Http/Controllers/Candidate/ApplicationController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/candidate/jobs';
import type { JobPostingWithCompany } from '@/types/job';

/** Salaries arrive as `decimal:2` strings, so format them for display. */
function formatSalaryRange(min: string | null, max: string | null) {
    const format = (value: string) =>
        new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 0,
        }).format(Number(value));

    if (min !== null && max !== null) {
        return `${format(min)} – ${format(max)}`;
    }

    if (min !== null) {
        return `From ${format(min)}`;
    }

    if (max !== null) {
        return `Up to ${format(max)}`;
    }

    return null;
}

function Section({ title, body }: { title: string; body: string }) {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="font-medium">{title}</h2>

            <p className="text-sm whitespace-pre-line text-muted-foreground">
                {body}
            </p>
        </section>
    );
}

function ApplyDialog({ job }: { job: JobPostingWithCompany }) {
    // The redirect lands back on this page, so close the dialog by hand.
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button data-test="apply-button">Apply</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Apply to “{job.title}”</DialogTitle>

                <DialogDescription>
                    Add a cover letter if you would like to introduce yourself.
                    It is optional.
                </DialogDescription>

                <Form
                    {...ApplicationController.store.form(job.slug)}
                    options={{
                        preserveScroll: true,
                    }}
                    onSuccess={() => setOpen(false)}
                >
                    {({ processing, errors }) => (
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="cover_letter">
                                    Cover letter
                                </Label>

                                <Textarea
                                    id="cover_letter"
                                    name="cover_letter"
                                    rows={6}
                                    maxLength={5000}
                                    placeholder="Tell the recruiter why you are a good fit"
                                    data-test="cover-letter-input"
                                />

                                <InputError message={errors.cover_letter} />
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary" type="button">
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button disabled={processing} asChild>
                                    <button
                                        type="submit"
                                        data-test="confirm-apply-button"
                                    >
                                        Submit application
                                    </button>
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

type ShowJobProps = {
    job: JobPostingWithCompany;
    hasApplied: boolean;
};

export default function ShowJob({ job, hasApplied }: ShowJobProps) {
    const salary = formatSalaryRange(job.salary_min, job.salary_max);

    return (
        <>
            <Head title={job.title} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading title={job.title} description={job.company.name} />

                    {hasApplied ? (
                        <Button disabled data-test="applied-button">
                            Applied ✓
                        </Button>
                    ) : (
                        <ApplyDialog job={job} />
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Building2 className="size-3.5 shrink-0" />
                            {job.company.name}
                        </span>

                        {job.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="size-3.5 shrink-0" />
                                {job.location}
                            </span>
                        )}

                        {job.deadline && (
                            <span className="flex items-center gap-1.5">
                                <CalendarDays className="size-3.5 shrink-0" />
                                Apply before{' '}
                                {new Date(job.deadline).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {job.employment_type && (
                            <Badge variant="secondary">
                                {job.employment_type}
                            </Badge>
                        )}

                        {job.work_mode && (
                            <Badge variant="outline">{job.work_mode}</Badge>
                        )}

                        {job.experience_level && (
                            <Badge variant="outline">
                                {job.experience_level}
                            </Badge>
                        )}
                    </div>

                    {salary !== null && (
                        <p className="text-sm">
                            <span className="text-muted-foreground">
                                Salary
                            </span>{' '}
                            <span className="font-medium">{salary}</span>
                        </p>
                    )}
                </div>

                <Separator />

                <div className="flex max-w-3xl flex-col gap-6">
                    <Section title="Description" body={job.description} />

                    {job.requirements && (
                        <Section title="Requirements" body={job.requirements} />
                    )}

                    {job.skills && job.skills.length > 0 && (
                        <section className="flex flex-col gap-2">
                            <h2 className="font-medium">Skills</h2>

                            <div className="flex flex-wrap gap-1.5">
                                {job.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}

ShowJob.layout = {
    breadcrumbs: [
        {
            title: 'Browse Jobs',
            href: index(),
        },
        {
            title: 'Job details',
            href: index(),
        },
    ],
};
