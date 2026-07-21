<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candidate_timelines', function (Blueprint $table) {
            $table->id();

            $table->foreignId('candidate_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('event');

            $table->string('title');

            $table->text('description')->nullable();

            $table->string('icon')->default('history');

            $table->string('color')->default('blue');

            $table->json('metadata')->nullable();

            $table->timestamps();

            $table->index('candidate_id');
            $table->index('event');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_timelines');
    }
};