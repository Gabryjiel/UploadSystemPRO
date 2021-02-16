<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class SubjectCollectionResource
 * @package App\Http\Resources
 * @mixin \App\Models\Subject
 */
class SubjectCollectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'teachers' => UserResource::collection($this->users()->where('role', '=', 1)->get()),
            'semester' => $this->semester->name,
            'group' => $this->group->name,
            'subgroup' => $this->subgroup->name,
            'assignments' => $this->assignments->count(),
            'students' => $this->users()->where('role', '=', 2)->count(),

            'not_answered' => $this->when($request->user()->role == 2, $this->assignments->count() - $this->answers->where('user_id', '=', $request->user()->id)->count()),

            'not_graded' => $this->when(in_array($request->user()->role, [1,2]), $this->answers->reduce(function ($carry, $item) {
                return $item->feedback ? $carry - 1 : $carry;
            }, $this->answers->count())),
        ];
    }
}
