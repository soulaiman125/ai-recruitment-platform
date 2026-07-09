import type { AnalysisStatus } from '@/types/resume';

/** ألوان الـ badge ديال حالة التحليل، بحال اللي عندنا فـ application-status. */
export const analysisStatusVariants: Record<
    AnalysisStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    pending: 'secondary',
    processing: 'outline',
    completed: 'default',
    failed: 'destructive',
};

/** Completed is the one happy terminal state, so lift it out of the defaults. */
export const analysisStatusClasses: Partial<Record<AnalysisStatus, string>> = {
    completed: 'bg-emerald-600 text-white hover:bg-emerald-600/90',
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

/** Badge variant + class per band, so a match score reads at a glance. */
export const scoreBadgeVariants: Record<
    ScoreTone,
    'default' | 'secondary' | 'destructive'
> = {
    strong: 'default',
    fair: 'secondary',
    weak: 'destructive',
};

export const scoreBadgeClasses: Record<ScoreTone, string> = {
    strong: 'bg-emerald-600 text-white hover:bg-emerald-600/90',
    fair: 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15 dark:text-amber-500',
    weak: '',
};
