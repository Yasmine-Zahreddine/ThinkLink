<?php
return [
    'connections' => [
        'default' => [
            'driver'   => env('DB_CONNECTION', 'mysql'),
            'host'     => env('DB_HOST', '127.0.0.1'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset'  => 'utf8mb4',
        ],
    ],
    'entities' => [
        app\Models\User::class, // Example for User model
        // Add other models here
    ],
];
?>