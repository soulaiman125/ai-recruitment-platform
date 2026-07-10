import { router } from '@inertiajs/react';
import { save, unsave } from '@/routes/candidate/jobs';

/**
 * Toggle a job's bookmark for the authenticated candidate.
 *
 * Both requests redirect back, so the fresh `savedJobIds` / `isSaved` prop is
 * what flips the icon — there is no local optimistic state to drift. Scroll and
 * component state are preserved so the grid never jumps under the cursor and a
 * half-typed search survives the round trip.
 */
export function toggleSavedJob(slug: string, isSaved: boolean): void {
    const options = {
        preserveScroll: true,
        preserveState: true,
    };

    if (isSaved) {
        router.delete(unsave(slug).url, options);

        return;
    }

    router.post(save(slug).url, {}, options);
}
