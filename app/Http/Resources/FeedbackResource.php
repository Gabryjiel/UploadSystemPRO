<?php

namespace App\Http\Resources;

class FeedbackResource extends ApiResource {
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

            ];
        }

        return [

        ];
    }
}
