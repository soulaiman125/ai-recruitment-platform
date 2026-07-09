import AppLogoIcon from '@/components/app-logo-icon';

import { cn } from '@/lib/utils';

/**
 * The landing page's logo. A thin wrapper over the shared brand mark so the
 * marketing site and the authenticated app never drift apart — the gradient
 * ring lives inside the mark itself, and `text-*` tints the sparkle and check.
 */
export function LogoMark({ className }: { className?: string }) {
    return (
        <AppLogoIcon
            className={cn(
                'size-9 shrink-0 text-violet-500 dark:text-violet-400',
                className,
            )}
        />
    );
}
