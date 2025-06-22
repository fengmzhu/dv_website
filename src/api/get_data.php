<?php
header('Content-Type: application/json');
require 'db_connect.php';

$stmt = $pdo->query("SELECT name, project_name, ip_type, workload, DATE_FORMAT(deadline, '%Y-%m-%d') as deadline FROM entries ORDER BY submission_date DESC");
$entries = $stmt->fetchAll();

echo json_encode($entries);
?> 