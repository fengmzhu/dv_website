# Update Summary (Latest Changes)

## Summary of Changes
- **New files added:**
  - `.env`: Environment variable file for local development.
  - `src/api/batch_insert.php`: Backend script for batch inserting tasks.
  - `src/api/preview_upload.php`: Backend script for previewing uploaded files (Excel/JSON).
  - `src/css/main.css`: Main stylesheet for the application.
  - `src/js/upload.js`: JavaScript for handling upload and preview logic.
  - `src/upload.html`: New page for uploading and previewing bulk data.
- **Modified files:**
  - `docker/db/init.sql`: Updated database schema, likely to support new fields in the `tasks` table.
  - `docker/web/Dockerfile`: Updated Dockerfile for the web service, possibly to support new dependencies or configuration.
  - `src/api/db_connect.php`, `get_data.php`, `submit_entry.php`: Updated backend scripts to support new schema and features.
  - `src/dashboard.html`, `index.html`: Updated frontend to support new fields and workflows.
  - `src/js/dashboard.js`, `main.js`: Updated JavaScript to support new UI and data handling.

## Potential Issues
- **Environment Configuration:** Ensure `.env` is not committed to production or public repos, as it may contain sensitive data.
- **Database Migration:** If the database schema has changed, existing data may need to be migrated or the database reset.
- **Dependency Management:** If new PHP or JS dependencies are required (e.g., PhpSpreadsheet for Excel parsing), ensure they are installed in both local and production environments.
- **Frontend/Backend Sync:** All new fields and workflows must be consistently handled across frontend forms, backend scripts, and the database.
- **Testing:** New upload and batch insert features should be thoroughly tested for edge cases, such as invalid files, missing required fields, or partial failures.
- **Docker Build:** Changes to the Dockerfile may require rebuilding the container (`docker-compose build`).

# Technical Roadmap: Application Overhaul

This document outlines the phased approach to adding new, flexible data entry features to the application.

### The Core Challenge: Data Flexibility

The main challenge is handling a "schema" (the set of fields) that can change. Some entries will come from a form with a few required fields, some will come from an Excel file with many columns, and we want to add more fields later.

The best way to handle this is to have a **single, definitive database table** that can accommodate all possible fields, marking only the truly essential ones as required.

---

### Phase 1: The Database Foundation (The "Single Source of Truth")

Everything starts with the database. We will create a new, flexible table called `tasks`.

1.  **Design the `tasks` table:**
    *   It will have columns for all known fields: `Project`, `IP`, `DV`, `TO Date`, and all other optional fields from the Excel file.
    *   The few truly required fields (`Project`, `IP`, `DV`, `TO Date`) will be marked as `NOT NULL`.
    *   All other fields will be optional (allowed to be `NULL`).
    *   It will have a unique `id` and tracking metadata.

2.  **Example `CREATE TABLE` statement:**
    ```sql
    CREATE TABLE tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        -- Required Fields
        project VARCHAR(255) NOT NULL,
        ip VARCHAR(255) NOT NULL,
        dv VARCHAR(100) NOT NULL,
        to_date DATE NOT NULL,
        -- Optional Fields (examples from Excel file)
        status VARCHAR(100),
        load_total DECIMAL(10, 2),
        load_remain DECIMAL(10, 2),
        ip_postfix VARCHAR(255),
        remark TEXT,
        priority VARCHAR(50),
        
        -- Tracking metadata
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        source VARCHAR(50) -- To track if it came from 'manual_entry' or 'excel_upload'
    );
    ```

---

### Phase 2: Upgrading the Manual Entry Form

Adapt the existing `index.html` page to use this new table.

1.  **Update `index.html`:** Add new optional input fields as needed.
2.  **Update `src/api/submit_entry.php`:**
    *   Change the script to `INSERT` into the new `tasks` table.
    *   Handle optional fields by inserting `NULL` if they are not provided.

---

### Phase 3: The Upload & Preview Workflow

This is the most complex feature, involving a multi-step user process.

**Step A: The Upload Page (Frontend)**
1.  **Create `upload.html`:** A new page with a form for file uploads (`.xlsx`, `.json`).
2.  The page will have a "Preview Upload" button and a hidden `div` to show the results.

**Step B: The Parser (Backend)**
1.  **Create `api/preview_upload.php`:** This script's only job is to parse the uploaded file.
    *   It does **not** add anything to the database.
    *   It handles `.xlsx` (using `PhpSpreadsheet`) and `.json` files.
    *   It validates the data in each row.
    *   It sends back a JSON array of all valid tasks found in the file.

**Step C: The Preview & Selection Page (Frontend)**
1.  **Create `js/upload.js`:** This script will power the `upload.html` page.
    *   It sends the file to `preview_upload.php` for parsing.
    *   It receives the JSON array of tasks back from the server.
    *   It dynamically generates an HTML table to display the tasks.
    *   Each row in the table will have a **checkbox** for selection.

**Step D: The Final Insert (Backend)**
1.  **Create `api/batch_insert.php`:** This script completes the process.
    *   It receives a JSON array containing only the tasks the user selected with checkboxes.
    *   It loops through the array and `INSERT`s each task into the `tasks` table, ideally within a single database transaction for safety.

---

### How to Add More Fields in the Future

This architecture makes future enhancements much easier.

1.  **Database:** Run an `ALTER TABLE tasks ADD COLUMN ...` command on MySQL.
2.  **Manual Form:** Add the new input field to `index.html` and update `submit_entry.php`.
3.  **Upload Parser:** Update `preview_upload.php` to look for the new column header when parsing.
4.  **Frontend Preview:** Update `js/upload.js` to display the new field in the preview table.

This provides a robust, scalable, and maintainable way forward. 