async function fetchDataAndRenderCharts() {
    const response = await fetch('api/get_data.php');
    const entries = await response.json();

    // 1. Process data for Workload by Person
    const workloadByPerson = entries.reduce((acc, entry) => {
        acc[entry.name] = (acc[entry.name] || 0) + parseInt(entry.workload, 10);
        return acc;
    }, {});

    // 2. Process data for Workload by Project
    const workloadByProject = entries.reduce((acc, entry) => {
        acc[entry.project_name] = (acc[entry.project_name] || 0) + parseInt(entry.workload, 10);
        return acc;
    }, {});

    // Render charts
    renderBarChart('workloadByPersonChart', 'Workload by Person (hours)', workloadByPerson);
    renderPieChart('workloadByProjectChart', 'Workload by Project (hours)', workloadByProject);
}

function renderBarChart(canvasId, label, data) {
    new Chart(document.getElementById(canvasId), {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{ label, data: Object.values(data) }]
        }
    });
}

function renderPieChart(canvasId, label, data) {
    new Chart(document.getElementById(canvasId), {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{ label, data: Object.values(data) }]
        }
    });
}

fetchDataAndRenderCharts(); 