import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

import { AnalysisCard } from '@/components/landing/analysis-card';
import { fadeUp, staggerContainer } from '@/components/landing/animations';
import {
    DotGrid,
    GlowOrb,
    NoiseTexture,
} from '@/components/landing/background-decor';
import { LandingLinkButton } from '@/components/landing/landing-link-button';
import { cn } from '@/lib/utils';
import { login, register } from '@/routes';

export function HeroSection() {
    const reduceMotion = useReducedMotion() ?? false;

    return (
        <section className="relative overflow-hidden">
            <DotGrid />
            <NoiseTexture />
            <GlowOrb className="-top-40 left-1/2 size-[32rem] -translate-x-1/2" />
            <GlowOrb className="top-1/3 -right-24 hidden size-96 lg:block" />

            <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-24">
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
                        <LandingLinkButton size="lg" href={register()}>
                            Get started
                            <ArrowRight className="size-4" />
                        </LandingLinkButton>
                        <LandingLinkButton
                            size="lg"
                            variant="outline"
                            href={login()}
                        >
                            Sign in
                        </LandingLinkButton>
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
                        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                        transition={{
                            duration: 6,
                            ease: 'easeInOut',
                            repeat: Infinity,
                        }}
                        className={cn(!reduceMotion && 'will-change-transform')}
                    >
                        <AnalysisCard />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
