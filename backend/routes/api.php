<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Mail\VerificationCode;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\VideoController;


Route::middleware('api')->post('/signup', function (Request $request) {
    $validatedData = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email',
        'password' => 'required|string|min:8',
    ]);

    try {
        $verificationCode = random_int(100000, 999999);

        DB::table('user_verifications')->updateOrInsert(
            ['email' => $validatedData['email']],
            [
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'verification_code' => $verificationCode,
                'expires_at' => now()->addMinutes(10),
            ]
        );

        // Send verification email
        Mail::to('majedshmaitlu@gmail.com')->send(new VerificationCode($verificationCode));

        return response()->json([
            'success' => true,
            'message' => 'A verification code has been sent to your email.',
        ], 200);
    } catch (\Exception $e) {
        Log::error('Error in signup: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Something went wrong',
        ], 500);
    }
});


Route::middleware('api')->post('/verify-signup', function (Request $request) {
    $validatedData = $request->validate([
        'email' => 'required|string|email|max:255',
        'verification_code' => 'required|integer',
    ]);

    try {
        // Find the temporary data and check expiration
        $tempUser = DB::table('user_verifications')
            ->where('email', $validatedData['email'])
            ->where('verification_code', $validatedData['verification_code'])
            ->first();

        if (!$tempUser) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code.',
            ], 400);
        }

        // Check if code has expired
        if (now()->isAfter($tempUser->expires_at)) {
            // Delete expired verification data
            DB::table('user_verifications')
                ->where('email', $tempUser->email)
                ->delete();
                
            return response()->json([
                'success' => false,
                'message' => 'Verification code has expired. Please sign up again.',
                'expired' => true
            ], 400);
        }

        // Insert user into `users` table
        DB::table('users')->insert([
            'first_name' => $tempUser->first_name,
            'last_name' => $tempUser->last_name,
            'email' => $tempUser->email,
            'password' => $tempUser->password,
            'created_at' => now(),
        ]);
        
        $user = DB::table('users')
            ->where('email', $tempUser->email)
            ->first();


        DB::table('user_verifications')->where('email', $tempUser->email)->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Account created successfully.',
            'user_id' => $user->user_id
        ], 201);
    } catch (\Exception $e) {
        Log::error('Error in verification: ' . $e->getMessage());
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

    Log::info('Signin attempt: ', ['email' => $validatedData['email']]);

    try {
        $user = DB::table('users')->where('email', $validatedData['email'])->first();

        if ($user && Hash::check($validatedData['password'], $user->password)) {
          
            return response()->json([
                'success' => true,
                'message' => 'Signin successful',
                'user_id' => $user->user_id,
                'email' => $user->email,
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

Route::middleware('api')->post('/users', function (Request $request) {
    try {
        $id = $request["user_id"];

        $user = DB::table('users')
            ->where('user_id', $id)
            ->select('first_name', 'last_name', 'email','description', 'linkedin_url', 'github_url')
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
            'email' => $user->email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
        ], 200);

    } catch (\Exception $e) {
        Log::error('Error fetching user: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Internal server error'
        ], 500);
    }
});

Route::middleware('api')->post('/delete', function (Request $request) {
    try {
        $id = $request->input('user_id');

        $user = DB::table('users')->where('user_id', $id)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Delete the user
        DB::table('users')->where('user_id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ], 200);

    } catch (\Exception $e) {
        Log::error('Error deleting user: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Internal server error'
        ], 500);
    }
});

Route::middleware('api')->post('/forgot-password', function (Request $request) {
    $validatedData = $request->validate([
        'email' => 'required|string|email|max:255|exists:users,email',
        'password' => 'required|string|min:8',
    ]);

    try {
        // Check if new password is same as old password
        $user = DB::table('users')->where('email', $validatedData['email'])->first();
        if (Hash::check($validatedData['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'New password cannot be the same as your current password.',
            ], 400);
        }

        $verificationCode = random_int(100000, 999999);

        DB::table('user_verifications')->updateOrInsert(
            ['email' => $validatedData['email']],
            [
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'verification_code' => $verificationCode,
                'expires_at' => now()->addMinutes(10),
            ]
        );

        Mail::to('zahreddineyasmine@gmail.com')->send(new VerificationCode($verificationCode));

        return response()->json([
            'success' => true,
            'message' => 'A verification code has been sent to your email.',
        ], 200);
    } catch (\Exception $e) {
        Log::error('Error in forgot password request: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Something went wrong',
        ], 500);
    }
});


Route::middleware('api')->post('/verify-new-password', function (Request $request) {
    $validatedData = $request->validate([
        'email' => 'required|string|email|max:255',
        'verification_code' => 'required|integer',
    ]);

    try {
        // Find the temporary data and check expiration
        $tempUser = DB::table('user_verifications')
            ->where('email', $validatedData['email'])
            ->where('verification_code', $validatedData['verification_code'])
            ->first();

        if (!$tempUser) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code.',
            ], 400);
        }

        // Check if code has expired
        if (now()->isAfter($tempUser->expires_at)) {
            // Delete expired verification data
            DB::table('user_verifications')
                ->where('email', $tempUser->email)
                ->delete();
                
            return response()->json([
                'success' => false,
                'message' => 'Verification code has expired. Please try again.',
                'expired' => true
            ], 400);
        }

        // Update the user's password
        DB::table('users')
            ->where('email', $tempUser->email)
            ->update([
                'password' => $tempUser->password,
            ]);

        // Delete the temporary data
        DB::table('user_verifications')->where('email', $tempUser->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.',
        ], 201);
    } catch (\Exception $e) {
        Log::error('Error in verification: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Something went wrong',
        ], 500);
    }
});

