<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

require 'db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

$sql = "INSERT INTO entries (name, project_name, ip_type, workload, deadline) VALUES (?, ?, ?, ?, ?)";
$stmt= $pdo->prepare($sql);

try {
    $stmt->execute([
        $data['name'],
        $data['project'],
        $data['ipType'],
        $data['workload'],
        $data['deadline']
    ]);
    echo json_encode(['status' => 'success', 'message' => 'Entry added successfully!']);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?> 