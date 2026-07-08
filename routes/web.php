<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Candidate\DashboardController as CandidateDashboard;
use App\Http\Controllers\Candidate\JobBrowseController;
use App\Http\Controllers\Company\DashboardController as CompanyDashboard;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Recruiter\DashboardController as RecruiterDashboard;
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
    });

    // Recruiter
    Route::middleware('role:recruiter')->prefix('recruiter')->name('recruiter.')->group(function () {
        Route::get('dashboard', [RecruiterDashboard::class, 'index'])->name('dashboard');

        Route::patch('jobs/{job}/publish', [JobPostingController::class, 'publish'])->name('jobs.publish');
        Route::resource('jobs', JobPostingController::class)->except(['show']);
    });

    // Candidate
    Route::middleware('role:candidate')->prefix('candidate')->name('candidate.')->group(function () {
        Route::get('dashboard', [CandidateDashboard::class, 'index'])->name('dashboard');

        Route::get('jobs', [JobBrowseController::class, 'index'])->name('jobs.index');
        Route::get('jobs/{job}', [JobBrowseController::class, 'show'])->name('jobs.show');
    });
});

require __DIR__.'/settings.php';