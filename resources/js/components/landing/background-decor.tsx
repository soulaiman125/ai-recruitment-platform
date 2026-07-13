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

/**
 * A nearly imperceptible grain layer that keeps large white surfaces from
 * feeling flat. It is static and pointer-free, so it has no runtime cost.
 */
export function NoiseTexture({ className }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={cn(
                'pointer-events-none absolute inset-0 -z-10 opacity-[0.025] mix-blend-multiply dark:mix-blend-soft-light',
                className,
            )}
            style={{
                backgroundImage:
                    'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%271.1%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%271%27/%3E%3C/svg%3E")',
                backgroundSize: '180px 180px',
            }}
        />
    );
}
