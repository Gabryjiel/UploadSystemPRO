<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * @mixin \App\Models\Assignment
*/
class AssignmentResource extends ApiResource {
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'deadline' => $this->deadline,
            'answers' => AnswerResource::collection($this->answers),
            'files' => FileResource::collection($this->files),
            'subject_id' => $this->subject->id
        ];
    }
}