Route::middleware('api')->post('/update-profile', function (Request $request) {
    Log::info('Update Profile Request: ', $request->all());

    $validatedData = $request->validate([
        'user_id' => 'required|string|exists:users,user_id',
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'description' => 'nullable|string|max:255',
        'linkedin_url' => 'nullable|url|max:255',
        'github_url' => 'nullable|url|max:255',
    ]);

    try {
        DB::table('users')
            ->where('user_id', $validatedData['user_id'])
            ->update([
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'description' => $validatedData['description'] ?? null,
                'linkedin_url' => $validatedData['linkedin_url'] ?? null,
                'github_url' => $validatedData['github_url'] ?? null,
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
        ], 200);
    } catch (\Exception $e) {
        Log::error('Error updating profile: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to update profile. Please try again.',
        ], 500);
    }
});



Route::middleware('api')->post('/delete-confirmation', function (Request $request) {
    $validatedData = $request->validate([
        'user_id' => 'required|string|exists:users,user_id',
        'password' => 'required|string|min:8',
    ]);

    try {
        $user = DB::table('users')->where('user_id', $validatedData['user_id'])->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        if (Hash::check($validatedData['password'], $user->password)) {
            return response()->json([
                'success' => true,
                'message' => 'delete-confirmation',
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password',
            ], 401);
        }
    } catch (\Exception $e) {
        Log::error('Error in delete-confirmation: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Something went wrong',
        ], 500);
    }
});



Route::get('/videos', [VideoController::class, 'index']); 

Route::middleware('api')->post('/upload-photo', function (Request $request) {
    Log::info('Upload Photo Request Received');

    try {
        // Validate the request
        $validatedData = $request->validate([
            'user_id' => 'required|string|exists:users,user_id',
            'file' => 'required|image|max:2048',
        ]);

        $file = $request->file('file');
        if (!$file->isValid()) {
            throw new \Exception('Invalid file upload');
        }

        $userId = $validatedData['user_id'];
        $fileName = "users/$userId/" . Str::uuid() . '.' . $file->getClientOriginalExtension();
        $bucket = 'user-uploads';

        // Read file contents
        $fileContents = file_get_contents($file->getRealPath());

        // Upload to Supabase Storage
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('DB_API_KEY'),
            'Content-Type' => $file->getMimeType(),
        ])->withOptions([
            'verify' => false, // Disable SSL verification
        ])->withBody(
            $fileContents,
            $file->getMimeType()
        )->put("https://dvdvbefkxqowxmcvpzpc.supabase.co/storage/v1/object/$bucket/$fileName");

        if (!$response->successful()) {
            Log::error('Supabase Upload Failed:', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Upload failed',
                'error' => $response->json() ?? $response->body()
            ], 500);
        }

        $fileUrl = "https://dvdvbefkxqowxmcvpzpc.supabase.co/storage/v1/object/public/$bucket/$fileName";

        // Save file URL to database
        DB::table('users')
            ->where('user_id', $userId)
            ->update(['pfp_url' => $fileUrl]);

        return response()->json([
            'success' => true,
            'message' => 'Photo uploaded successfully',
            'file_url' => $fileUrl
        ], 200);

    } catch (\Exception $e) {
        Log::error('Error uploading photo: ' . $e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to upload photo',
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::middleware('api')->post('/get-photo', function (Request $request) {
    Log::info('Get Photo Request Received');

    try {
        // Validate request
        $validatedData = $request->validate([
            'user_id' => 'required|string|exists:users,user_id',
        ]);

        $userId = $validatedData['user_id'];

        // Retrieve user photo URL from the database
        $user = DB::table('users')->where('user_id', $userId)->first();

        if (!$user || !$user->pfp_url) {
            return response()->json([
                'success' => false,
                'message' => 'No profile photo found'
            ], 404);
        }

        $fileUrl = $user->pfp_url;

        // Fetch the image from Supabase
        $headers = [
            'Authorization' => 'Bearer ' . env('DB_API_KEY'), // Ensure your Supabase API key is in .env
            'Accept' => 'image/*'
        ];

        $response = Http::withHeaders($headers)->get($fileUrl);

        if (!$response->successful()) {
            Log::error('Failed to retrieve image from Supabase:', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve image',
                'error' => $response->json() ?? $response->body()
            ], 500);
        }

        // Return the image directly
        return response($response->body(), 200)
            ->header('Content-Type', $response->header('Content-Type'))
            ->header('Content-Disposition', 'inline; filename="profile-photo"');
    } catch (\Exception $e) {
        Log::error('Error retrieving photo: ' . $e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve photo',
            'error' => $e->getMessage()
        ], 500);
    }
});