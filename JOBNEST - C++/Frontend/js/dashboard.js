
// ================================================
// JOBNEST - DYNAMIC JOB SEEKER DASHBOARD
// Connected to C++ Backend
// ================================================

const API_URL = "http://127.0.0.1:8080/api";

// Get authenticated user
const currentUser = JSON.parse(
    localStorage.getItem("jobnestUser") || "null"
);

// Protect dashboard from unauthenticated access
if (!currentUser || !currentUser.email || !currentUser.name) {
    window.location.href = "login.html";
}

// User-specific browser storage
const storageKey = currentUser
    ? currentUser.email.toLowerCase().replace(/[^a-z0-9]/g, "_")
    : "guest";

let jobs = [];
let applications = [];
let notifications = [];

let savedJobs = JSON.parse(
    localStorage.getItem("jobnestSavedJobs_" + storageKey) || "[]"
);

// ================================================
// API REQUEST HELPER
// ================================================

async function apiRequest(endpoint, method = "GET", data = null) {
    const options = {
        method: method,
        headers: {}
    };

    if (data !== null) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    const response = await fetch(API_URL + endpoint, options);
    const result = await response.json();

    if (!response.ok || result.success === false) {
        throw new Error(result.message || "API request failed.");
    }

    return result;
}

// Prevent HTML injection when displaying user/backend data
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// ================================================
// PAGE NAVIGATION
// ================================================

function showPage(pageId) {
    document.querySelectorAll(".dashboard-page").forEach(page => {
        page.classList.toggle("active", page.id === pageId);
    });

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    const selected = document.querySelector(
        `[data-page="${pageId}"]`
    );

    const title = selected
        ? selected.textContent.trim().replace(/\d+/g, "").trim()
        : pageId.replace("-", " ");

    document.getElementById("pageTitle").textContent =
        title.charAt(0).toUpperCase() + title.slice(1);

    document.getElementById("sidebar").classList.remove("open");

    if (pageId === "find-jobs") renderJobs();
    if (pageId === "saved-jobs") renderSavedJobs();
    if (pageId === "applications") loadApplications();
    if (pageId === "notifications") loadNotifications();
}

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

document.querySelectorAll("[data-open-page]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.openPage);
    });
});

document.getElementById("mobileMenu").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
});

// ================================================
// USER PROFILE
// ================================================

let profile = {
    name: currentUser.name || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
    qualification: currentUser.qualification || "",
    skills: currentUser.skills || ""
};

const savedProfile = JSON.parse(
    localStorage.getItem("jobnestProfile_" + storageKey) || "null"
);

if (savedProfile) {
    profile = { ...profile, ...savedProfile };
}

function displayUser() {
    const firstName = profile.name.trim().split(/\s+/)[0] || "User";
    const initial = firstName.charAt(0).toUpperCase();

    document.getElementById("userName").textContent = profile.name;
    document.getElementById("welcomeName").textContent = firstName;

    document.getElementById("userAvatar").textContent = initial;
    document.getElementById("profileAvatar").textContent = initial;

    document.getElementById("profileName").value = profile.name;
    document.getElementById("profileEmail").value = profile.email;
    document.getElementById("profilePhone").value = profile.phone;
    document.getElementById("profileQualification").value =
        profile.qualification;
    document.getElementById("profileSkills").value = profile.skills;
}

// ================================================
// LOAD REAL JOBS FROM C++ BACKEND
// ================================================

async function loadJobs() {
    try {
        const result = await apiRequest("/jobs");

        jobs = (result.jobs || []).map((job, index) => ({
            id: String(job.jobID || index + 1),
            title: job.jobTitle || "Untitled Job",
            company: job.companyName || "Company",
            salary: job.salary || "Not specified",
            skills: job.skills || "",
            category: job.category || "",
            location: job.location || "Not specified",
            type: job.type || "Not specified",
            logo: (job.companyName || "J").substring(0, 2).toUpperCase()
        }));

        renderJobs();
        renderSavedJobs();
        renderRecommendedJobs();

    } catch (error) {
        console.error("Jobs loading error:", error);

        document.getElementById("allJobs").innerHTML =
            `<p class="empty-state">${escapeHTML(error.message)}</p>`;
    }
}

// ================================================
// JOB CARD
// ================================================

