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
        'name', 'description', 'code', 'group_id', 'subgroup_id', 'semester_id'
    ];

    protected $hidden = [
        'pivot'
    ];

    public function users() {
        return $this->belongsToMany(User::class, 'users_subjects')->using(UserSubject::class);
    }

    public function assignments() {
        return $this->hasMany(Assignment::class);
    }

    public function group() {
        return $this->belongsTo(Group::class);
    }

    public function subgroup() {
        return $this->belongsTo(Subgroup::class);
    }

    public function semester() {
        return $this->belongsTo(Semester::class);
    }
}
