import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';

type Testimonial = {
    quote: string;
    name: string;
    role: string;
    initials: string;
};

// Fictional, illustrative quotes — no real people or companies.
const lead: Testimonial = {
    quote: 'The match scores put the strongest candidates right at the top. What used to take an afternoon of reading now takes minutes.',
    name: 'Maya Bennett',
    role: 'HR Manager',
    initials: 'MB',
};

const asides: Testimonial[] = [
    {
        quote: 'I finally understood why my CV kept getting passed over. The feedback was specific, and my next application landed an interview.',
        name: 'Daniel Osei',
        role: 'Software Engineer, candidate',
        initials: 'DO',
    },
    {
        quote: 'One workspace for the whole team. Recruiters, hiring managers, and admins all see exactly the view they need.',
        name: 'Elena Ríos',
        role: 'Talent Lead',
        initials: 'ER',
    },
];

export function TestimonialsSection() {
    const { ref, show, transition } = useReveal<HTMLElement>();

    return (
        <section ref={ref} className="border-t border-border/60 py-20 lg:py-28">
            <div className="mx-auto w-full max-w-6xl px-6">
                <motion.p
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(0)}
                    className="text-xs font-medium tracking-widest text-muted-foreground uppercase"
                >
                    Both sides of the hire
                </motion.p>

                <div className="mt-10 grid gap-14 lg:grid-cols-5 lg:gap-20">
                    {/* One quote carries the section. */}
                    <motion.figure
                        initial={hiddenState}
                        animate={show ? shownState : hiddenState}
                        transition={transition(1)}
                        className="lg:col-span-3"
                    >
                        <Quote className="size-8 text-violet-500/50" />
                        <blockquote className="mt-6 text-2xl leading-snug font-medium tracking-tight text-balance sm:text-3xl">
                            “{lead.quote}”
                        </blockquote>
                        <figcaption className="mt-8 flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
                                {lead.initials}
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    {lead.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {lead.role}
                                </p>
                            </div>
                        </figcaption>
                    </motion.figure>

                    {/* The other two recede into the margin. */}
                    <div className="flex flex-col justify-center gap-8 lg:col-span-2">
                        {asides.map((aside, index) => (
                            <motion.figure
                                key={aside.name}
                                initial={hiddenState}
                                animate={show ? shownState : hiddenState}
                                transition={transition(2 + index)}
                                className="border-l border-border pl-5"
                            >
                                <blockquote className="text-sm text-pretty text-muted-foreground">
                                    “{aside.quote}”
                                </blockquote>
                                <figcaption className="mt-3 text-xs font-medium">
                                    {aside.name}
                                    <span className="text-muted-foreground">
                                        {' '}
                                        · {aside.role}
                                    </span>
                                </figcaption>
                            </motion.figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
