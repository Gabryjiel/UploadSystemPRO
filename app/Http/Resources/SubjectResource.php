<?php

namespace App\Http\Resources;

/**
 * Class SubjectResource
 * @package App\Http\Resources
 * @mixin \App\Models\Subject
 */
class SubjectResource extends ApiResource {
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array {
        if ($this->isCollection($request->path())) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'description' => $this->description,
                'teachers' => UserResource::collection($this->users()->where('role', '=', 1)->get()),
                'semester' => $this->semester->name,
                'group' => $this->group->name,
                'subgroup' => $this->subgroup->name,
                'assignments' => $this->assignments->count(),
                'students' => UserResource::collection($this->users()->where('role', '=', 2))->count()
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'code' => $this->code,
            'teachers' => UserResource::collection($this->users()->where('role', '=', 1)->get()),
            'semester' => $this->semester->name,
            'group' => $this->group->name,
            'subgroup' => $this->subgroup->name,
            'assignments' => AssignmentResource::collection($this->assignments)
        ];
    }
}
