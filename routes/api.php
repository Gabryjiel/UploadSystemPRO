<?php

use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\SemesterController;
use App\Http\Controllers\Api\SubgroupController;
use App\Http\Controllers\Api\UniController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AnswerController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\FileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);
Route::post('register', [AuthController::class, 'register']);
Route::get('register/{hash}', [AuthController::class, 'verify']);
Route::post('reset', [AuthController::class, 'reset']);
Route::post('account', [AuthController::class, 'new_password']);
Route::patch('account', [AuthController::class, 'rename']);
Route::delete('account', [AuthController::class, 'delete']);
Route::get('session', [AuthController::class, 'session']);

Route::get('subjects/form', [SubjectController::class, 'create']);
Route::post('subjects/join', [SubjectController::class, 'join']);
Route::post('subjects/{id}/leave', [SubjectController::class, 'leave']);
Route::apiResource('subjects', SubjectController::class);
Route::post('assignments/{id}', [AssignmentController::class, 'update']);
Route::apiResource('assignments', AssignmentController::class);
Route::apiResource('files', FileController::class);
Route::post('answers/{id}', [AnswerController::class, 'update']);
Route::apiResource('answers', AnswerController::class);
Route::apiResource('feedbacks', FeedbackController::class);

Route::group(['prefix' => 'uni'], function () {
   Route::get('/', [UniController::class, 'index']);
   Route::apiResource('/groups', GroupController::class);
   Route::apiResource('/subgroups', SubgroupController::class);
   Route::apiResource('/semesters', SemesterController::class);
});

Route::any('/{path?}', function () {
    return response()->json([
        'error' => 'Endpoint not found. Perhaps you provided incorrect address.'
    ], 404);
});
