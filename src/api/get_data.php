<?php
header('Content-Type: application/json');

require 'db_connect.php';

$filter_conditions = [];
$bind_params = [];
$types = '';

if (!empty($_GET['dv'])) {
    $filter_conditions[] = 'dv = ?';
    $bind_params[] = $_GET['dv'];
    $types .= 's';
}

$sql = "SELECT * FROM tasks";

if (!empty($filter_conditions)) {
    $sql .= " WHERE " . implode(' AND ', $filter_conditions);
}

$sql .= " ORDER BY created_at DESC";

$stmt = $conn->prepare($sql);

if ($stmt) {
    if (!empty($bind_params)) {
        $stmt->bind_param($types, ...$bind_params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $tasks = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
} else {
    $tasks = []; // In case of query error
}

echo json_encode(['status' => 'success', 'data' => $tasks]);

$conn->close();
?> 