import { Head, usePage } from '@inertiajs/react';

import { CtaSection } from '@/components/landing/cta-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { SiteFooter } from '@/components/landing/site-footer';
import { StatsBar } from '@/components/landing/stats-bar';
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
                <main>
                    <HeroSection />
                    <StatsBar />
                    <FeaturesSection />
                    <HowItWorksSection />
                    <TestimonialsSection />
                    <CtaSection />
                </main>
                <SiteFooter />
            </div>
        </>
    );
}
