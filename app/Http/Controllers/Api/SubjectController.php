<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Semester;
use App\Models\Subgroup;
use App\Models\Subject;
use App\Models\UserSubject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    public function __construct() {
        $this->middleware(['auth.basic.once']);
        $this->middleware(['auth.basic.teacher'])->only(['create', 'store', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse {
        $amount = $request->input('amount');
        $subjects = $this->currentUser()->subjects();

        if (!$subjects) {
            return $this->returnResourceNotFound();
        }

        if ($amount) {
            $subjects = $subjects->paginate($amount);
        } else {
            $subjects = $subjects->get();
        }

        foreach ($subjects as $subject) {
            $subject->students = $subject->users()->where('role', '=', '2')->get()->count();
            $subject->teachers = $subject->users()->where('role', '=', '1')->get()->toArray();
            $subject->group = $subject->group()->first();
            $subject->subgroup = $subject->subgroup()->first();
            $subject->semester = $subject->semester()->first();
        }

        return $this->returnJson($subjects, 200);
    }

    public function create() {
        $result = [
            'groups' => Group::all(),
            'subgroups' => Subgroup::all(),
            'semesters' => Semester::all()
        ];

        return $this->returnJson($result, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request) : JsonResponse {
        $validator = Validator::make($request->only('name', 'description', 'group', 'subgroup', 'semester'), [
            'name' => 'required|max:64',
            'description' => 'required',
            'group' => 'required',
            'subgroup' => 'required',
            'semester' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->returnJson($validator->errors()->toJson(), 400);
        }

        do{
            $code = bin2hex(random_bytes(8));
            $subject = Subject::all()->where('code', '=', $code)->first();
        } while($subject);

        $subject = $request->user()->subjects()->create([
            'name' => $request->name,
            'description' => $request->description,
            'code' => $code,
            'group_id' => $request->group,
            'subgroup_id' => $request->subgroup,
            'semester_id' => $request->semester
        ]);

        return $this->returnJson($subject, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show($id) : JsonResponse {
        $subject = $this->currentUser()->subjects()->find($id);

        if (!$subject) {
            return $this->returnResourceNotFound();
        }

        $subject->teachers = $subject->users()->where('role', '=', 1)->get();
        $subject->group = $subject->group()->first();
        $subject->subgroup = $subject->subgroup()->first();
        $subject->semester = $subject->semester()->first();
        $subject->assignments = $subject->assignments()->get();

        return $this->returnJson($subject, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id) : JsonResponse{
        $subject = $this->currentUser()->subjects()->find($id);

        if (!$subject) {
            return $this->returnResourceNotFound();
        }

        foreach ($request->all() as $key => $value) {
            $subject[$key] = $value;
        }

        $subject->save();

        return $this->returnJson($subject, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy($id) : JsonResponse{
        $subject = $this->currentUser()->subjects()->find($id);

        if (!$subject) {
            return $this->returnResourceNotFound();
        }

        $subject->destroy($id);

        return $this->returnJson("Subject with id $id has been successfully destroyed", 200);
   }

   /**
     * Add user to subject with code.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function join(Request $request) : JsonResponse {
        $code = $request->code;

        if (!$code) {
            return $this->returnJson('Code is required', 400);
        }

        $user_id = $this->currentUser()->id;
        $subject = Subject::all()->where('code', '=', $code)->first();

        if (!$subject) {
            return $this->returnResourceNotFound();
        }

        $subject_id = $subject->id;

        $user_subject = new UserSubject([
            'user_id' => $user_id,
            'subject_id' => $subject_id
        ]);

        $user_subject->save();

        return $this->returnJson("Added user $user_id to subject $subject_id" ,201);
    }

    /**
     * Remove user from subject.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function leave(int $id) : JsonResponse{
        $user_id = $this->currentUser()->id;
        $subject_id = $id;

        $user_subject = UserSubject::all()
            ->where('subject_id', '=', $subject_id)
            ->where('user_id', '=', $user_id)
            ->delete();

        if (!$user_subject) {
            return $this->returnResourceNotFound();
        }

        return $this->returnJson("Removed user $user_id from subject $subject_id", 200);
    }
}
