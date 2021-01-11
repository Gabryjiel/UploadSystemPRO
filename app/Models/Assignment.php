<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'decription', 'deadline', 'subject_id'
    ];

    protected $hidden = [
        'laravel_through_key'
    ];

    public function users() {
        return $this->belongsToMany(User::class, 'users_assignments', 'user_id', 'assignment_id')->latest();
    }

    public function answers() {
        return $this->hasMany(Answer::class);
    }

    public function files() {
        return $this->hasManyThrough(File::class, Answer::class);
    }
}
