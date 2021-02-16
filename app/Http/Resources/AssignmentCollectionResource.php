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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'answers' => $this->answers->count(),
            'students' => $this->users->where('role', '=', '2')->count(),
            'deadline' => $this->deadline,
            'ends_in' =>  CarbonInterval::seconds(strtotime($this->deadline) - now()->timestamp)->cascade()->forHumans(['parts' => 1]),
            'files' => $this->files()->count(),
            'subject_id' => $this->subject->id,
            'not_graded' => $this->answers->reduce(function ($carry, $item) {
                return $item->feedback ? $carry - 1 : $carry;
            }, $this->answers->count())
        ];
    }
}
