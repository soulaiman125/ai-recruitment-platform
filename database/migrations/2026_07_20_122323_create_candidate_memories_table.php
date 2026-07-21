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
        Schema::create('candidate_memories', function (Blueprint $table) {
            $table->id();

            $table->foreignId('candidate_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('category');

            $table->string('title');

            $table->text('content');

            $table->unsignedTinyInteger('importance')->default(5);

            $table->string('source')->default('system');

            $table->json('metadata')->nullable();

            // Future AI Embeddings
            $table->longText('embedding')->nullable();

            $table->timestamps();

            $table->index('candidate_id');
            $table->index('category');
            $table->index('importance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_memories');
    }
};