document.getElementById('entry-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('api/submit_entry.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    const messageDiv = document.getElementById('response-message');
    if (response.ok) {
        messageDiv.className = 'alert alert-success';
        form.reset();
    } else {
        messageDiv.className = 'alert alert-danger';
    }
    messageDiv.textContent = result.message;
}); 