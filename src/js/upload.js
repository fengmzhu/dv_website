// This file will handle the logic for the file upload page.

document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const previewArea = document.getElementById('preview-area');
    const previewTableContainer = document.getElementById('preview-table-container');
    const addToDbBtn = document.getElementById('add-to-db-btn');
    const uploadStatus = document.getElementById('upload-status');
    const fileInput = document.getElementById('task-file');

    let parsedData = []; // To store the data from the preview

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        uploadStatus.innerHTML = '';
        
        if (!fileInput.files.length) {
            uploadStatus.innerHTML = `<div class="alert alert-danger">Please select a file to upload.</div>`;
            return;
        }

        const formData = new FormData();
        formData.append('task_file', fileInput.files[0]);

        uploadStatus.innerHTML = `<div class="alert alert-info">Uploading and parsing...</div>`;

        try {
            const response = await fetch('api/preview_upload.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 'success') {
                parsedData = result.data;
                renderPreviewTable(parsedData);
                previewArea.classList.remove('d-none');
                uploadStatus.innerHTML = `<div class="alert alert-success">${parsedData.length} records parsed successfully. Please review and select entries to add.</div>`;
            } else {
                uploadStatus.innerHTML = `<div class="alert alert-danger">Error: ${result.message}</div>`;
                previewArea.classList.add('d-none');
            }
        } catch (error) {
            uploadStatus.innerHTML = `<div class="alert alert-danger">A network or server error occurred.</div>`;
            console.error('Upload error:', error);
        }
    });

    function renderPreviewTable(data) {
        if (!data.length) {
            previewTableContainer.innerHTML = '<p>No valid data found to preview.</p>';
            return;
        }

        const headers = Object.keys(data[0]);
        const table = document.createElement('table');
        table.className = 'table table-bordered table-striped table-hover';

        // Create table header
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        const thCheckbox = document.createElement('th');
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = 'select-all-checkbox';
        thCheckbox.appendChild(selectAllCheckbox);
        headerRow.appendChild(thCheckbox);

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        // Create table body
        const tbody = table.createTBody();
        data.forEach((row, index) => {
            const tr = tbody.insertRow();
            const tdCheckbox = tr.insertCell();
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'row-checkbox';
            checkbox.dataset.index = index;
            tdCheckbox.appendChild(checkbox);

            headers.forEach(header => {
                const td = tr.insertCell();
                td.textContent = row[header];
            });
        });

        previewTableContainer.innerHTML = '';
        previewTableContainer.appendChild(table);

        // Add event listener for "Select All"
        selectAllCheckbox.addEventListener('change', (e) => {
            document.querySelectorAll('.row-checkbox').forEach(cb => {
                cb.checked = e.target.checked;
            });
        });
    }

    addToDbBtn.addEventListener('click', async () => {
        const selectedRows = [];
        document.querySelectorAll('.row-checkbox:checked').forEach(cb => {
            selectedRows.push(parsedData[cb.dataset.index]);
        });

        if (selectedRows.length === 0) {
            uploadStatus.innerHTML = `<div class="alert alert-warning">Please select at least one entry to add.</div>`;
            return;
        }

        uploadStatus.innerHTML = `<div class="alert alert-info">Adding ${selectedRows.length} entries to the database...</div>`;

        try {
            const response = await fetch('api/batch_insert.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedRows)
            });

            const result = await response.json();

            if (result.status === 'success') {
                uploadStatus.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
                // Optionally, clear the preview area after successful insertion
                previewArea.classList.add('d-none');
                fileInput.value = ''; // Reset file input
            } else {
                uploadStatus.innerHTML = `<div class="alert alert-danger">Error: ${result.message}</div>`;
            }
        } catch (error) {
            uploadStatus.innerHTML = `<div class="alert alert-danger">A network or server error occurred during the final submission.</div>`;
            console.error('Batch insert error:', error);
        }
    });
}); 