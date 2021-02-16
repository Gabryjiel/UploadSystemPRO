<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubjectJoinRequest;
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

        $subject = $this->currentUser()->subjects()->create(array_merge($request->validated(), ['code' => $code]));

        return SubjectResource::make($subject);
    }

    public function show(int $subject_id): SubjectResource {
        $subject = $this->currentUser()->subjects()->findOrFail($subject_id);

        return SubjectResource::make($subject);
    }

    public function update(Subject $subject, SubjectUpdateRequest $request): SubjectResource {
        $subject->update($request->validated());

        return SubjectResource::make($subject);
    }

    public function destroy(Subject $subject): JsonResponse{
        $subject->delete();

        return $this->returnJson("Subject has been successfully deleted", 200);
   }

    public function join(SubjectJoinRequest $request): JsonResponse {
        $subject_id = Subject::query()->where('code', '=', $request->get('code'))->firstOrFail()->getKey();
        $this->currentUser()->subjects()->syncWithoutDetaching($subject_id);

        return $this->returnJson("Added user to subject ".$subject_id ,201);
    }

    public function leave(int $subject_id): JsonResponse{
        $this->currentUser()->subjects()->findOrFail($subject_id);
        $this->currentUser()->subjects()->detach($subject_id);

        return $this->returnJson("Removed user from subject $subject_id", 200);
    }
}
