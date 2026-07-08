<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resumes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_profile_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable();          // "CV Développeur 2026"
            $table->string('file_path');                  // بلاصة الملف فـ storage
            $table->string('original_name');              // سمية الملف الأصلية
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable(); // بالبايت
            $table->text('parsed_text')->nullable();      // النص المستخرج من الـ PDF
            $table->boolean('is_default')->default(false);// الـ CV الرئيسي
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resumes');
    }
};