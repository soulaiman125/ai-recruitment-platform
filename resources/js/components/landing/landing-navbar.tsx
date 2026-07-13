import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';

import { LandingLinkButton } from '@/components/landing/landing-link-button';
import { LogoMark } from '@/components/landing/logo-mark';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';
import type { Auth } from '@/types';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
];

export function LandingNavbar({ auth }: { auth: Auth }) {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 12);
    });

    return (
        <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                'sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300',
                isScrolled
                    ? 'border-border/60 bg-background/75 shadow-sm shadow-black/5 backdrop-blur-xl dark:shadow-black/20'
                    : 'border-transparent bg-transparent',
            )}
        >
            <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
                <a
                    href="#top"
                    className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                    <LogoMark />
                    <span className="text-base font-semibold tracking-tight">
                        AI Recruitment
                    </span>
                </a>

                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {auth.user ? (
                        <LandingLinkButton size="sm" href={dashboard()}>
                            Dashboard
                        </LandingLinkButton>
                    ) : (
                        <>
                            <LandingLinkButton
                                variant="ghost"
                                size="sm"
                                href={login()}
                                className="hidden sm:inline-flex"
                            >
                                Log in
                            </LandingLinkButton>
                            <LandingLinkButton size="sm" href={register()}>
                                Get started
                            </LandingLinkButton>
                        </>
                    )}
                </div>
            </nav>
        </motion.header>
    );
}
