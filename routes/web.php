<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// TODO: Entry point to React App, probably breaks with react router

Route::get('/{path?}', function () {
    return File::get(resource_path('react/public/index.html'));
})->where('path', '^((?!api).)*$');