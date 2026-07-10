import { motion } from 'framer-motion';

import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';
import { CountUpNumber } from '@/components/landing/count-up-number';

/**
 * The supporting facts, deliberately small. They live as a line of text under
 * the statement rather than as four competing cards.
 */
const facts = [
    { value: 'Under 30s', label: 'to analyze a resume' },
    { value: '4 roles', label: 'candidate, recruiter, company, admin' },
    { value: 'Every applicant', label: 'ranked against the job description' },
    { value: 'End to end', label: 'application through interview' },
];

export function ScoreStatement() {
    const { ref, show, transition } = useReveal<HTMLElement>();

    return (
        <section
            ref={ref}
            className="border-y border-border/60 bg-muted/20 py-20 lg:py-24"
        >
            <div className="mx-auto w-full max-w-6xl px-6">
                <div className="grid items-center gap-10 lg:grid-cols-5 lg:gap-16">
                    <motion.p
                        initial={hiddenState}
                        animate={show ? shownState : hiddenState}
                        transition={transition(0)}
                        className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-7xl leading-none font-bold tracking-tighter text-transparent tabular-nums sm:text-8xl lg:col-span-2"
                    >
                        0–{show ? <CountUpNumber value={100} /> : 0}
                    </motion.p>

                    <motion.div
                        initial={hiddenState}
                        animate={show ? shownState : hiddenState}
                        transition={transition(1)}
                        className="lg:col-span-3"
                    >
                        <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                            Every CV gets a clarity score.
                        </h2>
                        <p className="mt-4 text-lg text-pretty text-muted-foreground">
                            Not a pass or a fail — a number you can reason
                            about. The AI reads the resume against the job
                            description and returns a single score, the
                            strengths behind it, and the gaps holding it back.
                            Recruiters see who to read first. Candidates see
                            why.
                        </p>
                    </motion.div>
                </div>

                <motion.dl
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(2)}
                    className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-border/60 pt-8 text-sm"
                >
                    {facts.map((fact) => (
                        <div
                            key={fact.value}
                            className="flex items-baseline gap-2"
                        >
                            <dt className="font-semibold">{fact.value}</dt>
                            <dd className="text-muted-foreground">
                                {fact.label}
                            </dd>
                        </div>
                    ))}
                </motion.dl>
            </div>
        </section>
    );
}
