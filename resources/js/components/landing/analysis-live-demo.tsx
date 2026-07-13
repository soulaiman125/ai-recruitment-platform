import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CountUpNumber } from '@/components/landing/count-up-number';
import { ScoreRing } from '@/components/landing/score-ring';
import { cn } from '@/lib/utils';

export const ANALYSIS_SCORE = 87;
export const ANALYSIS_SKILLS = [
    'React',
    'TypeScript',
    'Laravel',
    'AI/ML',
    'SQL',
];
export const ANALYSIS_RECOMMENDATIONS = [
    'Move to a technical screen',
    'Ask about design-system ownership',
    'Probe PostgreSQL tuning depth',
];

const analysisSteps = [
    { id: 'uploading', label: 'Uploading resume', duration: 1000 },
    { id: 'extracting', label: 'Extracting skills', duration: 1200 },
    { id: 'experience', label: 'Reading experience', duration: 1300 },
    { id: 'summary', label: 'Generating summary', duration: 1200 },
    { id: 'score', label: 'Calculating match score', duration: 1500 },
    { id: 'finished', label: 'Analysis finished', duration: 3000 },
] as const;

export const LIVE_ANALYSIS_CYCLE_MS = analysisSteps.reduce(
    (total, step) => total + step.duration,
    0,
);

type LiveAnalysisOptions = {
    active?: boolean;
};

/**
 * Shared state machine for every marketing AI preview. It deliberately uses
 * discrete, explainable product states rather than an indeterminate loader.
 */
export function useLiveAnalysis({ active = true }: LiveAnalysisOptions = {}) {
    const reduceMotion = useReducedMotion() ?? false;
    const [stageIndex, setStageIndex] = useState(
        reduceMotion ? analysisSteps.length - 1 : 0,
    );
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        if (reduceMotion || !active) {
            return;
        }

        let index = 0;
        let timeout: ReturnType<typeof setTimeout>;

        const advance = () => {
            setStageIndex(index);

            timeout = setTimeout(() => {
                if (index === analysisSteps.length - 1) {
                    index = 0;
                    setCycle((current) => current + 1);
                } else {
                    index += 1;
                }

                advance();
            }, analysisSteps[index].duration);
        };

        timeout = setTimeout(advance, 0);

        return () => clearTimeout(timeout);
    }, [active, reduceMotion]);

    const resolvedStageIndex = reduceMotion
        ? analysisSteps.length - 1
        : active
          ? stageIndex
          : 0;

    return {
        cycle,
        reduceMotion,
        stage: analysisSteps[resolvedStageIndex],
        stageIndex: resolvedStageIndex,
        isComplete: resolvedStageIndex === analysisSteps.length - 1,
        isScoreReady: resolvedStageIndex >= 4,
        showSkills: resolvedStageIndex >= 1,
        showSummary: resolvedStageIndex >= 3,
    };
}

type LiveAnalysisState = ReturnType<typeof useLiveAnalysis>;

