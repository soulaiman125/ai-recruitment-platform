<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('scheduled_by')->constrained('users')->cascadeOnDelete();
            $table->string('type')->default('online');    // online / onsite / phone
            $table->dateTime('scheduled_at');
            $table->integer('duration_minutes')->default(30);
            $table->string('location')->nullable();       // عنوان ولا رابط الميتينغ
            $table->string('meeting_link')->nullable();
            $table->text('notes')->nullable();
            $table->text('feedback')->nullable();
            $table->string('status')->default('scheduled'); // scheduled / completed / cancelled / no_show
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};