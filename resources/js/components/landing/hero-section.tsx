import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

import { AnalysisCard } from '@/components/landing/analysis-card';
import { fadeUp, staggerContainer } from '@/components/landing/animations';
import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            {/* Soft brand glow behind the hero, purely decorative. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center"
            >
                <div className="h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20 blur-3xl" />
            </div>

            <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-start"
                >
                    <motion.div
                        variants={fadeUp}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                        <Sparkles className="size-3.5 text-violet-500" />
                        Powered by AI resume analysis
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
                    >
                        Hire smarter with{' '}
                        <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                            AI
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="mt-6 max-w-md text-lg text-pretty text-muted-foreground"
                    >
                        Our platform analyzes resumes and matches candidates to
                        jobs using AI — giving every application a clear score,
                        actionable feedback, and a smarter path to hire.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        className="mt-8 flex flex-col gap-3 sm:flex-row"
                    >
                        <Button asChild size="lg">
                            <Link href={register()}>
                                Get started
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href={login()}>Sign in</Link>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Floating hero visual. */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.2,
                    }}
                    className="flex justify-center lg:justify-end"
                >
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{
                            duration: 6,
                            ease: 'easeInOut',
                            repeat: Infinity,
                        }}
                    >
                        <AnalysisCard />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
