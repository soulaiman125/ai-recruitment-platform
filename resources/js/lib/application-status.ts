import type { ApplicationStatus } from '@/types/application';

/**
 * ألوان الـ status badge. مشتركة بين الـ candidate و الـ recruiter
 * باش نفس الـ status يبان بنفس اللون فـ الجوج ديال الصفحات.
 */
export const applicationStatusVariants: Record<
    ApplicationStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    pending: 'secondary',
    reviewed: 'outline',
    interview: 'default',
    accepted: 'default',
    rejected: 'destructive',
};

/** Accepted is the one happy terminal state, so lift it out of the defaults. */
export const applicationStatusClasses: Partial<
    Record<ApplicationStatus, string>
> = {
    accepted: 'bg-emerald-600 text-white hover:bg-emerald-600/90',
};
