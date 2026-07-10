import { useCountUp } from '@/hooks/use-count-up';

/**
 * Renders a number counting up from zero. Mount it only once its section is
 * revealed so the count plays on reveal rather than on page load. `useCountUp`
 * already honors prefers-reduced-motion by settling on the target instantly.
 */
export function CountUpNumber({
    value,
    duration = 1.2,
}: {
    value: number;
    duration?: number;
}) {
    const counted = useCountUp(value, duration);

    return <>{counted}</>;
}
