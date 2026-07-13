import { FileText, TrendingUp } from 'lucide-react';

import {
    LiveAnalysisStatus,
    LiveScore,
    LiveSkills,
    useLiveAnalysis,
} from '@/components/landing/analysis-live-demo';
import { interactiveSurface } from '@/components/landing/animations';
import { cn } from '@/lib/utils';

/**
 * A compact live analysis preview for the hero. It shares the same product
 * state machine as the larger recruiter-facing previews below the fold.
 */
export function AnalysisCard() {
    const analysis = useLiveAnalysis();

    return (
        <div
            className={cn(
                'w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/5 dark:shadow-black/40',
                interactiveSurface,
            )}
        >
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="size-5 text-muted-foreground" />
                </div>
                <LiveAnalysisStatus analysis={analysis} compact />
            </div>

            <div className="mt-6 flex items-center gap-5">
                <LiveScore analysis={analysis} className="size-32" />

                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="size-4" />
                        {analysis.isComplete
                            ? 'Strong match'
                            : 'Analysis in progress'}
                    </div>
                    <p className="max-w-32 text-xs leading-relaxed text-muted-foreground">
                        {analysis.isScoreReady
                            ? 'Match score calibrated against this role.'
                            : 'Experience and skills are being evaluated.'}
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t border-border pt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Detected skills
                </p>
                <LiveSkills analysis={analysis} />
            </div>
        </div>
    );
}
