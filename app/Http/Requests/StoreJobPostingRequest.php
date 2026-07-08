<?php

namespace App\Http\Requests;

use App\Concerns\JobPostingValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreJobPostingRequest extends FormRequest
{
    use JobPostingValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->jobPostingRules();
    }
}
