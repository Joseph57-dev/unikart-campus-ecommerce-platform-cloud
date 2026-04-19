<?php
/**
 * PostgreSQL Connection Test Script
 * Run this after setting up PostgreSQL and PHP
 */

// Database configuration - UPDATE THESE VALUES
$host = 'localhost';
$port = '5432';
$dbname = 'unikart_db';
$username = 'postgres';  // Change this to your PostgreSQL username
$password = 'password';  // Change this to your PostgreSQL password

echo "Testing PostgreSQL connection...\n\n";

try {
    // Test basic connection
    echo "1. Testing basic connection to PostgreSQL...\n";
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=postgres;user=$username;password=$password");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✓ Basic connection successful\n\n";

    // Test database creation
    echo "2. Testing database creation...\n";
    $stmt = $pdo->query("SELECT 1 FROM pg_database WHERE datname = '$dbname'");
    $exists = $stmt->fetch();

    if (!$exists) {
        $pdo->exec("CREATE DATABASE $dbname");
        echo "✓ Database '$dbname' created\n";
    } else {
        echo "✓ Database '$dbname' already exists\n";
    }

    // Close connection and reconnect to our database
    $pdo = null;
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$username;password=$password");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Test schema execution
    echo "\n3. Testing schema execution...\n";
    $schemaFile = __DIR__ . '/unikart_db_postgres.sql';

    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found: $schemaFile");
    }

    $schema = file_get_contents($schemaFile);
    $statements = array_filter(array_map('trim', explode(';', $schema)));

    $executed = 0;
    $skipped = 0;

    foreach ($statements as $statement) {
        if (!empty($statement) && !preg_match('/^--/', $statement)) {
            try {
                $pdo->exec($statement);
                $executed++;
            } catch (PDOException $e) {
                // Skip errors for CREATE EXTENSION if already exists
                if (str_contains($e->getMessage(), 'already exists')) {
                    $skipped++;
                } else {
                    echo "Warning: " . $e->getMessage() . "\n";
                }
            }
        }
    }

    echo "✓ Schema executed: $executed statements executed, $skipped skipped\n";

    // Test table creation
    echo "\n4. Verifying table creation...\n";
    $stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "✓ Created tables (" . count($tables) . "):\n";
    foreach ($tables as $table) {
        echo "  - $table\n";
    }

    // Test sample data insertion
    echo "\n5. Testing sample data...\n";
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM products");
    $productCount = $stmt->fetch()['count'];

    $stmt = $pdo->query("SELECT COUNT(*) as count FROM category");
    $categoryCount = $stmt->fetch()['count'];

    echo "✓ Sample data inserted: $productCount products, $categoryCount categories\n";

    // Test basic queries
    echo "\n6. Testing basic queries...\n";

    // Get products
    $stmt = $pdo->query("SELECT product_id, name, price, stock_quantity FROM products LIMIT 3");
    $products = $stmt->fetchAll();

    echo "✓ Product query successful:\n";
    foreach ($products as $product) {
        echo "  - {$product['name']}: UGX " . number_format($product['price']) . " (Stock: {$product['stock_quantity']})\n";
    }

    // Test user creation
    echo "\n7. Testing user creation...\n";
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM user_account");
    $userCount = $stmt->fetch()['count'];
    echo "✓ Users in system: $userCount\n";

    echo "\n🎉 All tests passed! PostgreSQL setup is complete.\n";
    echo "\nNext steps:\n";
    echo "1. Update your API endpoints to use config_pgsql.php\n";
    echo "2. Test the API endpoints with the new schema\n";
    echo "3. Connect your React frontend to the PostgreSQL API\n";

} catch (PDOException $e) {
    echo "\n❌ Database test failed: " . $e->getMessage() . "\n";
    echo "\nTroubleshooting:\n";
    echo "1. Make sure PostgreSQL is running\n";
    echo "2. Check your connection credentials\n";
    echo "3. Ensure the database user has proper permissions\n";
    echo "4. Verify PHP has pgsql extension installed\n";
    exit(1);
} catch (Exception $e) {
    echo "\n❌ Test failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>