<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\RateController;

Route::get('/rates/latest', [RateController::class, 'latest']);
Route::get('/rates/availableDates', [RateController::class, 'giveListOfDates']);
Route::get('/rates/{date}', [RateController::class, 'byDate']);
// boilerplate API endpoint should we are to implement adding rate in future:
// Route::post('/rates/{date}', [RateController::class, 'addRateOnDate']);
