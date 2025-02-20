<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatHistory extends Model
{
    protected $table = 'chatHistory';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false; // Disable timestamps

    protected $fillable = [
        'userMessage',
        'botResponse',
        'userfk'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'id' => 'string'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userfk', 'user_id');
    }

    public function create($userMessage, $botResponse, $userfk = null)
    {
        return self::query()->create([
            'userMessage' => $userMessage,
            'botResponse' => $botResponse,
            'userfk' => $userfk
        ]);
    }

    public function getChatHistory($userfk)
    {
        return self::query()
            ->where('userfk', $userfk)
            ->orderBy('created_at', 'asc')
            ->get(['userMessage', 'botResponse', 'created_at'])
            ->map(function ($chat) {
                return [
                    [
                        'role' => 'user',
                        'content' => $chat->userMessage,
                    ],
                    [
                        'role' => 'system',
                        'content' => $chat->botResponse,
                    ]
                ];
            })
            ->flatten(1)
            ->toArray();
    }

    

    public function processMessage($userMessage, $userfk = null)
    {
        try {
            $chatHistory = $this->getChatHistory($userfk);
            $currentMessage = [
                'role' => 'user',
                'content' => $userMessage,
            ];
            
            $chatHistory[] = $currentMessage;

            $response = Http::post('http://127.0.0.1:8001/answer',[
                'message' => $chatHistory
            ]);

            if (!$response->successful()) {
                Log::error('FastAPI Error:', ['response' => $response->body()]);
                throw new \Exception('Failed to get response from AI service');
            }

            $botResponse = $response->json('response');
            Log::info('Bot Response:', ['response' => $botResponse]);
            
            // Store in database
            $this->create($userMessage, $botResponse, $userfk);

            // Add bot response to chat history
            $chatHistory[] = [
                'role' => 'system',
                'content' => $botResponse,
            ];

            return [
                'message' => $botResponse,
                'history' => $chatHistory
            ];

        } catch (\Exception $e) {
            Log::error('Chat Processing Error:', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}