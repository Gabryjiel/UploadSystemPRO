<?php

namespace App\Http\Resources;

use Carbon\CarbonInterval;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class AssignmentCollectionResource
 * @package App\Http\Resources
 * @mixin \App\Models\Assignment
 */
class AssignmentCollectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request) {

        $time = strtotime($this->deadline) - now()->timestamp;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'answers' => $request->user()->role == 2 ? $this->answers()->where('user_id', '=', $request->user()->id)->count() : $this->answers()->count(),
            'deadline' => $this->deadline,
            'ends_in' =>  $time < 0 ? 'ended' : CarbonInterval::seconds($time)->cascade()->forHumans(['parts' => 1]),
            'files' => $this->files()->count(),
            'subject_id' => $this->subject->id,

            'students' => $this->when($request->user()->role != 2, $this->users->where('role', '=', '2')->count()),
            'not_graded' => $this->answers->reduce(function ($carry, $item) {
                return $item->feedback ? $carry - 1 : $carry;
            }, $this->answers->count())
        ];
    }
}
