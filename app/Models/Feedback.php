<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'user_id', 'name', 'description'
    ];

    protected $hidden = [
        'laravel_through_key'
    ];

    public function answer(): BelongsTo {
        return $this->belongsTo(Answer::class);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
