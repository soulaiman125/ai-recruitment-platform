<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resume_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained()->cascadeOnDelete();
            $table->json('extracted_skills')->nullable();      // skills اللي لقا الـ AI
            $table->json('extracted_experience')->nullable();  // الخبرات
            $table->json('extracted_education')->nullable();   // التعليم
            $table->integer('overall_score')->nullable();      // نقطة عامة (0-100)
            $table->text('summary')->nullable();               // ملخص ديال الـ AI
            $table->json('strengths')->nullable();             // نقاط القوة
            $table->json('weaknesses')->nullable();            // نقاط الضعف
            $table->json('recommendations')->nullable();       // اقتراحات تحسين
            $table->string('ai_provider')->nullable();         // openai / gemini / claude
            $table->string('status')->default('pending');      // pending / processing / completed / failed
            $table->timestamp('analyzed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resume_analyses');
    }
};