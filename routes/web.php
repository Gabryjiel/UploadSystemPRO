<?php

use App\Mail\RegistrationMail;
use Illuminate\Support\Facades\Mail;
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

Route::get('/email', function () {
    $mail = new RegistrationMail();
    Mail::to('160767@stud.prz.edu.pl')->send($mail);
    return $mail;
});

Route::get('/{path?}', function () {
    return view('index');
})->where('path', '^((?!api).)*$');
