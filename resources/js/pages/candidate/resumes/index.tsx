import { Form, Head } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    CircleCheck,
    FileText,
    Lightbulb,
    Sparkles,
    TriangleAlert,
} from 'lucide-react';
import ResumeController from '@/actions/App/Http/Controllers/Candidate/ResumeController';
import EmptyState from '@/components/empty-state';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PageTransition from '@/components/page-transition';
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
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useCountUp } from '@/hooks/use-count-up';
import {
    analysisStatusClasses,
    analysisStatusVariants,
    scoreStrokeClasses,
    scoreTextClasses,
    scoreTone,
} from '@/lib/analysis-status';
import { fadeSlideUp, staggerContainer } from '@/lib/motion';
import { index } from '@/routes/candidate/resumes';
import { formatFileSize, isCompleted, resumeUrl } from '@/types/resume';
import type {
    Resume,
    ResumeAnalysis,
    ResumeWithAnalysis,
} from '@/types/resume';

function UploadForm() {
    return (
        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <Form
                {...ResumeController.store.form()}
                options={{
                    preserveScroll: true,
                }}
                resetOnSuccess
            >
                {({ processing, progress, errors }) => (
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="file">PDF file</Label>

                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept=".pdf"
                                    required
                                    data-test="resume-file-input"
                                />

                                <InputError message={errors.file} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Title (optional)</Label>

                                <Input
                                    id="title"
                                    name="title"
                                    maxLength={255}
                                    placeholder="Frontend Developer 2026"
                                    data-test="resume-title-input"
                                />

                                <InputError message={errors.title} />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing} asChild>
                                <button
                                    type="submit"
                                    data-test="upload-resume-button"
                                >
                                    Upload resume
                                </button>
                            </Button>

                            {progress && (
                                <span className="text-sm text-muted-foreground">
                                    Uploading {progress.percentage ?? 0}%
                                </span>
                            )}

                            <span className="text-sm text-muted-foreground">
                                PDF only, up to 5 MB.
                            </span>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    );
}

function DeleteResumeDialog({ resume }: { resume: Resume }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    data-test="delete-resume-button"
                >
                    Delete
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Delete this resume?</DialogTitle>

                <DialogDescription>
                    “{resume.title ?? resume.original_name}” will be permanently
                    deleted, and removed from the applications it is attached
                    to. This cannot be undone.
                </DialogDescription>

                <Form
                    {...ResumeController.destroy.form(resume.id)}
                    options={{
                        preserveScroll: true,
                    }}
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
                                    data-test="confirm-delete-resume-button"
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

/** The AI's 0-100 verdict, as a donut that fills clockwise from the top. */
function ScoreRing({ score }: { score: number }) {
    const reduceMotion = useReducedMotion();
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const tone = scoreTone(score);
    const counted = useCountUp(score);

    // A full circle is offset 0, an empty one is offset `circumference`.
    const offset =
        circumference * (1 - Math.min(100, Math.max(0, score)) / 100);

    return (
        <div className="relative flex size-32 shrink-0 items-center justify-center">
            <svg viewBox="0 0 120 120" className="size-32 -rotate-90">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    strokeWidth="10"
                    className="stroke-muted"
                />

                {/* Fills from empty to `offset` on open; the count keeps pace. */}
                <motion.circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{
                        strokeDashoffset: reduceMotion ? offset : circumference,
                    }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className={scoreStrokeClasses[tone]}
                />
            </svg>

            <div className="absolute flex flex-col items-center">
                <span
                    className={`text-4xl font-semibold tabular-nums ${scoreTextClasses[tone]}`}
                >
                    {counted}
                </span>

                <span className="text-xs text-muted-foreground">
                    out of 100
                </span>
            </div>
        </div>
    );
}

/** One of the three colour-coded verdict lists: strengths, gaps, next steps. */
function FindingList({
    title,
    icon: Icon,
    iconClassName,
    items,
}: {
    title: string;
    icon: typeof CircleCheck;
    iconClassName: string;
    items: string[];
}) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section className="flex flex-col gap-2">
            <h2 className="font-medium">{title}</h2>

            <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-2"
            >
                {items.map((item) => (
                    <motion.li
                        key={item}
                        variants={fadeSlideUp}
                        className="flex items-start gap-2 text-sm"
                    >
                        <Icon
                            className={`mt-0.5 size-4 shrink-0 ${iconClassName}`}
                        />

                        <span className="text-muted-foreground">{item}</span>
                    </motion.li>
                ))}
            </motion.ul>
        </section>
    );
}

