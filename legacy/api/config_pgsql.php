<?php
// api/config.php - Updated for PostgreSQL

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Include PostgreSQL database connection
require_once '../components/connect_pgsql.php';

// API Response Helper
class APIResponse {
    public static function send($data, $status = 200, $message = '') {
        http_response_code($status);
        echo json_encode([
            'status' => $status >= 200 && $status < 300 ? 'success' : 'error',
            'message' => $message,
            'data' => $data,
            'timestamp' => time()
        ]);
        exit;
    }

    public static function error($message, $status = 400) {
        self::send(null, $status, $message);
    }

    public static function success($data, $message = '') {
        self::send($data, 200, $message);
    }
}

// Authentication Middleware
class APIAuth {
    public static function authenticate() {
        $headers = getallheaders();
        $api_key = $headers['X-API-Key'] ?? $_GET['api_key'] ?? null;

        if (!$api_key) {
            APIResponse::error('API key required', 401);
        }

        // Validate API key (you can store these in database)
        $valid_keys = [
            'unikart_web_key_2024' => ['type' => 'web', 'permissions' => ['read', 'write']],
            'unikart_mobile_key_2024' => ['type' => 'mobile', 'permissions' => ['read', 'write']],
            'unikart_public_key_2024' => ['type' => 'public', 'permissions' => ['read']]
        ];

        if (!isset($valid_keys[$api_key])) {
            APIResponse::error('Invalid API key', 401);
        }

        return $valid_keys[$api_key];
    }

    public static function requirePermission($permission) {
        $auth = self::authenticate();
        if (!in_array($permission, $auth['permissions'])) {
            APIResponse::error('Insufficient permissions', 403);
        }
        return true;
    }
}

// Input validation
class APIValidator {
    public static function validateRequired($data, $fields) {
        foreach ($fields as $field) {
            if (!isset($data[$field]) || (is_string($data[$field]) && empty(trim($data[$field])))) {
                APIResponse::error("Field '$field' is required");
            }
        }
    }

    public static function validateEmail($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            APIResponse::error('Invalid email format');
        }
    }

    public static function validateNumber($number, $min = null, $max = null) {
        if (!is_numeric($number)) {
            APIResponse::error('Must be a number');
        }
        if ($min !== null && $number < $min) {
            APIResponse::error("Must be at least $min");
        }
        if ($max !== null && $number > $max) {
            APIResponse::error("Must be at most $max");
        }
    }

    public static function validateSKU($sku) {
        if (!preg_match('/^[A-Z0-9\-_]+$/', $sku)) {
            APIResponse::error('SKU must contain only uppercase letters, numbers, hyphens, and underscores');
        }
    }
}

// Database helper functions for PostgreSQL
class DBHelper {
    private static $conn;

    public static function setConnection($conn) {
        self::$conn = $conn;
    }

    public static function getConnection() {
        return self::$conn;
    }

    // Execute query with parameters
    public static function execute($query, $params = []) {
        $stmt = self::$conn->prepare($query);
        $stmt->execute($params);
        return $stmt;
    }

    // Get single row
    public static function fetchOne($query, $params = []) {
        $stmt = self::execute($query, $params);
        return $stmt->fetch();
    }

    // Get all rows
    public static function fetchAll($query, $params = []) {
        $stmt = self::execute($query, $params);
        return $stmt->fetchAll();
    }

    // Get count
    public static function count($query, $params = []) {
        $result = self::fetchOne($query, $params);
        return $result ? (int)$result['count'] : 0;
    }

    // Insert and return ID
    public static function insert($table, $data) {
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $query = "INSERT INTO $table ($columns) VALUES ($placeholders) RETURNING *";

        $stmt = self::$conn->prepare($query);
        $stmt->execute(array_values($data));
        return $stmt->fetch();
    }

    // Update
    public static function update($table, $data, $where, $whereParams = []) {
        $setParts = [];
        foreach (array_keys($data) as $column) {
            $setParts[] = "$column = ?";
        }
        $setClause = implode(', ', $setParts);

        $query = "UPDATE $table SET $setClause WHERE $where";
        $params = array_merge(array_values($data), $whereParams);

        $stmt = self::$conn->prepare($query);
        $stmt->execute($params);
        return $stmt->rowCount();
    }
}

// Initialize database helper
DBHelper::setConnection($conn);

?>