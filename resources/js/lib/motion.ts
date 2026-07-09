import type { Variants } from 'framer-motion';

/**
 * Shared motion variants for the authenticated app. Tuned tighter than the
 * landing page: short travel, fast ease-out, never bouncy — the kind of
 * micro-interaction you barely notice but that makes a page feel alive.
 */

const easeOut = [0.16, 1, 0.3, 1] as const;

/** Parent that reveals its children in a quick, subtle cascade. */
export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.06, delayChildren: 0.04 },
    },
};

/** A single card, row, or list item: a short fade and slide-up. */
export const fadeSlideUp: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: easeOut },
    },
};
