<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateGoal extends Model
{
    protected $fillable = [
        'candidate_id',
        'title',
        'description',
        'status',
        'progress',
        'target_date',
    ];

    protected $casts = [
        'target_date' => 'date',
    ];

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }
}