import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type LandingLinkButtonProps = Pick<
    ComponentProps<typeof Button>,
    'className' | 'size' | 'variant'
> & {
    href: ComponentProps<typeof Link>['href'];
    children: ReactNode;
};

/**
 * Shared landing CTA treatment. The Button remains the single source of truth
 * for its semantics and focus ring; this wrapper only adds route progress and
 * a spring-driven affordance for marketing surfaces.
 */
export function LandingLinkButton({
    href,
    children,
    className,
    size,
    variant,
}: LandingLinkButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className="will-change-transform motion-reduce:transform-none"
        >
            <Button
                asChild
                size={size}
                variant={variant}
                className={cn(
                    'shadow-sm transition-[box-shadow,background-color] duration-300 hover:shadow-lg hover:shadow-primary/20 focus-visible:ring-[3px] focus-visible:ring-primary/40',
                    className,
                )}
            >
                <Link
                    href={href}
                    aria-busy={isLoading}
                    onStart={() => setIsLoading(true)}
                    onFinish={() => setIsLoading(false)}
                >
                    {isLoading ? (
                        <>
                            <LoaderCircle className="size-4 animate-spin" />
                            Loading
                        </>
                    ) : (
                        children
                    )}
                </Link>
            </Button>
        </motion.div>
    );
}
