import { motion } from 'framer-motion';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { fadeSlideUp } from '@/lib/motion';

/** One day in a 14-day activity series, as sent by the dashboard controller. */
export type ActivityPoint = { date: string; count: number };

/** `YYYY-MM-DD` → a short, locale-aware axis label like "Jul 9". */
function formatDay(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });
}

type TooltipProps = {
    active?: boolean;
    label?: string;
    payload?: { value: number }[];
};

/** Theme-aware tooltip built from popover tokens so it reads in both modes. */
function ChartTooltip({ active, label, payload }: TooltipProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const value = payload[0].value;

    return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
            <p className="font-medium text-popover-foreground">
                {label ? formatDay(label) : ''}
            </p>
            <p className="text-muted-foreground">
                {value} {value === 1 ? 'entry' : 'entries'}
            </p>
        </div>
    );
}

/**
 * A responsive 14-day area chart. Every colour is a theme CSS variable — the
 * violet primary for the line and its gradient fill, the border token for the
 * grid, muted-foreground for the ticks — so it stays legible in light and dark
 * without a hardcoded palette.
 */
export default function ActivityChart({
    title,
    description,
    data,
}: {
    title: string;
    description: string;
    data: ActivityPoint[];
}) {
    return (
        <motion.div
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border"
        >
            <div className="mb-4">
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="activityFill"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="var(--primary)"
                                    stopOpacity={0.35}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="var(--primary)"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            stroke="var(--border)"
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDay}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={24}
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                        />

                        <YAxis
                            allowDecimals={false}
                            width={32}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                        />

                        <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ stroke: 'var(--border)' }}
                        />

                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="var(--primary)"
                            strokeWidth={2}
                            fill="url(#activityFill)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
