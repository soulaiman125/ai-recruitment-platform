<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidate_goals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('candidate_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('title');

            $table->text('description')->nullable();

            $table->enum('status', [
                'planned',
                'active',
                'completed',
                'paused'
            ])->default('planned');

            $table->unsignedTinyInteger('progress')->default(0);

            $table->date('target_date')->nullable();

            $table->timestamps();

            $table->index('candidate_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_goals');
    }
};