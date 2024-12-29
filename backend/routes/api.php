<?php 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', function (Request $request) {
    $email = $request->input('email');
    $password = $request->input('password');

    // Mock response (replace with real authentication logic)
    if ($email === 'test@example.com' && $password === 'password') {
        return response()->json(['success' => true, 'message' => 'Login successful']);
    }

    return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
});
?>