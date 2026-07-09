import { useId } from 'react';
import type { SVGAttributes } from 'react';

/**
 * The brand mark: an open "match ring" whose gradient stroke sweeps ~290° and
 * breaks at the top-right, where a four-point sparkle sits in the gap. A check
 * rests in the ring's negative centre — the match, confirmed.
 *
 * The ring paints itself from a violet → fuchsia gradient so the mark is
 * self-contained on any surface. The sparkle and check use `currentColor`, so
 * callers tint them via `text-*` and the whole mark stays theme-aware.
 *
 * Stroked paths pin `fill="none"` explicitly: a caller's `fill-current` class
 * would otherwise beat the root `fill` attribute and flood the arcs.
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    // Unique per instance — several marks can share a page (navbar + footer).
    // `useId` embeds punctuation (":r1:", "«r0»") that a url(#…) reference can
    // choke on, so strip it down to an id that is safe to point at.
    const gradientId = `logo-ring-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <defs>
                <linearGradient
                    id={gradientId}
                    x1="6"
                    y1="6"
                    x2="34"
                    y2="34"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#d946ef" />
                </linearGradient>
            </defs>

            {/* Match ring: open arc, gap centred on the top-right diagonal. */}
            <path
                d="M22.3 7.2A13 13 0 1 0 32.8 17.7"
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="3.2"
                strokeLinecap="round"
            />

            {/* Confirmation check, seated in the ring's negative centre. */}
            <path
                d="M14.6 20.2L18.4 24L25.6 15.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Four-point AI sparkle, breaking out of the ring's gap. */}
            <path
                d="M29.2 5.8C29.2 9.4 30.6 10.8 34.2 10.8C30.6 10.8 29.2 12.2 29.2 15.8C29.2 12.2 27.8 10.8 24.2 10.8C27.8 10.8 29.2 9.4 29.2 5.8Z"
                fill="currentColor"
            />
        </svg>
    );
}
