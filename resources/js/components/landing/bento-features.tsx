import { motion } from 'framer-motion';
import {
    BrainCircuit,
    Building2,
    CalendarCheck,
    CheckCircle2,
    FileText,
    ShieldCheck,
    Target,
    UserRound,
} from 'lucide-react';
import type { ReactNode } from 'react';

import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';
import { CountUpNumber } from '@/components/landing/count-up-number';
import { ScoreRing } from '@/components/landing/score-ring';
import { cn } from '@/lib/utils';

const DEMO_SCORE = 87;
const demoSkills = ['React', 'TypeScript', 'Laravel', 'AI/ML', 'SQL', 'Docker'];

/** Illustrative ranking, the way a recruiter would see a shortlist ordered. */
const rankedCandidates = [
    { initials: 'AD', name: 'A. Dubois', score: 91 },
    { initials: 'MN', name: 'M. Novak', score: 78 },
    { initials: 'KI', name: 'K. Ito', score: 64 },
];

const roles = [
    { icon: UserRound, label: 'Candidate' },
    { icon: Target, label: 'Recruiter' },
    { icon: Building2, label: 'Company' },
    { icon: ShieldCheck, label: 'Admin' },
];

const pipeline = [
    { label: 'Applied', done: true },
    { label: 'Screened', done: true },
    { label: 'Interview', done: false },
];

/** Every tile shares the surface; only the grid span differs. */
function Tile({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
                className,
            )}
        >
            {children}
        </div>
    );
}

function TileHeading({
    icon: Icon,
    title,
}: {
    icon: typeof BrainCircuit;
    title: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 text-violet-500 ring-1 ring-violet-500/20 ring-inset">
                <Icon className="size-5" />
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
        </div>
    );
}

