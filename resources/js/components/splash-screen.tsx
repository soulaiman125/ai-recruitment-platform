import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const SPLASH_KEY = 'splash_shown';

/** Shared ease-out curve; matches the rest of the app's motion language. */
const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * Beat sheet (seconds). The overlay starts exiting at HOLD, so the whole
 * splash resolves in HOLD + EXIT = 1.75s.
 */
const RING = { delay: 0.1, duration: 0.75 };
const CHECK = { delay: 0.6, duration: 0.35 };
const SPARKLE = { delay: 0.9, duration: 0.3 };
const WORDMARK = { delay: 1.05, duration: 0.35 };
const HOLD = 1.45;
const EXIT = 0.3;

/**
 * `?splash=1` replays the intro on demand — for a live demo, where the session
 * flag would otherwise have been set by an earlier load in the same tab. It
 * overrides both the flag and the reduced-motion check, because asking for the
 * splash explicitly is a request to see it.
 */
function isForced(): boolean {
    try {
        return (
            new URLSearchParams(window.location.search).get('splash') === '1'
        );
    } catch {
        return false;
    }
}

/**
 * Decided once, synchronously, during the first render — so a returning visitor
 * renders `null` on frame one with no flash and no timer. Purely a read: the
 * sessionStorage write happens in an effect, since `strictMode` double-invokes
 * state initializers.
 */
function shouldShowSplash(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    if (isForced()) {
        return true;
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return false;
    }

    try {
        return window.sessionStorage.getItem(SPLASH_KEY) === null;
    } catch {
        // Private mode / storage disabled: never show rather than show forever.
        return false;
    }
}

/**
 * A one-per-session branded intro: the match ring draws itself, the check
 * follows, the sparkle pops, the wordmark rises, and the overlay dissolves to
 * reveal the app already rendered underneath.
 *
 * It never gates data loading — it is a `fixed` overlay above a live page — and
 * it removes itself from the DOM once the exit transition completes.
 */
export default function SplashScreen() {
    const [visible, setVisible] = useState(shouldShowSplash);
    const [present, setPresent] = useState(visible);

    useEffect(() => {
        if (!visible) {
            return;
        }

        try {
            window.sessionStorage.setItem(SPLASH_KEY, '1');
        } catch {
            // Nothing to persist to; the splash simply plays this once.
        }

        const timer = window.setTimeout(() => setVisible(false), HOLD * 1000);

        return () => window.clearTimeout(timer);
    }, [visible]);

    // Returning visitors, reduced-motion users: zero DOM, zero delay.
    if (!present) {
        return null;
    }

    return (
        <AnimatePresence onExitComplete={() => setPresent(false)}>
            {visible && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: EXIT, ease: 'easeOut' }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
                >
                    <div className="relative flex items-center justify-center">
                        {/* Soft violet glow, breathing once behind the mark. */}
                        <motion.div
                            aria-hidden
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{
                                opacity: [0, 0.55, 0.3],
                                scale: [0.85, 1.05, 1],
                            }}
                            transition={{ duration: 1.4, ease: 'easeOut' }}
                            className="pointer-events-none absolute size-40 rounded-full bg-violet-500/30 blur-3xl"
                        />

                        <svg
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="relative size-20 text-violet-500 dark:text-violet-400"
                        >
                            <defs>
                                <linearGradient
                                    id="splash-ring"
                                    x1="6"
                                    y1="6"
                                    x2="34"
                                    y2="34"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#6366f1" />
                                    <stop offset="0.5" stopColor="#8b5cf6" />
                                    <stop offset="1" stopColor="#d946ef" />
                                </linearGradient>
                            </defs>

                            {/* The match ring draws itself along its own length. */}
                            <motion.path
                                d="M22.3 7.2A13 13 0 1 0 32.8 17.7"
                                fill="none"
                                stroke="url(#splash-ring)"
                                strokeWidth="3.2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ ...RING, ease: easeOut }}
                            />

                            {/* The check follows, overlapping the ring's tail. */}
                            <motion.path
                                d="M14.6 20.2L18.4 24L25.6 15.8"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ ...CHECK, ease: easeOut }}
                            />

                            {/* The sparkle pops from its own centre, on the ring. */}
                            <motion.g
                                style={{ transformOrigin: '29.2px 10.8px' }}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ ...SPARKLE, ease: easeOut }}
                            >
                                <path
                                    d="M29.2 5.8C29.2 9.4 30.6 10.8 34.2 10.8C30.6 10.8 29.2 12.2 29.2 15.8C29.2 12.2 27.8 10.8 24.2 10.8C27.8 10.8 29.2 9.4 29.2 5.8Z"
                                    fill="currentColor"
                                />
                            </motion.g>
                        </svg>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...WORDMARK, ease: easeOut }}
                        className="mt-6 text-sm font-medium tracking-tight text-muted-foreground"
                    >
                        AI Recruitment Platform
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