function ExperienceList({ analysis }: { analysis: ResumeAnalysis }) {
    const experience = analysis.extracted_experience ?? [];

    if (experience.length === 0) {
        return null;
    }

    return (
        <section className="flex flex-col gap-2">
            <h2 className="font-medium">Experience the AI found</h2>

            <ul className="flex flex-col gap-3">
                {experience.map((role, roleIndex) => (
                    <li
                        // The model guarantees no natural key here, so pair the
                        // title with its position to keep the list stable.
                        key={`${role.title ?? 'role'}-${roleIndex}`}
                        className="text-sm"
                    >
                        <p className="font-medium">
                            {role.title ?? 'Not specified'}

                            {role.company && (
                                <span className="text-muted-foreground">
                                    {' · '}
                                    {role.company}
                                </span>
                            )}
                        </p>

                        {role.duration && (
                            <p className="text-xs text-muted-foreground">
                                {role.duration}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

/** Submits the analyze route. Gemini takes seconds, so surface the wait. */
function AnalyzeButton({
    resume,
    label,
    variant = 'ghost',
}: {
    resume: Resume;
    label: string;
    variant?: 'ghost' | 'secondary';
}) {
    return (
        <Form
            {...ResumeController.analyze.form(resume.id)}
            options={{
                preserveScroll: true,
            }}
        >
            {({ processing }) => (
                <Button
                    variant={variant}
                    size="sm"
                    disabled={processing}
                    asChild
                >
                    <button type="submit" data-test="analyze-resume-button">
                        {processing ? (
                            <>
                                <Spinner />
                                Analyzing…
                            </>
                        ) : (
                            label
                        )}
                    </button>
                </Button>
            )}
        </Form>
    );
}

/**
 * The full AI verdict on one resume. Only ever rendered for a completed
 * analysis, so every column it reads is populated.
 */
function AnalysisDialog({
    resume,
    analysis,
}: {
    resume: Resume;
    analysis: ResumeAnalysis;
}) {
    const skills = analysis.extracted_skills ?? [];
    const education = analysis.extracted_education ?? [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    data-test="view-analysis-button"
                >
                    View analysis
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                <DialogTitle>AI analysis</DialogTitle>

                <DialogDescription>
                    {resume.title ?? resume.original_name}
                </DialogDescription>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                        <ScoreRing score={analysis.overall_score ?? 0} />

                        <div className="flex flex-col gap-2">
                            <h2 className="flex items-center gap-1.5 font-medium">
                                <Sparkles className="size-4 shrink-0" />
                                Summary
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                {analysis.summary === null ||
                                analysis.summary === ''
                                    ? 'The AI returned no summary for this resume.'
                                    : analysis.summary}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {skills.length > 0 && (
                        <section className="flex flex-col gap-2">
                            <h2 className="font-medium">Skills detected</h2>

                            <div className="flex flex-wrap gap-1.5">
                                {skills.map((skill) => (
                                    <Badge key={skill} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}

                    <FindingList
                        title="Strengths"
                        icon={CircleCheck}
                        iconClassName="text-emerald-600 dark:text-emerald-500"
                        items={analysis.strengths ?? []}
                    />

                    <FindingList
                        title="Weaknesses"
                        icon={TriangleAlert}
                        iconClassName="text-amber-600 dark:text-amber-500"
                        items={analysis.weaknesses ?? []}
                    />

                    <FindingList
                        title="Recommendations"
                        icon={Lightbulb}
                        iconClassName="text-sky-600 dark:text-sky-500"
                        items={analysis.recommendations ?? []}
                    />

                    <ExperienceList analysis={analysis} />

                    {education.length > 0 && (
                        <section className="flex flex-col gap-2">
                            <h2 className="font-medium">Education</h2>

                            <ul className="flex flex-col gap-1">
                                {education.map((entry, entryIndex) => (
                                    <li
                                        key={`${entry.degree ?? 'degree'}-${entryIndex}`}
                                        className="text-sm text-muted-foreground"
                                    >
                                        {[
                                            entry.degree,
                                            entry.institution,
                                            entry.year,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <Separator />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                            Analyzed by {analysis.ai_provider ?? 'AI'}
                            {analysis.analyzed_at !== null &&
                                ` on ${new Date(analysis.analyzed_at).toLocaleString()}`}
                        </p>

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" type="button">
                                    Close
                                </Button>
                            </DialogClose>

                            <AnalyzeButton
                                resume={resume}
                                label="Re-analyze"
                                variant="secondary"
                            />
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function AnalysisBadge({ analysis }: { analysis: ResumeAnalysis | null }) {
    if (analysis === null) {
        return <span className="text-muted-foreground">—</span>;
    }

    return (
        <Badge
            variant={analysisStatusVariants[analysis.status]}
            className={analysisStatusClasses[analysis.status]}
        >
            {isCompleted(analysis) && analysis.overall_score !== null
                ? `Score ${analysis.overall_score}`
                : analysis.status}
        </Badge>
    );
}

export default function ResumesIndex({
    resumes,
}: {
    resumes: ResumeWithAnalysis[];
}) {
    return (
        <>
            <Head title="Resumes" />

            <PageTransition className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Resumes"
                    description="Upload the resumes you attach to your applications"
                />

                <UploadForm />

                {resumes.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="No resumes yet"
                        description="Upload a PDF above to attach it to the jobs you apply to."
                    />
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Uploaded</TableHead>
                                    <TableHead>Analysis</TableHead>
                                    <TableHead className="pr-4 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {resumes.map((resume) => (
                                    <TableRow key={resume.id}>
                                        <TableCell className="pl-4 font-medium">
                                            <div className="flex items-center gap-2">
                                                {resume.title ??
                                                    resume.original_name}

                                                {resume.is_default && (
                                                    <Badge variant="secondary">
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {formatFileSize(resume.file_size)}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                resume.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell>
                                            <AnalysisBadge
                                                analysis={resume.analysis}
                                            />
                                        </TableCell>

                                        <TableCell className="pr-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={resumeUrl(resume)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        data-test="download-resume-link"
                                                    >
                                                        Download
                                                    </a>
                                                </Button>

                                                {/* A completed analysis is worth
                                                    reading; anything else is
                                                    worth running or retrying. */}
                                                {isCompleted(
                                                    resume.analysis,
                                                ) ? (
                                                    <AnalysisDialog
                                                        resume={resume}
                                                        analysis={
                                                            resume.analysis
                                                        }
                                                    />
                                                ) : (
                                                    <AnalyzeButton
                                                        resume={resume}
                                                        label={
                                                            resume.analysis
                                                                ?.status ===
                                                            'failed'
                                                                ? 'Retry analysis'
                                                                : 'Analyze'
                                                        }
                                                    />
                                                )}

                                                {!resume.is_default && (
                                                    <Form
                                                        {...ResumeController.setDefault.form(
                                                            resume.id,
                                                        )}
                                                        options={{
                                                            preserveScroll: true,
                                                        }}
                                                    >
                                                        {({ processing }) => (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={
                                                                    processing
                                                                }
                                                                asChild
                                                            >
                                                                <button
                                                                    type="submit"
                                                                    data-test="set-default-resume-button"
                                                                >
                                                                    Set as
                                                                    default
                                                                </button>
                                                            </Button>
                                                        )}
                                                    </Form>
                                                )}

                                                <DeleteResumeDialog
                                                    resume={resume}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </PageTransition>
        </>
    );
}

ResumesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Resumes',
            href: index(),
        },
    ],
};
