<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Jobs\AnalyzeResumeJob;
use App\Models\CandidateProfile;
use App\Models\Resume;
use App\Models\ResumeAnalysis;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ResumeController extends Controller
{
    /**
     * List the resumes owned by the authenticated candidate.
     */
    public function index(): Response
    {
        $resumes = $this->candidateProfile()
            ->resumes()
            // The table renders the analysis badge, and the dialog renders the
            // whole analysis, so both come down with the list.
            ->with('analysis')
            // Same-second uploads tie on `created_at`, so the id keeps the
            // table from shuffling between requests.
            ->latest()
            ->latest('id')
            ->get();

        return Inertia::render('candidate/resumes/index', [
            'resumes' => $resumes,
        ]);
    }

    /**
     * Queue the configured AI provider to run over the given resume.
     */
    public function analyze(Resume $resume): RedirectResponse
    {
        $this->authorizeResume($resume);

        /** @var ResumeAnalysis|null $analysis */
        $analysis = $resume->analysis;

        // Defense in depth behind the rate limiter: a worker is already inside
        // this resume, so a second job would only race it and burn an extra
        // Gemini call. Read the row *before* creating one — a fresh row is born
        // `pending`, and guarding on that would block a first-ever analysis.
        if ($analysis?->status === 'processing') {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('Analysis already in progress.')]);

            return back();
        }

        // Park the row on `pending` up front, so the table shows the queued
        // state on the very next render — before a worker has picked it up.
        if ($analysis === null) {
            $resume->analysis()->create(['status' => 'pending']);
        } else {
            $analysis->update(['status' => 'pending']);
        }

        AnalyzeResumeJob::dispatch($resume->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Analysis started — this takes a few seconds.')]);

        return back();
    }

    /**
     * Store a newly uploaded resume for the authenticated candidate.
     */
    public function store(Request $request): RedirectResponse
    {
        $profile = $this->candidateProfile();

        $data = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf', 'max:5120'],
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        /** @var UploadedFile $file */
        $file = $request->file('file');

        // Count before the insert, otherwise the new row makes this false.
        $isFirst = ! $profile->resumes()->exists();

        // store() hashes the name, so two candidates uploading "cv.pdf" never
        // collide, and the stored name is never attacker controlled.
        $path = $file->store("resumes/{$profile->id}", 'public');

        $profile->resumes()->create([
            'title' => $data['title'] ?? null,
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            // The first resume a candidate uploads becomes their default one.
            'is_default' => $isFirst,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Resume uploaded.')]);

        return back();
    }

    /**
     * Promote the given resume to the candidate's default one.
     */
    public function setDefault(Resume $resume): RedirectResponse
    {
        $profile = $this->authorizeResume($resume);

        // Exactly one resume may carry the flag, so both writes go together.
        DB::transaction(function () use ($profile, $resume): void {
            $profile->resumes()
                ->whereKeyNot($resume->id)
                ->update(['is_default' => false]);

            $resume->update(['is_default' => true]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Default resume updated.')]);

        return back();
    }

    /**
     * Delete the given resume and its stored file.
     */
    public function destroy(Resume $resume): RedirectResponse
    {
        $profile = $this->authorizeResume($resume);

        DB::transaction(function () use ($profile, $resume): void {
            $resume->delete();

            // Applications keep pointing at nothing (`nullOnDelete`), so the
            // candidate always keeps a default as long as one resume remains.
            // Resumes uploaded in the same second tie on `created_at`, so fall
            // back to the id to always promote the genuinely newest one.
            if ($resume->is_default) {
                $profile->resumes()
                    ->latest()
                    ->latest('id')
                    ->first()
                    ?->update(['is_default' => true]);
            }
        });

        Storage::disk('public')->delete($resume->file_path);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Resume deleted.')]);

        return back();
    }

    /**
     * Ensure the resume belongs to the authenticated candidate.
     */
    private function authorizeResume(Resume $resume): CandidateProfile
    {
        $profile = $this->candidateProfile();

        abort_unless($resume->candidate_profile_id === $profile->id, 403);

        return $profile;
    }

    /**
     * Resolve the authenticated user's candidate profile.
     */
    private function candidateProfile(): CandidateProfile
    {
        /** @var User $user */
        $user = Auth::user();

        $profile = $user->candidateProfile;

        abort_if($profile === null, 403, __('You do not have a candidate profile.'));

        return $profile;
    }
}
