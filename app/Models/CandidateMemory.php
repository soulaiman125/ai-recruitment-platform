<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateMemory extends Model
{
    protected $fillable = [
        'candidate_id',
        'category',
        'title',
        'content',
        'importance',
        'source',
        'metadata',
        'embedding',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }
}