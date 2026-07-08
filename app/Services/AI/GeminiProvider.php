<?php

namespace App\Services\AI;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Throwable;

class GeminiProvider extends AbstractAiProvider
{
    private const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/';

    /** Analysing a long resume routinely takes Gemini well over 10 seconds. */
    private const TIMEOUT_SECONDS = 60;

    public function name(): string
    {
        return 'gemini';
    }

    protected function complete(string $prompt): string
    {
        $key = config('services.gemini.key');
        $model = config('services.gemini.model');

        if (! is_string($key) || $key === '') {
            throw new AiProviderException('GEMINI_API_KEY is not set.');
        }

        if (! is_string($model) || $model === '') {
            throw new AiProviderException('No Gemini model is configured.');
        }

        try {
            $response = Http::baseUrl(self::BASE_URL)
                ->withQueryParameters(['key' => $key])
                ->timeout(self::TIMEOUT_SECONDS)
                // Only a transport error or a 5xx is worth retrying; a bad key
                // fails the same way a second later. `throw: false` keeps a
                // spent retry budget returning the response we inspect below.
                ->retry(3, 1000, fn (Throwable $e): bool => $e instanceof ConnectionException
                    || ($e instanceof RequestException && $e->response->serverError()), throw: false)
                ->post("models/{$model}:generateContent", [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]],
                    ],
                    'generationConfig' => [
                        // The prompt demands JSON; this makes the API enforce it,
                        // which all but eliminates markdown fences in the output.
                        'responseMimeType' => 'application/json',
                        // Scoring should be reproducible, not creative.
                        'temperature' => 0.2,
                    ],
                ]);
        } catch (ConnectionException $e) {
            throw new AiProviderException('Could not reach Gemini: '.$e->getMessage(), previous: $e);
        }

        if ($response->failed()) {
            throw new AiProviderException("Gemini returned HTTP {$response->status()}: {$response->body()}");
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        // An empty candidate list is how Gemini reports a safety block.
        if (! is_string($text) || trim($text) === '') {
            throw new AiProviderException('Gemini returned an empty completion.');
        }

        return $text;
    }
}
