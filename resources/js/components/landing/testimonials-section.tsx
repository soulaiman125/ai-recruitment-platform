import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

import {
    fadeUp,
    staggerContainer,
    viewportOnce,
} from '@/components/landing/animations';

type Testimonial = {
    quote: string;
    name: string;
    role: string;
    initials: string;
};

// Fictional, illustrative quotes — no real people or companies.
const testimonials: Testimonial[] = [
    {
        quote: 'The match scores put the strongest candidates right at the top. What used to take an afternoon of reading now takes minutes.',
        name: 'Maya Bennett',
        role: 'HR Manager',
        initials: 'MB',
    },
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
    return (
        <section className="py-20">
            <div className="mx-auto w-full max-w-6xl px-6">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mx-auto max-w-2xl text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Built for both sides of the hire
                    </h2>
                    <p className="mt-4 text-lg text-pretty text-muted-foreground">
                        Recruiters move faster, candidates get clarity — the same
                        AI working for everyone.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
                >
                    {testimonials.map((testimonial) => (
                        <motion.figure
                            key={testimonial.name}
                            variants={fadeUp}
                            className="flex flex-col rounded-2xl border border-border bg-card p-6"
                        >
                            <Quote className="size-6 text-violet-500/60" />
                            <blockquote className="mt-4 flex-1 text-sm text-pretty text-foreground/90">
                                “{testimonial.quote}”
                            </blockquote>
                            <figcaption className="mt-6 flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </figcaption>
                        </motion.figure>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
