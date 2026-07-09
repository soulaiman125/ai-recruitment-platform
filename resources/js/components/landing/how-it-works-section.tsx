import { motion } from 'framer-motion';
import { Briefcase, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';

type Track = {
    icon: LucideIcon;
    audience: string;
    steps: { title: string; description: string }[];
};

const tracks: Track[] = [
    {
        icon: UserRound,
        audience: 'For candidates',
        steps: [
            {
                title: 'Upload your CV',
                description:
                    'Add your resume in seconds — no lengthy forms to fill out.',
            },
            {
                title: 'AI analyzes & scores',
                description:
                    'Get an instant score with feedback on how you fit each role.',
            },
            {
                title: 'Apply & get matched',
                description:
                    'Apply to jobs and let your match score put you in front of recruiters.',
            },
        ],
    },
    {
        icon: Briefcase,
        audience: 'For recruiters',
        steps: [
            {
                title: 'Post a job',
                description:
                    'Publish a role with the requirements and skills you need.',
            },
            {
                title: 'AI ranks applicants',
                description:
                    'Candidates are scored and ordered by fit the moment they apply.',
            },
            {
                title: 'Interview & hire',
                description:
                    'Focus on the best matches, schedule interviews, and make the hire.',
            },
        ],
    },
];

export function HowItWorksSection() {
    const { ref, show, transition } = useReveal<HTMLElement>();

    return (
        <section
            ref={ref}
            id="how-it-works"
            className="scroll-mt-20 border-t border-border bg-muted/30 py-20"
        >
            <div className="mx-auto w-full max-w-6xl px-6">
                <motion.div
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(0)}
                    className="mx-auto max-w-2xl text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        How it works
                    </h2>
                    <p className="mt-4 text-lg text-pretty text-muted-foreground">
                        A simple flow on both sides of the hire — powered by the
                        same AI underneath.
                    </p>
                </motion.div>

                <div className="mt-14 grid gap-6 lg:grid-cols-2">
                    {tracks.map((track, trackIndex) => (
                        <motion.div
                            key={track.audience}
                            initial={hiddenState}
                            animate={show ? shownState : hiddenState}
                            transition={transition(1 + trackIndex)}
                            className="rounded-2xl border border-border bg-card p-8"
                        >
                            <div className="mb-8 flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white">
                                    <track.icon className="size-5" />
                                </div>
                                <span className="text-lg font-semibold">
                                    {track.audience}
                                </span>
                            </div>

                            <ol className="space-y-6">
                                {track.steps.map((step, index) => (
                                    <motion.li
                                        key={step.title}
                                        initial={hiddenState}
                                        animate={show ? shownState : hiddenState}
                                        transition={transition(
                                            2 + trackIndex + index,
                                        )}
                                        className="flex gap-4"
                                    >
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-muted-foreground">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold">
                                                {step.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-pretty text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ol>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
