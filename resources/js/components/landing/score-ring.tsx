import { motion } from 'framer-motion';
import { useId } from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Geometry of the ring, in the SVG's own 120×120 coordinate space. */
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type ScoreRingProps = {
    /** The score, 0–100. Drives how far around the track the arc sweeps. */
    value: number;
    /** Flip to true to sweep the arc. Leave false to hold it at zero. */
    play?: boolean;
    delay?: number;
    reduceMotion?: boolean;
    strokeWidth?: number;
    /** Sizing lives with the caller — pass `size-32`, `size-40`, etc. */
    className?: string;
    /** Centered content, usually the number itself. */
    children?: ReactNode;
};

/**
 * The score arc, shared by every surface that shows an analysis. Each instance
 * mints its own gradient id, so several rings can coexist on one page.
 */
export function ScoreRing({
    value,
    play = true,
    delay = 0.3,
    reduceMotion = false,
    strokeWidth = 10,
    className,
    children,
}: ScoreRingProps) {
    // useId's colons are legal in a url(#…) fragment reference, but stripping
    // them keeps the id usable from a CSS selector too.
    const gradientId = `score-ring-${useId().replace(/:/g, '')}`;

    return (
        <div className={cn('relative shrink-0', className)}>
            <svg className="size-full -rotate-90" viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className="stroke-muted"
                />
                <motion.circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    stroke={`url(#${gradientId})`}
                    strokeDasharray={CIRCUMFERENCE}
                    initial={{ strokeDashoffset: CIRCUMFERENCE }}
                    animate={{
                        strokeDashoffset: play
                            ? CIRCUMFERENCE * (1 - value / 100)
                            : CIRCUMFERENCE,
                    }}
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay }
                    }
                />
                <defs>
                    <linearGradient
                        id={gradientId}
                        x1="0"
                        y1="0"
                        x2="120"
                        y2="120"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    );
}
