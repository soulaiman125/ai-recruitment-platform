<x-mail::message>
# Hello {{ $recruiterName }},

You've been invited to join **{{ $companyName }}** on {{ config('app.name') }} as a recruiter.

To get started, set your own password using the button below:

<x-mail::button :url="$resetUrl">
Set your password
</x-mail::button>

Once your password is set, you can sign in any time here:

<x-mail::button :url="$loginUrl" color="success">
Go to login
</x-mail::button>

If you weren't expecting this invitation, you can safely ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
