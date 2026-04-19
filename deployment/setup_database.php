<?php
/**
 * PostgreSQL Database Setup Script for Unikart
 * This script creates the database and runs the schema
 */

// Database configuration
$host = 'localhost';
$port = '5432';
$dbname = 'unikart_db';
$username = 'postgres';  // Change this to your PostgreSQL username
$password = 'password';  // Change this to your PostgreSQL password

echo "Setting up PostgreSQL database for Unikart...\n";

try {
    // First connect to postgres database to create our database
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=postgres;user=$username;password=$password");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if database exists
    $stmt = $pdo->query("SELECT 1 FROM pg_database WHERE datname = '$dbname'");
    $exists = $stmt->fetch();

    if (!$exists) {
        echo "Creating database '$dbname'...\n";
        $pdo->exec("CREATE DATABASE $dbname");
        echo "Database created successfully!\n";
    } else {
        echo "Database '$dbname' already exists.\n";
    }

    // Close connection to postgres database
    $pdo = null;

    // Connect to our new database
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$username;password=$password");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Read and execute the schema file
    $schemaFile = __DIR__ . '/../unikart_db_postgres.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found: $schemaFile");
    }

    echo "Executing database schema...\n";
    $schema = file_get_contents($schemaFile);

    // Split schema into individual statements
    $statements = array_filter(array_map('trim', explode(';', $schema)));

    foreach ($statements as $statement) {
        if (!empty($statement) && !preg_match('/^--/', $statement)) {
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                // Skip errors for CREATE EXTENSION if already exists
                if (!str_contains($e->getMessage(), 'already exists')) {
                    echo "Warning executing statement: " . $e->getMessage() . "\n";
                }
            }
        }
    }

    echo "Database schema executed successfully!\n";

    // Verify tables were created
    $stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "\nCreated tables:\n";
    foreach ($tables as $table) {
        echo "- $table\n";
    }

    echo "\nDatabase setup completed successfully!\n";
    echo "You can now use the API endpoints with PostgreSQL.\n";

} catch (PDOException $e) {
    echo "Database setup failed: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "Setup failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>