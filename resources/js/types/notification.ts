/** The kinds of notification the platform sends. */
export type NotificationType =
    'application_status' | 'interview_scheduled' | 'new_application';

/**
 * The `data` payload each notification carries. Every type shares the first
 * four keys; the rest are typed but optional, since they depend on the type.
 */
export type NotificationData = {
    type: NotificationType;
    title: string;
    message: string;
    url: string;
    application_id?: number;
    interview_id?: number;
    job_title?: string;
    job_slug?: string | null;
    company_name?: string | null;
    candidate_name?: string;
    status?: string;
    scheduled_at?: string;
    interview_type?: string;
    match_score?: number | null;
};

/** One row of the `notifications` table, as the controller serialises it. */
export type Notification = {
    id: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string | null;
};
