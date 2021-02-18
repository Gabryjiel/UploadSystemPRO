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
        $upgrade_requested = $this->sentMessages()
            ->where('message', '=', 'I want to be a teacher')
            ->where('resolved', '=', false)->exists();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'email' => $this->email,
            'upgrade_requested' => $this->when($request->user()->role == 0, $upgrade_requested)
        ];
    }
}
