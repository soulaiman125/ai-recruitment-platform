import { motion } from 'framer-motion';
import { CheckCircle2, FileText, TrendingUp } from 'lucide-react';

const SCORE = 87;
const skills = ['React', 'TypeScript', 'Laravel', 'AI/ML', 'SQL'];

/** Circumference of the progress ring (r = 52). */
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A fake "AI analysis" card used purely as decorative hero art. Built
 * entirely from divs + inline SVG (no external images) so it renders
 * crisp at any size and adapts to light / dark via theme tokens.
 */
export function AnalysisCard() {
    return (
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/5 dark:shadow-black/40">
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="size-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                        candidate_resume.pdf
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Analyzed by AI · just now
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-5">
                <div className="relative size-32 shrink-0">
                    <svg className="size-full -rotate-90" viewBox="0 0 120 120">
                        <circle
                            cx="60"
                            cy="60"
                            r={RADIUS}
                            fill="none"
                            strokeWidth="10"
                            className="stroke-muted"
                        />
                        <motion.circle
                            cx="60"
                            cy="60"
                            r={RADIUS}
                            fill="none"
                            strokeWidth="10"
                            strokeLinecap="round"
                            stroke="url(#scoreGradient)"
                            strokeDasharray={CIRCUMFERENCE}
                            initial={{ strokeDashoffset: CIRCUMFERENCE }}
                            whileInView={{
                                strokeDashoffset:
                                    CIRCUMFERENCE * (1 - SCORE / 100),
                            }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 1.4,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.3,
                            }}
                        />
                        <defs>
                            <linearGradient
                                id="scoreGradient"
                                x1="0"
                                y1="0"
                                x2="120"
                                y2="120"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#d946ef" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold tracking-tight">
                            {SCORE}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            / 100
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="size-4" />
                        Strong match
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                        <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                            5 years experience
                        </li>
                        <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                            Skills aligned
                        </li>
                        <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                            Role-ready
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 border-t border-border pt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Detected skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
