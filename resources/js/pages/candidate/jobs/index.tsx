import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FilterX, Search, SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import EmptyState from '@/components/empty-state';
import Heading from '@/components/heading';
import JobCard from '@/components/job-card';
import PageTransition from '@/components/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { fadeSlideUp, staggerContainer } from '@/lib/motion';
import { index } from '@/routes/candidate/jobs';
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS, WORK_MODES } from '@/types/job';
import type {
    EmploymentType,
    ExperienceLevel,
    JobPostingWithCompany,
    WorkMode,
} from '@/types/job';

/** A company that has at least one published opening. */
type FilterCompany = {
    id: number;
    name: string;
};

type JobFilters = {
    search: string;
    company: number | null;
    employment_type: EmploymentType | null;
    work_mode: WorkMode | null;
    experience_level: ExperienceLevel | null;
};

type JobsBrowseProps = {
    jobs: JobPostingWithCompany[];
    savedJobIds: number[];
    companies: FilterCompany[];
    filters: JobFilters;
};

/**
 * Radix rejects an empty `SelectItem` value, so "All" rides on this sentinel
 * and is translated back to "no filter" before the request is built.
 */
const ALL = 'all';

/** Drop every empty filter, so a cleared one leaves the URL entirely. */
function queryFrom(filters: JobFilters): Record<string, string> {
    const query: Record<string, string> = {};

    if (filters.search !== '') {
        query.search = filters.search;
    }

    if (filters.company !== null) {
        query.company = String(filters.company);
    }

    if (filters.employment_type !== null) {
        query.employment_type = filters.employment_type;
    }

    if (filters.work_mode !== null) {
        query.work_mode = filters.work_mode;
    }

    if (filters.experience_level !== null) {
        query.experience_level = filters.experience_level;
    }

    return query;
}

export default function JobsBrowse({
    jobs,
    savedJobIds,
    companies,
    filters,
}: JobsBrowseProps) {
    const [search, setSearch] = useState(filters.search);

    // Membership test per card, so the grid stays linear rather than quadratic.
    const savedIds = new Set(savedJobIds);

    const hasActiveFilters =
        search !== '' ||
        filters.company !== null ||
        filters.employment_type !== null ||
        filters.work_mode !== null ||
        filters.experience_level !== null;

    // The typed search always rides along, so switching a dropdown never drops
    // a query the candidate has not submitted yet.
    const apply = (next: Partial<JobFilters>) => {
        router.get(index().url, queryFrom({ ...filters, search, ...next }), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');

        router.get(
            index().url,
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    // Debounce the query so typing does not fire a request per keystroke.
    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(index().url, queryFrom({ ...filters, search }), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, filters]);

    return (
        <>
            <Head title="Browse Jobs" />

            <PageTransition className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Browse Jobs"
                    description="Find the openings that match your profile"
                />

                <div className="flex flex-col gap-3">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by title or location"
                            aria-label="Search jobs"
                            className="pl-9"
                            data-test="job-search-input"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <Select
                            value={
                                filters.company === null
                                    ? ALL
                                    : String(filters.company)
                            }
                            onValueChange={(value) =>
                                apply({
                                    company:
                                        value === ALL ? null : Number(value),
                                })
                            }
                        >
                            <SelectTrigger
                                className="w-full"
                                aria-label="Filter by company"
                                data-test="company-filter"
                            >
                                <SelectValue placeholder="Company" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value={ALL}>
                                    All companies
                                </SelectItem>

                                {companies.map((company) => (
                                    <SelectItem
                                        key={company.id}
                                        value={String(company.id)}
                                    >
                                        {company.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.employment_type ?? ALL}
                            onValueChange={(value) =>
                                apply({
                                    employment_type:
                                        value === ALL
                                            ? null
                                            : (value as EmploymentType),
                                })
                            }
                        >
                            <SelectTrigger
                                className="w-full"
                                aria-label="Filter by employment type"
                                data-test="employment-type-filter"
                            >
                                <SelectValue placeholder="Employment type" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value={ALL}>All types</SelectItem>

                                {EMPLOYMENT_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.work_mode ?? ALL}
                            onValueChange={(value) =>
                                apply({
                                    work_mode:
                                        value === ALL
                                            ? null
                                            : (value as WorkMode),
                                })
                            }
                        >
                            <SelectTrigger
                                className="w-full"
                                aria-label="Filter by work mode"
                                data-test="work-mode-filter"
                            >
                                <SelectValue placeholder="Work mode" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value={ALL}>All modes</SelectItem>

                                {WORK_MODES.map((mode) => (
                                    <SelectItem key={mode} value={mode}>
                                        {mode}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.experience_level ?? ALL}
                            onValueChange={(value) =>
                                apply({
                                    experience_level:
                                        value === ALL
                                            ? null
                                            : (value as ExperienceLevel),
                                })
                            }
                        >
                            <SelectTrigger
                                className="w-full"
                                aria-label="Filter by experience level"
                                data-test="experience-level-filter"
                            >
                                <SelectValue placeholder="Experience level" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value={ALL}>All levels</SelectItem>

                                {EXPERIENCE_LEVELS.map((level) => (
                                    <SelectItem key={level} value={level}>
                                        {level}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground">
                            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
                        </p>

                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                data-test="clear-filters-button"
                            >
                                <FilterX className="size-4" />
                                Clear filters
                            </Button>
                        )}
                    </div>
                </div>

                {jobs.length === 0 ? (
                    <EmptyState
                        icon={SearchX}
                        title={
                            hasActiveFilters
                                ? 'No jobs match your filters'
                                : 'No jobs found'
                        }
                        description={
                            hasActiveFilters
                                ? 'Try widening your search, or use “Clear filters” to see every published opening.'
                                : 'There are no published openings right now. Check back soon.'
                        }
                    />
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {jobs.map((job) => (
                            <motion.div
                                key={job.id}
                                variants={fadeSlideUp}
                                className="h-full"
                            >
                                <JobCard
                                    job={job}
                                    isSaved={savedIds.has(job.id)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </PageTransition>
        </>
    );
}

JobsBrowse.layout = {
    breadcrumbs: [
        {
            title: 'Browse Jobs',
            href: index(),
        },
    ],
};
