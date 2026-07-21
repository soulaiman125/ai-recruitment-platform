import { Link } from '@inertiajs/react';
import {
    Bookmark,
    BookmarkCheck,
    CheckCircle2,
    MapPin,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { toggleSavedJob } from '@/lib/saved-jobs';
import { show } from '@/routes/candidate/jobs';
import type { JobPostingWithCompany } from '@/types/job';

/**
 * One posting in a candidate-facing grid, with its bookmark toggle.
 *
 * The toggle lives outside the `Link` rather than inside it: nesting a button
 * in an anchor is invalid markup, and it means no `stopPropagation` dance is
 * needed to keep a save from navigating to the job.
 */
export default function JobCard({
    job,
    isSaved,
}: {
    job: JobPostingWithCompany;
    isSaved: boolean;
}) {
    const Icon = isSaved ? BookmarkCheck : Bookmark;

    const match = job.ai_match;

    return (
        <div className="group relative h-full">
            <Link
                href={show(job.slug)}
                className="block h-full"
                data-test="job-card-link"
            >
                <Card className="h-full transition-colors group-hover:border-primary/50">
                    <CardHeader>
                        {/* Leaves room for the bookmark button beside it. */}
                        <CardTitle className="line-clamp-2 pr-10">
                            {job.title}
                        </CardTitle>

                        <CardDescription className="flex items-center justify-between gap-2">
                            <span>{job.company.name}</span>

                            {match && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge
                                                className={
                                                    match.score >= 80
                                                        ? 'bg-green-600 hover:bg-green-700 text-white cursor-help'
                                                        : match.score >= 50
                                                          ? 'bg-yellow-500 hover:bg-yellow-600 text-black cursor-help'
                                                          : match.score >= 20
                                                            ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-help'
                                                            : 'bg-red-600 hover:bg-red-700 text-white cursor-help'
                                                }
                                            >
                                                {Math.round(match.score)}% Match
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-md text-sm">
                                            <p>{match.explanation}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-3">
                        {job.location && (
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="size-3.5 shrink-0" />
                                {job.location}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-1.5">
                            {job.employment_type && (
                                <Badge variant="secondary">
                                    {job.employment_type}
                                </Badge>
                            )}

                            {job.work_mode && (
                                <Badge variant="outline">{job.work_mode}</Badge>
                            )}
                        </div>

                        <p className="line-clamp-3 text-sm text-muted-foreground">
                            {job.description}
                        </p>

                        {match && (
                            <div className="space-y-3">
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Matched Skills</span>
                                    </div>

                                    {match.matched_skills.length > 0 ? (
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {match.matched_skills.map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    className="bg-green-100 text-green-700"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-1 rounded-md border border-dashed p-2">
                                            <p className="text-xs italic text-muted-foreground">
                                                No matching skills found.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {match.missing_skills.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                                            <XCircle className="h-4 w-4" />
                                            <span>Missing Skills</span>
                                        </div>

                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {match.missing_skills
                                                .slice(0, 5)
                                                .map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant="outline"
                                                        className="border-red-400 text-red-600"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}

                                            {match.missing_skills.length > 5 && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-muted-foreground text-muted-foreground"
                                                >
                                                    +{match.missing_skills.length - 5} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Link>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleSavedJob(job.slug, isSaved)}
                aria-pressed={isSaved}
                aria-label={
                    isSaved ? `Unsave ${job.title}` : `Save ${job.title}`
                }
                className="absolute top-4 right-4"
                data-test="job-card-save-button"
            >
                <Icon
                    className={
                        isSaved
                            ? 'size-4 fill-primary text-primary'
                            : 'size-4 text-muted-foreground'
                    }
                />
            </Button>
        </div>
    );
}