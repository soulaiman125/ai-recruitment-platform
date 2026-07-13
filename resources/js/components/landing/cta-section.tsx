import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';
import { DotGrid, GlowOrb } from '@/components/landing/background-decor';
import { LandingLinkButton } from '@/components/landing/landing-link-button';
import { cn } from '@/lib/utils';
import { register } from '@/routes';

export function CtaSection() {
    const { ref, show, transition } = useReveal<HTMLElement>();

    return (
        <section ref={ref} className="relative overflow-hidden py-20">
            <DotGrid mask="radial-gradient(ellipse 55% 60% at 50% 50%, black, transparent 75%)" />
            <GlowOrb className="bottom-0 left-1/2 size-[36rem] -translate-x-1/2 translate-y-1/4" />

            <div className="mx-auto w-full max-w-6xl px-6">
                <motion.div
                    initial={hiddenState}
                    animate={show ? shownState : hiddenState}
                    transition={transition(0)}
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
                            Create your account and let AI score, match, and
                            rank candidates for you — from day one.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <LandingLinkButton
                                size="lg"
                                href={register()}
                                className={cn(
                                    'bg-white text-violet-700 hover:bg-white/90',
                                )}
                            >
                                Get started for free
                                <ArrowRight className="size-4" />
                            </LandingLinkButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
