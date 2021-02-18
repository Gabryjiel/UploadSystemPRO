<?php

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\SemesterController;
use App\Http\Controllers\Api\SubgroupController;
use App\Http\Controllers\Api\UniController;
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

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('register/{hash}', [AuthController::class, 'verify']);
    Route::post('reset', [AuthController::class, 'reset']);
});

Route::get('dashboard', [DashboardController::class, 'index']);

Route::prefix('account')->group(function () {
    Route::get('/', [AccountController::class, 'show']);
    Route::post('/password', [AccountController::class, 'new_password']);
    Route::post('/upgrade', [AccountController::class, 'upgrade']);
    Route::patch('/', [AccountController::class, 'update']);
    Route::delete('/', [AccountController::class, 'delete']);
});

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::patch('/{user}', [UserController::class, 'update']);
    Route::delete('/{user}', [UserController::class, 'destroy']);
});

Route::prefix('subjects')->group(function () {
    Route::post('join', [SubjectController::class, 'join']);
    Route::post('{id}/leave', [SubjectController::class, 'leave']);
});
Route::apiResource('subjects', SubjectController::class);

Route::prefix('assignments')->group(function () {
    Route::get('/', [AssignmentController::class, 'index']);
    Route::get('/{assignment}', [AssignmentController::class, 'show']);
    Route::post('/', [AssignmentController::class, 'store']);
    Route::post('/{id}', [AssignmentController::class, 'update']);
    Route::delete('/{id}', [AssignmentController::class, 'destroy']);
});

Route::prefix('answers')->group(function () {
    Route::get('/', [AnswerController::class, 'index']);
    Route::get('/{answer}', [AnswerController::class, 'show']);
    Route::post('/', [AnswerController::class, 'store']);
    Route::post('/{answer}', [AnswerController::class, 'update']);
    Route::delete('/{answer}', [AnswerController::class, 'destroy']);
});

Route::apiResource('files', FileController::class);
Route::apiResource('feedbacks', FeedbackController::class);

Route::prefix('uni')->group(function () {
   Route::get('/', [UniController::class, 'index']);
   Route::apiResource('/groups', GroupController::class);
   Route::apiResource('/subgroups', SubgroupController::class);
   Route::apiResource('/semesters', SemesterController::class);
});

// Route for 404
Route::any('/{path?}', function () {
    return response()->json([
        'error' => 'Endpoint not found. Perhaps you provided incorrect address.'
    ], 404);
});
