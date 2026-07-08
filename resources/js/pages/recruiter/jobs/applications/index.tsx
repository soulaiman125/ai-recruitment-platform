import { Head, router } from '@inertiajs/react';
import { Github, Globe, Linkedin, MapPin } from 'lucide-react';
import { useState } from 'react';
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
import { index } from '@/routes/recruiter/jobs';
import {
    index as applications,
    updateStatus,
} from '@/routes/recruiter/jobs/applications';
import { APPLICATION_STATUSES } from '@/types/application';
import type {
    ApplicationStatus,
    ApplicationWithCandidate,
} from '@/types/application';
import type { JobPosting } from '@/types/job';

/** The AI scorer is not wired yet, so every application arrives unscored. */
function MatchScore({ score }: { score: number | null }) {
    if (score === null) {
        return <span className="text-muted-foreground">—</span>;
    }

    return <Badge variant="outline">Match {score}%</Badge>;
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

                        {(candidate.linkedin ||
                            candidate.github ||
                            candidate.portfolio) && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
