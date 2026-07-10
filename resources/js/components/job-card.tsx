import { Link } from '@inertiajs/react';
import { Bookmark, BookmarkCheck, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

                        <CardDescription>{job.company.name}</CardDescription>
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
