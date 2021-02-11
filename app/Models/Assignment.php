<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Assignment
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property string $deadline
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $subject_id
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Answer[] $answers
 * @property-read int|null $answers_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\File[] $files
 * @property-read int|null $files_count
 * @property-read \App\Models\Subject $subject
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\User[] $users
 * @property-read int|null $users_count
 * @method static Builder|Assignment newModelQuery()
 * @method static Builder|Assignment newQuery()
 * @method static Builder|Assignment query()
 * @method static Builder|Assignment whereCreatedAt($value)
 * @method static Builder|Assignment whereDeadline($value)
 * @method static Builder|Assignment whereDescription($value)
 * @method static Builder|Assignment whereId($value)
 * @method static Builder|Assignment whereName($value)
 * @method static Builder|Assignment whereSubjectId($value)
 * @method static Builder|Assignment whereUpdatedAt($value)
 * @mixin \Eloquent
 * @mixin IdeHelperAssignment
 */
class Assignment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name', 'description', 'deadline', 'subject_id'
    ];

    /**
     * @var string[]
     */
    protected $hidden = [
        'laravel_through_key'
    ];

    public function answers(): HasMany {
        return $this->hasMany(Answer::class);
    }

    public function files(): BelongsToMany {
        return $this->belongsToMany(File::class, 'files_assignments', 'file_id', 'assignment_id');
    }

    public function subject(): BelongsTo {
        return $this->belongsTo(Subject::class);
    }
}
