<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Models\User;

class ConversationService
{
    public function getOrCreate(User $user, ?int $conversationId = null): Conversation
    {
        if ($conversationId) {
            return $user->conversations()
                ->whereKey($conversationId)
                ->firstOrFail();
        }

        return $user->conversations()->create([
            'title' => 'New Chat',
        ]);
    }

    public function addUserMessage(Conversation $conversation, string $content): ConversationMessage
    {
        return $conversation->messages()->create([
            'role' => 'user',
            'content' => $content,
        ]);
    }

    public function addAssistantMessage(Conversation $conversation, string $content): ConversationMessage
    {
        return $conversation->messages()->create([
            'role' => 'assistant',
            'content' => $content,
        ]);
    }
}