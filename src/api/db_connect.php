<?php
// Report all mysqli errors as exceptions
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = 'db'; // The service name from docker-compose.yml
$dbname = getenv('MYSQL_DATABASE');
$user = getenv('MYSQL_USER');
$pass = getenv('MYSQL_PASSWORD');

// Create a new mysqli connection object
$conn = new mysqli($host, $user, $pass, $dbname);

// Check the connection
if ($conn->connect_error) {
    // In a real app, you would log this error, not expose it.
    // The die() call will prevent any further code execution.
    die("Connection failed: " . $conn->connect_error);
}

// Set the character set to utf8mb4 for full Unicode support
$conn->set_charset("utf8mb4");

?> 