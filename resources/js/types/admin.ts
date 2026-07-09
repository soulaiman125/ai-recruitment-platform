import type { JobStatus } from '@/types/job';

/** The four Spatie roles a platform account can hold. */
export type Role = 'admin' | 'company' | 'recruiter' | 'candidate';

export const ROLES: readonly Role[] = [
    'admin',
    'company',
    'recruiter',
    'candidate',
];

/** KPIs rendered on the admin dashboard. */
export type AdminStats = {
    users: number;
    companies: number;
    published_jobs: number;
    applications: number;
    analyses: number;
    interviews: number;
};

/** A row in the dashboard "Latest users" list. */
export type AdminLatestUser = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: string[];
};

/** A row in the dashboard "Latest applications" list. */
export type AdminLatestApplication = {
    id: number;
    candidate_name: string | null;
    job_title: string | null;
    applied_at: string | null;
};

/** A user row in the admin users table. */
export type AdminUser = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: string[];
};

/** A company row in the admin companies table, with owner + counts. */
export type AdminCompany = {
    id: number;
    name: string;
    industry: string | null;
    location: string | null;
    is_active: boolean;
    recruiters_count: number;
    job_postings_count: number;
    owner: {
        id: number;
        name: string;
        email: string;
    } | null;
};

/** A job row in the admin jobs table, with its company eager-loaded. */
export type AdminJob = {
    id: number;
    title: string;
    slug: string;
    status: JobStatus;
    applications_count: number;
    created_at: string;
    company: {
        id: number;
        name: string;
    } | null;
};
