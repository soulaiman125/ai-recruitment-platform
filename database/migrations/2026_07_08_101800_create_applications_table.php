<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->constrained()->cascadeOnDelete();
            $table->foreignId('candidate_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('resume_id')->nullable()->constrained()->nullOnDelete();
            $table->text('cover_letter')->nullable();
            $table->string('status')->default('pending'); // pending / reviewed / interview / accepted / rejected
            $table->integer('match_score')->nullable();   // نتيجة الـ AI (0-100)
            $table->text('recruiter_notes')->nullable();
            $table->timestamp('applied_at')->nullable();
            $table->timestamps();

            // candidate ما يقدرش يطبّق مرتين على نفس الـ job
            $table->unique(['job_posting_id', 'candidate_profile_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};