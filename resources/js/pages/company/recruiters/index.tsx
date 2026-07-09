import { Form, Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useState } from 'react';
import RecruiterController from '@/actions/App/Http/Controllers/Company/RecruiterController';
import EmptyState from '@/components/empty-state';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PageTransition from '@/components/page-transition';
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
import { index } from '@/routes/company/recruiters';
import type { CompanyRecruiter } from '@/types/company';

function InviteRecruiterDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button data-test="invite-recruiter-button">
                    Invite recruiter
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Invite a recruiter</DialogTitle>

                <DialogDescription>
                    We create their account right away. They set their password
                    through the “Forgot password” flow.
                </DialogDescription>

                <Form
                    {...RecruiterController.store.form()}
                    options={{ preserveScroll: true }}
                    resetOnSuccess
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Full name"
                                />

                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="recruiter@example.com"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="job_title">Job title</Label>

                                <Input
                                    id="job_title"
                                    name="job_title"
                                    placeholder="Talent Acquisition Lead"
                                />

                                <InputError message={errors.job_title} />
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
                                        data-test="confirm-invite-recruiter-button"
                                    >
                                        Send invite
                                    </button>
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteRecruiterDialog({ recruiter }: { recruiter: CompanyRecruiter }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    data-test="delete-recruiter-button"
                >
                    Remove
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Remove this recruiter?</DialogTitle>

                <DialogDescription>
                    {recruiter.user.name} will lose recruiter access to your
                    company. Their account is kept, but the profile is deleted.
                </DialogDescription>

                <Form
                    {...RecruiterController.destroy.form(recruiter.id)}
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
                                    data-test="confirm-delete-recruiter-button"
                                >
                                    Remove
                                </button>
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function RecruitersIndex({
    recruiters,
}: {
    recruiters: CompanyRecruiter[];
}) {
    return (
        <>
            <Head title="Recruiters" />

            <PageTransition className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title="Recruiters"
                        description="Invite and manage the recruiters in your company"
                    />

                    <InviteRecruiterDialog />
                </div>

                {recruiters.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No recruiters yet"
                        description="Invite a recruiter with the button above to start posting jobs as a team."
                    />
                ) : (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Job title</TableHead>
                                    <TableHead>Jobs</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="pr-4 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {recruiters.map((recruiter) => (
                                    <TableRow key={recruiter.id}>
                                        <TableCell className="pl-4 font-medium">
                                            {recruiter.user.name}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {recruiter.user.email}
                                        </TableCell>

                                        <TableCell>
                                            {recruiter.job_title ?? '—'}
                                        </TableCell>

                                        <TableCell>
                                            {recruiter.job_postings_count}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                recruiter.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell className="pr-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <DeleteRecruiterDialog
                                                    recruiter={recruiter}
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

RecruitersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Recruiters',
            href: index(),
        },
    ],
};
