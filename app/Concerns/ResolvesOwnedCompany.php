<?php

namespace App\Concerns;

use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

trait ResolvesOwnedCompany
{
    /**
     * Resolve the company owned by the authenticated user.
     */
    protected function ownedCompany(): Company
    {
        /** @var User $user */
        $user = Auth::user();

        $company = $user->ownedCompany;

        abort_if($company === null, 403, __('You do not own a company.'));

        return $company;
    }
}
