<?php
namespace App\Models;

use App\Models\Assignment;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserSubject extends Pivot {
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users_subjects';

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    
    public function assignments()
    {
        return $this->hasManyThrough(Assignment::class, Subject::class);
    }
   
}