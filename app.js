document.addEventListener('DOMContentLoaded', () => {
    // Store sample username and password in local storage
    localStorage.setItem('username', 'admin');
    localStorage.setItem('password', 'password123');

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');

            if (username === storedUsername && password === storedPassword) {
                window.location.href = 'resume.html';
            } else {
                document.getElementById('error-message').innerText = 'Invalid username/password';
            }
        });
    }

    // Prevent back navigation to the login page from the resume page
    if (window.location.href.includes('resume.html')) {
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', function () {
            window.history.pushState(null, null, window.location.href);
        });

        let currentIndex = 0;
        let applicants = [];

        // Fetch applicants from the JSON file
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                applicants = data;
                displayApplicant(currentIndex);
            });

        // Display applicant details
        function displayApplicant(index) {
            if (applicants.length > 0) {
                const applicant = applicants[index];
                document.getElementById('name').innerText = applicant.name;
                document.getElementById('email').innerText = applicant.email;
                document.getElementById('job').innerText = applicant.job;

                document.getElementById('prevButton').style.display = index === 0 ? 'none' : 'inline-block';
                document.getElementById('nextButton').style.display = index === applicants.length - 1 ? 'none' : 'inline-block';
            }
        }

        // Next and Previous Button Events
        document.getElementById('nextButton').addEventListener('click', function () {
            if (currentIndex < applicants.length - 1) {
                currentIndex++;
                displayApplicant(currentIndex);
            }
        });

        document.getElementById('prevButton').addEventListener('click', function () {
            if (currentIndex > 0) {
                currentIndex--;
                displayApplicant(currentIndex);
            }
        });

        // Filter by Job
        document.getElementById('searchJob').addEventListener('input', function () {
            const searchQuery = this.value.toLowerCase();
            const filteredApplicants = applicants.filter(applicant => applicant.job.toLowerCase() === searchQuery);

            if (filteredApplicants.length > 0) {
                applicants = filteredApplicants;
                currentIndex = 0;
                displayApplicant(currentIndex);
            } else {
                alert('Invalid search or No applications for this job');
            }
        });
    }
});
