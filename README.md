# AI Recruitment Platform

**Hire smarter with AI — resume analysis and candidate ranking for modern recruiting.**

AI Recruitment Platform is an AI-assisted recruitment application that connects candidates and recruiters. Candidates upload their CVs and apply to jobs; the platform extracts the resume text and uses an AI model to analyze and score it against the job description. Recruiters then see applicants ranked by match score, along with structured AI feedback, so they can focus their attention on the most relevant candidates. The AI output is assistive — it supports human decisions, it does not replace them.

## Features

### Candidate
- Browse and filter job postings
- Save jobs for later
- Apply to jobs
- AI resume analysis with a match score and structured feedback
- Track applications and scheduled interviews
- Manage a candidate profile

### Recruiter
- Post and publish job openings
- Review applications ranked by AI match score
- Schedule interviews with candidates

### Company
- Invite and manage recruiters
- Manage the company profile
- View hiring stats

### Admin
- Manage users, companies, and job postings
- View platform-wide statistics

### Platform-wide
- In-app notifications
- Email verification and password reset
- Light and dark mode

## Tech stack

| Layer | Technology |
| --- | --- |
| Backend | Laravel 13 (PHP 8.3) |
| Frontend | Inertia v3 + React 19 + TypeScript |
| UI | shadcn/ui + Tailwind CSS v4 |
| Database | MySQL |
| Auth & roles | Laravel Fortify + Spatie Laravel-Permission |
| AI | Google Gemini (pluggable provider) |
| Queue | Database queue |
| Email | Brevo HTTP API |
| Build tooling | Vite |

## How the AI works

1. **Text extraction** — when a candidate submits a resume (PDF), the text is extracted from the document.
2. **AI analysis** — the extracted text is sent to the configured AI provider (Gemini by default), which returns a structured JSON result (score, strengths, gaps, and feedback).
3. **Storage** — the structured analysis is persisted so recruiters can review it without re-running the model.
4. **Match scoring** — the match score compares the resume text against the target job description, letting recruiters rank applicants by relevance.

The provider is abstracted behind a common interface, so you can switch between Gemini and OpenAI by setting the `AI_PROVIDER` environment variable — no code changes required.

## Requirements

- PHP 8.3+
- Composer
- Node.js (with npm)
- MySQL

## Installation

```bash
# 1. Clone the repository
git clone <your-repo-url> ai_recrute
cd ai_recrute

# 2. Install PHP dependencies
composer install

# 3. Install JavaScript dependencies
npm install

# 4. Create your environment file
cp .env.example .env

# 5. Generate the application key
php artisan key:generate

# 6. Configure .env:
#    - set DB_* to your MySQL database
#    - set GEMINI_API_KEY (and AI_PROVIDER)
#    - set MAIL_* for email delivery

# 7. Run migrations and seed test data
php artisan migrate --seed

# 8. Link the storage directory (for uploaded resumes)
php artisan storage:link
```

## Running locally

The application needs **three processes** running together:

| Process | Command | Purpose |
| --- | --- | --- |
| Web server | `php artisan serve` | Serves the Laravel/Inertia app |
| Vite dev server | `npm run dev` | Compiles and hot-reloads the frontend |
| Queue worker | `php artisan queue:work` | Processes AI resume analysis and outgoing emails |

> **The queue worker is required.** AI analysis and emails are dispatched as queued jobs (`QUEUE_CONNECTION=database`). Without a running worker, those jobs sit in the `jobs` table and never execute — resumes won't get analyzed and verification/invitation emails won't be sent.

### One command (recommended)

The included `dev` script runs the web server, queue worker, log viewer, and Vite together:

```bash
composer run dev
```

## Environment variables

| Variable | Description |
| --- | --- |
| `APP_KEY` | Application encryption key. Generate with `php artisan key:generate`. |
| `DB_CONNECTION` | Database driver — `mysql` for this project. |
| `DB_HOST` / `DB_PORT` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | MySQL connection details. |
| `AI_PROVIDER` | Which AI provider to use: `gemini` (default) or `openai`. |
| `GEMINI_API_KEY` | API key for Google Gemini (required when `AI_PROVIDER=gemini`). |
| `OPENAI_API_KEY` | API key for OpenAI (required when `AI_PROVIDER=openai`). |
| `MAIL_MAILER` | Mail transport — `log` for local, `brevo` for real delivery. |
| `BREVO_API_KEY` | Brevo v3 API key used for HTTPS email delivery. |
| `MAIL_FROM_ADDRESS` / `MAIL_FROM_NAME` | Default sender identity for outgoing mail. |
| `QUEUE_CONNECTION` | Queue backend — `database`. Requires a running queue worker. |

> Never commit real secrets. `.env` is git-ignored; only `.env.example` (with placeholders) is tracked.

## Seeded test accounts

Running `php artisan migrate --seed` creates the following accounts. All use the password **`password`**.

| Role | Email | Name |
| --- | --- | --- |
| Admin | `admin@airecrute.com` | Admin |
| Company | `company@airecrute.com` | Acme Company |
| Recruiter | `recruiter@airecrute.com` | Sara Recruiter |
| Candidate | `candidate@airecrute.com` | Ahmed Candidate |

> These accounts are for **local development only**. Never seed them in a production environment.

## Roadmap / not yet implemented

The following are known gaps to address before a production launch:

- Multi-tenancy hardening (stronger data isolation between companies)
- Billing and subscriptions
- Comprehensive automated test coverage
- Internationalization (i18n)
- S3 (or other cloud) storage for uploaded files
- Production deployment configuration
- Domain-authenticated email (SPF/DKIM/DMARC)

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).
