/*
 * TEMPLATE NOTICE — This is placeholder legal text, not legal advice.
 * Consult a qualified lawyer and have it reviewed before any production use.
 */
import { Head, Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

import { LogoMark } from '@/components/landing/logo-mark';

function Section({ title, children }: PropsWithChildren<{ title: string }>) {
    return (
        <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
                {children}
            </div>
        </section>
    );
}

export default function Terms() {
    return (
        <>
            <Head title="Terms of Service" />
            <div className="min-h-screen bg-background text-foreground antialiased">
                <header className="border-b border-border">
                    <div className="mx-auto flex max-w-3xl items-center px-6 py-5">
                        <Link
                            href="/"
                            className="flex items-center gap-3 transition-opacity hover:opacity-80"
                        >
                            <LogoMark className="size-8" />
                            <span className="text-sm font-semibold">
                                AI Recruitment Platform
                            </span>
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-6 py-16">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Last updated: July 10, 2026
                    </p>

                    <Section title="1. Acceptance of terms">
                        <p>
                            By creating an account or otherwise using AI
                            Recruitment Platform (the &ldquo;Service&rdquo;), you
                            agree to these Terms of Service. If you do not agree,
                            please do not use the Service. If you use the Service
                            on behalf of an organization, you represent that you
                            are authorized to accept these terms for that
                            organization.
                        </p>
                    </Section>

                    <Section title="2. Description of the service">
                        <p>
                            AI Recruitment Platform is an AI-assisted recruitment
                            platform that connects candidates and recruiters. The
                            Service helps candidates present their experience and
                            apply to roles, and helps recruiters publish job
                            postings and review applications with the aid of
                            automated analysis. Features may change over time as
                            we improve the product.
                        </p>
                    </Section>

                    <Section title="3. Accounts and roles">
                        <p>
                            You may use the Service as a candidate, a recruiter,
                            or a company owner, and the features available to you
                            depend on your role. You are responsible for keeping
                            your login credentials secure and for all activity
                            that happens under your account. Please provide
                            accurate information and keep it up to date, and let
                            us know promptly if you believe your account has been
                            compromised.
                        </p>
                    </Section>

                    <Section title="4. Acceptable use">
                        <p>You agree not to use the Service to:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                upload content you do not have the right to
                                share, or that infringes someone else&rsquo;s
                                rights;
                            </li>
                            <li>
                                post false, misleading, discriminatory, or
                                unlawful job postings or applications;
                            </li>
                            <li>
                                attempt to disrupt, reverse engineer, or gain
                                unauthorized access to the Service or other
                                users&rsquo; data;
                            </li>
                            <li>
                                scrape, resell, or misuse personal data of other
                                users, including candidate resumes.
                            </li>
                        </ul>
                    </Section>

                    <Section title="5. AI analysis disclaimer">
                        <p>
                            The Service uses automated analysis to generate
                            scores, summaries, and suggestions that help
                            recruiters review applications. These outputs are{' '}
                            <strong className="font-medium text-foreground">
                                assistive only
                            </strong>{' '}
                            and are not definitive hiring decisions. We do not
                            guarantee that automated analysis is accurate,
                            complete, or free from bias. Hiring decisions remain
                            the sole responsibility of the recruiters and
                            organizations using the Service, who should apply
                            their own human judgment and comply with applicable
                            employment laws.
                        </p>
                    </Section>

                    <Section title="6. Intellectual property">
                        <p>
                            The Service, including its software, design, and
                            branding, is owned by us and protected by
                            intellectual property laws. You retain ownership of
                            the content you submit, such as your resume and
                            profile, and you grant us a limited license to store
                            and process that content solely to operate and
                            provide the Service to you.
                        </p>
                    </Section>

                    <Section title="7. Termination">
                        <p>
                            You may stop using the Service and request deletion
                            of your account at any time. We may suspend or
                            terminate access if you violate these terms or use
                            the Service in a way that could harm other users or
                            us. Provisions that by their nature should survive
                            termination will continue to apply.
                        </p>
                    </Section>

                    <Section title="8. Limitation of liability">
                        <p>
                            To the maximum extent permitted by law, the Service
                            is provided &ldquo;as is&rdquo; without warranties of
                            any kind. We are not liable for indirect, incidental,
                            or consequential damages, or for hiring outcomes,
                            lost opportunities, or decisions made based on
                            automated analysis. Nothing in these terms limits
                            liability that cannot be limited under applicable
                            law.
                        </p>
                    </Section>

                    <Section title="9. Changes to these terms">
                        <p>
                            We may update these terms from time to time. When we
                            make material changes, we will update the &ldquo;Last
                            updated&rdquo; date and, where appropriate, notify
                            you. Continued use of the Service after changes take
                            effect means you accept the updated terms.
                        </p>
                    </Section>

                    <Section title="10. Contact">
                        <p>
                            If you have questions about these terms, contact us
                            at{' '}
                            <a
                                href="mailto:legal@example.com"
                                className="font-medium text-foreground underline underline-offset-4"
                            >
                                legal@example.com
                            </a>
                            .
                        </p>
                    </Section>

                    <div className="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
                        <p>
                            See also our{' '}
                            <Link
                                href="/privacy"
                                className="font-medium text-foreground underline underline-offset-4"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
