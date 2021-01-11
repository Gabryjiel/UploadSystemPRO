<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Models\Subject;
use App\Models\Assignment;
use App\Models\File;
use App\Models\Answer;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'role', 'password','role',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function subjects() {
        return $this->belongsToMany(Subject::class, 'users_subjects')->using(UserSubject::class);
    }

    public function assignments() {
        return $this->hasManyThrough(Assignment::class, UserSubject::class, 'user_id', 'subject_id', 'id', 'subject_id');
    }

    public function files() {
        return $this->hasMany(File::class);
    }

    public function answers() {
        return $this->hasMany(Answer::class);
    }
}
