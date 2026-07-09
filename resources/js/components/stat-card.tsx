import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useCountUp } from '@/hooks/use-count-up';
import { fadeSlideUp } from '@/lib/motion';

/**
 * One dashboard KPI: a violet-tinted icon, a label, and a value. Entrance is a
 * fade and slide-up orchestrated by a parent `staggerContainer`, and numeric
 * values count up from zero on mount. An optional `context` line adds a small
 * muted footnote (e.g. "3 published"). Hover gives a gentle lift.
 */
export default function StatCard({
    icon: Icon,
    label,
    value,
    context,
}: {
    icon: LucideIcon;
    label: string;
    value: number | string;
    context?: string;
}) {
    const reduceMotion = useReducedMotion();
    const isNumeric = typeof value === 'number';

    // The hook must run unconditionally; ignore its output for string values.
    const counted = useCountUp(isNumeric ? value : 0);

    return (
        <motion.div
            variants={fadeSlideUp}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="rounded-xl border border-sidebar-border/70 p-6 transition-shadow hover:shadow-md dark:border-sidebar-border"
        >
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">{label}</p>

                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                </div>
            </div>

            <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
                {isNumeric ? counted : value}
            </p>

            {context && (
                <p className="mt-1 text-xs text-muted-foreground">{context}</p>
            )}
        </motion.div>
    );
}
