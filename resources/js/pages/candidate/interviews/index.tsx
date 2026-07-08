import { Head, Link } from '@inertiajs/react';
import { MapPin, Phone, Video } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    interviewStatusClasses,
    interviewStatusLabels,
    interviewStatusVariants,
} from '@/lib/interview-status';
import { index } from '@/routes/candidate/interviews';
import { show } from '@/routes/candidate/jobs';
import type { InterviewWithApplication } from '@/types/interview';

/** Interviews arrive as ISO strings, so render them in the viewer's locale. */
function formatWhen(scheduledAt: string): string {
    return new Date(scheduledAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

/**
 * Where the candidate has to be: a join link for online interviews, the room
 * for onsite ones, and a plain phone label otherwise.
 */
function InterviewLocation({
    interview,
}: {
    interview: InterviewWithApplication;
}) {
    if (interview.type === 'online') {
        if (interview.meeting_link === null) {
            return <span className="text-muted-foreground">—</span>;
        }

        return (
            <a
                href={interview.meeting_link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm hover:underline"
                data-test="join-interview-link"
            >
                <Video className="size-3.5 shrink-0" />
                Join
            </a>
        );
    }

    if (interview.type === 'onsite') {
        return (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                {interview.location ?? 'On site'}
            </span>
        );
    }

    return (
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="size-3.5 shrink-0" />
            Phone
        </span>
    );
}

export default function InterviewsIndex({
    interviews,
}: {
    interviews: InterviewWithApplication[];
}) {
    return (
        <>
            <Head title="My Interviews" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Interviews"
                    description="The interviews recruiters have scheduled with you"
                />

                {interviews.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 py-16 text-center dark:border-sidebar-border">
                        <p className="font-medium">No interviews yet</p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            When a recruiter schedules an interview, it will
                            show up here.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Job</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>When</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Where</TableHead>
                                    <TableHead className="pr-4">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {interviews.map((interview) => (
                                    <TableRow key={interview.id}>
                                        <TableCell className="pl-4 font-medium">
                                            <Link
                                                href={show(
                                                    interview.application
                                                        .job_posting.slug,
                                                )}
                                                className="hover:underline"
                                                data-test="interview-job-link"
                                            >
                                                {
                                                    interview.application
                                                        .job_posting.title
                                                }
                                            </Link>
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {
                                                interview.application
                                                    .job_posting.company.name
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {formatWhen(interview.scheduled_at)}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="outline">
                                                {interview.type}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {interview.duration_minutes} min
                                        </TableCell>

                                        <TableCell>
                                            <InterviewLocation
                                                interview={interview}
                                            />
                                        </TableCell>

                                        <TableCell className="pr-4">
                                            <Badge
                                                variant={
                                                    interviewStatusVariants[
                                                        interview.status
                                                    ]
                                                }
                                                className={
                                                    interviewStatusClasses[
                                                        interview.status
                                                    ]
                                                }
                                            >
                                                {
                                                    interviewStatusLabels[
                                                        interview.status
                                                    ]
                                                }
                                            </Badge>
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

InterviewsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Interviews',
            href: index(),
        },
    ],
};
