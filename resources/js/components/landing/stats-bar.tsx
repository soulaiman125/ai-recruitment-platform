import { motion } from 'framer-motion';

import {
    hiddenState,
    shownState,
    useReveal,
} from '@/components/landing/animations';
import { useCountUp } from '@/hooks/use-count-up';

type Stat = {
    prefix?: string;
    value: number;
    suffix?: string;
    label: string;
};

const stats: Stat[] = [
    { prefix: '< ', value: 30, suffix: 's', label: 'to analyze a resume' },
    { prefix: '0–', value: 100, label: 'clarity score on every CV' },
    { value: 4, suffix: ' roles', label: 'on one platform' },
    { value: 100, suffix: '%', label: 'AI-assisted ranking' },
];

/**
 * Renders the counting number. Mounted only once the bar is revealed so the
 * count-up plays on reveal rather than on page load. `useCountUp` already
 * honors prefers-reduced-motion by settling on the target instantly.
 */
function CountUpNumber({ value }: { value: number }) {
    const counted = useCountUp(value, 1.2);

    return <>{counted}</>;
}

export function StatsBar() {
    const { ref, show, transition } = useReveal<HTMLElement>();

    return (
        <section ref={ref} className="px-6 pb-8">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border/60 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={hiddenState}
                        animate={show ? shownState : hiddenState}
                        transition={transition(index)}
                        className="flex flex-col items-center bg-card px-6 py-8 text-center"
                    >
                        <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                                {stat.prefix}
                                {show ? <CountUpNumber value={stat.value} /> : 0}
                                {stat.suffix}
                            </span>
                        </p>
                        <p className="mt-2 text-sm text-pretty text-muted-foreground">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
