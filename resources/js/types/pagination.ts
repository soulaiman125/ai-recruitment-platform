/** One entry in a Laravel paginator's `links` array. */
export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

/**
 * The JSON shape Laravel's LengthAwarePaginator serializes to. `T` is the type
 * of a single row in `data`, so pages stay strongly typed over their rows.
 */
export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
};
