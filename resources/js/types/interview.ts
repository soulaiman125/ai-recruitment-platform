import type { ApplicationWithJob } from '@/types/application';

export type InterviewType = 'online' | 'onsite' | 'phone';

export type InterviewStatus =
    'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type Interview = {
    id: number;
    application_id: number;
    scheduled_by: number;
    type: InterviewType;
    scheduled_at: string;
    duration_minutes: number;
    location: string | null;
    meeting_link: string | null;
    notes: string | null;
    feedback: string | null;
    status: InterviewStatus;
    created_at: string;
    updated_at: string;
};

/**
 * An interview rendered for candidates, with the application it belongs to and
 * that application's posting and company eager-loaded. Eloquent snake-cases
 * relation keys.
 */
export type InterviewWithApplication = Interview & {
    application: ApplicationWithJob;
};

export const INTERVIEW_TYPES: readonly InterviewType[] = [
    'online',
    'onsite',
    'phone',
];

export const INTERVIEW_STATUSES: readonly InterviewStatus[] = [
    'scheduled',
    'completed',
    'cancelled',
    'no_show',
];
