<?php

namespace App\Http\Controllers\Company;

use App\Concerns\ResolvesOwnedCompany;
use App\Http\Controllers\Controller;
use App\Mail\RecruiterInvitation;
use App\Models\RecruiterProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class RecruiterController extends Controller
{
    use ResolvesOwnedCompany;

    /**
     * List the recruiters belonging to the authenticated owner's company.
     */
    public function index(): Response
    {
        $recruiters = $this->ownedCompany()
            ->recruiters()
            ->with('user:id,name,email')
            ->withCount('jobPostings')
            ->latest()
            ->get();

        return Inertia::render('company/recruiters/index', [
            'recruiters' => $recruiters,
        ]);
    }

    /**
     * Invite a new recruiter into the authenticated owner's company.
     */
    public function store(Request $request): RedirectResponse
    {
        $company = $this->ownedCompany();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'job_title' => ['nullable', 'string', 'max:255'],
        ]);

        // The user + profile are created together so a failure never leaves a
        // recruiter account without a company profile.
        $user = DB::transaction(function () use ($company, $data): User {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                // A random password is set so the account is never login-ready
                // until the recruiter chooses their own via the reset link in
                // their invitation. The cast on User hashes this automatically.
                'password' => Str::random(16),
            ]);

            $user->assignRole('recruiter');

            $company->recruiters()->create([
                'user_id' => $user->id,
                'job_title' => $data['job_title'] ?? null,
            ]);

            return $user;
        });

        // The invitation goes out only after the transaction commits, and a
        // mail failure must never undo the recruiter that was just created.
        $emailSent = $this->sendInvitation($user, $company->name);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $emailSent
                ? __('Recruiter invited — an email was sent so they can set their password.')
                : __('Recruiter invited, but the invitation email could not be sent. They can use "Forgot password" to set their password.'),
        ]);

        return back();
    }

    /**
     * Send the invitation email carrying a password-reset link so the recruiter
     * can set their own password. Returns whether the mail was dispatched.
     */
    private function sendInvitation(User $user, string $companyName): bool
    {
        try {
            $token = Password::broker()->createToken($user);

            Mail::to($user->email)->send(new RecruiterInvitation(
                recruiterName: $user->name,
                companyName: $companyName,
                resetUrl: route('password.reset', ['token' => $token, 'email' => $user->email]),
                loginUrl: route('login'),
            ));

            return true;
        } catch (Throwable $e) {
            Log::error('Failed to send recruiter invitation email.', [
                'user_id' => $user->id,
                'exception' => $e,
            ]);

            return false;
        }
    }

    /**
     * Remove a recruiter from the authenticated owner's company.
     */
    public function destroy(RecruiterProfile $recruiter): RedirectResponse
    {
        // A company owner may only manage recruiters of their own company.
        abort_unless($recruiter->company_id === $this->ownedCompany()->id, 403);

        // Delete the profile only and revoke the recruiter role rather than
        // deleting the user account: the account may hold other roles or data,
        // and hard-deleting it would cascade onto their job postings. Revoking
        // the role removes their recruiter access while keeping the login safe.
        DB::transaction(function () use ($recruiter): void {
            /** @var User|null $user */
            $user = $recruiter->user;

            $user?->removeRole('recruiter');

            $recruiter->delete();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Recruiter removed.')]);

        return back();
    }
}
