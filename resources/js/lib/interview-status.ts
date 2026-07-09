import type { InterviewStatus } from '@/types/interview';

/**
 * ألوان الـ status badge ديال الـ interviews. مشتركة بين الـ candidate و
 * الـ recruiter باش نفس الـ status يبان بنفس اللون فـ الجوج ديال الصفحات.
 *
 * Soft tinted badges built on an `outline` base plus a tone class, matching the
 * application and analysis status maps.
 */
export const interviewStatusVariants: Record<
    InterviewStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    scheduled: 'outline',
    completed: 'outline',
    cancelled: 'outline',
    no_show: 'outline',
};

export const interviewStatusClasses: Record<InterviewStatus, string> = {
    scheduled: 'border-primary/20 bg-primary/10 text-primary',
    completed:
        'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    cancelled: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
    no_show: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
};

/** `no_show` reads badly with its underscore, so label the statuses by hand. */
export const interviewStatusLabels: Record<InterviewStatus, string> = {
    scheduled: 'scheduled',
    completed: 'completed',
    cancelled: 'cancelled',
    no_show: 'no show',
};
