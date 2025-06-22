CREATE TABLE entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    ip_type VARCHAR(100) NOT NULL,
    workload INT NOT NULL,
    deadline DATE NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 