<?php

namespace App\Providers;

use App\Services\AI\AiProvider;
use App\Services\AI\GeminiProvider;
use App\Services\AI\OpenAiProvider;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use InvalidArgumentException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->registerAiProvider();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureRateLimiting();
    }

    /**
     * Cap the routes that cost money or storage.
     *
     * Every one of these sits behind `auth`, so the user — and their id — is
     * always present by the time the limiter runs.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('ai-analysis', fn (Request $request) => Limit::perHour(5)
            ->by((string) $request->user()->id));

        RateLimiter::for('uploads', fn (Request $request) => Limit::perHour(10)
            ->by((string) $request->user()->id));

        RateLimiter::for('applications', fn (Request $request) => Limit::perHour(20)
            ->by((string) $request->user()->id));
    }

    /**
     * Resolve the AI vendor named by `AI_PROVIDER`. Everything downstream only
     * ever type-hints the interface, so swapping vendors is a one-line change.
     */
    protected function registerAiProvider(): void
    {
        $this->app->singleton(AiProvider::class, function (): AiProvider {
            $provider = config('services.ai_provider');

            return match ($provider) {
                'gemini' => new GeminiProvider,
                'openai' => new OpenAiProvider,
                // A typo in `.env` must fail loudly at boot, never silently
                // fall back to a vendor the operator did not ask for.
                default => throw new InvalidArgumentException(
                    sprintf('Unsupported AI_PROVIDER [%s]. Expected "gemini" or "openai".', is_string($provider) ? $provider : gettype($provider))
                ),
            };
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
