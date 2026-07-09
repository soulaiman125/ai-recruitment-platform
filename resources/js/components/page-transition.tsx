import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Wraps a page's content in a subtle fade/slide-up entrance. Kept deliberately
 * light so it never fights Inertia navigation, and skipped for reduced motion.
 * Applied per-page rather than globally to stay clear of layout resolution.
 */
export default function PageTransition({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
