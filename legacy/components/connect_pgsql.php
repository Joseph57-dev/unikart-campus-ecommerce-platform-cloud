<?php
// PostgreSQL database connection for Unikart API

$host = 'localhost';
$dbname = 'unikart_db';
$username = 'postgres';  // Change this to your PostgreSQL username
$password = 'password';  // Change this to your PostgreSQL password
$port = '5432';

try {
    $conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$username;password=$password");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Set timezone to UTC for consistency
    $conn->exec("SET timezone = 'UTC'");

    // Uncomment for debugging
    // echo "Connected to PostgreSQL database successfully";

} catch(PDOException $e) {
    // In production, log this error instead of displaying
    die("Database connection failed: " . $e->getMessage());
}
?>