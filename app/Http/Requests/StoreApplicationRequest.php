<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApplicationRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var User|null $user */
        $user = $this->user();

        // A null profile id matches no row, so a candidate without a profile —
        // and anyone reaching for someone else's resume — fails validation.
        $candidateProfileId = $user?->candidateProfile?->id;

        return [
            'cover_letter' => ['nullable', 'string', 'max:5000'],
            'resume_id' => [
                'nullable',
                'integer',
                Rule::exists('resumes', 'id')
                    ->where('candidate_profile_id', $candidateProfileId),
            ],
        ];
    }
}
