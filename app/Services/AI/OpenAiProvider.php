<?php

namespace App\Services\AI;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * The drop-in alternative to {@see GeminiProvider}. Same prompts, same parsing —
 * only the transport differs. Flip AI_PROVIDER=openai in `.env` to use it.
 */
class OpenAiProvider extends AbstractAiProvider
{
    private const ENDPOINT = 'https://api.openai.com/v1/chat/completions';

    private const TIMEOUT_SECONDS = 60;

    public function name(): string
    {
        return 'openai';
    }

    protected function complete(string $prompt): string
    {
        $key = config('services.openai.key');
        $model = config('services.openai.model');

        if (! is_string($key) || $key === '') {
            throw new AiProviderException('OPENAI_API_KEY is not set.');
        }

        if (! is_string($model) || $model === '') {
            throw new AiProviderException('No OpenAI model is configured.');
        }

        try {
            $response = Http::withToken($key)
                ->timeout(self::TIMEOUT_SECONDS)
                // Mirrors GeminiProvider: retry transport errors and 5xx only,
                // and never let a spent budget throw past the response check.
                ->retry(3, 1000, fn (Throwable $e): bool => $e instanceof ConnectionException
                    || ($e instanceof RequestException && $e->response->serverError()), throw: false)
                ->post(self::ENDPOINT, [
                    'model' => $model,
                    'temperature' => 0.2,
                    // The counterpart to Gemini's responseMimeType.
                    'response_format' => ['type' => 'json_object'],
                    'messages' => [
                        [
                            'role' => 'system',
                            // json_object mode requires the word "JSON" in the
                            // conversation, which the prompt itself satisfies.
                            'content' => 'You are an expert technical recruiter. Respond with a single raw JSON object and nothing else.',
                        ],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                ]);
        } catch (ConnectionException $e) {
            throw new AiProviderException('Could not reach OpenAI: '.$e->getMessage(), previous: $e);
        }

        if ($response->failed()) {
            throw new AiProviderException("OpenAI returned HTTP {$response->status()}: {$response->body()}");
        }

        $text = $response->json('choices.0.message.content');

        // A refusal or a length stop can leave the content null.
        if (! is_string($text) || trim($text) === '') {
            throw new AiProviderException('OpenAI returned an empty completion.');
        }

        return $text;
    }
}
