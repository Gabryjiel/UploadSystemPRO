<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\File
 *
 * @property int $id
 * @property string $name
 * @property int $size
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static Builder|File newModelQuery()
 * @method static Builder|File newQuery()
 * @method static Builder|File query()
 * @method static Builder|File whereCreatedAt($value)
 * @method static Builder|File whereId($value)
 * @method static Builder|File whereName($value)
 * @method static Builder|File whereSize($value)
 * @method static Builder|File whereUpdatedAt($value)
 * @method static Builder|File whereUserId($value)
 * @mixin \Eloquent
 * @mixin IdeHelperFile
 */
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

    protected $hidden = [
        'pivot', 'laravel_through_key'
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

}
