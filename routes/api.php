<?php

use Illuminate\Support\Facades\Route;

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
Route::get('session', [AuthController::class, 'session']);

Route::get('subjects/form', [SubjectController::class, 'create']);
Route::post('subjects/join', [SubjectController::class, 'join']);
Route::post('subjects/{id}/leave', [SubjectController::class, 'leave']);
Route::apiResource('subjects', SubjectController::class);
Route::apiResource('assignments', AssignmentController::class);
Route::apiResource('files', FileController::class);

Route::get('feedbacks', [FeedbackController::class, 'index']);
Route::get('assignments/{id}/feedback', [FeedbackController::class, 'show']);
Route::post('assignments/{id}/feedback', [FeedbackController::class, 'store']);
Route::patch('assignments/{id}/feedback', [FeedbackController::class, 'update']);
Route::delete('assignments/{id}/feedback', [FeedbackController::class, 'destroy']);

Route::any('/{path?}', function () {
    return response()->json([
        'message' => 'Resource not found. Perhaps you provided incorrect address.'
    ], 404);
})->where('path', '^((?!api).)*$');