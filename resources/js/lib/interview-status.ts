import type { InterviewStatus } from '@/types/interview';

/**
 * ألوان الـ status badge ديال الـ interviews. مشتركة بين الـ candidate و
 * الـ recruiter باش نفس الـ status يبان بنفس اللون فـ الجوج ديال الصفحات.
 */
export const interviewStatusVariants: Record<
    InterviewStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    scheduled: 'default',
    completed: 'secondary',
    cancelled: 'destructive',
    no_show: 'destructive',
};

/** Completed is the one happy terminal state, so lift it out of the defaults. */
export const interviewStatusClasses: Partial<Record<InterviewStatus, string>> =
    {
        completed: 'bg-emerald-600 text-white hover:bg-emerald-600/90',
    };

/** `no_show` reads badly with its underscore, so label the statuses by hand. */
export const interviewStatusLabels: Record<InterviewStatus, string> = {
    scheduled: 'scheduled',
    completed: 'completed',
    cancelled: 'cancelled',
    no_show: 'no show',
};
