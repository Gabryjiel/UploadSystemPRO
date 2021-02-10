<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Answer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'description' , 'assignment_id'
    ];

    protected $hidden = [
        'laravel_through_key'
    ];

    public function assignment(): BelongsTo {
        return $this->belongsTo(Assignment::class);
    }

    public function reports(): BelongsToMany {
        return $this->belongsToMany(File::class, 'files_answers', 'file_id', 'answer_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function feedback(): HasOne {
        return $this->hasOne(Feedback::class);
    }
}
