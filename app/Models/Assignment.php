<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assignment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'deadline', 'subject_id'
    ];

    protected $hidden = [
        'laravel_through_key'
    ];

    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class, 'users_assignments', 'user_id', 'assignment_id')->latest();
    }

    public function answers(): HasMany {
        return $this->hasMany(Answer::class);
    }

    public function instructions(): BelongsToMany {
        return $this->belongsToMany(File::class, 'files_assignments', 'file_id', 'assignment_id');
    }

    public function subject(): BelongsTo {
        return $this->belongsTo(Subject::class);
    }
}
