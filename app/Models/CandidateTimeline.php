<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateTimeline extends Model
{
    protected $fillable = [
        'candidate_id',
        'event',
        'title',
        'description',
        'icon',
        'color',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }
}