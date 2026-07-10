import type { ExperienceLevel } from '@/types/job';

/** The authenticated candidate's own profile, as they edit it. */
export type CandidateProfile = {
    id: number;
    user_id: number;
    title: string | null;
    bio: string | null;
    phone: string | null;
    location: string | null;
    avatar: string | null;
    skills: string[] | null;
    experience_level: ExperienceLevel | null;
    experience_years: number | null;
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
    is_open_to_work: boolean;
    created_at: string;
    updated_at: string;
};
