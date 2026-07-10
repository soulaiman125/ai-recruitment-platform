import { motion } from 'framer-motion';
import { FileUp, Gauge, ListChecks, ScanText, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useId } from 'react';

import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';
import { cn } from '@/lib/utils';

type Beat = {
    icon: LucideIcon;
    title: string;
    detail: string;
};

const beats: Beat[] = [
    {
        icon: FileUp,
        title: 'Upload PDF',
        detail: 'A candidate drops in a resume — no forms to fill out.',
    },
    {
        icon: ScanText,
        title: 'Extract text',
        detail: 'The document is parsed down to the plain text underneath.',
    },
    {
        icon: Sparkles,
        title: 'Gemini analyzes',
        detail: 'The text goes to the model with the job description in context.',
    },
    {
        icon: ListChecks,
        title: 'Skills & experience detected',
        detail: 'Technologies, seniority, and history are pulled out and structured.',
    },
    {
        icon: Gauge,
        title: 'Score + recommendations',
        detail: 'A 0–100 score lands, with strengths, gaps, and what to ask next.',
    },
];

/** Beats sit at the center of equal slices: 10%, 30%, 50%, 70%, 90%. */
const positionOf = (index: number) => ((index + 0.5) / beats.length) * 100;

/** How long after the line starts drawing each dot pops in. */
const dotDelay = (index: number) => 0.35 + index * 0.28;

export function AnalysisPipeline() {
    const { ref, show, transition, reduceMotion } = useReveal<HTMLElement>();
    const gradientId = `pipeline-${useId().replace(/:/g, '')}`;

    return (
        <section
            ref={ref}
            id="how-it-works"
            className="scroll-mt-20 overflow-hidden py-20 lg:py-28"
        >
            <div className="mx-auto w-full max-w-6xl px-6">
                <motion.div
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(0)}
                    className="mx-auto max-w-2xl text-center"
                >
                    <p className="text-xs font-medium tracking-widest text-violet-500 uppercase">
                        Under the hood
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        How the AI reads a CV
                    </h2>
                    <p className="mt-4 text-lg text-pretty text-muted-foreground">
                        Five steps between a PDF landing in the browser and a
                        recruiter seeing a ranked, explained candidate.
                    </p>
                </motion.div>
            </div>

            {/* The timeline needs room to breathe; on narrow screens it scrolls
                sideways rather than collapsing back into a stack of cards. */}
            <div className="mt-20 [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <div className="relative mx-auto h-[26rem] max-w-6xl min-w-[56rem] px-6">
                    <svg
                        aria-hidden
                        className="absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2 overflow-visible"
                        style={{ width: 'calc(100% - 3rem)' }}
                        viewBox="0 0 1000 2"
                        preserveAspectRatio="none"
                        fill="none"
                    >
                        <line
                            x1="0"
                            y1="1"
                            x2="1000"
                            y2="1"
                            strokeWidth={2}
                            vectorEffect="non-scaling-stroke"
                            className="stroke-border"
                        />
                        <motion.path
                            d="M0 1 H1000"
                            stroke={`url(#${gradientId})`}
                            strokeWidth={2}
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: show ? 1 : 0 }}
                            transition={
                                reduceMotion
                                    ? { duration: 0 }
                                    : {
                                          duration: 1.8,
                                          ease: [0.22, 1, 0.36, 1],
                                          delay: 0.2,
                                      }
                            }
                        />
                        <defs>
                            <linearGradient
                                id={gradientId}
                                x1="0"
                                y1="0"
                                x2="1000"
                                y2="0"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#d946ef" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {beats.map((beat, index) => {
                        const above = index % 2 === 0;
                        const left = `calc(1.5rem + (100% - 3rem) * ${positionOf(index) / 100})`;

                        return (
                            <div key={beat.title}>
                                {/* The dot, riding the line. */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={
                                        show
                                            ? { opacity: 1, scale: 1 }
                                            : { opacity: 0, scale: 0 }
                                    }
                                    transition={
                                        reduceMotion
                                            ? { duration: 0 }
                                            : {
                                                  duration: 0.45,
                                                  ease: [0.16, 1, 0.3, 1],
                                                  delay: dotDelay(index),
                                              }
                                    }
                                    style={{ left }}
                                    className="absolute top-1/2 z-10 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background"
                                >
                                    <span className="size-2.5 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500" />
                                </motion.div>

                                {/* The label, alternating above and below. */}
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: above ? -8 : 8,
                                    }}
                                    animate={
                                        show
                                            ? { opacity: 1, y: 0 }
                                            : { opacity: 0, y: above ? -8 : 8 }
                                    }
                                    transition={
                                        reduceMotion
                                            ? { duration: 0 }
                                            : {
                                                  duration: 0.5,
                                                  ease: [0.16, 1, 0.3, 1],
                                                  delay: dotDelay(index) + 0.1,
                                              }
                                    }
                                    style={{ left }}
                                    className={cn(
                                        'absolute flex w-44 -translate-x-1/2 items-center text-center',
                                        // The hairline is authored first so it
                                        // always sits against the line: reversed
                                        // when the label hangs above it.
                                        above
                                            ? 'bottom-1/2 mb-2.5 flex-col-reverse'
                                            : 'top-1/2 mt-2.5 flex-col',
                                    )}
                                >
                                    {/* Hairline tying the label back to its dot. */}
                                    <span
                                        aria-hidden
                                        className="h-8 w-px shrink-0 bg-border"
                                    />
                                    <div
                                        className={cn(
                                            'flex flex-col items-center',
                                            above ? 'mb-3' : 'mt-3',
                                        )}
                                    >
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 text-violet-500 ring-1 ring-violet-500/20 ring-inset">
                                            <beat.icon className="size-4" />
                                        </div>
                                        <p className="mt-2.5 text-xs font-medium text-muted-foreground/70 tabular-nums">
                                            {String(index + 1).padStart(2, '0')}
                                        </p>
                                        <h3 className="mt-1 text-sm font-semibold text-balance">
                                            {beat.title}
                                        </h3>
                                        <p className="mt-1.5 text-xs text-pretty text-muted-foreground">
                                            {beat.detail}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
