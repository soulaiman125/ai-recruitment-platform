import { motion, useReducedMotion } from 'framer-motion';
import { useCountUp } from '@/hooks/use-count-up';
import { scoreStrokeClasses, scoreTextClasses, scoreTone } from '@/lib/analysis-status';
import { cn } from '@/lib/utils';

/**
 * A compact, self-contained version of the resume score ring used in the
 * analysis dialog: a muted track, a tone-coloured progress arc that fills on
 * mount, and a counting value in the middle. Sized via `className` (defaults to
 * a dashboard-friendly size-24). Honors prefers-reduced-motion by settling the
 * arc and value in place with no animation.
 */
export default function ScoreRing({
    score,
    className,
}: {
    score: number;
    className?: string;
}) {
    const reduceMotion = useReducedMotion();
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const tone = scoreTone(score);
    const counted = useCountUp(score);

    // A full circle is offset 0, an empty one is offset `circumference`.
    const offset =
        circumference * (1 - Math.min(100, Math.max(0, score)) / 100);

    return (
        <div
            className={cn(
                'relative flex size-24 shrink-0 items-center justify-center',
                className,
            )}
        >
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    strokeWidth="10"
                    className="stroke-muted"
                />

                <motion.circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{
                        strokeDashoffset: reduceMotion ? offset : circumference,
                    }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className={scoreStrokeClasses[tone]}
                />
            </svg>

            <div className="absolute flex flex-col items-center">
                <span
                    className={cn(
                        'text-2xl font-semibold tabular-nums',
                        scoreTextClasses[tone],
                    )}
                >
                    {counted}
                </span>
                <span className="text-[10px] text-muted-foreground">
                    / 100
                </span>
            </div>
        </div>
    );
}
