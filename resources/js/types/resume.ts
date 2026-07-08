export type Resume = {
    id: number;
    candidate_profile_id: number;
    title: string | null;
    file_path: string;
    original_name: string;
    mime_type: string | null;
    file_size: number | null;
    is_default: boolean;
    created_at: string;
    updated_at: string;
};

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

/** One role the AI pulled out of the resume. */
export type ExtractedExperience = {
    title?: string;
    company?: string;
    duration?: string;
    highlights?: string[];
};

/** One qualification the AI pulled out of the resume. */
export type ExtractedEducation = {
    degree?: string;
    institution?: string;
    year?: string;
};

/**
 * Everything the AI returned about one resume. Only a `completed` analysis is
 * guaranteed to have its columns filled, which is why they are all nullable —
 * a `pending`, `processing`, or `failed` row carries a status and nothing else.
 */
export type ResumeAnalysis = {
    id: number;
    resume_id: number;
    extracted_skills: string[] | null;
    extracted_experience: ExtractedExperience[] | null;
    extracted_education: ExtractedEducation[] | null;
    overall_score: number | null;
    summary: string | null;
    strengths: string[] | null;
    weaknesses: string[] | null;
    recommendations: string[] | null;
    ai_provider: string | null;
    status: AnalysisStatus;
    analyzed_at: string | null;
    created_at: string;
    updated_at: string;
};

/** A resume as the candidate's table renders it. `analysis` is null until run. */
export type ResumeWithAnalysis = Resume & {
    analysis: ResumeAnalysis | null;
};

/** An analysis whose columns are guaranteed populated. */
export type CompletedResumeAnalysis = ResumeAnalysis & { status: 'completed' };

/**
 * Narrows an analysis to the one state whose fields are worth rendering. The
 * predicate names the narrowed `status` so the failing branch keeps the whole
 * `ResumeAnalysis | null` union rather than collapsing to `never`.
 */
export function isCompleted(
    analysis: ResumeAnalysis | null,
): analysis is CompletedResumeAnalysis {
    return analysis !== null && analysis.status === 'completed';
}

/** `storage:link` exposes the public disk under /storage. */
export function resumeUrl(resume: Resume): string {
    return `/storage/${resume.file_path}`;
}

/** Renders the byte count the database stores as KB or MB. */
export function formatFileSize(bytes: number | null): string {
    if (bytes === null) {
        return '—';
    }

    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
