<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

Route::post('/signup', function (Request $request) {
    $validatedData = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email',
        'password' => 'required|string|min:8',
    ]);

    // Log validated data
    Log::info('Validated Data: ', $validatedData);

    try {
        $userId = DB::table('users')->insertGetId([
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
?>