<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Services\AiChatService;
use App\Services\ConversationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiCoachController extends Controller
{
    public function __construct(
        protected AiChatService $chatService,
        protected ConversationService $conversationService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('candidate/ai-coach/index');
    }

    public function ask(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'conversation_id' => ['nullable', 'integer'],
        ]);

        $conversation = $this->conversationService->getOrCreate(
            $request->user(),
            $validated['conversation_id'] ?? null
        );

        $this->conversationService->addUserMessage(
            $conversation,
            $validated['message']
        );

        $answer = $this->chatService->ask($validated['message']);

        $this->conversationService->addAssistantMessage(
            $conversation,
            $answer
        );

        return response()->json([
            'conversation_id' => $conversation->id,
            'answer' => $answer,
        ]);
    }
}