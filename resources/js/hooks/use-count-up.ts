import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Counts a number up from zero to `target` on mount, easing out so it settles
 * gently rather than stopping dead. Honors prefers-reduced-motion by returning
 * the final value straight away, with no animation.
 */
export function useCountUp(target: number, duration = 0.8): number {
    const reduceMotion = useReducedMotion();
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (reduceMotion) {
            return;
        }

        let frame: number;
        const start = performance.now();

        const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / (duration * 1000));
            // easeOutCubic keeps the count brisk, then eases into place.
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [target, duration, reduceMotion]);

    return reduceMotion ? target : value;
}
