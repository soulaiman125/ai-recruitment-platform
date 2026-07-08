<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * كيوجّه المستخدم للـ dashboard ديالو حسب الدور
     */
    public function index(): RedirectResponse
    {
        $user = Auth::user();

        return match (true) {
            $user->hasRole('admin')     => redirect()->route('admin.dashboard'),
            $user->hasRole('company')   => redirect()->route('company.dashboard'),
            $user->hasRole('recruiter') => redirect()->route('recruiter.dashboard'),
            $user->hasRole('candidate') => redirect()->route('candidate.dashboard'),
            default                     => redirect()->route('home'),
        };
    }
}