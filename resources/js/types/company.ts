export type Company = {
    id: number;
    user_id: number | null;
    name: string;
    slug: string;
    logo: string | null;
    website: string | null;
    description: string | null;
    industry: string | null;
    size: string | null;
    location: string | null;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

/** KPIs rendered on the company dashboard. */
export type CompanyStats = {
    recruiters: number;
    active_jobs: number;
    applications: number;
    interviews: number;
};

/**
 * A recruiter as the company owner sees them, with the linked user account and
 * the count of postings they own. Eloquent snake-cases relation keys.
 */
export type CompanyRecruiter = {
    id: number;
    user_id: number;
    company_id: number;
    job_title: string | null;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    job_postings_count: number;
};
