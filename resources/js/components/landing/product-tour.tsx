import {
    AnimatePresence,
    motion,
    useAnimationFrame,
    useInView,
    useMotionValue,
} from 'framer-motion';
import { CalendarDays, FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';
import { GlowOrb } from '@/components/landing/background-decor';
import { CountUpNumber } from '@/components/landing/count-up-number';
import { ScoreRing } from '@/components/landing/score-ring';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/** How long each scene holds before the tour advances, in milliseconds. */
const SCENE_MS = 4000;

const SCORE = 87;

const skills = ['React', 'TypeScript', 'Laravel', 'PostgreSQL', 'Docker'];

const applicants = [
    { initials: 'AD', name: 'A. Dubois', match: 91 },
    { initials: 'MN', name: 'M. Novak', match: 78 },
    { initials: 'KI', name: 'K. Ito', match: 64 },
];

const steps = [
    'AI analyzes the CV',
    'Candidates get ranked',
    'Recruiters decide faster',
];

type SceneProps = {
    reduceMotion: boolean;
};

/** Collapses every delay and duration to zero when motion is unwelcome. */
const timing = (reduceMotion: boolean, value: number) =>
    reduceMotion ? 0 : value;

/* -------------------------------------------------------------------------- */

/** Scene 1 — the resume lands, the score sweeps, the skills surface. */
function AnalyzeScene({ reduceMotion }: SceneProps) {
    return (
        <div className="flex h-full flex-col gap-5">
            <div className="flex items-center gap-3 rounded-lg border bg-background/60 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-4" />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                        candidate_resume.pdf
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Parsed and sent to the model
                    </p>
                </div>
            </div>

            <div className="flex flex-1 flex-col items-center gap-5 sm:flex-row sm:gap-6">
                <ScoreRing
                    value={SCORE}
                    reduceMotion={reduceMotion}
                    delay={timing(reduceMotion, 0.2)}
                    strokeWidth={9}
                    className="size-24 sm:size-28"
                >
                    <span className="text-2xl font-bold tracking-tight">
                        <CountUpNumber
                            value={SCORE}
                            duration={timing(reduceMotion, 1.2)}
                        />
                    </span>
                    <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                        Match
                    </span>
                </ScoreRing>

                <div className="min-w-0 flex-1">
                    <p className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
                        Skills detected
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, index) => (
                            <motion.span
                                key={skill}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: timing(reduceMotion, 0.35),
                                    delay: timing(
                                        reduceMotion,
                                        0.45 + index * 0.1,
                                    ),
                                }}
                            >
                                <Badge variant="secondary">{skill}</Badge>
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Scene 2 — the applicants sort themselves by how well they fit. */
function RankScene({ reduceMotion }: SceneProps) {
    return (
        <div className="flex h-full flex-col gap-3">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Applicants · ranked by match
            </p>

            <div className="flex flex-1 flex-col justify-center gap-2.5">
                {applicants.map((applicant, index) => (
                    <motion.div
                        key={applicant.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: timing(reduceMotion, 0.35),
                            delay: timing(reduceMotion, index * 0.12),
                        }}
                        className={cn(
                            'flex items-center gap-3 rounded-lg border bg-background/60 p-3',
                            // The leader earns the same violet accent the real
                            // applicant table gives its best match.
                            index === 0 && 'border-l-2 border-l-primary',
                        )}
                    >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {applicant.initials}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-medium">
                                    {applicant.name}
                                </p>
                                <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
                                    {applicant.match}%
                                </p>
                            </div>

                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: applicant.match / 100 }}
                                    transition={{
                                        duration: timing(reduceMotion, 0.7),
                                        delay: timing(
                                            reduceMotion,
                                            0.25 + index * 0.15,
                                        ),
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="h-full origin-left rounded-full bg-gradient-to-r from-primary to-primary/50"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/** Scene 3 — one decision: pending becomes an interview on the calendar. */
function DecideScene({ reduceMotion }: SceneProps) {
    const [scheduled, setScheduled] = useState(reduceMotion);

    useEffect(() => {
        if (reduceMotion) {
            return;
        }

        const timeout = setTimeout(() => setScheduled(true), 900);

        return () => clearTimeout(timeout);
    }, [reduceMotion]);

    return (
        <div className="flex h-full flex-col gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-l-2 border-l-primary bg-background/60 p-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    AD
                </div>

                <p className="flex-1 truncate text-sm font-medium">A. Dubois</p>

                {/* The pill keeps its box while the label swaps, so the row
                    never reflows mid-transition. */}
                <div className="relative h-6 w-24 shrink-0">
                    <AnimatePresence initial={false}>
                        <motion.span
                            key={scheduled ? 'interview' : 'pending'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: timing(reduceMotion, 0.35),
                            }}
                            className={cn(
                                'absolute inset-0 flex items-center justify-center rounded-full border text-xs font-medium',
                                scheduled
                                    ? 'border-primary/30 bg-primary/10 text-primary'
                                    : 'bg-muted text-muted-foreground',
                            )}
                        >
                            {scheduled ? 'interview' : 'pending'}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex flex-1 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: timing(reduceMotion, 0.45),
                        delay: timing(reduceMotion, 1.3),
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex w-full items-center gap-3 rounded-lg border bg-card p-4"
                >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CalendarDays className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                            Interview scheduled
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            Thursday, 14:30 · video call
                        </p>
                    </div>

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                        className="size-5 shrink-0 text-primary"
                    >
                        <motion.path
                            d="M4 12.5 9.5 18 20 6.5"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                                duration: timing(reduceMotion, 0.5),
                                delay: timing(reduceMotion, 1.8),
                                ease: 'easeOut',
                            }}
                        />
                    </svg>
                </motion.div>
            </div>
        </div>
    );
}

const scenes = [AnalyzeScene, RankScene, DecideScene];

/* -------------------------------------------------------------------------- */

export function ProductTour() {
    const { ref, show, transition, reduceMotion } = useReveal<HTMLElement>();

    const frameRef = useRef<HTMLDivElement>(null);
    // `once: false` on purpose — the tour idles whenever it scrolls away.
    const inView = useInView(frameRef, { amount: 0.3 });

    const [active, setActive] = useState(0);
    const [hovered, setHovered] = useState(false);

    // Progress rides a motion value rather than React state: the bar repaints
    // on the compositor every frame without re-rendering the section.
    const progress = useMotionValue(0);
    const elapsed = useRef(0);

    const playing = inView && !hovered && !reduceMotion;

    const select = (index: number) => {
        elapsed.current = 0;
        progress.set(0);
        setActive(index);
    };

    useAnimationFrame((_, delta) => {
        if (!playing) {
            return;
        }

        elapsed.current += delta;

        const fraction = Math.min(1, elapsed.current / SCENE_MS);

        progress.set(fraction);

        if (fraction === 1) {
            elapsed.current = 0;
            progress.set(0);
            setActive((current) => (current + 1) % scenes.length);
        }
    });

    const Scene = scenes[active];

    return (
        <section ref={ref} className="relative py-20 lg:py-28">
            <div className="mx-auto w-full max-w-5xl px-6">
                <motion.div
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(0)}
                    className="max-w-2xl"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        See it in action
                    </h2>
                    <p className="mt-4 text-lg text-pretty text-muted-foreground">
                        Three moments from a real hiring flow.
                    </p>
                </motion.div>

                <motion.div
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(1)}
                    className="relative mt-12"
                >
                    <GlowOrb className="inset-x-12 top-10 h-56 opacity-10" />

                    <div
                        ref={frameRef}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="relative overflow-hidden rounded-xl border bg-card shadow-lg"
                    >
                        {/* Browser chrome, purely decorative. */}
                        <div
                            aria-hidden
                            className="flex h-9 items-center gap-1.5 border-b bg-muted/40 px-4"
                        >
                            <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                            <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                            <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                        </div>

                        {/* Fixed height: scenes are absolute inside it, so a
                            scene change can never shift the page. */}
                        <div className="relative h-[360px] sm:h-[320px]">
                            <AnimatePresence initial={false}>
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{
                                        duration: timing(reduceMotion, 0.45),
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="absolute inset-0 p-5 sm:p-6"
                                >
                                    <Scene reduceMotion={reduceMotion} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(2)}
                    className="mt-6 grid gap-2 sm:grid-cols-3"
                >
                    {steps.map((step, index) => {
                        const isActive = index === active;

                        return (
                            <button
                                key={step}
                                type="button"
                                onClick={() => select(index)}
                                aria-current={isActive}
                                className={cn(
                                    'relative overflow-hidden rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                                    isActive
                                        ? 'border-primary/30 bg-primary/5 font-medium text-primary'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <span className="text-xs tabular-nums opacity-60">
                                    0{index + 1}
                                </span>{' '}
                                {step}
                                {isActive && (
                                    <motion.span
                                        aria-hidden
                                        style={{ scaleX: progress }}
                                        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary"
                                    />
                                )}
                            </button>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
