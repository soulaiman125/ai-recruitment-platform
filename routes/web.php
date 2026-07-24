<?php

use App\Http\Controllers\Admin\CompanyController as AdminCompanyController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\JobPostingController as AdminJobPostingController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Candidate\AiCoachController;
use App\Http\Controllers\Candidate\ApplicationController;
use App\Http\Controllers\Candidate\DashboardController as CandidateDashboard;
use App\Http\Controllers\Candidate\InterviewController as CandidateInterviewController;
use App\Http\Controllers\Candidate\JobBrowseController;
use App\Http\Controllers\Candidate\ProfileController as CandidateProfileController;
use App\Http\Controllers\Candidate\ResumeController;
use App\Http\Controllers\Candidate\SavedJobController;
use App\Http\Controllers\Company\CompanyProfileController;
use App\Http\Controllers\Company\DashboardController as CompanyDashboard;
use App\Http\Controllers\Company\RecruiterController as CompanyRecruiterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Recruiter\ApplicationController as RecruiterApplicationController;
use App\Http\Controllers\Recruiter\DashboardController as RecruiterDashboard;
use App\Http\Controllers\Recruiter\InterviewController as RecruiterInterviewController;
use App\Http\Controllers\Recruiter\JobPostingController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/terms', 'legal/terms')->name('terms');
Route::inertia('/privacy', 'legal/privacy')->name('privacy');

// كيوجّه المستخدم للـ dashboard ديالو حسب الدور
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Notifications — shared by every role, so never inside a role group.
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::patch('notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::delete('notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Admin
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminDashboard::class, 'index'])->name('dashboard');

        Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
        Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

        Route::get('companies', [AdminCompanyController::class, 'index'])->name('companies.index');
        Route::patch('companies/{company}/toggle', [AdminCompanyController::class, 'toggleActive'])->name('companies.toggleActive');

        Route::get('jobs', [AdminJobPostingController::class, 'index'])->name('jobs.index');
        Route::delete('jobs/{job}', [AdminJobPostingController::class, 'destroy'])->name('jobs.destroy');
    });

    // Company
    Route::middleware('role:company')->prefix('company')->name('company.')->group(function () {
        Route::get('dashboard', [CompanyDashboard::class, 'index'])->name('dashboard');

        Route::get('profile', [CompanyProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('profile', [CompanyProfileController::class, 'update'])->name('profile.update');

        Route::get('recruiters', [CompanyRecruiterController::class, 'index'])->name('recruiters.index');
        Route::post('recruiters', [CompanyRecruiterController::class, 'store'])->name('recruiters.store');
        Route::delete('recruiters/{recruiter}', [CompanyRecruiterController::class, 'destroy'])->name('recruiters.destroy');
    });

    // Recruiter
    Route::middleware('role:recruiter')->prefix('recruiter')->name('recruiter.')->group(function () {
        Route::get('dashboard', [RecruiterDashboard::class, 'index'])->name('dashboard');

        Route::patch('jobs/{job}/publish', [JobPostingController::class, 'publish'])->name('jobs.publish');

        Route::get('jobs/{job}/applications', [RecruiterApplicationController::class, 'index'])->name('jobs.applications.index');
        Route::get('jobs/{job}/applications/{application}/resume', [RecruiterApplicationController::class, 'resume'])->name('jobs.applications.resume');
        Route::patch('jobs/{job}/applications/{application}', [RecruiterApplicationController::class, 'updateStatus'])->name('jobs.applications.updateStatus');

        Route::post('jobs/{job}/applications/{application}/interviews', [RecruiterInterviewController::class, 'store'])->name('jobs.applications.interviews.store');
        Route::patch('jobs/{job}/applications/{application}/interviews/{interview}', [RecruiterInterviewController::class, 'update'])->name('jobs.applications.interviews.update');
        Route::delete('jobs/{job}/applications/{application}/interviews/{interview}', [RecruiterInterviewController::class, 'destroy'])->name('jobs.applications.interviews.destroy');

        Route::resource('jobs', JobPostingController::class)->except(['show']);
    });

    // Candidate
    Route::middleware('role:candidate')->prefix('candidate')->name('candidate.')->group(function () {
        Route::get('dashboard', [CandidateDashboard::class, 'index'])->name('dashboard');

        Route::get('profile', [CandidateProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('profile', [CandidateProfileController::class, 'update'])->name('profile.update');

        Route::get('jobs', [JobBrowseController::class, 'index'])->name('jobs.index');
        Route::get('jobs/{job}', [JobBrowseController::class, 'show'])->name('jobs.show');
        Route::post('jobs/{job}/apply', [ApplicationController::class, 'store'])->middleware('throttle:applications')->name('jobs.apply');
        Route::post('jobs/{job}/save', [SavedJobController::class, 'store'])->name('jobs.save');
        Route::delete('jobs/{job}/save', [SavedJobController::class, 'destroy'])->name('jobs.unsave');

        Route::get('saved-jobs', [SavedJobController::class, 'index'])->name('saved-jobs.index');

        Route::get('applications', [ApplicationController::class, 'index'])->name('applications.index');

        Route::get('interviews', [CandidateInterviewController::class, 'index'])->name('interviews.index');

        Route::get('resumes', [ResumeController::class, 'index'])->name('resumes.index');
        Route::post('resumes', [ResumeController::class, 'store'])->middleware('throttle:uploads')->name('resumes.store');
        Route::post('resumes/{resume}/analyze', [ResumeController::class, 'analyze'])->middleware('throttle:ai-analysis')->name('resumes.analyze');
        Route::patch('resumes/{resume}/default', [ResumeController::class, 'setDefault'])->name('resumes.setDefault');
        Route::delete('resumes/{resume}', [ResumeController::class, 'destroy'])->name('resumes.destroy');

        // AI Coach (Sprint 1: page bghir logic, POST /ask ghadi tzad f Sprint 2)
        Route::get('ai-coach', [AiCoachController::class, 'index'])->name('ai-coach.index');
        Route::post('ai-coach/ask', [AiCoachController::class, 'ask'])->name('ai-coach.ask');
        Route::get('ai-coach/conversations', [AiCoachController::class, 'conversations'])
    ->name('ai-coach.conversations');

        Route::get('ai-coach/conversations/{conversation}', [AiCoachController::class, 'showConversation'])
            ->name('ai-coach.conversations.show');

        Route::post('ai-coach/conversations', [AiCoachController::class, 'createConversation'])
            ->name('ai-coach.conversations.create');
    });
});

require __DIR__.'/settings.php';