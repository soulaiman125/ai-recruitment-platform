import { Form, Head, router } from '@inertiajs/react';
import {
    FileDown,
    Github,
    Globe,
    Linkedin,
    MapPin,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import InterviewController from '@/actions/App/Http/Controllers/Recruiter/InterviewController';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
    applicationStatusClasses,
    applicationStatusVariants,
} from '@/lib/application-status';
import {
    interviewStatusClasses,
    interviewStatusLabels,
    interviewStatusVariants,
} from '@/lib/interview-status';
import { index } from '@/routes/recruiter/jobs';
import {
    index as applications,
    resume as resumeDownload,
    updateStatus,
} from '@/routes/recruiter/jobs/applications';
import { APPLICATION_STATUSES } from '@/types/application';
import type {
    ApplicationStatus,
    ApplicationWithCandidate,
} from '@/types/application';
import { INTERVIEW_STATUSES, INTERVIEW_TYPES } from '@/types/interview';
import type { Interview, InterviewStatus } from '@/types/interview';
import type { JobPosting } from '@/types/job';

/** The AI scorer is not wired yet, so every application arrives unscored. */
function MatchScore({ score }: { score: number | null }) {
    if (score === null) {
        return <span className="text-muted-foreground">—</span>;
    }

    return <Badge variant="outline">Match {score}%</Badge>;
}

/**
 * The route authorizes the job, so the file is only ever reachable through an
 * application on one of this recruiter's own postings.
 */
function ResumeLink({
    job,
    application,
}: {
    job: JobPosting;
    application: ApplicationWithCandidate;
}) {
    if (application.resume === null) {
        return <span className="text-muted-foreground">—</span>;
    }

    return (
        <a
            href={resumeDownload.url([job.slug, application.id])}
            className="flex items-center gap-1.5 text-sm hover:underline"
            data-test="download-applicant-resume-link"
        >
            <FileDown className="size-3.5 shrink-0" />
            Download résumé
        </a>
    );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
    return (
        <Badge
            variant={applicationStatusVariants[status]}
            className={applicationStatusClasses[status]}
        >
            {status}
        </Badge>
    );
}

