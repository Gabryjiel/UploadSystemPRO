<?php


namespace App\Http\Resources;

/**
 * Class UserResource
 * @package App\Http\Resources
 * @mixin \App\Models\User
 */
class UserResource extends ApiResource {
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request): array
    {
        if ($this->isCollection($request->path())) {
            return [
                'id' => $this->id,
                'name' => $this->name
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role
        ];
    }
}
