import type { JobPostingWithCompany } from '@/types/job';

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

export const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
    'pending',
    'reviewed',
    'interview',
    'accepted',
    'rejected',
];
