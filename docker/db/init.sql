-- Drop the old, rigid table if it exists to ensure a clean slate.
DROP TABLE IF EXISTS entries;

-- Create the new, flexible tasks table.
-- This table will be the single source of truth for all tasks,
-- whether they come from manual entry or file uploads.
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- New fields from the Excel/JSON file
    index_num INT,
    alternative_name VARCHAR(255),
    dd VARCHAR(100),
    pl VARCHAR(100),
    bu VARCHAR(100),
    assign_date DATE,
    finish_date DATE,

    -- Core, required fields that must exist for any task.
    project VARCHAR(255) NOT NULL,
    ip VARCHAR(255) NOT NULL,
    dv VARCHAR(100) NOT NULL,
    to_date DATE NOT NULL,

    -- Optional fields that can be null.
    -- These can come from the detailed Excel uploads or future form fields.
    status VARCHAR(100),
    load_total DECIMAL(10, 2),
    load_remain DECIMAL(10, 2),
    ip_postfix VARCHAR(255),
    remark TEXT,
    priority VARCHAR(50),
    
    -- Metadata for tracking where the record came from and when it was added.
    source VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 