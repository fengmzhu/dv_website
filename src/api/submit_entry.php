<?php
// Log all errors to a file instead of displaying them
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');
ini_set('display_errors', 0); // Do not display errors to the browser

// --- Main Execution ---
header('Content-Type: application/json');
$response = ['status' => 'error', 'message' => 'An unknown server error occurred. Please check the logs.'];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method.');
    }

    require_once 'db_connect.php';

    // Required fields from the form
    $required_fields = ['dv', 'project', 'ip', 'to_date'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            $response['message'] = "Error: Required field '{$field}' is missing.";
            echo json_encode($response);
            exit;
        }
    }

    // All possible fields from the form (required and optional)
    $all_fields = [
        'dv', 'project', 'ip', 'to_date', 
        'status', 'load_total', 'load_remain', 'ip_postfix', 'remark', 'priority',
        'index_num', 'alternative_name', 'dd', 'pl', 'bu', 'assign_date', 'finish_date'
    ];
    
    $data_to_insert = [];
    foreach ($all_fields as $field) {
        if (isset($_POST[$field]) && $_POST[$field] !== '') {
            $data_to_insert[$field] = $_POST[$field];
        }
    }

    // Add the source field
    $data_to_insert['source'] = 'manual';

    if (empty($data_to_insert) || empty($_POST['dv'])) { // Also check a required field
        throw new Exception('No data to insert or missing required fields.');
    }

    $columns = implode(', ', array_keys($data_to_insert));
    $placeholders = implode(', ', array_fill(0, count($data_to_insert), '?'));

    $sql = "INSERT INTO tasks ($columns) VALUES ($placeholders)";
    $stmt = $conn->prepare($sql);

    $types = '';
    $values = [];
    foreach (array_keys($data_to_insert) as $key) {
        if (in_array($key, ['load_total', 'load_remain'])) $types .= 'd';
        else if ($key === 'index_num') $types .= 'i';
        else $types .= 's';
        $values[] = $data_to_insert[$key];
    }

    $stmt->bind_param($types, ...$values);
    $stmt->execute();
    
    $response['status'] = 'success';
    $response['message'] = 'New record created successfully';
    
    $stmt->close();
    $conn->close();

} catch (Throwable $e) {
    // Log any exception or error to our file
    error_log($e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
    // The generic response will be sent, as defined at the top.
}

echo json_encode($response);
?> 