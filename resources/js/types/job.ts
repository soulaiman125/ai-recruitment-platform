export type EmploymentType =
    'full-time' | 'part-time' | 'contract' | 'internship';

export type WorkMode = 'remote' | 'onsite' | 'hybrid';

export type ExperienceLevel = 'junior' | 'mid' | 'senior';

export type JobStatus = 'draft' | 'published' | 'paused' | 'closed';

export type JobPosting = {
    id: number;
    company_id: number;
    recruiter_profile_id: number;
    title: string;
    slug: string;
    description: string;
    requirements: string | null;
    skills: string[] | null;
    location: string | null;
    employment_type: EmploymentType | null;
    work_mode: WorkMode | null;
    experience_level: ExperienceLevel | null;
    // Cast to `decimal:2` server side, so these arrive as strings.
    salary_min: string | null;
    salary_max: string | null;
    status: JobStatus;
    deadline: string | null;
    created_at: string;
    updated_at: string;
};

export type JobPostingListItem = JobPosting & {
    applications_count: number;
};

export type JobCompany = {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    website: string | null;
    location: string | null;
    industry: string | null;
};

/** A posting rendered for candidates, with its company eager-loaded. */
export type JobPostingWithCompany = JobPosting & {
    company: JobCompany;
};

export const EMPLOYMENT_TYPES: readonly EmploymentType[] = [
    'full-time',
    'part-time',
    'contract',
    'internship',
];

export const WORK_MODES: readonly WorkMode[] = ['remote', 'onsite', 'hybrid'];

export const EXPERIENCE_LEVELS: readonly ExperienceLevel[] = [
    'junior',
    'mid',
    'senior',
];

export const JOB_STATUSES: readonly JobStatus[] = [
    'draft',
    'published',
    'paused',
    'closed',
];
