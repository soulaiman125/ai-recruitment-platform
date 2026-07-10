<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // A rate-limited Inertia visit gets a toast and stays where it was,
        // rather than a bare 429 error page. `api/*` and JSON clients fall
        // through to the framework's untouched 429 response.
        $exceptions->render(function (ThrottleRequestsException $e, Request $request): ?Response {
            if ($request->is('api/*') || $request->expectsJson() || ! $request->header('X-Inertia')) {
                return null;
            }

            $message = match ($request->route()?->getName()) {
                'candidate.resumes.analyze' => __("You've reached the analysis limit. Try again in an hour."),
                'candidate.resumes.store' => __("You've reached the upload limit. Try again in an hour."),
                'candidate.jobs.apply' => __("You've reached the application limit. Try again in an hour."),
                default => __('Too many requests. Please slow down and try again shortly.'),
            };

            Inertia::flash('toast', ['type' => 'error', 'message' => $message]);

            // 303 so the browser re-issues the redirect as a GET; a POST that
            // was throttled must not be replayed against the previous page.
            return back(303);
        });
    })->create();
