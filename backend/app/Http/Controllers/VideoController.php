<?php
namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VideoController extends Controller
{
    public function getTitlesAndDescriptions()
    {
        try {
            $videos = DB::table('videos')
                ->select('title', 'description')
                ->get();

            $formattedData = $videos->map(function($video) {
                return [
                    'title' => $video->title,
                    'description' => $video->description
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedData
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching video titles and descriptions: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch video data: ' . $e->getMessage()
            ], 500);
        }
    }
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
