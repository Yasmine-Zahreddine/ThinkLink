<?php

namespace App\Models;

class ChatHistory {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($userMessage, $botResponse, $userfk = null) {
        $sql = "INSERT INTO public.\"chatHistory\" (\"userMessage\", \"botResponse\", userfk) VALUES (:userMessage, :botResponse, :userfk)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':userMessage', $userMessage);
        $stmt->bindParam(':botResponse', $botResponse);
        $stmt->bindParam(':userfk', $userfk);
        return $stmt->execute();
    }

    public function getById($id) {
        $sql = "SELECT * FROM public.\"chatHistory\" WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAll() {
        $sql = "SELECT * FROM public.\"chatHistory\" ORDER BY created_at DESC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete($id) {
        $sql = "DELETE FROM public.\"chatHistory\" WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function processMessage($userMessage, $userfk = null) {
        $apiUrl = 'http://your-fastapi-app-url/answer';
    
        // Get chat history
        $chatHistoryJson = $this->getChatHistoryJson($userfk);
        $chatHistory = json_decode($chatHistoryJson, true);
    
        // Append the user's message to the chat history
        $chatHistory[] = ["role" => "user", "content" => $userMessage];
    
        // Prepare the data to send to the FastAPI endpoint
        $data = ['message' => $chatHistory];
    
        $options = [
            'http' => [
                'method'  => 'POST',
                'header'  => 'Content-type: application/json',
                'content' => json_encode($data)
            ]
        ];
        $context  = stream_context_create($options);
        $result = file_get_contents($apiUrl, false, $context);
        
        if ($result === FALSE) {
            // Handle error (e.g., log it, throw an exception)
            error_log("Error calling FastAPI endpoint: " . print_r(error_get_last(), true));
            return json_encode($chatHistory); // Return current chat history even on error
        }
        $response = json_decode($result, true);
        if (isset($response['response'])) {
            $botResponse = $response['response'];
            // Store both user message and bot response in the database
            // Decode the chat history to append the bot response
            $chatHistory = json_decode($this->getChatHistoryJson($userfk), true);
            $chatHistory[] = ["role" => "system", "content" => $botResponse];
            // Encode the chat history back to JSON to store in the database
            $chatHistoryJson = json_encode($chatHistory);
            $this->create($userMessage, $botResponse, $userfk);
            return $chatHistoryJson;
        } else {
            // Handle unexpected response format
            error_log("Unexpected response from FastAPI: " . $result);
            return json_encode($chatHistory); // Return current chat history even on error
        }
    }

    public function getChatHistoryJson($userfk) {
        $sql = "SELECT \"userMessage\" as user, \"botResponse\" as system FROM public.\"chatHistory\" WHERE userfk = :userfk ORDER BY created_at ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':userfk', $userfk);
        $stmt->execute();
        $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        $chatHistory = [];
        foreach ($results as $result) {
            $chatHistory[] = ["role" => "user", "content" => $result['user']];
            $chatHistory[] = ["role" => "system", "content" => $result['system']];
        }
        return json_encode($chatHistory);
    }
}