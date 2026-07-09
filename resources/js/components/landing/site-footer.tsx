import { Link } from '@inertiajs/react';

import { LogoMark } from '@/components/landing/logo-mark';
import { login, register } from '@/routes';

const anchorLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
];

const routeLinks = [
    { label: 'Create account', href: register() },
    { label: 'Sign in', href: login() },
];

const linkClass =
    'text-sm text-muted-foreground transition-colors hover:text-foreground';

export function SiteFooter() {
    return (
        <footer className="border-t border-border py-12">
            <div className="mx-auto w-full max-w-6xl px-6">
                <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
                    <div className="flex items-center gap-3">
                        <LogoMark className="size-8" />
                        <div>
                            <p className="text-sm font-semibold">
                                AI Recruitment Platform
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Hire smarter with AI.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 sm:gap-16">
                        <div>
                            <p className="text-sm font-semibold">Product</p>
                            <ul className="mt-3 space-y-2">
                                {anchorLinks.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className={linkClass}>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Get started</p>
                            <ul className="mt-3 space-y-2">
                                {routeLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className={linkClass}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-border pt-6">
                    <p className="text-center text-xs text-muted-foreground sm:text-left">
                        © 2026 AI Recruitment Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
