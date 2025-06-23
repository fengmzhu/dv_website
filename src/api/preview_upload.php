<?php

// Main entry point
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_error('Method not allowed', 405);
}

if (!isset($_FILES['task_file']) || $_FILES['task_file']['error'] !== UPLOAD_ERR_OK) {
    send_json_error('File upload error.');
}

$file = $_FILES['task_file'];
$file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if ($file_extension !== 'json') {
    send_json_error('Unsupported file type. Please upload a .json file.');
}

try {
    $data = parse_json_file($file['tmp_name']);
    // Send the parsed data back to the frontend
    echo json_encode(['status' => 'success', 'data' => $data]);
} catch (Exception $e) {
    send_json_error('An error occurred during file processing: ' . $e->getMessage());
}

// --- Helper Functions ---

function parse_json_file($file_path) {
    $json_content = file_get_contents($file_path);
    if ($json_content === false) {
        throw new Exception("Could not read the JSON file.");
    }
    
    $raw_data = json_decode($json_content, true);
    if ($raw_data === null) {
        throw new Exception("Invalid JSON format.");
    }

    $mapped_data = [];
    foreach ($raw_data as $row) {
        // Map the keys from the Python script's output to the database schema keys
        $mapped_data[] = [
            // New fields
            'index_num' => $row['Index'] ?? null,
            'alternative_name' => $row['Alternative Name'] ?? null,
            'dd' => $row['DD'] ?? null,
            'pl' => $row['PL'] ?? null,
            'bu' => $row['BU'] ?? null,
            'assign_date' => $row['Assign Date'] ?? null,
            'finish_date' => $row['Finish Date'] ?? null,

            // Existing fields
            'project' => $row['Project'] ?? null,
            'ip' => $row['IP'] ?? null,
            'dv' => $row['DV'] ?? null,
            'to_date' => $row['TO Date'] ?? null,
            'status' => $row['Status'] ?? null,
            'load_total' => $row['Load Total'] ?? null,
            'load_remain' => $row['Load Remain'] ?? null,
            'ip_postfix' => $row['IP Postfix'] ?? null,
            'remark' => $row['Remark'] ?? null,
            'priority' => $row['Priority'] ?? null
            // We don't map Assign Date or Finish Date here as they are not in the tasks table yet
        ];
    }
    
    return $mapped_data;
}

function send_json_error($message, $http_code = 400) {
    http_response_code($http_code);
    echo json_encode(['status' => 'error', 'message' => $message]);
    exit;
} 