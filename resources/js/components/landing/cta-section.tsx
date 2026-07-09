import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { fadeUp, viewportOnce } from '@/components/landing/animations';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';

export function CtaSection() {
    return (
        <section className="py-24">
            <div className="mx-auto w-full max-w-6xl px-6">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-16"
                >
                    {/* Decorative gradient wash. */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10"
                    />

                    <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Ready to hire smarter?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-muted-foreground">
                        Create your account and let AI score, match, and rank
                        candidates for you — from day one.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Button asChild size="lg">
                            <Link href={register()}>
                                Get started for free
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
