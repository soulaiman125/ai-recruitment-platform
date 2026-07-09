import type { AnalysisStatus } from '@/types/resume';

/** ألوان الـ badge ديال حالة التحليل، بحال اللي عندنا فـ application-status. */
export const analysisStatusVariants: Record<
    AnalysisStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    pending: 'outline',
    processing: 'outline',
    completed: 'outline',
    failed: 'outline',
};

export const analysisStatusClasses: Record<AnalysisStatus, string> = {
    pending: 'border-transparent bg-muted text-muted-foreground',
    processing: 'border-primary/20 bg-primary/10 text-primary',
    completed:
        'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    failed: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
};

export type ScoreTone = 'strong' | 'fair' | 'weak';

/** Display bands shared by the resume score ring and the match-score badge. */
export function scoreTone(score: number): ScoreTone {
    if (score >= 70) {
        return 'strong';
    }

    return score >= 40 ? 'fair' : 'weak';
}

export const scoreTextClasses: Record<ScoreTone, string> = {
    strong: 'text-emerald-600 dark:text-emerald-500',
    fair: 'text-amber-600 dark:text-amber-500',
    weak: 'text-red-600 dark:text-red-500',
};

export const scoreStrokeClasses: Record<ScoreTone, string> = {
    strong: 'stroke-emerald-600 dark:stroke-emerald-500',
    fair: 'stroke-amber-600 dark:stroke-amber-500',
    weak: 'stroke-red-600 dark:stroke-red-500',
};

/** Badge variant + tone class per band, so a match score reads at a glance. */
export const scoreBadgeVariants: Record<
    ScoreTone,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    strong: 'outline',
    fair: 'outline',
    weak: 'outline',
};

export const scoreBadgeClasses: Record<ScoreTone, string> = {
    strong: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    fair: 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    weak: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
};
