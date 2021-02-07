<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'decription' , 'assignment_id'
    ];

    public function assignment() {
        return $this->belongsTo(Assignment::class);
    }

    public function file() {
        return $this->belongsTo(File::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function feedback() {
        return $this->hasOne(Feedback::class);
    }
}
