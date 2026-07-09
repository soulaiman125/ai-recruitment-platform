import { Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Brand logo: a rounded gradient tile with a spark glyph. The accent
 * gradient (indigo -> violet -> fuchsia) is the one colourful signature
 * we allow ourselves on top of the otherwise monochrome theme tokens.
 */
export function LogoMark({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25',
                className,
            )}
        >
            <Sparkles className="size-5" strokeWidth={2.25} />
        </div>
    );
}
