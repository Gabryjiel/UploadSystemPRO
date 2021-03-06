<?php

namespace App\Http\Resources;

/**
 * Class FileResource
 * @package App\Http\Resources
 * @mixin \App\Models\File
 */
class FileResource extends ApiResource {
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
                'name' => $this->name,
                'size' => $this->size,
                'user' => UserResource::make($this->user)
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'size' => $this->size,
            'user' => UserResource::make($this->user)
        ];
    }
}
