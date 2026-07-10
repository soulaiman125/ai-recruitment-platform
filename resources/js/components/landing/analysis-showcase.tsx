import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    FileText,
    Sparkles,
} from 'lucide-react';

import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';
import { GlowOrb } from '@/components/landing/background-decor';
import { CountUpNumber } from '@/components/landing/count-up-number';
import { ScoreRing } from '@/components/landing/score-ring';

/**
 * Demo data, written the way the model actually reports: prose about a person,
 * not metrics about a business.
 */
const SCORE = 91;

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
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
                                    <Sparkles className="size-3.5" />
                                    Analysis complete
                                </span>
                            </div>

                            <div className="grid gap-10 pt-8 lg:grid-cols-[15rem_1fr] lg:gap-14">
                                {/* Left rail: the verdict. */}
                                <div className="flex flex-col items-center gap-6 lg:items-start">
                                    <ScoreRing
                                        value={SCORE}
                                        play={show}
                                        reduceMotion={reduceMotion}
                                        delay={0.4}
                                        className="size-40"
                                    >
                                        <span className="text-4xl font-bold tracking-tight tabular-nums">
                                            {show ? (
                                                <CountUpNumber
                                                    value={SCORE}
                                                    duration={1.4}
                                                />
                                            ) : (
                                                0
                                            )}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            / 100
                                        </span>
                                    </ScoreRing>

                                    <div className="w-full">
                                        <p className="mb-2.5 text-xs font-medium text-muted-foreground">
                                            Detected skills
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-1.5 lg:justify-start">
                                            {analysis.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="cursor-default rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium transition-transform duration-200 hover:scale-105"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: the reasoning. */}
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Summary
                                        </p>
                                        <p className="mt-3 text-sm leading-relaxed text-pretty text-foreground/90">
                                            {analysis.summary}
                                        </p>
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
                                        <ul className="mt-3 space-y-2.5">
                                            {analysis.recommendations.map(
                                                (recommendation) => (
                                                    <li
                                                        key={recommendation}
                                                        className="flex gap-2.5 text-sm text-pretty text-foreground/90"
                                                    >
                                                        <ArrowRight className="mt-0.5 size-4 shrink-0 text-violet-500" />
                                                        {recommendation}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
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
