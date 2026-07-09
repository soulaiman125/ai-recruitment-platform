<?php

namespace App\Http\Controllers\Company;

use App\Concerns\ResolvesOwnedCompany;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyProfileController extends Controller
{
    use ResolvesOwnedCompany;

    /**
     * Show the form for editing the authenticated owner's company.
     */
    public function edit(): Response
    {
        return Inertia::render('company/profile/edit', [
            'company' => $this->ownedCompany(),
        ]);
    }

    /**
     * Update the authenticated owner's company profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $company = $this->ownedCompany();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'industry' => ['nullable', 'string', 'max:255'],
            'size' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        // The slug is the company's public identity, so it stays unchanged.
        $company->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Company profile updated.')]);

        return back();
    }
}
