import { Form, Head } from '@inertiajs/react';
import ResumeController from '@/actions/App/Http/Controllers/Candidate/ResumeController';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/candidate/resumes';
import { formatFileSize, resumeUrl } from '@/types/resume';
import type { Resume } from '@/types/resume';

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

export default function ResumesIndex({ resumes }: { resumes: Resume[] }) {
    return (
        <>
            <Head title="Resumes" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Resumes"
                    description="Upload the resumes you attach to your applications"
                />

                <UploadForm />

                {resumes.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 py-16 text-center dark:border-sidebar-border">
                        <p className="font-medium">No resumes yet</p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Upload a PDF above to attach it to the jobs you
                            apply to.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Uploaded</TableHead>
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
            </div>
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
