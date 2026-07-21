<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AiCoachController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('candidate/ai-coach/index');
    }
}