
function showJobs(category) {
    document.getElementById('fresher jobs').classList.add('hidden');
    document.getElementById('internships').classList.add('hidden');
    document.getElementById('part-time').classList.add('hidden');

    document.getElementById(category).classList.remove('hidden');

    let buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.querySelector(`[onclick="showJobs('${category}')"]`).classList.add('active');
}

  document.getElementById('addJobBtn').addEventListener('click', function() {
    window.location.href = '/add-job.html';  // redirect to add-job page
  });



// Job Search Functionality
document.getElementById("search").addEventListener("input", function () {
    let searchTerm = this.value.toLowerCase();
    let jobs = document.querySelectorAll(".job");
    let matchCount = 0;

    jobs.forEach(job => {
        let jobText = job.innerText.toLowerCase();
        if (jobText.includes(searchTerm)) {
            job.style.display = "block";
            matchCount++;
        } else {
            job.style.display = "none";
        }
    });

    // Show or hide "No jobs found"
    const noResults = document.getElementById("no-results");
    if (matchCount === 0) {
        noResults.classList.remove("hidden");
    } else {
        noResults.classList.add("hidden");
    }
});
function openModal() {
    document.getElementById("applyModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("applyModal").classList.add("hidden");
}

// This will show the success popup
function showSuccessPopup() {
    document.getElementById('successPopup').classList.remove('hidden');
}

// This will hide the success popup
function closeSuccessPopup() {
    document.getElementById('successPopup').classList.add('hidden');
}

// ✅ Update form submit function
document.getElementById("applicationForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from refreshing

    const name = document.getElementById("applicantName").value;
    const email = document.getElementById("applicantEmail").value;
    const message = document.getElementById("applicantMessage").value;

    // ✅ Send data to the server
    try {
        const response = await fetch('/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();

        if (result.success) {
            showSuccessPopup();  // ✅ Show success popup
            this.reset();        // ✅ Clear the form
            closeModal();        // ✅ Close the application form
        } else {
            alert('Failed to submit application. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Something went wrong. Please try again later.');
    }
});
window.onload = async function() {
    try {
        const response = await fetch('/get-jobs');
        const data = await response.json();

        // Display Fresher Jobs
        const fresherContainer = document.getElementById('fresher jobs').querySelector('.job-listings');
        data.fresherJobs.forEach(job => {
            fresherContainer.innerHTML += `
                <div class="job">
                    <h3>${job.title}</h3>
                    <p><strong>Company:</strong> ${job.company}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p class="experience">Experience: ${job.experience}</p>
                    <button onclick="openModal()">Apply Now</button>
                </div>
            `;
        });

        // Display Part-Time Jobs
        const partTimeContainer = document.getElementById('part-time').querySelector('.job-listings');
        data.partTimeJobs.forEach(job => {
            partTimeContainer.innerHTML += `
                <div class="job">
                    <h3>${job.title}</h3>
                    <p><strong>Company:</strong> ${job.company}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p class="experience">Experience: ${job.experience}</p>
                    <button onclick="openModal()">Apply Now</button>
                </div>
            `;
        });

        // Display Internship Jobs
        const internshipContainer = document.getElementById('internships').querySelector('.job-listings');
        data.internshipJobs.forEach(job => {
            internshipContainer.innerHTML += `
                <div class="job">
                    <h3>${job.title}</h3>
                    <p><strong>Company:</strong> ${job.company}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p class="experience">Experience: ${job.experience}</p>
                    <button onclick="openModal()">Apply Now</button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
};

