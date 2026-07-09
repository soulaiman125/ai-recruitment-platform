<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    /**
     * List every company with its owner and moderation-relevant counts.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        $companies = Company::query()
            ->with('owner:id,name,email')
            ->withCount(['recruiters', 'jobPostings'])
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/companies/index', [
            'companies' => $companies,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Flip a company's active flag. Deactivation is a moderation marker only:
     * nothing cascades off it yet.
     */
    public function toggleActive(Company $company): RedirectResponse
    {
        $company->update(['is_active' => ! $company->is_active]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $company->is_active
                ? __('Company activated.')
                : __('Company deactivated.'),
        ]);

        return back();
    }
}
