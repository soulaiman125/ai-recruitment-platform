import { LogoMark } from '@/components/landing/logo-mark';

export function SiteFooter() {
    return (
        <footer className="border-t border-border py-12">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
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
                <p className="text-xs text-muted-foreground">
                    © 2026 AI Recruitment Platform. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
