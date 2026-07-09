import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * The shared empty state for tables and lists: a lucide icon in a soft circle,
 * a title, a description, and an optional action link. Fades in gently so it
 * does not pop when a list resolves to nothing.
 */
export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        href: InertiaLinkProps['href'];
    };
}) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center rounded-xl border border-sidebar-border/70 px-6 py-16 text-center dark:border-sidebar-border"
        >
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-6" />
            </div>

            <p className="mt-4 font-medium">{title}</p>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {description}
            </p>

            {action && (
                <Button asChild className="mt-4">
                    <Link href={action.href}>{action.label}</Link>
                </Button>
            )}
        </motion.div>
    );
}
