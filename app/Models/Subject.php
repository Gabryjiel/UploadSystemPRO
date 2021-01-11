<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'code'
    ];

    protected $hidden = [
        'pivot'
    ];

    public function users() {
        return $this->belongsToMany(User::class)->using(UserSubject::class);
    }

    public function assignments() {
        return $this->hasMany(Assignment::class);
    }
}
