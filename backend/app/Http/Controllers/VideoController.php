<?php
namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VideoController extends Controller
{
    public function index()
    {
        try {
            $videos = DB::table('videos')->get();

            return response()->json([
                'success' => true,
                'data' => $videos,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching videos: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch videos' . $e->getMessage(),
            ], 500);
        }
    }

}
