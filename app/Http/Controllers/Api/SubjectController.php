<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubjectStoreRequest;
use App\Http\Requests\SubjectUpdateRequest;
use App\Http\Resources\SubjectCollectionResource;
use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SubjectController extends Controller {
    public function __construct() {
        $this->middleware(['auth.basic.once']);
        $this->middleware(['auth.basic.teacher'])->only(['create', 'store', 'update', 'destroy']);
    }

    public function index(Request $request): AnonymousResourceCollection {
        $subjects = $this->currentUser()->subjects();
        $amount = $request->get('amount') ?? $subjects->count();

        return SubjectCollectionResource::collection($subjects->paginate($amount));
    }

    public function store(SubjectStoreRequest $request): SubjectResource {
        do{
            $code = bin2hex(random_bytes(8));
            $subject = Subject::all()->where('code', '=', $code)->first();
        } while($subject);

        $subject = $request->user()->subjects()->create([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'group_id' => $request->get('group'),
            'subgroup_id' => $request->get('subgroup'),
            'semester_id' => $request->get('semester'),
            'code' => $code
        ]);

        return SubjectResource::make($subject);
    }

    public function show(int $subject_id): SubjectResource {
        $subject = $this->currentUser()->subjects()->findOrFail($subject_id);

        return SubjectResource::make($subject);
    }

    public function update(SubjectUpdateRequest $request, int $subject_id): SubjectResource {
        $subject = $this->currentUser()->subjects()->findOrFail($subject_id);

        $data = [
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'group_id' => $request->get('group'),
            'subgroup_id' => $request->get('subgroup'),
            'semester_id' => $request->get('semester')
        ];

        foreach ($data as $key => $value) {
            $subject[$key] = $value ?? $subject[$key];
        }

        $subject->save();

        return SubjectResource::make($subject);
    }

    public function destroy(int $subject_id): JsonResponse{
        $subject = $this->currentUser()->subjects()->findOrFail($subject_id);
        $subject->delete();

        return $this->returnJson("Subject with id $subject_id has been successfully deleted", 200);
   }

    public function join(Request $request): JsonResponse {
        $code = $request->get('code');

        if (!$code) {
            return $this->returnJson('Code is required', 400);
        }

        $subject_id = Subject::query()->where('code', '=', $code)->firstOrFail()->value('id');
        $this->currentUser()->subjects()->syncWithoutDetaching($subject_id);

        return $this->returnJson("Added user to subject ".$subject_id ,201);
    }

    public function leave(int $subject_id): JsonResponse{
        $this->currentUser()->subjects()->findOrFail($subject_id);
        $this->currentUser()->subjects()->detach($subject_id);

        return $this->returnJson("Removed user from subject $subject_id", 200);
    }
}
