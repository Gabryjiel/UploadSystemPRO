<?php

namespace App\Http\Resources;

use App\Models\Group;
use App\Models\Semester;
use App\Models\Subgroup;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class DashboardResource
 * @package App\Http\Resources
 * @mixin \App\Models\User
 */
class DashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array {
        return [
            'username' => $this->name,
            'subjects' => $this->subjects()->count(),
            'assignments' => $this->assignments()->count(),
            'answers' => $this->answers()->count(),
            'feedback' => $this->feedbacks()->count(),
            'files' => $this->files()->count(),

            'students' => $this->when($this->role == 0, User::query()->where('role', '=', 2)->count()),
            'upgrade_requests' => $this->when($this->role == 0, $this->receivedMessages()->count()),
            'teachers' => $this->when($this->role == 0, User::query()->where('role', '=', 1)->count()),
            'admins' => $this->when($this->role == 0, User::query()->where('role', '=', 0)->count()),
            'groups' => $this->when($this->role ==0, Group::query()->count()),
            'subgroups' => $this->when($this->role ==0, Subgroup::query()->count()),
            'semesters' => $this->when($this->role ==0, Semester::query()->count()),
        ];
    }
}
