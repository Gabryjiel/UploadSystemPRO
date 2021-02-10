<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'size', 'user_id'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    // public function answer() {
    //     return $this->belongsTo(Answer::class);
    // }
}