export function BentoFeatures() {
    const { ref, show, transition, reduceMotion } = useReveal<HTMLElement>();

    return (
        <section
            ref={ref}
            id="features"
            className="scroll-mt-20 py-20 lg:py-24"
        >
            <div className="mx-auto w-full max-w-6xl px-6">
                {/* Left-aligned header: the centered header belongs to the
                    timeline below, so these two sections don't rhyme. */}
                <motion.div
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(0)}
                    className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                >
                    <h2 className="max-w-xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Everything you need to hire well
                    </h2>
                    <p className="max-w-sm text-pretty text-muted-foreground">
                        From the first resume to the final interview, AI works
                        alongside your team at every stage.
                    </p>
                </motion.div>

                <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:grid-rows-3">
                    {/* 2×2 — the flagship tile, with a living demo inside. */}
                    <motion.div
                        initial={hiddenState}
                        animate={show ? shownState : hiddenState}
                        transition={transition(1)}
                        className="lg:col-span-2 lg:row-span-2"
                    >
                        <Tile className="h-full">
                            <TileHeading
                                icon={BrainCircuit}
                                title="AI Resume Analysis"
                            />
                            <p className="mt-4 max-w-md text-sm text-pretty text-muted-foreground">
                                Every resume is scored and summarized by AI,
                                with clear feedback on strengths and gaps
                                against the role.
                            </p>

                            <div className="mt-8 flex flex-1 flex-col justify-end">
                                <div className="flex flex-wrap items-center gap-6">
                                    <ScoreRing
                                        value={DEMO_SCORE}
                                        play={show}
                                        reduceMotion={reduceMotion}
                                        delay={0.35}
                                        strokeWidth={9}
                                        className="size-28"
                                    >
                                        <span className="text-2xl font-bold tracking-tight tabular-nums">
                                            {show ? (
                                                <CountUpNumber
                                                    value={DEMO_SCORE}
                                                    duration={1.4}
                                                />
                                            ) : (
                                                0
                                            )}
                                        </span>
                                        <span className="text-[0.65rem] text-muted-foreground">
                                            / 100
                                        </span>
                                    </ScoreRing>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <FileText className="size-3.5" />
                                            candidate_resume.pdf
                                        </div>
                                        <p className="mt-3 text-xs font-medium text-muted-foreground">
                                            Detected skills
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {demoSkills.map((skill, index) => (
                                                // The reveal and the hover live
                                                // on separate elements: framer
                                                // owns the outer transform, so a
                                                // `hover:scale` class there would
                                                // be overwritten inline.
                                                <motion.span
                                                    key={skill}
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.9,
                                                    }}
                                                    animate={
                                                        show
                                                            ? {
                                                                  opacity: 1,
                                                                  scale: 1,
                                                              }
                                                            : {
                                                                  opacity: 0,
                                                                  scale: 0.9,
                                                              }
                                                    }
                                                    transition={transition(
                                                        4 + index,
                                                    )}
                                                    className="inline-flex"
                                                >
                                                    <span className="cursor-default rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium transition-transform duration-200 hover:scale-105">
                                                        {skill}
                                                    </span>
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tile>
                    </motion.div>

                    {/* 1×2 — tall and narrow. */}
                    <motion.div
                        initial={hiddenState}
                        animate={show ? shownState : hiddenState}
                        transition={transition(2)}
                        className="lg:col-start-3 lg:row-span-2"
                    >
                        <Tile className="h-full">
                            <TileHeading
                                icon={Target}
                                title="Smart Match Score"
                            />
                            <p className="mt-4 text-sm text-pretty text-muted-foreground">
                                Rank candidates automatically by comparing each
                                CV against the job description.
                            </p>

                            <ul className="mt-8 flex flex-1 flex-col justify-end gap-5">
                                {rankedCandidates.map((candidate, index) => (
                                    <li key={candidate.initials}>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-2 font-medium">
                                                <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[0.6rem] font-semibold text-muted-foreground">
                                                    {candidate.initials}
                                                </span>
                                                {candidate.name}
                                            </span>
                                            <span className="text-muted-foreground tabular-nums">
                                                {candidate.score}
                                            </span>
                                        </div>
                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{
                                                    scaleX: show
                                                        ? candidate.score / 100
                                                        : 0,
                                                }}
                                                transition={
                                                    reduceMotion
                                                        ? { duration: 0 }
                                                        : {
                                                              duration: 1,
                                                              ease: [
                                                                  0.16, 1, 0.3,
                                                                  1,
                                                              ],
                                                              delay:
                                                                  0.4 +
                                                                  index * 0.12,
                                                          }
                                                }
                                                className="h-full origin-left rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Tile>
                    </motion.div>

                    {/* 2×1 — wide and short. */}
                    <motion.div
                        initial={hiddenState}
                        animate={show ? shownState : hiddenState}
                        transition={transition(3)}
                        className="lg:col-span-2 lg:row-start-3"
                    >
                        <Tile className="h-full">
                            <TileHeading
                                icon={Building2}
                                title="Role-based workspaces"
                            />
                            <p className="mt-4 text-sm text-pretty text-muted-foreground">
                                Tailored dashboards for everyone — each role
                                sees exactly what it needs, and nothing more.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {roles.map((role) => (
                                    <span
                                        key={role.label}
                                        className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium transition-transform duration-200 hover:scale-105"
                                    >
                                        <role.icon className="size-3.5 text-violet-500" />
                                        {role.label}
                                    </span>
                                ))}
                            </div>
                        </Tile>
                    </motion.div>

                    {/* 1×1 — the small square that closes the composition. */}
                    <motion.div
                        initial={hiddenState}
                        animate={show ? shownState : hiddenState}
                        transition={transition(4)}
                        className="lg:col-start-3 lg:row-start-3"
                    >
                        <Tile className="h-full">
                            <TileHeading
                                icon={CalendarCheck}
                                title="Interview tracking"
                            />
                            <ol className="mt-6 flex flex-1 flex-col justify-end gap-3">
                                {pipeline.map((stage) => (
                                    <li
                                        key={stage.label}
                                        className="flex items-center gap-2.5 text-xs"
                                    >
                                        {stage.done ? (
                                            <CheckCircle2 className="size-4 text-emerald-500" />
                                        ) : (
                                            <span className="flex size-4 items-center justify-center">
                                                <span className="size-2 rounded-full border border-border bg-background" />
                                            </span>
                                        )}
                                        <span
                                            className={cn(
                                                stage.done
                                                    ? 'font-medium'
                                                    : 'text-muted-foreground',
                                            )}
                                        >
                                            {stage.label}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </Tile>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
