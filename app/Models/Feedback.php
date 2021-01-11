<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'description'
    ];

    public function answer() {
        return $this->belongsTo(Answer::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