function ProfileLink({
    href,
    icon: Icon,
    label,
}: {
    href: string;
    icon: typeof Linkedin;
    label: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm hover:underline"
        >
            <Icon className="size-3.5 shrink-0" />
            {label}
        </a>
    );
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

/** Interviews arrive as ISO strings, so render them in the viewer's locale. */
function formatInterviewWhen(scheduledAt: string): string {
    return new Date(scheduledAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

/** `<input type="datetime-local">` wants a zoneless `YYYY-MM-DDTHH:mm` value. */
function toDatetimeLocal(iso: string): string {
    const date = new Date(iso);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

    return local.toISOString().slice(0, 16);
}

function InterviewStatusBadge({ status }: { status: InterviewStatus }) {
    return (
        <Badge
            variant={interviewStatusVariants[status]}
            className={interviewStatusClasses[status]}
        >
            {interviewStatusLabels[status]}
        </Badge>
    );
}

/**
 * The schedule/outcome fields shared by the create and edit forms. Ids are
 * prefixed because a schedule form and an edit form can both be open at once.
 */
function InterviewFields({
    idPrefix,
    interview,
    errors,
}: {
    idPrefix: string;
    interview?: Interview;
    errors: Record<string, string>;
}) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor={`${idPrefix}-scheduled_at`}>
                        Date &amp; time
                    </Label>

                    <Input
                        id={`${idPrefix}-scheduled_at`}
                        name="scheduled_at"
                        type="datetime-local"
                        defaultValue={
                            interview
                                ? toDatetimeLocal(interview.scheduled_at)
                                : ''
                        }
                        required
                        data-test="interview-datetime-input"
                    />

                    <InputError message={errors.scheduled_at} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${idPrefix}-type`}>Type</Label>

                    <Select
                        name="type"
                        defaultValue={interview?.type ?? 'online'}
                    >
                        <SelectTrigger
                            id={`${idPrefix}-type`}
                            data-test="interview-type-select"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {INTERVIEW_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <InputError message={errors.type} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${idPrefix}-duration_minutes`}>
                        Duration (minutes)
                    </Label>

                    <Input
                        id={`${idPrefix}-duration_minutes`}
                        name="duration_minutes"
                        type="number"
                        min={15}
                        max={480}
                        defaultValue={interview?.duration_minutes ?? 30}
                        required
                    />

                    <InputError message={errors.duration_minutes} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${idPrefix}-location`}>Location</Label>

                    <Input
                        id={`${idPrefix}-location`}
                        name="location"
                        maxLength={255}
                        defaultValue={interview?.location ?? ''}
                        placeholder="Office, room, address…"
                    />

                    <InputError message={errors.location} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`${idPrefix}-meeting_link`}>Meeting link</Label>

                <Input
                    id={`${idPrefix}-meeting_link`}
                    name="meeting_link"
                    type="url"
                    defaultValue={interview?.meeting_link ?? ''}
                    placeholder="https://…"
                />

                <InputError message={errors.meeting_link} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`${idPrefix}-notes`}>Notes</Label>

                <Textarea
                    id={`${idPrefix}-notes`}
                    name="notes"
                    rows={3}
                    maxLength={2000}
                    defaultValue={interview?.notes ?? ''}
                    placeholder="Agenda, who is attending…"
                />

                <InputError message={errors.notes} />
            </div>
        </>
    );
}

/** Immediately removes one interview; the redirect lands back on this page. */
function DeleteInterviewForm({
    job,
    application,
    interview,
}: {
    job: JobPosting;
    application: ApplicationWithCandidate;
    interview: Interview;
}) {
    return (
        <Form
            {...InterviewController.destroy.form([
                job.slug,
                application.id,
                interview.id,
            ])}
            options={{ preserveScroll: true }}
        >
            {({ processing }) => (
                <Button variant="ghost" size="sm" disabled={processing} asChild>
                    <button
                        type="submit"
                        aria-label="Delete interview"
                        data-test="delete-interview-button"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </Button>
            )}
        </Form>
    );
}

/**
 * One scheduled interview: its when/type/status at a glance, plus an inline
 * editor to move its date, set an outcome, and record feedback.
 */
function InterviewItem({
    job,
    application,
    interview,
}: {
    job: JobPosting;
    application: ApplicationWithCandidate;
    interview: Interview;
}) {
    const [editing, setEditing] = useState(false);

    return (
        <div className="rounded-lg border border-sidebar-border/70 p-3 dark:border-sidebar-border">
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">
                        {formatInterviewWhen(interview.scheduled_at)}
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline">{interview.type}</Badge>

                        <span className="text-xs text-muted-foreground">
                            {interview.duration_minutes} min
                        </span>

                        <InterviewStatusBadge status={interview.status} />
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing((value) => !value)}
                        data-test="edit-interview-button"
                    >
                        Edit
                    </Button>

                    <DeleteInterviewForm
                        job={job}
                        application={application}
                        interview={interview}
                    />
                </div>
            </div>

            {editing && (
                <Form
                    {...InterviewController.update.form([
                        job.slug,
                        application.id,
                        interview.id,
                    ])}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setEditing(false)}
                    className="mt-3 flex flex-col gap-4 border-t border-sidebar-border/70 pt-3 dark:border-sidebar-border"
                >
                    {({ processing, errors }) => (
                        <>
                            <InterviewFields
                                idPrefix={`edit-${interview.id}`}
                                interview={interview}
                                errors={errors}
                            />

                            <div className="grid gap-2 sm:max-w-[calc(50%-0.5rem)]">
                                <Label htmlFor={`edit-${interview.id}-status`}>
                                    Status
                                </Label>

                                <Select
                                    name="status"
                                    defaultValue={interview.status}
                                >
                                    <SelectTrigger
                                        id={`edit-${interview.id}-status`}
                                        data-test="interview-status-select"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {INTERVIEW_STATUSES.map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {interviewStatusLabels[status]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.status} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor={`edit-${interview.id}-feedback`}
                                >
                                    Feedback
                                </Label>

                                <Textarea
                                    id={`edit-${interview.id}-feedback`}
                                    name="feedback"
                                    rows={3}
                                    maxLength={2000}
                                    defaultValue={interview.feedback ?? ''}
                                    placeholder="How did the interview go?"
                                />

                                <InputError message={errors.feedback} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancel
                                </Button>

                                <Button disabled={processing} asChild>
                                    <button
                                        type="submit"
                                        data-test="save-interview-button"
                                    >
                                        Save interview
                                    </button>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            )}
        </div>
    );
}

/** Collapsed to a button until the recruiter wants to schedule a new one. */
function ScheduleInterviewForm({
    job,
    application,
}: {
    job: JobPosting;
    application: ApplicationWithCandidate;
}) {
    const [open, setOpen] = useState(false);

    if (!open) {
        return (
            <Button
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() => setOpen(true)}
                data-test="new-interview-button"
            >
                Schedule interview
            </Button>
        );
    }

    return (
        <Form
            {...InterviewController.store.form([job.slug, application.id])}
            options={{ preserveScroll: true }}
            resetOnSuccess
            onSuccess={() => setOpen(false)}
            className="flex flex-col gap-4 rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border"
        >
            {({ processing, errors }) => (
                <>
                    <InterviewFields idPrefix="new" errors={errors} />

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button disabled={processing} asChild>
                            <button
                                type="submit"
                                data-test="schedule-interview-button"
                            >
                                Schedule
                            </button>
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}

/** Existing interviews for one application, plus the form to add another. */
function InterviewsSection({
    job,
    application,
}: {
    job: JobPosting;
    application: ApplicationWithCandidate;
}) {
    return (
        <section className="flex flex-col gap-3">
            <h2 className="font-medium">Interviews</h2>

            {application.interviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No interviews scheduled yet.
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {application.interviews.map((interview) => (
                        <InterviewItem
                            key={interview.id}
                            job={job}
                            application={application}
                            interview={interview}
                        />
                    ))}
                </div>
            )}

            <ScheduleInterviewForm job={job} application={application} />
        </section>
    );
}

/**
 * The full applicant profile, their cover letter, and the recruiter's private
 * notes. Notes are saved through the same endpoint the status select uses, so
 * the current status rides along with them.
 */
function ApplicantDialog({
    job,
    application,
}: {
    job: JobPosting;
    application: ApplicationWithCandidate;
}) {
    // The redirect lands back on this page, so close the dialog by hand.
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState(application.recruiter_notes ?? '');
    const [processing, setProcessing] = useState(false);

    const candidate = application.candidate;

    const saveNotes = () => {
        router.patch(
            updateStatus.url([job.slug, application.id]),
            { status: application.status, recruiter_notes: notes },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onSuccess: () => setOpen(false),
            },
        );
    };

    const experience = [
        candidate.experience_level,
        candidate.experience_years === null
            ? null
            : `${candidate.experience_years} ${candidate.experience_years === 1 ? 'year' : 'years'}`,
    ]
        .filter((part) => part !== null)
        .join(' · ');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    data-test="view-applicant-button"
                >
                    View
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                <DialogTitle>{candidate.user.name}</DialogTitle>

                <DialogDescription>
                    {candidate.title ?? candidate.user.email}
                </DialogDescription>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <span>{candidate.user.email}</span>

                            {candidate.phone && <span>{candidate.phone}</span>}

                            {candidate.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="size-3.5 shrink-0" />
                                    {candidate.location}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                            {experience !== '' && (
                                <Badge variant="secondary">{experience}</Badge>
                            )}

                            <MatchScore score={application.match_score} />

                            <StatusBadge status={application.status} />
                        </div>

                        {(application.resume !== null ||
                            candidate.linkedin ||
                            candidate.github ||
                            candidate.portfolio) && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                {application.resume !== null && (
                                    <ResumeLink
                                        job={job}
                                        application={application}
                                    />
                                )}

                                {candidate.linkedin && (
                                    <ProfileLink
                                        href={candidate.linkedin}
                                        icon={Linkedin}
                                        label="LinkedIn"
                                    />
                                )}

                                {candidate.github && (
                                    <ProfileLink
                                        href={candidate.github}
                                        icon={Github}
                                        label="GitHub"
                                    />
                                )}

                                {candidate.portfolio && (
                                    <ProfileLink
                                        href={candidate.portfolio}
                                        icon={Globe}
                                        label="Portfolio"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {candidate.bio && (
                        <Section title="About" body={candidate.bio} />
                    )}

                    {candidate.skills && candidate.skills.length > 0 && (
                        <section className="flex flex-col gap-2">
                            <h2 className="font-medium">Skills</h2>

                            <div className="flex flex-wrap gap-1.5">
                                {candidate.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}

                    <Section
                        title="Cover letter"
                        body={
                            application.cover_letter ??
                            'This candidate did not send a cover letter.'
                        }
                    />

                    <Separator />

                    <InterviewsSection job={job} application={application} />

                    <Separator />

                    <div className="grid gap-2">
                        <Label htmlFor="recruiter_notes">Private notes</Label>

                        <Textarea
                            id="recruiter_notes"
                            name="recruiter_notes"
                            rows={5}
                            maxLength={5000}
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="Only your team can see these notes"
                            data-test="recruiter-notes-input"
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            disabled={processing}
                            onClick={saveNotes}
                            data-test="save-notes-button"
                        >
                            Save notes
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function StatusSelect({
    job,
    application,
}: {
    job: JobPosting;
    application: ApplicationWithCandidate;
}) {
    const changeStatus = (status: string) => {
        router.patch(
            updateStatus.url([job.slug, application.id]),
            { status },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <Select value={application.status} onValueChange={changeStatus}>
            <SelectTrigger
                className="w-36"
                size="sm"
                data-test="application-status-select"
            >
                <SelectValue />
            </SelectTrigger>

            <SelectContent>
                {APPLICATION_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                        {status}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

type ApplicationsIndexProps = {
    job: JobPosting;
    applications: ApplicationWithCandidate[];
};

export default function ApplicationsIndex({
    job,
    applications,
}: ApplicationsIndexProps) {
    return (
        <>
            <Head title={`Applications · ${job.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title={job.title}
                    description={`${applications.length} application${applications.length === 1 ? '' : 's'} received`}
                />

                {applications.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 py-16 text-center dark:border-sidebar-border">
                        <p className="font-medium">No applications yet</p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Candidates who apply to this job will show up here.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">
                                        Candidate
                                    </TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Experience</TableHead>
                                    <TableHead>Match</TableHead>
                                    <TableHead>Résumé</TableHead>
                                    <TableHead>Applied</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="pr-4 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {applications.map((application) => (
                                    <TableRow key={application.id}>
                                        <TableCell className="pl-4 font-medium">
                                            {application.candidate.user.name}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {application.candidate.user.email}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {application.candidate
                                                .experience_level ?? '—'}
                                        </TableCell>

                                        <TableCell>
                                            <MatchScore
                                                score={application.match_score}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <ResumeLink
                                                job={job}
                                                application={application}
                                            />
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {application.applied_at === null
                                                ? '—'
                                                : new Date(
                                                      application.applied_at,
                                                  ).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell>
                                            <StatusBadge
                                                status={application.status}
                                            />
                                        </TableCell>

                                        <TableCell className="pr-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <StatusSelect
                                                    job={job}
                                                    application={application}
                                                />

                                                <ApplicantDialog
                                                    job={job}
                                                    application={application}
                                                />
                                            </div>
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

ApplicationsIndex.layout = ({ job }: ApplicationsIndexProps) => ({
    breadcrumbs: [
        {
            title: 'Jobs',
            href: index(),
        },
        {
            title: job.title,
            href: applications(job.slug),
        },
        {
            title: 'Applications',
            href: applications(job.slug),
        },
    ],
});
