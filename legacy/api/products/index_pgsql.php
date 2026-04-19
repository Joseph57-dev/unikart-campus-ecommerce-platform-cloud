<?php
require_once '../config_pgsql.php';

// Authenticate request
$auth = APIAuth::authenticate();

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? $_REQUEST;

try {
    switch($method) {
        case 'GET':
            handleGetProducts($input);
            break;
        case 'POST':
            APIAuth::requirePermission('write');
            handleCreateProduct($input);
            break;
        case 'PUT':
            APIAuth::requirePermission('write');
            handleUpdateProduct($input);
            break;
        case 'DELETE':
            APIAuth::requirePermission('write');
            handleDeleteProduct($input);
            break;
        default:
            APIResponse::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    APIResponse::error($e->getMessage(), 500);
}

function handleGetProducts($params) {
    $page = max(1, intval($params['page'] ?? 1));
    $limit = min(50, max(1, intval($params['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    $where = [];
    $queryParams = [];

    // Search filters
    if (!empty($params['search'])) {
        $where[] = "(p.name ILIKE ? OR p.description ILIKE ? OR p.short_description ILIKE ?)";
        $searchTerm = "%{$params['search']}%";
        $queryParams[] = $searchTerm;
        $queryParams[] = $searchTerm;
        $queryParams[] = $searchTerm;
    }

    if (!empty($params['category'])) {
        $where[] = "c.name = ?";
        $queryParams[] = $params['category'];
    }

    if (!empty($params['category_id'])) {
        $where[] = "p.category_id = ?";
        $queryParams[] = intval($params['category_id']);
    }

    if (!empty($params['supplier_id'])) {
        $where[] = "p.supplier_id = ?";
        $queryParams[] = intval($params['supplier_id']);
    }

    if (!empty($params['min_price'])) {
        $where[] = "p.price >= ?";
        $queryParams[] = floatval($params['min_price']);
    }

    if (!empty($params['max_price'])) {
        $where[] = "p.price <= ?";
        $queryParams[] = floatval($params['max_price']);
    }

    if (!empty($params['in_stock'])) {
        $where[] = "p.stock_quantity > 0 AND p.stock_status = 'in_stock'";
    }

    if (!empty($params['featured'])) {
        $where[] = "p.is_featured = true";
    }

    if (!empty($params['hot_deal'])) {
        $where[] = "p.is_hot_deal = true";
    }

    if (!empty($params['active'])) {
        $where[] = "p.is_active = true";
    }

    if (!empty($params['sku'])) {
        $where[] = "p.sku = ?";
        $queryParams[] = $params['sku'];
    }

    // Build query
    $whereClause = $where ? "WHERE " . implode(" AND ", $where) : "";

    // Get total count for pagination
    $countQuery = "SELECT COUNT(*) as total FROM products p LEFT JOIN category c ON p.category_id = c.category_id $whereClause";
    $total = DBHelper::count($countQuery, $queryParams);

    // Get products with sorting
    $orderBy = match($params['sort'] ?? 'newest') {
        'price_low' => 'p.price ASC',
        'price_high' => 'p.price DESC',
        'name' => 'p.name ASC',
        'rating' => 'p.rating DESC',
        'popular' => 'p.view_count DESC',
        default => 'p.created_at DESC'
    };

    $query = "SELECT
                p.product_id, p.sku, p.name, p.description, p.short_description,
                p.price, p.compare_price, p.currency, p.stock_quantity, p.stock_status,
                p.image_url, p.additional_images, p.rating, p.review_count,
                p.is_featured, p.is_hot_deal, p.is_active, p.view_count,
                c.name as category_name, s.supplier_name,
                p.created_at, p.updated_at
              FROM products p
              LEFT JOIN category c ON p.category_id = c.category_id
              LEFT JOIN supplier s ON p.supplier_id = s.supplier_id
              $whereClause
              ORDER BY $orderBy
              LIMIT ? OFFSET ?";

    $queryParams[] = $limit;
    $queryParams[] = $offset;

    $products = DBHelper::fetchAll($query, $queryParams);

    // Format response
    $response = [
        'products' => $products,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'total_pages' => ceil($total / $limit)
        ]
    ];

    APIResponse::success($response);
}

function handleCreateProduct($input) {
    APIValidator::validateRequired($input, ['name', 'sku', 'price']);
    APIValidator::validateSKU($input['sku']);
    APIValidator::validateNumber($input['price'], 0);

    // Check if SKU already exists
    $existing = DBHelper::fetchOne("SELECT product_id FROM products WHERE sku = ?", [$input['sku']]);
    if ($existing) {
        APIResponse::error('SKU already exists', 409);
    }

    $data = [
        'sku' => strtoupper($input['sku']),
        'name' => trim($input['name']),
        'description' => $input['description'] ?? '',
        'short_description' => $input['short_description'] ?? '',
        'price' => floatval($input['price']),
        'compare_price' => isset($input['compare_price']) ? floatval($input['compare_price']) : null,
        'currency' => $input['currency'] ?? 'UGX',
        'stock_quantity' => intval($input['stock_quantity'] ?? 0),
        'low_stock_threshold' => intval($input['low_stock_threshold'] ?? 5),
        'image_url' => $input['image_url'] ?? null,
        'additional_images' => isset($input['additional_images']) ? json_encode($input['additional_images']) : '[]',
        'attributes' => isset($input['attributes']) ? json_encode($input['attributes']) : '{}',
        'tags' => isset($input['tags']) ? '{' . implode(',', array_map('pg_escape_string', $input['tags'])) . '}' : '{}',
        'category_id' => isset($input['category_id']) ? intval($input['category_id']) : null,
        'supplier_id' => isset($input['supplier_id']) ? intval($input['supplier_id']) : null,
        'is_featured' => $input['is_featured'] ?? false,
        'is_hot_deal' => $input['is_hot_deal'] ?? false,
        'is_active' => $input['is_active'] ?? true
    ];

    $product = DBHelper::insert('products', $data);
    APIResponse::success($product, 'Product created successfully');
}

function handleUpdateProduct($input) {
    APIValidator::validateRequired($input, ['product_id']);

    $productId = intval($input['product_id']);

    // Check if product exists
    $existing = DBHelper::fetchOne("SELECT * FROM products WHERE product_id = ?", [$productId]);
    if (!$existing) {
        APIResponse::error('Product not found', 404);
    }

    // Check SKU uniqueness if being updated
    if (!empty($input['sku']) && $input['sku'] !== $existing['sku']) {
        APIValidator::validateSKU($input['sku']);
        $skuExists = DBHelper::fetchOne("SELECT product_id FROM products WHERE sku = ? AND product_id != ?",
            [$input['sku'], $productId]);
        if ($skuExists) {
            APIResponse::error('SKU already exists', 409);
        }
    }

    $data = [];
    $allowedFields = [
        'sku', 'name', 'description', 'short_description', 'price', 'compare_price',
        'currency', 'stock_quantity', 'low_stock_threshold', 'image_url', 'category_id',
        'supplier_id', 'is_featured', 'is_hot_deal', 'is_active', 'attributes', 'tags'
    ];

    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            if ($field === 'sku') {
                $data[$field] = strtoupper($input[$field]);
            } elseif ($field === 'attributes') {
                $data[$field] = json_encode($input[$field]);
            } elseif ($field === 'tags') {
                $data[$field] = '{' . implode(',', array_map('pg_escape_string', $input[$field])) . '}';
            } elseif (in_array($field, ['price', 'compare_price'])) {
                $data[$field] = floatval($input[$field]);
            } elseif (in_array($field, ['stock_quantity', 'low_stock_threshold', 'category_id', 'supplier_id'])) {
                $data[$field] = intval($input[$field]);
            } elseif (in_array($field, ['is_featured', 'is_hot_deal', 'is_active'])) {
                $data[$field] = (bool)$input[$field];
            } else {
                $data[$field] = trim($input[$field]);
            }
        }
    }

    if (empty($data)) {
        APIResponse::error('No valid fields to update');
    }

    $updated = DBHelper::update('products', $data, 'product_id = ?', [$productId]);

    if ($updated > 0) {
        $product = DBHelper::fetchOne("SELECT * FROM products WHERE product_id = ?", [$productId]);
        APIResponse::success($product, 'Product updated successfully');
    } else {
        APIResponse::error('Failed to update product');
    }
}

function handleDeleteProduct($input) {
    APIValidator::validateRequired($input, ['product_id']);

    $productId = intval($input['product_id']);

    // Check if product exists
    $existing = DBHelper::fetchOne("SELECT * FROM products WHERE product_id = ?", [$productId]);
    if (!$existing) {
        APIResponse::error('Product not found', 404);
    }

    // Soft delete by setting is_active to false
    $updated = DBHelper::update('products', ['is_active' => false], 'product_id = ?', [$productId]);

    if ($updated > 0) {
        APIResponse::success(['product_id' => $productId], 'Product deactivated successfully');
    } else {
        APIResponse::error('Failed to deactivate product');
    }
}
?>