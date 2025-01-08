<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;


Route::middleware('api')->post('/signup', function (Request $request) {
    $validatedData = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email',
        'password' => 'required|string|min:8',
    ]);

    // Log validated data
    Log::info('Validated Data: ', $validatedData);

    try {
        // Generate a unique user_id if necessary
        $userId = Str::uuid(); // or any other method to generate a unique user_id

        DB::table('users')->insert([
            'user_id' => $userId, // Use 'user_id' instead of 'id'
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully',
            'user_id' => $userId
        ], 201);

    } catch (\Exception $e) {
        // Log any error that occurs
        Log::error('Error in signup: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Something went wrong',
        ], 500);
    }
});

Route::middleware('api')->post('/signin', function (Request $request) {
    $validatedData = $request->validate([
        'email' => 'required|string|email|max:255',
        'password' => 'required|string|min:8',
    ]);

    // Log validated data
    Log::info('Signin attempt: ', ['email' => $validatedData['email']]);

    try {
        // Retrieve the user by email
        $user = DB::table('users')->where('email', $validatedData['email'])->first();

        if ($user && Hash::check($validatedData['password'], $user->password)) {
            // Password matches
            return response()->json([
                'success' => true,
                'message' => 'Signin successful',
                'user_id' => $user->user_id
            ], 200);
        } else {
            // Invalid credentials
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password',
            ], 401);
        }

    } catch (\Exception $e) {
        // Log any error that occurs
        Log::error('Error in signin: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Something went wrong',
        ], 500);
    }
});
