<?php
// Database connection details
$host = 'aws-0-eu-central-1.pooler.supabase.com'; // Host from your Supabase project
$port = '5432'; // Default PostgreSQL port
$dbname = 'postgres'; // Database name from Supabase
$user = 'postgres.dvdvbefkxqowxmcvpzpc'; // Username from Supabase
$password = 'zWG7WgA4Y3fNuIcB'; // Password from Supabase

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

// Step 3: Run a SELECT query
$query = 'SELECT * FROM users'; // Replace 'users' with a table in your database
$result = pg_query($conn, $query);

// Check if the query was successful
if (!$result) {
    echo "Error: Query failed.<br>";
    exit;
} else {
    echo "Query executed successfully!<br>";

    // Step 4: Fetch and display the results
    while ($row = pg_fetch_assoc($result)) {
        echo "ID: " . $row['id'] . " - Name: " . $row['name'] . " - Email: " . $row['email'] . "<br>";
    }
}

// Close the database connection
pg_close($conn);
?>
