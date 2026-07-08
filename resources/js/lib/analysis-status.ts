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

/** The same bands the prompt's scoring rubric describes to the model. */
export function scoreTone(score: number): ScoreTone {
    if (score >= 75) {
        return 'strong';
    }

    return score >= 50 ? 'fair' : 'weak';
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
