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

            'answers' => $request->user()->role == 2 ? $this->answers->where('user_id', '=', $request->user()->id)->count() : $this->answers->count(),

            'feedbacks' => $request->user()->role == 2 ? $this->answers()->where('answers.user_id', '=', $request->user()->id)->join('feedbacks', 'answer_id', '=', 'answers.id')->select('feedbacks.id')->count() :
                $this->answers->reduce(function ($carry, $item) {
                    return $item->feedback ? $carry + 1 : $carry;
                }, 0)
        ];
    }
}
