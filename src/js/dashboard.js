document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('task-table-body');
    const dvFilter = document.getElementById('dv-filter');
    let allTasks = [];

    // Fetch all data from the backend
    async function fetchData() {
        try {
            const response = await fetch('api/get_data.php');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();

            if (result.status === 'success') {
                allTasks = result.data;
                populateDvFilter(allTasks);
                renderTable(allTasks);
            } else {
                console.error('API error:', result.message);
                tableBody.innerHTML = `<tr><td colspan="18" class="text-center text-danger">Error loading data: ${result.message}</td></tr>`;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            tableBody.innerHTML = `<tr><td colspan="18" class="text-center text-danger">Could not connect to the server.</td></tr>`;
        }
    }

    // Populate the DV filter dropdown with unique names
    function populateDvFilter(tasks) {
        const dvs = [...new Set(tasks.map(task => task.dv))];
        dvFilter.innerHTML = '<option value="">All DVs</option>'; // Reset
        dvs.sort().forEach(dv => {
            const option = document.createElement('option');
            option.value = dv;
            option.textContent = dv;
            dvFilter.appendChild(option);
        });
    }

    // Render the main data table
    function renderTable(tasks) {
        tableBody.innerHTML = ''; // Clear existing rows

        if (tasks.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="18" class="text-center">No tasks found.</td></tr>';
            return;
        }

        tasks.forEach(task => {
            const row = document.createElement('tr');
            // This order MUST match the <th> order in dashboard.html
            row.innerHTML = `
                <td>${task.index_num || ''}</td>
                <td>${task.alternative_name || ''}</td>
                <td>${task.dd || ''}</td>
                <td>${task.pl || ''}</td>
                <td>${task.bu || ''}</td>
                <td>${task.assign_date || ''}</td>
                <td>${task.finish_date || ''}</td>
                <td>${task.dv || ''}</td>
                <td>${task.project || ''}</td>
                <td>${task.ip || ''}</td>
                <td>${task.ip_postfix || ''}</td>
                <td>${task.priority || ''}</td>
                <td>${task.to_date || ''}</td>
                <td>${task.status || ''}</td>
                <td>${task.load_total || ''}</td>
                <td>${task.load_remain || ''}</td>
                <td>${task.remark || ''}</td>
                <td>${task.source || ''}</td>
                <td>${new Date(task.created_at).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Event listener for the DV filter
    dvFilter.addEventListener('change', () => {
        const selectedDv = dvFilter.value;
        const filteredTasks = selectedDv 
            ? allTasks.filter(task => task.dv === selectedDv)
            : allTasks;
        renderTable(filteredTasks);
    });

    // Initial data load
    fetchData();
}); 