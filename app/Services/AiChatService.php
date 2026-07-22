<?php

namespace App\Services;

use App\Services\AI\AiProvider;

class AiChatService
{
    public function __construct(
        protected AiProvider $provider
    ) {}

    public function ask(string $message): string
    {
        $prompt = <<<PROMPT
You are an expert AI Career Coach.

Your job is to help candidates with:

- Career advice
- Resume improvements
- Interview preparation
- Job search
- Learning roadmap
- Technical skills

Answer clearly and professionally.

User:
{$message}
PROMPT;

        return $this->provider->chat($prompt);
    }
}