function createJobCard(job) {
    const isSaved = savedJobs.includes(String(job.id));

    return `
        <article class="job-result">

            <div class="company-logo">
                ${escapeHTML(job.logo)}
            </div>

            <div class="job-result-info">
                <h4>${escapeHTML(job.title)}</h4>
                <p>
                    ${escapeHTML(job.company)}
                    · ${escapeHTML(job.location)}
                    · ${escapeHTML(job.category)}
                </p>
            </div>

            <span class="job-pay">
                ${escapeHTML(job.salary)}
            </span>

            <div class="job-actions">

                <button class="small-btn save-job"
                        data-id="${escapeHTML(job.id)}">
                    ${isSaved ? "♥ Saved" : "♡ Save"}
                </button>

                <button class="small-btn primary apply-job"
                        data-id="${escapeHTML(job.id)}">
                    Apply
                </button>

            </div>

        </article>
    `;
}

// ================================================
// SAVE JOBS
// ================================================

function saveJob(jobId) {
    const id = String(jobId);

    if (savedJobs.includes(id)) {
        savedJobs = savedJobs.filter(item => item !== id);
    } else {
        savedJobs.push(id);
    }

    localStorage.setItem(
        "jobnestSavedJobs_" + storageKey,
        JSON.stringify(savedJobs)
    );

    // Also record the saved job in the C++ backend
    if (savedJobs.includes(id)) {
        apiRequest("/saved-jobs", "POST", {
            userName: currentUser.name,
            jobID: id
        }).catch(error => {
            console.error("Backend save error:", error);
        });
    }

    updateCounts();
    renderJobs();
    renderSavedJobs();
}

function renderSavedJobs() {
    const container = document.getElementById("savedJobsList");

    const list = jobs.filter(job =>
        savedJobs.includes(String(job.id))
    );

    container.innerHTML = list.length
        ? list.map(job => createJobCard(job)).join("")
        : '<p class="empty-state">You have not saved any jobs yet.</p>';

    attachJobEvents(container);
}

// ================================================
// APPLY FOR JOB - C++ BACKEND
// ================================================

async function applyForJob(jobId) {
    const job = jobs.find(item => String(item.id) === String(jobId));

    if (!job) return;

    try {
        const result = await apiRequest("/apply", "POST", {
            applicantName: currentUser.name,
            companyName: job.company,
            jobTitle: job.title
        });

        alert(result.message || "Application submitted successfully!");

        await loadApplications();
        await loadNotifications();

    } catch (error) {
        alert(error.message);
    }
}

// ================================================
// JOB BUTTON EVENTS
// ================================================

function attachJobEvents(container) {
    container.querySelectorAll(".save-job").forEach(button => {
        button.addEventListener("click", () => {
            saveJob(button.dataset.id);
        });
    });

    container.querySelectorAll(".apply-job").forEach(button => {
        button.addEventListener("click", () => {
            applyForJob(button.dataset.id);
        });
    });
}

// ================================================
// SEARCH AND FILTER JOBS
// ================================================

function renderJobs() {
    const keyword =
        document.getElementById("dashboardSearch").value
            .trim().toLowerCase();

    const location =
        document.getElementById("jobLocation").value
            .trim().toLowerCase();

    const filtered = jobs.filter(job => {
        const searchable = (
            job.title + " " +
            job.company + " " +
            job.skills + " " +
            job.category
        ).toLowerCase();

        const matchesKeyword = searchable.includes(keyword);

        const matchesLocation =
            !location ||
            job.location.toLowerCase().includes(location);

        return matchesKeyword && matchesLocation;
    });

    const container = document.getElementById("allJobs");

    container.innerHTML = filtered.length
        ? filtered.map(job => createJobCard(job)).join("")
        : '<p class="empty-state">No matching jobs found.</p>';

    document.getElementById("jobResultCount").textContent =
        `${filtered.length} job(s) found`;

    attachJobEvents(container);
}

document.getElementById("dashboardSearchBtn")
    .addEventListener("click", renderJobs);

document.getElementById("dashboardSearch")
    .addEventListener("input", renderJobs);

document.getElementById("jobLocation")
    .addEventListener("change", renderJobs);

// ================================================
// LOAD REAL APPLICATIONS FROM C++ BACKEND
// ================================================

async function loadApplications() {
    try {
        const result = await apiRequest("/applications", "POST", {
            name: currentUser.name
        });

        applications = (result.applications || []).map(item => ({
            job: item.jobTitle,
            company: item.companyName,
            date: "—",
            status: item.status || "Applied"
        }));

        renderApplications();
        updateCounts();

    } catch (error) {
        console.error("Applications loading error:", error);

        document.getElementById("applicationsTable").innerHTML =
            `<tr><td colspan="4">${escapeHTML(error.message)}</td></tr>`;
    }
}

