import type { Variants } from 'framer-motion';

/**
 * Shared motion variants for the landing page. Kept subtle and
 * professional: short travel distance, gentle easing, no bounce.
 */

const easeOut = [0.16, 1, 0.3, 1] as const;

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

/** Parent container that reveals its children one after another. */
export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
};

/**
 * Viewport config reused by every whileInView section. `amount: 0.2` fires as
 * soon as a fifth of the element is on screen, so wide multi-column grids
 * reveal reliably instead of leaving trailing cards stuck at low opacity.
 */
export const viewportOnce = { once: true, amount: 0.2 } as const;
