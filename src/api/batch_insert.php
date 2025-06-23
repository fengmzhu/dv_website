<?php
header('Content-Type: application/json');

require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data) || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No data provided or invalid format.']);
    exit;
}

try {
    // Begin a transaction
    $conn->begin_transaction();
    
    $inserted_count = 0;
    foreach ($data as $task) {
        if (empty($task)) continue;

        // Add the source
        $task['source'] = 'json_upload';

        $columns = implode(', ', array_keys($task));
        $placeholders = implode(', ', array_fill(0, count($task), '?'));
        
        $sql = "INSERT INTO tasks ($columns) VALUES ($placeholders)";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $types = str_repeat('s', count($task)); // Assume all are strings for simplicity
            $stmt->bind_param($types, ...array_values($task));
            
            if ($stmt->execute()) {
                $inserted_count++;
            } else {
                throw new Exception("Error executing statement: " . $stmt->error);
            }
            $stmt->close();
        } else {
            throw new Exception("Error preparing statement: " . $conn->error);
        }
    }

    // If all inserts were successful, commit the transaction
    $conn->commit();
    
    echo json_encode(['status' => 'success', 'message' => "$inserted_count tasks added to the database successfully!"]);

} catch (\Exception $e) {
    // If any insert fails, roll back the entire transaction
    $conn->rollback();
    http_response_code(500);
    error_log('Batch insert error: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'A database error occurred during the batch insert. No tasks were added. Error: ' . $e->getMessage()]);
}

$conn->close();
?> 