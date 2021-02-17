<?php


namespace App\Http\Resources;

/**
 * Class AnswerResource
 * @package App\Http\Resources
 * @mixin \App\Models\Answer
 */
class AnswerResource extends ApiResource {
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array{
        if ($this->isCollection($request->path())) {
            return [
                'id' => $this->id,
                'description' => $this->description,
                'user' => UserResource::make($this->user),
                'files' => FileResource::collection($this->files),
                'timestamp' => $this->updated_at,
                'feedback' => $this->feedback ? $this->feedback->id : null
            ];
        }

        return [
            'id' => $this->id,
            'description' => $this->description,
            'user' => UserResource::make($this->user),
            'files' => FileResource::collection($this->files),
            'timestamp' => $this->updated_at,
            'feedback' => FeedbackResource::make($this->feedback)
        ];
    }

}
