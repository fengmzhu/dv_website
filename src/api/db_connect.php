<?php
// FOR DEBUGGING ONLY - Using hardcoded credentials
$host = 'db'; // This is the service name from docker-compose.yml
$dbname = getenv('MYSQL_DATABASE');
$user = getenv('MYSQL_USER');
$pass = getenv('MYSQL_PASSWORD');
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// Allow exceptions to be caught by the calling script
$pdo = new PDO($dsn, $user, $pass, $options);
?> 