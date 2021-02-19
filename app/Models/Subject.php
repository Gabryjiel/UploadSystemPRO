<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * App\Models\Subject
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property int $group_id
 * @property int $subgroup_id
 * @property int $semester_id
 * @property string $code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Assignment[] $assignments
 * @property-read int|null $assignments_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Answer[] $answers
 * @property-read int|null $answers_count
 * @property-read \App\Models\Group $group
 * @property-read \App\Models\Semester $semester
 * @property-read \App\Models\Subgroup $subgroup
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\User[] $users
 * @property-read int|null $users_count
 * @method static Builder|Subject newModelQuery()
 * @method static Builder|Subject newQuery()
 * @method static Builder|Subject query()
 * @method static Builder|Subject whereCode($value)
 * @method static Builder|Subject whereCreatedAt($value)
 * @method static Builder|Subject whereDescription($value)
 * @method static Builder|Subject whereGroupId($value)
 * @method static Builder|Subject whereId($value)
 * @method static Builder|Subject whereName($value)
 * @method static Builder|Subject whereSemesterId($value)
 * @method static Builder|Subject whereSubgroupId($value)
 * @method static Builder|Subject whereUpdatedAt($value)
 */
class Subject extends Model
{
    use HasFactory, HasRelationships;

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

    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class);
    }

    public function assignments(): HasMany {
        return $this->hasMany(Assignment::class);
    }

    public function group(): BelongsTo {
        return $this->belongsTo(Group::class);
    }

    public function subgroup(): BelongsTo {
        return $this->belongsTo(Subgroup::class);
    }

    public function semester(): BelongsTo {
        return $this->belongsTo(Semester::class);
    }

    public function answers(): HasManyDeep {
        return $this->hasManyDeepFromRelations($this->assignments(), (new Assignment())->answers());
    }
}
