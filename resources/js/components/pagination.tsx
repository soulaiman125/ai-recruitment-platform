import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/pagination';

/**
 * Simple Prev/Next pager for a Laravel paginator. `noun` labels the row count
 * ("users", "companies", …). Rendered under the admin tables.
 */
export default function Pagination({
    paginator,
    noun,
}: {
    paginator: Paginated<unknown>;
    noun: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
                {paginator.total === 0
                    ? `No ${noun}`
                    : `Showing ${paginator.from}–${paginator.to} of ${paginator.total}`}
            </p>

            <div className="flex gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!paginator.prev_page_url}
                    asChild={!!paginator.prev_page_url}
                >
                    {paginator.prev_page_url ? (
                        <Link
                            href={paginator.prev_page_url}
                            preserveScroll
                            preserveState
                            data-test="pagination-prev"
                        >
                            Previous
                        </Link>
                    ) : (
                        <span>Previous</span>
                    )}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!paginator.next_page_url}
                    asChild={!!paginator.next_page_url}
                >
                    {paginator.next_page_url ? (
                        <Link
                            href={paginator.next_page_url}
                            preserveScroll
                            preserveState
                            data-test="pagination-next"
                        >
                            Next
                        </Link>
                    ) : (
                        <span>Next</span>
                    )}
                </Button>
            </div>
        </div>
    );
}
