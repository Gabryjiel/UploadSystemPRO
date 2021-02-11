<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Semester
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Subject[] $subject
 * @property-read int|null $subject_count
 * @method static Builder|Semester newModelQuery()
 * @method static Builder|Semester newQuery()
 * @method static Builder|Semester query()
 * @method static Builder|Semester whereCreatedAt($value)
 * @method static Builder|Semester whereId($value)
 * @method static Builder|Semester whereName($value)
 * @method static Builder|Semester whereUpdatedAt($value)
 * @mixin \Eloquent
 * @mixin IdeHelperSemester
 */
class Semester extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name'
    ];

    public function subject(): HasMany {
        return $this->hasMany(Subject::class);
    }
}
