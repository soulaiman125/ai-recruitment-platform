# AI Recruitment Platform

Laravel 13 · Inertia · React 19 · TypeScript · Tailwind v4 · MySQL · Gemini AI.

## Running the app

AI work (resume analysis and match scoring) runs on a **queued worker**, not
inside the HTTP request. `QUEUE_CONNECTION=database`, so a worker must be
running or those jobs will sit in the `jobs` table and never execute.

### One command (recommended)

```bash
composer run dev
```

This runs the Laravel `dev` command, which starts `php artisan serve`, the Vite
dev server, `php artisan pail` (logs), **and `php artisan queue:listen`**
together in one terminal.

### Separate terminals

If you prefer to run the processes yourself:

```bash
php artisan serve        # HTTP server
npm run dev              # Vite dev server
php artisan queue:work   # processes AnalyzeResumeJob and ScoreApplicationJob
```

`queue:work` holds the framework in memory and must be restarted after changing
queued job code; `queue:listen` (used by `composer run dev`) reloads each job
fresh and needs no restart.

> Without a running worker, uploading a resume and clicking **Analyze** will
> leave the row stuck on *pending* — the job is queued but nothing drains it.

## Rate limits

Per authenticated user, per hour: resume analysis **5**, resume uploads **10**,
job applications **20**. Exceeding one returns the candidate to the page with an
error toast rather than a raw 429.
