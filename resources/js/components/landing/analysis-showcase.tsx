import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

import {
    LiveAnalysisStatus,
    LiveRecommendations,
    LiveScore,
    LiveSkills,
    LiveSummary,
    useLiveAnalysis,
} from '@/components/landing/analysis-live-demo';
import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';
import { GlowOrb } from '@/components/landing/background-decor';

/**
 * Demo data, written the way the model actually reports: prose about a person,
 * not metrics about a business.
 */
const analysis = {
    file: 'amelia_dubois_resume.pdf',
    role: 'Senior Frontend Engineer',
    summary:
        'Six years building production React applications, with strong TypeScript fundamentals and recent Laravel + Inertia experience. Owned a design system adopted by four product teams, and the leadership bullets show consistent mentoring. The trajectory reads senior, and the stack lines up closely with the role.',
    skills: [
        'React',
        'TypeScript',
        'Laravel',
        'Inertia',
        'Tailwind CSS',
        'PostgreSQL',
        'Testing Library',
        'CI/CD',
    ],
    strengths: [
        'Six years of React in production, not side projects',
        'Owned a design system used across four teams',
        'Comfortable end to end on the Laravel + Inertia stack',
    ],
    gaps: [
        'No mention of accessibility testing anywhere',
        'Cloud infrastructure is implied but never stated',
    ],
    recommendations: [
        'Move to a technical screen — the stack overlap is unusually close.',
        'Ask who else contributed to the design system, and what they owned.',
        'Probe depth on PostgreSQL query tuning; the resume only names it.',
    ],
};

export function AnalysisShowcase() {
    const { ref, show, transition, reduceMotion } = useReveal<HTMLElement>();
    const liveAnalysis = useLiveAnalysis({ active: show });

    return (
        <section ref={ref} className="relative py-20 lg:py-28">
            <div className="mx-auto w-full max-w-6xl px-6">
                <motion.div
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(0)}
                    className="max-w-2xl"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        What a recruiter actually sees
                    </h2>
                    <p className="mt-4 text-lg text-pretty text-muted-foreground">
                        One resume, read end to end: the score, the reasoning
                        behind it, and the questions worth asking next.
                    </p>
                </motion.div>

                <div className="relative mt-16 [perspective:1600px]">
                    <GlowOrb className="inset-x-16 -bottom-8 h-56 opacity-20" />

                    <motion.div
                        initial={hiddenState}
                        animate={show ? shownState : hiddenState}
                        transition={transition(1)}
                    >
                        {/* The tilt lives on its own element so framer's transform
                            on the parent never fights with it. */}
                        <div
                            className="origin-top rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-violet-500/10 sm:p-8 dark:shadow-black/40"
                            style={
                                reduceMotion
                                    ? undefined
                                    : {
                                          transform:
                                              'perspective(1600px) rotateX(3deg)',
                                      }
                            }
                        >
                            {/* Window chrome. */}
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                        <FileText className="size-5 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">
                                            {analysis.file}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Reviewed against{' '}
                                            <span className="text-foreground/70">
                                                {analysis.role}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <LiveAnalysisStatus
                                    analysis={liveAnalysis}
                                    compact
                                    className="w-44"
                                />
                            </div>

                            <div className="grid gap-10 pt-8 lg:grid-cols-[15rem_1fr] lg:gap-14">
                                {/* Left rail: the verdict. */}
                                <div className="flex flex-col items-center gap-6 lg:items-start">
                                    <LiveScore
                                        analysis={liveAnalysis}
                                        className="size-40"
                                    />

                                    <div className="w-full">
                                        <p className="mb-2.5 text-xs font-medium text-muted-foreground">
                                            Detected skills
                                        </p>
                                        <LiveSkills
                                            analysis={liveAnalysis}
                                            skills={analysis.skills}
                                            className="justify-center lg:justify-start"
                                        />
                                    </div>
                                </div>

                                {/* Right: the reasoning. */}
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Summary
                                        </p>
                                        <LiveSummary
                                            analysis={liveAnalysis}
                                            className="mt-3 text-sm leading-relaxed text-pretty text-foreground/90"
                                        />
                                    </div>

                                    <div className="grid gap-8 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                Strengths
                                            </p>
                                            <ul className="mt-3 space-y-2.5">
                                                {analysis.strengths.map(
                                                    (strength) => (
                                                        <li
                                                            key={strength}
                                                            className="flex gap-2.5 text-sm text-pretty text-muted-foreground"
                                                        >
                                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                                            {strength}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                Gaps
                                            </p>
                                            <ul className="mt-3 space-y-2.5">
                                                {analysis.gaps.map((gap) => (
                                                    <li
                                                        key={gap}
                                                        className="flex gap-2.5 text-sm text-pretty text-muted-foreground"
                                                    >
                                                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                                                        {gap}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-border bg-muted/30 p-5">
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Recommendations
                                        </p>
                                        <LiveRecommendations
                                            analysis={liveAnalysis}
                                            className="mt-3 space-y-2.5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
