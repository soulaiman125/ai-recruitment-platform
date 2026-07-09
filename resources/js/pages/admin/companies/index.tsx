import { Form, Head, router } from '@inertiajs/react';
import { Search, SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import CompanyController from '@/actions/App/Http/Controllers/Admin/CompanyController';
import EmptyState from '@/components/empty-state';
import Heading from '@/components/heading';
import PageTransition from '@/components/page-transition';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/admin/companies';
import type { AdminCompany } from '@/types/admin';
import type { Paginated } from '@/types/pagination';

type CompaniesIndexProps = {
    companies: Paginated<AdminCompany>;
    filters: {
        search: string;
    };
};

function ToggleActiveButton({ company }: { company: AdminCompany }) {
    return (
        <Form
            {...CompanyController.toggleActive.form(company.id)}
            options={{ preserveScroll: true }}
        >
            {({ processing }) => (
                <Button variant="ghost" size="sm" disabled={processing} asChild>
                    <button
                        type="submit"
                        data-test="toggle-company-active-button"
                    >
                        {company.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                </Button>
            )}
        </Form>
    );
}

export default function CompaniesIndex({
    companies,
    filters,
}: CompaniesIndexProps) {
    const [search, setSearch] = useState(filters.search);

    // Debounce the query so typing does not fire a request per keystroke.
    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(index().url, search === '' ? {} : { search }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, filters.search]);

    return (
        <>
            <Head title="Companies" />

            <PageTransition className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Companies"
                    description="Every company registered on the platform"
                />

                <div className="relative w-full md:max-w-sm">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by company name"
                        aria-label="Search companies"
                        className="pl-9"
                        data-test="company-search-input"
                    />
                </div>

                {companies.data.length === 0 ? (
                    <EmptyState
                        icon={SearchX}
                        title="No companies match your search"
                        description="Try a different company name."
                    />
                ) : (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Name</TableHead>
                                    <TableHead>Industry</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Recruiters</TableHead>
                                    <TableHead>Jobs</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="pr-4 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {companies.data.map((company) => (
                                    <TableRow key={company.id}>
                                        <TableCell className="pl-4 font-medium">
                                            {company.name}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {company.industry ?? '—'}
                                        </TableCell>

                                        <TableCell>
                                            {company.owner ? (
                                                <div className="min-w-0">
                                                    <p className="truncate">
                                                        {company.owner.name}
                                                    </p>
                                                    <p className="truncate text-sm text-muted-foreground">
                                                        {company.owner.email}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {company.recruiters_count}
                                        </TableCell>

                                        <TableCell>
                                            {company.job_postings_count}
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={
                                                    company.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {company.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="pr-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <ToggleActiveButton
                                                    company={company}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Pagination paginator={companies} noun="companies" />
            </PageTransition>
        </>
    );
}

CompaniesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Companies',
            href: index(),
        },
    ],
};
