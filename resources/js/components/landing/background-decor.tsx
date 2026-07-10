import { cn } from '@/lib/utils';

const defaultMask =
    'radial-gradient(ellipse 60% 55% at 50% 0%, black, transparent 75%)';

/**
 * Faint dot grid that fades out toward the edges. Theme-aware via the --border
 * token, so it stays subtle in both light and dark. Purely decorative.
 */
export function DotGrid({
    className,
    mask = defaultMask,
}: {
    className?: string;
    /** A CSS mask-image value describing where the grid fades to nothing. */
    mask?: string;
}) {
    return (
        <div
            aria-hidden
            className={cn(
                'pointer-events-none absolute inset-0 -z-20',
                className,
            )}
            style={{
                backgroundImage:
                    'radial-gradient(circle, var(--border) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                maskImage: mask,
                WebkitMaskImage: mask,
            }}
        />
    );
}

/**
 * A very soft violet radial glow. Never animates and never paints text, so it
 * stays a cheap compositor layer. Position it with utility classes.
 */
export function GlowOrb({ className }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={cn(
                'pointer-events-none absolute -z-10 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 opacity-15 blur-3xl',
                className,
            )}
        />
    );
}
