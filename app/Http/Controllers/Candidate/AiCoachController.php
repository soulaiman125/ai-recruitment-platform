<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Services\AiChatService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiCoachController extends Controller
{
    public function __construct(
        protected AiChatService $chatService
    ) {}

    public function index(): Response
    {
        return Inertia::render('candidate/ai-coach/index');
    }

    public function ask(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $answer = $this->chatService->ask($validated['message']);

        return response()->json([
            'answer' => $answer,
        ]);
    }
}