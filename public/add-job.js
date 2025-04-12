// add-job.js

async function checkAdminAccess() {
    try {
        const response = await fetch('/check-admin', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.isAdmin) {
            // Not admin
            document.getElementById('addJobForm').style.display = 'none'; // hide form
            const container = document.querySelector('.container');
            container.innerHTML = `<h2 style="color: red;">Access Denied ❌ Only Admins Can Add Jobs</h2>`;
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 3000); // redirect after 3 seconds
        }
    } catch (error) {
        console.error('Error checking admin access:', error);
        alert('Something went wrong ❌');
    }
}

// Run this check when page loads
checkAdminAccess();

document.getElementById('addJobForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData);

    try {
        const response = await fetch('/add-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // ✅ Success
            window.location.href = '/index.html';
        } else {
            alert(data.message); // ❌ Admin access denied
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong ❌');
    }
});



  