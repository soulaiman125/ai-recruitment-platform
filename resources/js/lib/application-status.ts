import type { ApplicationStatus } from '@/types/application';

/**
 * ألوان الـ status badge. مشتركة بين الـ candidate و الـ recruiter
 * باش نفس الـ status يبان بنفس اللون فـ الجوج ديال الصفحات.
 *
 * Every status renders as a soft tinted badge: an `outline` base (transparent
 * fill, thin border) paired with a tone class below, so the whole app shares
 * one calm badge language instead of loud solid fills.
 */
export const applicationStatusVariants: Record<
    ApplicationStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    pending: 'outline',
    reviewed: 'outline',
    interview: 'outline',
    accepted: 'outline',
    rejected: 'outline',
};

export const applicationStatusClasses: Record<ApplicationStatus, string> = {
    pending: 'border-transparent bg-muted text-muted-foreground',
    reviewed:
        'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    interview: 'border-primary/20 bg-primary/10 text-primary',
    accepted:
        'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    rejected:
        'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
};
