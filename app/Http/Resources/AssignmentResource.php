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
        if ($this->isCollection($request->path())) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'answers' => $this->answers->count(),
                'deadline' => $this->deadline,
                'files' => $this->files()->count()
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'answers' => AnswerResource::collection($this->answers),
            'files' => FileResource::collection($this->files)
        ];
    }
}
