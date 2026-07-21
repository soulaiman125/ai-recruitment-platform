<?php

namespace App\Services\AI;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Throwable;

class OpenRouterProvider extends AbstractAiProvider
{
    private const BASE_URL = 'https://openrouter.ai/api/v1/';

    private const TIMEOUT_SECONDS = 60;

    public function name(): string
    {
        return 'openrouter';
    }

    protected function complete(string $prompt): string
    {
        $key = config('services.openrouter.key');
        $model = config('services.openrouter.model');

        if (!is_string($key) || $key === '') {
            throw new AiProviderException('OPENROUTER_API_KEY is not set.');
        }

        if (!is_string($model) || $model === '') {
            throw new AiProviderException('No OpenRouter model configured.');
        }

        try {
            $response = Http::baseUrl(self::BASE_URL)
                ->withToken($key)
                ->timeout(self::TIMEOUT_SECONDS)
                ->retry(
                    3,
                    1000,
                    fn(Throwable $e) =>
                        $e instanceof ConnectionException ||
                        ($e instanceof RequestException && $e->response->serverError()),
                    throw: false
                )
                ->withHeaders([
                    'HTTP-Referer' => config('app.url'),
                    'X-Title' => config('app.name'),
                ])
                ->post('chat/completions', [
                    'model' => $model,
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'temperature' => 0.2,
                ]);
        } catch (ConnectionException $e) {
            throw new AiProviderException(
                'Could not reach OpenRouter: '.$e->getMessage(),
                previous: $e
            );
        }

        if ($response->failed()) {
            throw new AiProviderException(
                "OpenRouter returned HTTP {$response->status()}: ".$response->body()
            );
        }

        $text = $response->json('choices.0.message.content');

        if (!is_string($text) || trim($text) === '') {
            throw new AiProviderException('OpenRouter returned an empty completion.');
        }

        return $text;
    }
}