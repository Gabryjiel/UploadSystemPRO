<?php

namespace App\Http\Resources;

/**
 * Class FeedbackResource
 * @package App\Http\Resources
 * @mixin \App\Models\Feedback
 */
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
                'id' => $this->id,
                'description' => $this->description
            ];
        }

        return [
            'id' =>$this->id,
            'description' => $this->description,
            'answer_id' => $this->answer_id,
            'user_id' => $this->user_id
        ];
    }
}
