import { useInView, useReducedMotion } from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Shared motion for the landing page. Kept subtle and professional: short
 * travel distance, gentle easing, no bounce.
 */

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: easeOut },
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.6, ease: easeOut },
    },
};

/**
 * Parent container that reveals its children one after another. Only used by
 * the hero, which animates on mount — scroll-revealed sections drive each item
 * explicitly via `useReveal` instead of relying on variant orchestration.
 */
export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
};

/** The two states a revealed element moves between, applied directly. */
export const hiddenState = { opacity: 0, y: 24 };
export const shownState = { opacity: 1, y: 0 };

/**
 * Drives a section's reveal from a single boolean, so every item inside it
 * animates from one source of truth instead of each element negotiating its own
 * `whileInView` observer.
 *
 * Content can never end up permanently invisible. `show` latches true if any of
 * these hold:
 *   - the user prefers reduced motion (render final state immediately);
 *   - the section is already on screen when it mounts (no scroll will ever come);
 *   - there is no element or no IntersectionObserver to observe with;
 *   - the observer reports the section scrolling into view.
 *
 * Because `show` only ever flips false → true, a section that has appeared
 * stays appeared.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);
    const reduceMotion = useReducedMotion() ?? false;
    const inView = useInView(ref, { once: true, amount: 0.15 });
    const [revealedOnMount, setRevealedOnMount] = useState(false);

    useEffect(() => {
        const element = ref.current;

        // Nothing to observe, or no observer to do it: fail open, show content.
        if (!element || typeof IntersectionObserver === 'undefined') {
            setRevealedOnMount(true);

            return;
        }

        // Already within the viewport on first paint — the case that used to
        // leave above-the-fold sections stranded at opacity 0.
        const rect = element.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setRevealedOnMount(true);
        }
    }, []);

    const show = reduceMotion || revealedOnMount || inView;

    /** Per-item transition; `index` cascades items into a gentle stagger. */
    const transition = (index = 0): Transition =>
        reduceMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: easeOut, delay: 0.06 + index * 0.09 };

    return { ref, show, transition };
}
