import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { fadeSlideUp } from '@/lib/motion';
import type { Auth } from '@/types';

/** Splits the day into a greeting word based on the viewer's local clock. */
function daypart(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'morning';
    }

    if (hour < 18) {
        return 'afternoon';
    }

    return 'evening';
}

/**
 * The greeting header shared by every dashboard: a time-aware "Good evening,
 * Soulaiman", the role context as a subtitle, and today's date. Name and role
 * are read from the shared Inertia `auth` prop so callers only pass context.
 */
export default function DashboardHeader({ subtitle }: { subtitle: string }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const firstName = auth.user.name.split(' ')[0];

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <motion.header
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Good {daypart()}, {firstName}
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    {subtitle}
                </p>
            </div>

            <p className="text-sm text-muted-foreground">{today}</p>
        </motion.header>
    );
}
