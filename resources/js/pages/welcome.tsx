import { Head, usePage } from '@inertiajs/react';

import { AnalysisPipeline } from '@/components/landing/analysis-pipeline';
import { AnalysisShowcase } from '@/components/landing/analysis-showcase';
import { BentoFeatures } from '@/components/landing/bento-features';
import { CtaSection } from '@/components/landing/cta-section';
import { HeroSection } from '@/components/landing/hero-section';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { ScoreStatement } from '@/components/landing/score-statement';
import { SiteFooter } from '@/components/landing/site-footer';
import { TestimonialsSection } from '@/components/landing/testimonials-section';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="AI Recruitment Platform — Hire smarter with AI" />
            <div
                id="top"
                className="min-h-screen scroll-smooth bg-background text-foreground antialiased"
            >
                <LandingNavbar auth={auth} />

                {/* No two neighbours share a layout archetype: split hero,
                    oversized number, bento grid, horizontal timeline, floating
                    surface, asymmetric quote, full-bleed CTA. */}
                <main>
                    <HeroSection />
                    <ScoreStatement />
                    <BentoFeatures />
                    <AnalysisPipeline />
                    <AnalysisShowcase />
                    <TestimonialsSection />
                    <CtaSection />
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
