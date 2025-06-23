document.addEventListener('DOMContentLoaded', () => {
    const entryForm = document.getElementById('entry-form');
    if (entryForm) {
        entryForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(entryForm);

            // Optional: Log formData entries to see what is being sent
            // for (let [key, value] of formData.entries()) {
            //     console.log(key, value);
            // }

            const messageDiv = document.getElementById('response-message');
            messageDiv.textContent = 'Submitting...';
            messageDiv.className = 'alert alert-info';

            try {
                const response = await fetch('api/submit_entry.php', {
                    method: 'POST',
                    body: formData, // When using FormData, do not set Content-Type header
                });

                const result = await response.json();

                if (result.status === 'success' || (result.status === 'debug' && result.post_data)) {
                     messageDiv.className = 'alert alert-success';
                     entryForm.reset();
                } else {
                     messageDiv.className = 'alert alert-danger';
                }
                
                // For debugging, display the full server response
                if (result.status === 'debug') {
                    messageDiv.textContent = 'DEBUG: ' + result.message + ' POST_DATA: ' + JSON.stringify(result.post_data);
                } else {
                    messageDiv.textContent = result.message;
                }

            } catch (error) {
                console.error('Submission error:', error);
                messageDiv.className = 'alert alert-danger';
                messageDiv.textContent = 'An error occurred while submitting the form. Please check the console.';
            }
        });
    }
}); 