export function LiveAnalysisStatus({
    analysis,
    compact = false,
    className,
}: {
    analysis: LiveAnalysisState;
    compact?: boolean;
    className?: string;
}) {
    if (compact) {
        return (
            <div className={cn('min-w-0', className)}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={`${analysis.cycle}-${analysis.stage.id}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.22 }}
                    >
                        <p className="text-xs font-medium text-foreground">
                            {analysis.stage.label}
                        </p>
                        <p className="mt-0.5 text-[0.65rem] text-muted-foreground">
                            {analysis.isComplete
                                ? 'Candidate analysis is ready to review'
                                : 'AI is processing candidate_resume.pdf'}
                        </p>
                    </motion.div>
                </AnimatePresence>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                        key={`${analysis.cycle}-${analysis.stage.id}-progress`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            duration: analysis.reduceMotion ? 0 : 0.85,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="h-full origin-left rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
                    />
                </div>
            </div>
        );
    }

    return (
        <ol className={cn('space-y-2', className)}>
            {analysisSteps.map((step, index) => {
                const isDone =
                    index < analysis.stageIndex || analysis.isComplete;
                const isActive =
                    index === analysis.stageIndex && !analysis.isComplete;

                return (
                    <li
                        key={step.id}
                        className={cn(
                            'flex items-center gap-2.5 text-xs transition-colors duration-300',
                            isActive || isDone
                                ? 'text-foreground'
                                : 'text-muted-foreground/60',
                        )}
                    >
                        <span
                            className={cn(
                                'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                                isDone
                                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : isActive
                                      ? 'border-violet-500/40 bg-violet-500/10 text-violet-500'
                                      : 'border-border bg-background',
                            )}
                        >
                            {isDone ? (
                                <Check className="size-2.5" strokeWidth={3} />
                            ) : isActive ? (
                                <motion.span
                                    animate={{ opacity: [0.45, 1, 0.45] }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="size-1.5 rounded-full bg-current"
                                />
                            ) : null}
                        </span>
                        <span>{step.label}</span>
                    </li>
                );
            })}
        </ol>
    );
}

export function LiveScore({
    analysis,
    className,
    strokeWidth = 10,
}: {
    analysis: LiveAnalysisState;
    className?: string;
    strokeWidth?: number;
}) {
    return (
        <ScoreRing
            value={ANALYSIS_SCORE}
            play={analysis.isScoreReady}
            reduceMotion={analysis.reduceMotion}
            delay={0.1}
            strokeWidth={strokeWidth}
            className={className}
        >
            <span className="text-3xl font-bold tracking-tight tabular-nums">
                {analysis.isScoreReady ? (
                    <CountUpNumber
                        key={analysis.cycle}
                        value={ANALYSIS_SCORE}
                        duration={1.2}
                    />
                ) : (
                    0
                )}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
        </ScoreRing>
    );
}

export function LiveSkills({
    analysis,
    skills = ANALYSIS_SKILLS,
    className,
}: {
    analysis: LiveAnalysisState;
    skills?: readonly string[];
    className?: string;
}) {
    return (
        <div className={cn('flex flex-wrap gap-1.5', className)}>
            <AnimatePresence initial={false}>
                {analysis.showSkills &&
                    skills.map((skill, index) => (
                        <motion.span
                            key={`${analysis.cycle}-${skill}`}
                            initial={{ opacity: 0, scale: 0.9, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                            transition={{
                                duration: analysis.reduceMotion ? 0 : 0.28,
                                delay: analysis.reduceMotion ? 0 : index * 0.06,
                            }}
                            className="cursor-default rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium transition-transform duration-200 hover:scale-105"
                        >
                            {skill}
                        </motion.span>
                    ))}
            </AnimatePresence>
        </div>
    );
}

export function LiveSummary({
    analysis,
    summary = 'Six years building production React applications, with strong TypeScript fundamentals and recent Laravel + Inertia experience.',
    className,
}: {
    analysis: LiveAnalysisState;
    summary?: string;
    className?: string;
}) {
    return (
        <AnimatePresence mode="wait" initial={false}>
            {analysis.showSummary && (
                <motion.p
                    key={analysis.cycle}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: analysis.reduceMotion ? 0 : 0.35 }}
                    className={cn(className)}
                >
                    {summary}
                </motion.p>
            )}
        </AnimatePresence>
    );
}

export function LiveRecommendations({
    analysis,
    recommendations = ANALYSIS_RECOMMENDATIONS,
    className,
}: {
    analysis: LiveAnalysisState;
    recommendations?: readonly string[];
    className?: string;
}) {
    return (
        <div className={cn(className)}>
            <AnimatePresence initial={false}>
                {analysis.isComplete &&
                    recommendations.map((recommendation, index) => (
                        <motion.div
                            key={`${analysis.cycle}-${recommendation}`}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: analysis.reduceMotion ? 0 : 0.3,
                                delay: analysis.reduceMotion ? 0 : index * 0.1,
                            }}
                            className="flex gap-2 text-xs text-foreground/90"
                        >
                            <FileText className="mt-0.5 size-3 shrink-0 text-violet-500" />
                            {recommendation}
                        </motion.div>
                    ))}
            </AnimatePresence>
        </div>
    );
}
