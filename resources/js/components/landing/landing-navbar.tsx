import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

import { LogoMark } from '@/components/landing/logo-mark';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import type { Auth } from '@/types';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
];

export function LandingNavbar({ auth }: { auth: Auth }) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl"
        >
            <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
                <a href="#top" className="flex items-center gap-2.5">
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
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {auth.user ? (
                        <Button asChild size="sm">
                            <Link href={dashboard()}>Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="hidden sm:inline-flex"
                            >
                                <Link href={login()}>Log in</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href={register()}>Get started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </motion.header>
    );
}
