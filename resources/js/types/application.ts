import type { ExperienceLevel, JobPostingWithCompany } from '@/types/job';

export type ApplicationStatus =
    'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';

export type Application = {
    id: number;
    job_posting_id: number;
    candidate_profile_id: number;
    resume_id: number | null;
    cover_letter: string | null;
    status: ApplicationStatus;
    match_score: number | null;
    recruiter_notes: string | null;
    applied_at: string | null;
    created_at: string;
    updated_at: string;
};

/**
 * An application rendered for candidates, with the posting it targets and
 * that posting's company eager-loaded. Eloquent snake-cases relation keys.
 */
export type ApplicationWithJob = Application & {
    job_posting: JobPostingWithCompany;
};

/** The applicant behind an application, as recruiters see them. */
export type ApplicationCandidate = {
    id: number;
    user_id: number;
    title: string | null;
    bio: string | null;
    phone: string | null;
    location: string | null;
    skills: string[] | null;
    experience_level: ExperienceLevel | null;
    experience_years: number | null;
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
    is_open_to_work: boolean;
    user: {
        id: number;
        name: string;
        email: string;
    };
};

/**
 * An application rendered for recruiters, with the candidate profile and the
 * user account behind it eager-loaded. Eloquent snake-cases relation keys.
 */
export type ApplicationWithCandidate = Application & {
    candidate: ApplicationCandidate;
};

export const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
    'pending',
    'reviewed',
    'interview',
    'accepted',
    'rejected',
];
