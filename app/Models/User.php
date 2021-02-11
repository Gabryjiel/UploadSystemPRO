<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property int $role
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Answer[] $answers
 * @property-read int|null $answers_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\File[] $files
 * @property-read int|null $files_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Subject[] $subjects
 * @property-read int|null $subjects_count
 * @method static Builder|User newModelQuery()
 * @method static Builder|User newQuery()
 * @method static Builder|User query()
 * @method static Builder|User whereCreatedAt($value)
 * @method static Builder|User whereEmail($value)
 * @method static Builder|User whereId($value)
 * @method static Builder|User whereName($value)
 * @method static Builder|User wherePassword($value)
 * @method static Builder|User whereRememberToken($value)
 * @method static Builder|User whereRole($value)
 * @method static Builder|User whereUpdatedAt($value)
 * @mixin \Eloquent
 * @mixin IdeHelperUser
 */
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

    public function subjects(): Subject|Builder|belongsToMany {
        if ($this->role == 0) {
            return Subject::query();
        }
        return $this->belongsToMany(Subject::class);
    }

    public function assignments(): Assignment|Builder|HasManyDeep {
        if ($this->role == 0) {
            return Assignment::query();
        }
        return $this->hasManyDeepFromRelations($this->subjects(), (new Subject())->assignments());
    }

    public function files(): File|Builder|HasMany {
        if ($this->role == 0) {
            return File::query();
        }
        return $this->hasMany(File::class);
    }

    public function answers(): Answer|Builder|HasMany|HasManyDeep {
        if ($this->role == 0) {
            return Answer::query();
        } elseif ($this->role == 1) {
            return $this->hasManyDeepFromRelations($this->assignments(), (new Assignment())->answers());
        } else {
            return $this->hasMany(Answer::class);
        }
    }

    public function feedbacks(): Feedback|Builder|HasManyDeep {
        if ($this->role == 0) {
            return Feedback::query();
        }
        return $this->hasManyDeepFromRelations($this->answers(), (new Answer)->feedback());
    }
}
