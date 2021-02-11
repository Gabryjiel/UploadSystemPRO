<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Feedback
 *
 * @property int $id
 * @property int $answer_id
 * @property int $user_id
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Answer $answer
 * @property-read \App\Models\User $user
 * @method static Builder|Feedback newModelQuery()
 * @method static Builder|Feedback newQuery()
 * @method static Builder|Feedback query()
 * @method static Builder|Feedback whereAnswerId($value)
 * @method static Builder|Feedback whereCreatedAt($value)
 * @method static Builder|Feedback whereDescription($value)
 * @method static Builder|Feedback whereId($value)
 * @method static Builder|Feedback whereUpdatedAt($value)
 * @method static Builder|Feedback whereUserId($value)
 * @mixin \Eloquent
 * @mixin IdeHelperFeedback
 */
class Feedback extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'name', 'description'
    ];

    protected $hidden = [
        'laravel_through_key'
    ];

    protected $table = 'feedbacks';

    public function answer(): BelongsTo {
        return $this->belongsTo(Answer::class);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
