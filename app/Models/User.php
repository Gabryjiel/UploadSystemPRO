<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

class User extends Authenticatable
{
    use HasFactory, Notifiable;
    use HasRelationships;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'role', 'password'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'pivot'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array $casts
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'users_subjects');
    }

    public function assignments()
    {
        return $this->hasManyDeepFromRelations($this->subjects(), (new Subject())->assignments());
    }

    public function instructions()
    {
        return $this->hasManyDeepFromRelations($this->assignments(), (new Assignment())->instructions());
    }

    public function reports()
    {
        return $this->hasManyDeepFromRelations($this->answers(), (new Answer())->reports());
    }

    public function files()
    {
        if ($this->role == 0) {
            return $this->hasMany(File::class)->orWhereRaw("true");
        }
        return $this->hasMany(File::class);
    }

    public function answers(): HasMany|HasManyDeep
    {
        if (!$this->role == 2) {
            return $this->hasManyDeepFromRelations($this->assignments(), (new Assignment())->answers());
        } else {
            return $this->hasMany(Answer::class);
        }
    }

    public function feedbacks(): HasManyDeep
    {
        return $this->hasManyDeepFromRelations($this->answers(), (new Answer)->feedback());
    }
}
