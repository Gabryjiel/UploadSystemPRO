<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Subgroup
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Subject[] $subject
 * @property-read int|null $subject_count
 * @method static Builder|Subgroup newModelQuery()
 * @method static Builder|Subgroup newQuery()
 * @method static Builder|Subgroup query()
 * @method static Builder|Subgroup whereCreatedAt($value)
 * @method static Builder|Subgroup whereId($value)
 * @method static Builder|Subgroup whereName($value)
 * @method static Builder|Subgroup whereUpdatedAt($value)
 * @mixin \Eloquent
 * @mixin IdeHelperSubgroup
 */
class Subgroup extends Model
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
