import { Form, Head } from '@inertiajs/react';
import CompanyProfileController from '@/actions/App/Http/Controllers/Company/CompanyProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { edit } from '@/routes/company/profile';
import type { Company } from '@/types/company';

export default function CompanyProfileEdit({ company }: { company: Company }) {
    return (
        <>
            <Head title="Company Profile" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Company Profile"
                    description="Update how your company appears to candidates"
                />

                <Form
                    {...CompanyProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="max-w-3xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={company.name}
                                    required
                                    placeholder="Acme Inc."
                                />

                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="website">Website</Label>

                                <Input
                                    id="website"
                                    name="website"
                                    type="url"
                                    defaultValue={company.website ?? ''}
                                    placeholder="https://example.com"
                                />

                                <InputError message={errors.website} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>

                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={company.description ?? ''}
                                    rows={6}
                                    placeholder="Tell candidates about your company, mission, and culture"
                                />

                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="industry">Industry</Label>

                                    <Input
                                        id="industry"
                                        name="industry"
                                        defaultValue={company.industry ?? ''}
                                        placeholder="Software"
                                    />

                                    <InputError message={errors.industry} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="size">Size</Label>

                                    <Input
                                        id="size"
                                        name="size"
                                        defaultValue={company.size ?? ''}
                                        placeholder="11-50 employees"
                                    />

                                    <InputError message={errors.size} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>

                                    <Input
                                        id="location"
                                        name="location"
                                        defaultValue={company.location ?? ''}
                                        placeholder="Tanger, Morocco"
                                    />

                                    <InputError message={errors.location} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>

                                    <Input
                                        id="phone"
                                        name="phone"
                                        defaultValue={company.phone ?? ''}
                                        placeholder="+212 600-000000"
                                    />

                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-company-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

CompanyProfileEdit.layout = {
    breadcrumbs: [
        {
            title: 'Company Profile',
            href: edit(),
        },
    ],
};
