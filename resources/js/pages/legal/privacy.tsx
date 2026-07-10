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

export default function Privacy() {
    return (
        <>
            <Head title="Privacy Policy" />
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
                        Privacy Policy
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Last updated: July 10, 2026
                    </p>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                        This policy explains what data we collect, how we use it,
                        and the choices you have. We aim to be clear and honest:
                        because our Service works with resumes and applications,
                        handling your data responsibly is central to what we do.
                    </p>

                    <Section title="Data we collect">
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                <strong className="font-medium text-foreground">
                                    Account information
                                </strong>{' '}
                                — your name, email address, password (stored
                                hashed), and role on the platform.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">
                                    CVs and resumes
                                </strong>{' '}
                                — the resume files and profile details you upload
                                or enter, including work history, education, and
                                skills.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">
                                    Application data
                                </strong>{' '}
                                — the jobs you apply to, application status,
                                interview details, and related messages.
                            </li>
                        </ul>
                    </Section>

                    <Section title="How we use your data">
                        <p>We use the data above to:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                operate your account and provide the Service;
                            </li>
                            <li>
                                match candidates with relevant roles and help
                                recruiters review applications;
                            </li>
                            <li>
                                generate AI-assisted analysis, scores, and
                                summaries to support (not replace) human
                                decisions;
                            </li>
                            <li>
                                send service-related emails such as verification,
                                password resets, and notifications.
                            </li>
                        </ul>
                    </Section>

                    <Section title="AI analysis and third-party processing">
                        <p>
                            To provide automated analysis, the text of your
                            resume and application content is sent to an external,
                            third-party AI provider that processes it on our
                            behalf and returns analysis such as scores and
                            summaries. In other words,{' '}
                            <strong className="font-medium text-foreground">
                                your resume text leaves our servers and is
                                transmitted to an external AI service for
                                analysis.
                            </strong>{' '}
                            We share only what is needed for this purpose and do
                            not sell your personal data. The AI provider processes
                            the data under its own terms and security commitments.
                        </p>
                    </Section>

                    <Section title="Data storage and security">
                        <p>
                            Your data is stored on secured infrastructure.
                            Passwords are hashed, access is restricted, and data
                            is transmitted over encrypted connections. No system
                            is perfectly secure, but we take reasonable technical
                            and organizational measures to protect your
                            information, and we work to limit access to those who
                            need it to operate the Service.
                        </p>
                    </Section>

                    <Section title="Third parties we share data with">
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                <strong className="font-medium text-foreground">
                                    AI provider
                                </strong>{' '}
                                — processes resume and application text to
                                generate analysis.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">
                                    Email provider
                                </strong>{' '}
                                — delivers transactional emails such as account
                                verification and password resets.
                            </li>
                        </ul>
                        <p>
                            We share data with recruiters and companies only as
                            part of the applications you choose to submit.
                        </p>
                    </Section>

                    <Section title="Your rights">
                        <p>
                            Depending on where you live, you may have rights under
                            laws such as the GDPR, including the right to access
                            the personal data we hold about you, to correct
                            inaccurate data, to request deletion of your data, and
                            to object to or restrict certain processing. You can
                            exercise these rights from your account settings where
                            available, or by contacting us. We will respond within
                            the timeframes required by applicable law.
                        </p>
                    </Section>

                    <Section title="Data retention">
                        <p>
                            We keep your data for as long as your account is
                            active or as needed to provide the Service. When you
                            delete your account or ask us to delete your data, we
                            remove or anonymize it within a reasonable period,
                            except where we must retain certain information to
                            comply with legal obligations or resolve disputes.
                        </p>
                    </Section>

                    <Section title="Cookies and sessions">
                        <p>
                            We use essential cookies to keep you signed in and to
                            keep the Service secure, for example session and
                            authentication cookies. These are necessary for the
                            platform to function and do not track you across other
                            websites for advertising.
                        </p>
                    </Section>

                    <Section title="Children">
                        <p>
                            The Service is not intended for children under 16, and
                            we do not knowingly collect personal data from them.
                            If you believe a child has provided us with personal
                            data, please contact us and we will take steps to
                            remove it.
                        </p>
                    </Section>

                    <Section title="Changes to this policy">
                        <p>
                            We may update this policy from time to time. When we
                            make material changes, we will update the &ldquo;Last
                            updated&rdquo; date and, where appropriate, notify you.
                        </p>
                    </Section>

                    <Section title="Contact">
                        <p>
                            If you have questions about this policy or your data,
                            contact us at{' '}
                            <a
                                href="mailto:privacy@example.com"
                                className="font-medium text-foreground underline underline-offset-4"
                            >
                                privacy@example.com
                            </a>
                            .
                        </p>
                    </Section>

                    <div className="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
                        <p>
                            See also our{' '}
                            <Link
                                href="/terms"
                                className="font-medium text-foreground underline underline-offset-4"
                            >
                                Terms of Service
                            </Link>
                            .
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
