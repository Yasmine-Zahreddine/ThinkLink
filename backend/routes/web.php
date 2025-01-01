<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return view('home');
});


Route::get('/test-db', function () {
    try {
        // Perform a simple query
        $result = DB::select('SELECT NOW()');
        
        return response()->json($result); // Return the result as JSON
    } catch (\Exception $e) {
        // Handle any errors
        return response()->json(['error' => $e->getMessage()]);
    }
});