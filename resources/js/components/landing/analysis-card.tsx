import { CheckCircle2, FileText, TrendingUp } from 'lucide-react';

import { ScoreRing } from '@/components/landing/score-ring';

const SCORE = 87;
const skills = ['React', 'TypeScript', 'Laravel', 'AI/ML', 'SQL'];

/**
 * A compact "AI analysis" card used as the hero's floating art. Built entirely
 * from divs + inline SVG (no external images) so it renders crisp at any size
 * and adapts to light / dark via theme tokens.
 */
export function AnalysisCard() {
    return (
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/5 dark:shadow-black/40">
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="size-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                        candidate_resume.pdf
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Analyzed by AI · just now
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-5">
                <ScoreRing value={SCORE} className="size-32">
                    <span className="text-3xl font-bold tracking-tight">
                        {SCORE}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                </ScoreRing>

                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="size-4" />
                        Strong match
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                        <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                            5 years experience
                        </li>
                        <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                            Skills aligned
                        </li>
                        <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                            Role-ready
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 border-t border-border pt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Detected skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium transition-transform hover:scale-105"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
