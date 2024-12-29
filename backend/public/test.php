<?php
// Autoload dependencies
require_once __DIR__ . '/../vendor/autoload.php';

// Load the .env file
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Access environment variables
$host = $_ENV['DB_HOST'];
$port = $_ENV['DB_PORT'] ?? '5432'; // Default to 5432 if not set
$dbname = $_ENV['DB_DATABASE'];
$user = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];

// Create connection string
$conn_string = "host=$host port=$port dbname=$dbname user=$user password=$password";

// Establish connection
$conn = pg_connect($conn_string);

// Check if the connection was successful
if (!$conn) {
    echo "Error: Unable to connect to the database.";
    exit;
} else {
    echo "Connected to the database successfully!<br>";
}

// Run a SELECT query
$query = 'SELECT * FROM users'; // Replace 'users' with a table in your database
$result = pg_query($conn, $query);

// Check if the query was successful
if (!$result) {
    echo "Error: Query failed.<br>";
    exit;
} else {
    echo "Query executed successfully!<br>";

    // Fetch and display the results
    while ($row = pg_fetch_assoc($result)) {
        echo "ID: " . $row['id'] . " - Name: " . $row['name'] . " - Email: " . $row['email'] . "<br>";
    }
}

// Close the database connection
pg_close($conn);
?>