function renderApplications() {
    const tbody = document.getElementById("applicationsTable");

    tbody.innerHTML = applications.length
        ? applications.map(item => {
            const status = String(item.status || "Applied");

            let statusClass = "status-pending";

            if (status.toLowerCase().includes("short")) {
                statusClass = "status-shortlisted";
            } else if (status.toLowerCase().includes("review")) {
                statusClass = "status-reviewed";
            }

            return `
                <tr>
                    <td>${escapeHTML(item.job)}</td>
                    <td>${escapeHTML(item.company)}</td>
                    <td>${escapeHTML(item.date)}</td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            ${escapeHTML(status)}
                        </span>
                    </td>
                </tr>
            `;
        }).join("")
        : '<tr><td colspan="4">No applications yet.</td></tr>';

    document.getElementById("applicationCount").textContent =
        applications.length;
}

// ================================================
// LOAD NOTIFICATIONS FROM C++ BACKEND
// ================================================

async function loadNotifications() {
    try {
        const result = await apiRequest("/notifications", "POST", {
            name: currentUser.name
        });

        notifications = (result.notifications || []).map(item => ({
            title: "Application Update",
            message: item.message,
            time: "Latest update"
        }));

        renderNotifications();

        document.querySelector(".notification-count").textContent =
            notifications.length;

    } catch (error) {
        console.error("Notifications loading error:", error);
    }
}

function renderNotifications() {
    const container = document.getElementById("notificationList");

    container.innerHTML = notifications.length
        ? notifications.map(item => `
            <div class="notification-item">
                <div class="notification-symbol">✦</div>
                <div>
                    <strong>${escapeHTML(item.title)}</strong>
                    <p>${escapeHTML(item.message)}</p>
                    <p>${escapeHTML(item.time)}</p>
                </div>
            </div>
        `).join("")
        : '<p class="empty-state">No notifications yet.</p>';
}

// ================================================
// RECOMMENDED JOBS
// ================================================

function renderRecommendedJobs() {
    const container = document.getElementById("recommendedJobs");

    container.innerHTML = jobs.length
        ? jobs.slice(0, 3).map(job => `
            <div class="recommended-job">
                <div class="company-logo">${escapeHTML(job.logo)}</div>
                <div>
                    <h4>${escapeHTML(job.title)}</h4>
                    <p>${escapeHTML(job.company)} · ${escapeHTML(job.location)}</p>
                </div>
                <span class="job-pay">${escapeHTML(job.salary)}</span>
            </div>
        `).join("")
        : '<p class="empty-state">No recommended jobs available.</p>';
}

// ================================================
// DASHBOARD COUNTS
// ================================================

function updateCounts() {
    document.getElementById("savedCount").textContent =
        savedJobs.length;

    document.getElementById("applicationCount").textContent =
        applications.length;
}

// ================================================
// PROFILE UPDATE - BROWSER STORAGE
// ================================================

document.getElementById("profileForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();

        profile.name =
            document.getElementById("profileName").value.trim();

        profile.email =
            document.getElementById("profileEmail").value.trim();

        profile.phone =
            document.getElementById("profilePhone").value.trim();

        profile.qualification =
            document.getElementById("profileQualification").value.trim();

        profile.skills =
            document.getElementById("profileSkills").value.trim();

        localStorage.setItem(
            "jobnestProfile_" + storageKey,
            JSON.stringify(profile)
        );

        document.getElementById("profileMessage").textContent =
            "Profile saved in this browser.";

        displayUser();
    });

// ================================================
// RESUME FILE VALIDATION
// ================================================

document.getElementById("resumeFile")
    .addEventListener("change", function() {
        const message = document.getElementById("resumeMessage");
        const file = this.files[0];

        if (!file) {
            message.textContent = "";
            return;
        }

        const allowed = /\.(pdf|doc|docx)$/i.test(file.name);

        if (!allowed) {
            message.textContent =
                "Please select a PDF, DOC or DOCX file.";

            this.value = "";
            return;
        }

        message.textContent =
            "Selected: " + file.name +
            ". Backend resume upload is not connected yet.";
    });

// ================================================
// LOGOUT
// ================================================

document.getElementById("logoutBtn")
    .addEventListener("click", function(event) {
        event.preventDefault();

        if (confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("jobnestUser");
            window.location.href = "login.html";
        }
    });

// ================================================
// INITIAL DASHBOARD LOAD
// ================================================

async function initializeDashboard() {
    displayUser();

    updateCounts();

    await loadJobs();
    await loadApplications();
    await loadNotifications();

    console.log("JOBNEST dynamic dashboard connected successfully!");
}

initializeDashboard();
