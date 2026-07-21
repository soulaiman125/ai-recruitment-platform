<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidate_skill_progress', function (Blueprint $table) {
            $table->id();

            $table->foreignId('candidate_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('skill_name');

            $table->unsignedTinyInteger('level')->default(1);

            $table->unsignedInteger('xp')->default(0);

            $table->timestamp('last_used_at')->nullable();

            $table->timestamps();

            $table->unique(['candidate_id', 'skill_name']);
            $table->index('candidate_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_skill_progress');
    }
};