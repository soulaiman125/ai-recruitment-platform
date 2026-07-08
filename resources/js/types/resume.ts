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
