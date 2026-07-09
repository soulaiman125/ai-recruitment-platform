<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Candidate\ApplicationController;
use App\Http\Controllers\Candidate\DashboardController as CandidateDashboard;
use App\Http\Controllers\Candidate\InterviewController as CandidateInterviewController;
use App\Http\Controllers\Candidate\JobBrowseController;
use App\Http\Controllers\Candidate\ResumeController;
use App\Http\Controllers\Company\CompanyProfileController;
use App\Http\Controllers\Company\DashboardController as CompanyDashboard;
use App\Http\Controllers\Company\RecruiterController as CompanyRecruiterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Recruiter\ApplicationController as RecruiterApplicationController;
use App\Http\Controllers\Recruiter\DashboardController as RecruiterDashboard;
use App\Http\Controllers\Recruiter\InterviewController as RecruiterInterviewController;
use App\Http\Controllers\Recruiter\JobPostingController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// كيوجّه المستخدم للـ dashboard ديالو حسب الدور
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminDashboard::class, 'index'])->name('dashboard');
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

        Route::get('jobs', [JobBrowseController::class, 'index'])->name('jobs.index');
        Route::get('jobs/{job}', [JobBrowseController::class, 'show'])->name('jobs.show');
        Route::post('jobs/{job}/apply', [ApplicationController::class, 'store'])->name('jobs.apply');

        Route::get('applications', [ApplicationController::class, 'index'])->name('applications.index');

        Route::get('interviews', [CandidateInterviewController::class, 'index'])->name('interviews.index');

        Route::get('resumes', [ResumeController::class, 'index'])->name('resumes.index');
        Route::post('resumes', [ResumeController::class, 'store'])->name('resumes.store');
        Route::post('resumes/{resume}/analyze', [ResumeController::class, 'analyze'])->name('resumes.analyze');
        Route::patch('resumes/{resume}/default', [ResumeController::class, 'setDefault'])->name('resumes.setDefault');
        Route::delete('resumes/{resume}', [ResumeController::class, 'destroy'])->name('resumes.destroy');
    });
});

require __DIR__.'/settings.php';