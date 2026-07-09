import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { fadeUp, viewportOnce } from '@/components/landing/animations';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';

export function CtaSection() {
    return (
        <section className="py-20">
            <div className="mx-auto w-full max-w-6xl px-6">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-20 text-center shadow-2xl shadow-violet-500/20 sm:px-16"
                >
                    {/* Slowly drifting glow to give the panel a sense of life. */}
                    <motion.div
                        aria-hidden
                        animate={{ opacity: [0.35, 0.6, 0.35] }}
                        transition={{
                            duration: 6,
                            ease: 'easeInOut',
                            repeat: Infinity,
                        }}
                        className="pointer-events-none absolute -top-24 left-1/2 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-white/25 blur-3xl"
                    />

                    <div className="relative">
                        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
                            Ready to hire smarter?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-white/80">
                            Create your account and let AI score, match, and rank
                            candidates for you — from day one.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-white text-violet-700 hover:bg-white/90"
                            >
                                <Link href={register()}>
                                    Get started for free
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
