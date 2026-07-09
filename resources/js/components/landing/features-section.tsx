import { motion } from 'framer-motion';
import { BrainCircuit, Building2, CalendarCheck, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';

type Feature = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const features: Feature[] = [
    {
        icon: BrainCircuit,
        title: 'AI Resume Analysis',
        description:
            'Every resume is scored and summarized by AI, with clear feedback on strengths and gaps against the role.',
    },
    {
        icon: Target,
        title: 'Smart Match Score',
        description:
            'Rank candidates automatically by comparing each CV against the job description for a precise fit percentage.',
    },
    {
        icon: Building2,
        title: 'Role-based workspaces',
        description:
            'Tailored dashboards for candidates, recruiters, companies, and admins — everyone sees exactly what they need.',
    },
    {
        icon: CalendarCheck,
        title: 'Application & interview tracking',
        description:
            'Follow every application from submission to interview and hire, with status updates at each step.',
    },
];

export function FeaturesSection() {
    const { ref, show, transition } = useReveal<HTMLElement>();

    return (
        <section ref={ref} id="features" className="scroll-mt-20 py-20">
            <div className="mx-auto w-full max-w-6xl px-6">
                <motion.div
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(0)}
                    className="mx-auto max-w-2xl text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Everything you need to hire well
                    </h2>
                    <p className="mt-4 text-lg text-pretty text-muted-foreground">
                        From the first resume to the final interview, AI works
                        alongside your team at every stage.
                    </p>
                </motion.div>

                <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={hiddenState}
                            animate={show ? shownState : hiddenState}
                            transition={transition(index + 1)}
                            className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/20"
                        >
                            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 text-violet-500 ring-1 ring-violet-500/20 ring-inset">
                                <feature.icon className="size-5" />
                            </div>
                            <h3 className="mt-5 text-base font-semibold">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm text-pretty text-muted-foreground">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
