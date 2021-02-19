<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * App\Models\Answer
 *
 * @property int $id
 * @property int $user_id
 * @property int $assignment_id
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Assignment $assignment
 * @property-read \App\Models\Feedback|null $feedback
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\File[] $files
 * @property-read int|null $files_count
 * @property-read \App\Models\User $user
 * @method static Builder|Answer newModelQuery()
 * @method static Builder|Answer newQuery()
 * @method static Builder|Answer query()
 * @method static Builder|Answer whereAssignmentId($value)
 * @method static Builder|Answer whereCreatedAt($value)
 * @method static Builder|Answer whereDescription($value)
 * @method static Builder|Answer whereId($value)
 * @method static Builder|Answer whereUpdatedAt($value)
 * @method static Builder|Answer whereUserId($value)
 */
class Answer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'description' , 'assignment_id', 'user_id'
    ];

    protected $hidden = [
        'laravel_through_key'
    ];

    public function assignment(): BelongsTo {
        return $this->belongsTo(Assignment::class);
    }

    public function files(): BelongsToMany {
        return $this->belongsToMany(File::class, 'files_answers', 'answer_id', 'file_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function feedback(): HasOne {
        return $this->hasOne(Feedback::class);
    }
}
