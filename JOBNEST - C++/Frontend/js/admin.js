
// // JOBNEST - Admin Dashboard
// // Demo data only. C++ backend integration comes later.

// let adminJobs = JSON.parse(localStorage.getItem("jobnestAdminJobs") || "null") || [
//     {id:1,title:"Python Developer",company:"Tech Solutions",location:"Mohali",salary:"₹3–5 LPA",type:"Full Time",skills:"Python, SQL"},
//     {id:2,title:"Frontend Developer",company:"Digital Creators",location:"Chandigarh",salary:"₹2.5–4 LPA",type:"Full Time",skills:"HTML, CSS, JavaScript"},
//     {id:3,title:"UI/UX Designer",company:"Creative Studio",location:"Remote",salary:"₹4–6 LPA",type:"Remote",skills:"Figma, UI Design"},
//     {id:4,title:"Java Developer",company:"CodeWorks",location:"Delhi",salary:"₹3–5 LPA",type:"Full Time",skills:"Java, SQL"},
//     {id:5,title:"Data Analyst",company:"Insight Labs",location:"Mohali",salary:"₹3–4 LPA",type:"Full Time",skills:"Excel, Python"}
// ];

// let adminUsers = JSON.parse(localStorage.getItem("jobnestAdminUsers") || "null") || [
//     {name:"Aarav Sharma",email:"aarav@example.com",qualification:"Graduation",role:"Job Seeker"},
//     {name:"Priya Verma",email:"priya@example.com",qualification:"Post Graduation",role:"Job Seeker"},
//     {name:"Rahul Singh",email:"rahul@example.com",qualification:"Diploma",role:"Job Seeker"},
//     {name:"Neha Gupta",email:"neha@example.com",qualification:"Graduation",role:"Job Seeker"}
// ];

// let adminApplications = JSON.parse(localStorage.getItem("jobnestAdminApplications") || "null") || [
//     {applicant:"Aarav Sharma",job:"Python Developer",company:"Tech Solutions",status:"Pending"},
//     {applicant:"Priya Verma",job:"Frontend Developer",company:"Digital Creators",status:"Shortlisted"},
//     {applicant:"Rahul Singh",job:"Java Developer",company:"CodeWorks",status:"Under Review"}
// ];

// let adminCompanies = JSON.parse(localStorage.getItem("jobnestAdminCompanies") || "null") || [
//     "Tech Solutions","Digital Creators","Creative Studio","CodeWorks"
// ];

// let adminInterviews = [
//     {applicant:"Priya Verma",job:"Frontend Developer",company:"Digital Creators",date:"15 Nov 2026",status:"Scheduled"},
//     {applicant:"Aarav Sharma",job:"Python Developer",company:"Tech Solutions",date:"18 Nov 2026",status:"Pending"}
// ];

// function saveAdminData() {
//     localStorage.setItem("jobnestAdminJobs", JSON.stringify(adminJobs));
//     localStorage.setItem("jobnestAdminUsers", JSON.stringify(adminUsers));
//     localStorage.setItem("jobnestAdminApplications", JSON.stringify(adminApplications));
//     localStorage.setItem("jobnestAdminCompanies", JSON.stringify(adminCompanies));
// }

// // Escape text before inserting it into HTML
// function safeText(value) {
//     return String(value ?? "").replace(/[&<>"']/g, character => ({
//         "&":"&amp;",
//         "<":"&lt;",
//         ">":"&gt;",
//         '"':"&quot;",
//         "'":"&#39;"
//     })[character]);
// }

// // Navigation
// function openAdminPage(pageId) {
//     document.querySelectorAll(".admin-page").forEach(page => {
//         page.classList.toggle("active", page.id === pageId);
//     });

//     document.querySelectorAll(".admin-nav").forEach(button => {
//         button.classList.toggle("active", button.dataset.page === pageId);
//     });

//     const selected = document.querySelector(`[data-page="${pageId}"]`);
//     const title = selected ? selected.textContent.trim() : "Overview";

//     document.getElementById("adminPageTitle").textContent =
//         title.replace(/^[^\w]+/, "").trim();

//     document.getElementById("adminSidebar").classList.remove("open");

//     if (pageId === "manage-jobs") renderAdminJobs();
//     if (pageId === "manage-users") renderAdminUsers();
//     if (pageId === "manage-applications") renderAdminApplications();
//     if (pageId === "manage-companies") renderAdminCompanies();
//     if (pageId === "manage-interviews") renderAdminInterviews();
//     if (pageId === "admin-reports") updateAdminReports();
// }

// document.querySelectorAll(".admin-nav").forEach(button => {
//     button.addEventListener("click", () => openAdminPage(button.dataset.page));
// });

// document.querySelectorAll("[data-open-admin]").forEach(button => {
//     button.addEventListener("click", () => openAdminPage(button.dataset.openAdmin));
// });

// document.getElementById("adminMobileMenu").addEventListener("click", () => {
//     document.getElementById("adminSidebar").classList.toggle("open");
// });

// // Dashboard statistics
// function updateAdminStats() {
//     document.getElementById("totalJobs").textContent = adminJobs.length;
//     document.getElementById("totalUsers").textContent = adminUsers.length;
//     document.getElementById("totalApplications").textContent = adminApplications.length;
//     document.getElementById("totalCompanies").textContent = adminCompanies.length;

//     document.getElementById("reportJobs").textContent = adminJobs.length;
//     document.getElementById("reportUsers").textContent = adminUsers.length;
//     document.getElementById("reportApplications").textContent = adminApplications.length;
//     document.getElementById("reportCompanies").textContent = adminCompanies.length;
// }

// // Recent jobs
// function renderOverviewJobs() {
//     const container = document.getElementById("overviewJobs");

//     container.innerHTML = adminJobs.slice(0,4).map(job => `
//         <div class="admin-list-item">
//             <div class="company-mark">${safeText(job.company.slice(0,2).toUpperCase())}</div>
//             <div>
//                 <strong>${safeText(job.title)}</strong>
//                 <small>${safeText(job.company)} · ${safeText(job.location)}</small>
//             </div>
//             <span>${safeText(job.salary)}</span>
//         </div>
//     `).join("") || '<p>No jobs have been posted yet.</p>';
// }

// // Manage jobs
// function renderAdminJobs() {
//     const query = document.getElementById("adminJobSearch").value.toLowerCase();

//     const filtered = adminJobs.filter(job =>
//         (job.title + " " + job.company + " " + job.location).toLowerCase().includes(query)
//     );

//     document.getElementById("jobAdminCount").textContent =
//         `${filtered.length} job listing(s)`;

//     document.getElementById("adminJobsTable").innerHTML = filtered.map(job => `
//         <tr>
//             <td>${safeText(job.title)}</td>
//             <td>${safeText(job.company)}</td>
//             <td>${safeText(job.location)}</td>
//             <td>${safeText(job.salary)}</td>
//             <td>
//                 <button class="table-action edit-job" data-id="${job.id}">Edit</button>
//                 <button class="table-action delete delete-job" data-id="${job.id}">Delete</button>
//             </td>
//         </tr>
//     `).join("") || '<tr><td colspan="5">No matching jobs found.</td></tr>';

//     document.querySelectorAll(".delete-job").forEach(button => {
//         button.addEventListener("click", () => {
//             const id = Number(button.dataset.id);
//             if (!confirm("Delete this demo job listing?")) return;

//             adminJobs = adminJobs.filter(job => job.id !== id);
//             saveAdminData();
//             renderAdminJobs();
//             renderOverviewJobs();
//             updateAdminStats();
//         });
//     });

//     document.querySelectorAll(".edit-job").forEach(button => {
//         button.addEventListener("click", () => editAdminJob(Number(button.dataset.id)));
//     });
// }

// function editAdminJob(id) {
//     const job = adminJobs.find(item => item.id === id);
//     if (!job) return;

//     const title = prompt("Edit job title:", job.title);
//     if (title === null) return;

//     const company = prompt("Edit company:", job.company);
//     if (company === null) return;

//     const salary = prompt("Edit salary:", job.salary);
//     if (salary === null) return;

//     if (!title.trim() || !company.trim() || !salary.trim()) {
//         alert("Job title, company and salary cannot be empty.");
//         return;
//     }

//     job.title = title.trim();
//     job.company = company.trim();
//     job.salary = salary.trim();

//     saveAdminData();
//     renderAdminJobs();
//     renderOverviewJobs();
//     updateAdminStats();
//     alert("Demo job updated successfully.");
// }

// document.getElementById("adminJobSearch").addEventListener("input", renderAdminJobs);

// // Post new job
// document.getElementById("postJobForm").addEventListener("submit", function(event) {
//     event.preventDefault();

//     const job = {
//         id:Date.now(),
//         title:document.getElementById("newJobTitle").value.trim(),
//         company:document.getElementById("newJobCompany").value.trim(),
//         location:document.getElementById("newJobLocation").value,
//         salary:document.getElementById("newJobSalary").value.trim(),
//         type:document.getElementById("newJobType").value,
//         skills:document.getElementById("newJobSkills").value.trim(),
//         description:document.getElementById("newJobDescription").value.trim()
//     };

//     adminJobs.unshift(job);
//     if (!adminCompanies.includes(job.company)) adminCompanies.push(job.company);

//     saveAdminData();

//     document.getElementById("postJobMessage").textContent =
//         "Demo job published successfully!";

//     this.reset();
//     renderOverviewJobs();
//     updateAdminStats();
// });

// // Registered users
// function renderAdminUsers() {
//     document.getElementById("adminUsersTable").innerHTML = adminUsers.map(user => `
//         <tr>
//             <td>${safeText(user.name)}</td>
//             <td>${safeText(user.email)}</td>
//             <td>${safeText(user.qualification)}</td>
//             <td>${safeText(user.role)}</td>
//         </tr>
//     `).join("") || '<tr><td colspan="4">No users found.</td></tr>';
// }

// // Applications and status updates
// function renderAdminApplications() {
//     document.getElementById("adminApplicationsTable").innerHTML =
//         adminApplications.map((app,index) => `
//             <tr>
//                 <td>${safeText(app.applicant)}</td>
//                 <td>${safeText(app.job)}</td>
//                 <td>${safeText(app.company)}</td>
//                 <td>${safeText(app.status)}</td>
//                 <td>
//                     <select class="status-select" data-index="${index}">
//                         ${["Pending","Under Review","Shortlisted","Rejected","Selected"].map(status =>
//                             `<option ${app.status === status ? "selected" : ""}>${status}</option>`
//                         ).join("")}
//                     </select>
//                 </td>
//             </tr>
//         `).join("") || '<tr><td colspan="5">No applications found.</td></tr>';

//     document.querySelectorAll(".status-select").forEach(select => {
//         select.addEventListener("change", () => {
//             const index = Number(select.dataset.index);
//             adminApplications[index].status = select.value;
//             saveAdminData();
//             updateAdminStats();
//         });
//     });
// }

// // Companies
// function renderAdminCompanies() {
//     const container = document.getElementById("companyList");

//     container.innerHTML = adminCompanies.map((company,index) => `
//         <div class="company-item">
//             <strong>${safeText(company)}</strong>
//             <button class="remove-company" data-index="${index}">Remove</button>
//         </div>
//     `).join("") || '<p>No companies added.</p>';

//     document.querySelectorAll(".remove-company").forEach(button => {
//         button.addEventListener("click", () => {
//             const index = Number(button.dataset.index);
//             const company = adminCompanies[index];

//             if (!confirm(`Remove ${company} from the demo company list?`)) return;

//             adminCompanies.splice(index,1);
//             saveAdminData();
//             renderAdminCompanies();
//             updateAdminStats();
//         });
//     });
// }

// document.getElementById("companyForm").addEventListener("submit", function(event) {
//     event.preventDefault();

//     const input = document.getElementById("companyName");
//     const name = input.value.trim();

//     if (adminCompanies.some(company => company.toLowerCase() === name.toLowerCase())) {
//         alert("This company already exists.");
//         return;
//     }

//     adminCompanies.push(name);
//     saveAdminData();
//     input.value = "";
//     renderAdminCompanies();
//     updateAdminStats();
// });

// // Interviews
// function renderAdminInterviews() {
//     document.getElementById("adminInterviewsTable").innerHTML =
//         adminInterviews.map(item => `
//             <tr>
//                 <td>${safeText(item.applicant)}</td>
//                 <td>${safeText(item.job)}</td>
//                 <td>${safeText(item.company)}</td>
//                 <td>${safeText(item.date)}</td>
//                 <td>${safeText(item.status)}</td>
//             </tr>
//         `).join("") || '<tr><td colspan="5">No interviews scheduled.</td></tr>';
// }

// // Reports
// function updateAdminReports() {
//     updateAdminStats();
// }

// document.getElementById("downloadReport").addEventListener("click", () => {
//     const rows = [
//         ["JOBNEST ADMIN REPORT"],
//         ["Report Date",new Date().toLocaleDateString()],
//         [],
//         ["Metric","Count"],
//         ["Total Jobs",adminJobs.length],
//         ["Registered Users",adminUsers.length],
//         ["Applications",adminApplications.length],
//         ["Companies",adminCompanies.length]
//     ];

//     const csv = rows.map(row =>
//         row.map(value => `"${String(value ?? "").replace(/"/g,'""')}"`).join(",")
//     ).join("\n");

//     const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");

//     link.href = url;
//     link.download = "JOBNEST_Admin_Report.csv";
//     link.click();

//     URL.revokeObjectURL(url);
// });

// // Logout demo
// document.getElementById("adminLogout").addEventListener("click", function(event) {
//     event.preventDefault();

//     if (confirm("Are you sure you want to log out?")) {
//         window.location.href = "index.html";
//     }
// });

// // Initial rendering
// saveAdminData();
// updateAdminStats();
// renderOverviewJobs();
// renderAdminJobs();
// renderAdminUsers();
// renderAdminApplications();
// renderAdminCompanies();
// renderAdminInterviews();

// console.log("JOBNEST Admin Dashboard loaded successfully!");

// ==========================================
// JOBNEST - ADMIN DASHBOARD
// C++ Backend Integration + Admin Authentication
// ==========================================

const API_URL = "http://127.0.0.1:8080/api";
const ADMIN_TOKEN_KEY = "jobnestAdminToken";

// Hide dashboard until admin authentication succeeds.
document.body.style.visibility = "hidden";

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

function getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
}

async function adminApiRequest(endpoint, options = {}) {
    const token = getAdminToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (token || "")
        }
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
        throw new Error(result.message || "Request failed.");
    }

    return result;
}

async function verifyAdminSession() {
    if (!getAdminToken()) {
        window.location.replace("admin-login.html");
        return false;
    }

    try {
        await adminApiRequest("/admin/verify", {
            method: "GET"
        });

        return true;

    } catch (error) {
        console.error("Admin verification failed:", error);

        localStorage.removeItem(ADMIN_TOKEN_KEY);
        window.location.replace("admin-login.html");

        return false;
    }
}

// ==========================================
// DEMO DATA
// Jobs, Users, Companies and Interviews
// remain localStorage-based in this version.
// Applications are connected to the C++ backend.
// ==========================================

let adminJobs =
    JSON.parse(localStorage.getItem("jobnestAdminJobs") || "null") || [
        {
            id: 1,
            title: "Python Developer",
            company: "Tech Solutions",
            location: "Mohali",
            salary: "₹3–5 LPA",
            type: "Full Time",
            skills: "Python, SQL"
        },
        {
            id: 2,
            title: "Frontend Developer",
            company: "Digital Creators",
            location: "Chandigarh",
            salary: "₹2.5–4 LPA",
            type: "Full Time",
            skills: "HTML, CSS, JavaScript"
        },
        {
            id: 3,
            title: "UI/UX Designer",
            company: "Creative Studio",
            location: "Remote",
            salary: "₹4–6 LPA",
            type: "Remote",
            skills: "Figma, UI Design"
        },
        {
            id: 4,
            title: "Java Developer",
            company: "CodeWorks",
            location: "Delhi",
            salary: "₹3–5 LPA",
            type: "Full Time",
            skills: "Java, SQL"
        },
        {
            id: 5,
            title: "Data Analyst",
            company: "Insight Labs",
            location: "Mohali",
            salary: "₹3–4 LPA",
            type: "Full Time",
            skills: "Excel, Python"
        }
    ];

let adminUsers =
    JSON.parse(localStorage.getItem("jobnestAdminUsers") || "null") || [
        {
            name: "Aarav Sharma",
            email: "aarav@example.com",
            qualification: "Graduation",
            role: "Job Seeker"
        },
        {
            name: "Priya Verma",
            email: "priya@example.com",
            qualification: "Post Graduation",
            role: "Job Seeker"
        },
        {
            name: "Rahul Singh",
            email: "rahul@example.com",
            qualification: "Diploma",
            role: "Job Seeker"
        },
        {
            name: "Neha Gupta",
            email: "neha@example.com",
            qualification: "Graduation",
            role: "Job Seeker"
        }
    ];

// Actual applications will be fetched from applications.txt.
let adminApplications = [];

let adminCompanies =
    JSON.parse(localStorage.getItem("jobnestAdminCompanies") || "null") || [
        "Tech Solutions",
        "Digital Creators",
        "Creative Studio",
        "CodeWorks"
    ];

let adminInterviews = [
    {
        applicant: "Priya Verma",
        job: "Frontend Developer",
        company: "Digital Creators",
        date: "15 Nov 2026",
        status: "Scheduled"
    },
    {
        applicant: "Aarav Sharma",
        job: "Python Developer",
        company: "Tech Solutions",
        date: "18 Nov 2026",
        status: "Pending"
    }
];

// ==========================================
// SAVE DEMO DATA
// ==========================================

function saveAdminData() {
    localStorage.setItem(
        "jobnestAdminJobs",
        JSON.stringify(adminJobs)
    );

    localStorage.setItem(
        "jobnestAdminUsers",
        JSON.stringify(adminUsers)
    );

    localStorage.setItem(
        "jobnestAdminCompanies",
        JSON.stringify(adminCompanies)
    );
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function safeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function showAdminMessage(message) {
    alert(message);
}

// ==========================================
// LOAD REAL APPLICATIONS FROM BACKEND
// ==========================================

async function loadAdminApplications() {
    try {
        const result = await adminApiRequest(
            "/admin/applications",
            {
                method: "GET"
            }
        );

        adminApplications = (result.applications || []).map(app => ({
            applicant: app.applicantName,
            company: app.companyName,
            job: app.jobTitle,
            status: app.status
        }));

        updateAdminStats();
        renderAdminApplications();

        console.log("Applications loaded from C++ backend.");

    } catch (error) {
        console.error("Could not load applications:", error);

        showAdminMessage(
            "Unable to load applications: " + error.message
        );
    }
}

// ==========================================
// NAVIGATION
// ==========================================

function openAdminPage(pageId) {

    document.querySelectorAll(".admin-page").forEach(page => {
        page.classList.toggle("active", page.id === pageId);
    });

    document.querySelectorAll(".admin-nav").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    const selected = document.querySelector(
        `[data-page="${pageId}"]`
    );

    const title = selected
        ? selected.textContent.trim()
        : "Overview";

    const pageTitle = document.getElementById("adminPageTitle");

    if (pageTitle) {
        pageTitle.textContent = title.replace(/^[^\w]+/, "").trim();
    }

    document.getElementById("adminSidebar")?.classList.remove("open");

    if (pageId === "manage-jobs") renderAdminJobs();
    if (pageId === "manage-users") renderAdminUsers();
    if (pageId === "manage-applications") loadAdminApplications();
    if (pageId === "manage-companies") renderAdminCompanies();
    if (pageId === "manage-interviews") renderAdminInterviews();
    if (pageId === "admin-reports") updateAdminReports();
}

function setupAdminNavigation() {

    document.querySelectorAll(".admin-nav").forEach(button => {
        button.addEventListener("click", () => {
            openAdminPage(button.dataset.page);
        });
    });

    document.querySelectorAll("[data-open-admin]").forEach(button => {
        button.addEventListener("click", () => {
            openAdminPage(button.dataset.openAdmin);
        });
    });

    document.getElementById("adminMobileMenu")?.addEventListener("click", () => {
        document.getElementById("adminSidebar")?.classList.toggle("open");
    });
}

// ==========================================
// DASHBOARD STATISTICS
// ==========================================

function updateAdminStats() {

    const stats = {
        totalJobs: adminJobs.length,
        totalUsers: adminUsers.length,
        totalApplications: adminApplications.length,
        totalCompanies: adminCompanies.length,

        reportJobs: adminJobs.length,
        reportUsers: adminUsers.length,
        reportApplications: adminApplications.length,
        reportCompanies: adminCompanies.length
    };

    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    });
}

// ==========================================
// OVERVIEW JOBS
// ==========================================

function renderOverviewJobs() {

    const container = document.getElementById("overviewJobs");

    if (!container) return;

    container.innerHTML = adminJobs.slice(0, 4).map(job => `
        <div class="admin-list-item">
            <div class="company-mark">
                ${safeText(job.company.slice(0, 2).toUpperCase())}
            </div>

            <div>
                <strong>${safeText(job.title)}</strong>
                <small>
                    ${safeText(job.company)} · ${safeText(job.location)}
                </small>
            </div>

            <span>${safeText(job.salary)}</span>
        </div>
    `).join("") || "<p>No jobs have been posted yet.</p>";
}

// ==========================================
// MANAGE JOBS
// ==========================================

function renderAdminJobs() {

    const search = document.getElementById("adminJobSearch");

    const query = search ? search.value.toLowerCase() : "";

    const filtered = adminJobs.filter(job =>
        (job.title + " " + job.company + " " + job.location)
            .toLowerCase()
            .includes(query)
    );

    const count = document.getElementById("jobAdminCount");

    if (count) {
        count.textContent = `${filtered.length} job listing(s)`;
    }

    const table = document.getElementById("adminJobsTable");

    if (!table) return;

    table.innerHTML = filtered.map(job => `
        <tr>
            <td>${safeText(job.title)}</td>
            <td>${safeText(job.company)}</td>
            <td>${safeText(job.location)}</td>
            <td>${safeText(job.salary)}</td>
            <td>
                <button class="table-action edit-job" data-id="${job.id}">
                    Edit
                </button>

                <button class="table-action delete delete-job" data-id="${job.id}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("") || '<tr><td colspan="5">No matching jobs found.</td></tr>';

    document.querySelectorAll(".delete-job").forEach(button => {

        button.addEventListener("click", () => {

            const id = Number(button.dataset.id);

            if (!confirm("Delete this demo job listing?")) return;

            adminJobs = adminJobs.filter(job => job.id !== id);

            saveAdminData();
            renderAdminJobs();
            renderOverviewJobs();
            updateAdminStats();
        });
    });

    document.querySelectorAll(".edit-job").forEach(button => {

        button.addEventListener("click", () => {
            editAdminJob(Number(button.dataset.id));
        });
    });
}

function editAdminJob(id) {

    const job = adminJobs.find(item => item.id === id);

    if (!job) return;

    const title = prompt("Edit job title:", job.title);

    if (title === null) return;

    const company = prompt("Edit company:", job.company);

    if (company === null) return;

    const salary = prompt("Edit salary:", job.salary);

    if (salary === null) return;

    if (!title.trim() || !company.trim() || !salary.trim()) {
        alert("Job title, company and salary cannot be empty.");
        return;
    }

    job.title = title.trim();
    job.company = company.trim();
    job.salary = salary.trim();

    saveAdminData();
    renderAdminJobs();
    renderOverviewJobs();
    updateAdminStats();

    alert("Demo job updated successfully.");
}

// ==========================================
// SEARCH JOBS
// ==========================================

document.getElementById("adminJobSearch")?.addEventListener(
    "input",
    renderAdminJobs
);

// ==========================================
// POST NEW JOB - DEMO
// ==========================================

document.getElementById("postJobForm")?.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const job = {
            id: Date.now(),

            title: document.getElementById("newJobTitle").value.trim(),

            company: document.getElementById("newJobCompany").value.trim(),

            location: document.getElementById("newJobLocation").value,

            salary: document.getElementById("newJobSalary").value.trim(),

            type: document.getElementById("newJobType").value,

            skills: document.getElementById("newJobSkills").value.trim(),

            description: document.getElementById("newJobDescription").value.trim()
        };

        if (!job.title || !job.company || !job.salary) {
            alert("Please fill in the required job details.");
            return;
        }

        adminJobs.unshift(job);

        if (!adminCompanies.includes(job.company)) {
            adminCompanies.push(job.company);
        }

        saveAdminData();

        const message = document.getElementById("postJobMessage");

        if (message) {
            message.textContent = "Demo job published successfully!";
        }

        this.reset();

        renderOverviewJobs();
        updateAdminStats();
    }
);

// ==========================================
// REGISTERED USERS - DEMO
// ==========================================

function renderAdminUsers() {

    const table = document.getElementById("adminUsersTable");

    if (!table) return;

    table.innerHTML = adminUsers.map(user => `
        <tr>
            <td>${safeText(user.name)}</td>
            <td>${safeText(user.email)}</td>
            <td>${safeText(user.qualification)}</td>
            <td>${safeText(user.role)}</td>
        </tr>
    `).join("") || '<tr><td colspan="4">No users found.</td></tr>';
}

// ==========================================
// APPLICATIONS - REAL C++ BACKEND
// ==========================================

function renderAdminApplications() {

    const table = document.getElementById("adminApplicationsTable");

    if (!table) return;

    if (adminApplications.length === 0) {
        table.innerHTML =
            '<tr><td colspan="5">No applications found.</td></tr>';

        updateAdminStats();
        return;
    }

    table.innerHTML = adminApplications.map((app, index) => `
        <tr>
            <td>${safeText(app.applicant)}</td>
            <td>${safeText(app.job)}</td>
            <td>${safeText(app.company)}</td>
            <td>${safeText(app.status)}</td>

            <td>
                <select class="status-select" data-index="${index}">
                    ${["Applied", "Pending", "Under Review", "Shortlisted", "Rejected", "Selected"].map(status =>
                        `<option value="${status}" ${app.status === status ? "selected" : ""}>
                            ${status}
                        </option>`
                    ).join("")}
                </select>
            </td>
        </tr>
    `).join("");

    document.querySelectorAll(".status-select").forEach(select => {

        select.addEventListener("change", async () => {

            const index = Number(select.dataset.index);
            const app = adminApplications[index];

            if (!app) return;

            const previousStatus = app.status;
            const newStatus = select.value;

            if (newStatus === previousStatus) return;

            select.disabled = true;

            try {

                const result = await adminApiRequest(
                    "/update-application-status",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            applicantName: app.applicant,
                            companyName: app.company,
                            jobTitle: app.job,
                            status: newStatus
                        })
                    }
                );

                app.status = newStatus;

                updateAdminStats();

                alert(result.message || "Application status updated successfully.");

                // Reload actual data from the backend.
                await loadAdminApplications();

            } catch (error) {

                console.error("Status update failed:", error);

                select.value = previousStatus;

                alert("Unable to update application: " + error.message);

            } finally {

                select.disabled = false;
            }
        });
    });
}

// ==========================================
// COMPANIES - DEMO
// ==========================================

function renderAdminCompanies() {

    const container = document.getElementById("companyList");

    if (!container) return;

    container.innerHTML = adminCompanies.map((company, index) => `
        <div class="company-item">
            <strong>${safeText(company)}</strong>

            <button class="remove-company" data-index="${index}">
                Remove
            </button>
        </div>
    `).join("") || "<p>No companies added.</p>";

    document.querySelectorAll(".remove-company").forEach(button => {

        button.addEventListener("click", () => {

            const index = Number(button.dataset.index);
            const company = adminCompanies[index];

            if (!confirm(`Remove ${company} from the demo company list?`)) {
                return;
            }

            adminCompanies.splice(index, 1);

            saveAdminData();
            renderAdminCompanies();
            updateAdminStats();
        });
    });
}

document.getElementById("companyForm")?.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const input = document.getElementById("companyName");
        const name = input.value.trim();

        if (!name) {
            alert("Please enter a company name.");
            return;
        }

        if (adminCompanies.some(company =>
            company.toLowerCase() === name.toLowerCase()
        )) {
            alert("This company already exists.");
            return;
        }

        adminCompanies.push(name);

        saveAdminData();

        input.value = "";

        renderAdminCompanies();
        updateAdminStats();
    }
);

// ==========================================
// INTERVIEWS - DEMO
// ==========================================

function renderAdminInterviews() {

    const table = document.getElementById("adminInterviewsTable");

    if (!table) return;

    table.innerHTML = adminInterviews.map(item => `
        <tr>
            <td>${safeText(item.applicant)}</td>
            <td>${safeText(item.job)}</td>
            <td>${safeText(item.company)}</td>
            <td>${safeText(item.date)}</td>
            <td>${safeText(item.status)}</td>
        </tr>
    `).join("") || '<tr><td colspan="5">No interviews scheduled.</td></tr>';
}

// ==========================================
// REPORTS
// ==========================================

function updateAdminReports() {
    updateAdminStats();
}

document.getElementById("downloadReport")?.addEventListener(
    "click",
    () => {

        const rows = [
            ["JOBNEST ADMIN REPORT"],
            ["Report Date", new Date().toLocaleDateString()],
            [],
            ["Metric", "Count"],
            ["Total Jobs", adminJobs.length],
            ["Registered Users", adminUsers.length],
            ["Applications", adminApplications.length],
            ["Companies", adminCompanies.length]
        ];

        const csv = rows.map(row =>
            row.map(value =>
                `"${String(value ?? "").replace(/"/g, '""')}"`
            ).join(",")
        ).join("\n");

        const blob = new Blob(
            [csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "JOBNEST_Admin_Report.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }
);

// ==========================================
// ADMIN LOGOUT
// ==========================================

document.getElementById("adminLogout")?.addEventListener(
    "click",
    async function(event) {

        event.preventDefault();

        if (!confirm("Are you sure you want to log out?")) {
            return;
        }

        try {

            await adminApiRequest("/admin/logout", {
                method: "POST",
                body: JSON.stringify({})
            });

        } catch (error) {

            console.error("Admin logout error:", error);

        } finally {

            localStorage.removeItem(ADMIN_TOKEN_KEY);

            window.location.replace("admin-login.html");
        }
    }
);

// ==========================================
// INITIALIZE ADMIN DASHBOARD
// ==========================================

async function initializeAdminDashboard() {

    const authenticated = await verifyAdminSession();

    if (!authenticated) return;

    // Show dashboard only after successful verification.
    document.body.style.visibility = "visible";

    setupAdminNavigation();

    saveAdminData();

    updateAdminStats();
    renderOverviewJobs();
    renderAdminJobs();
    renderAdminUsers();
    renderAdminCompanies();
    renderAdminInterviews();

    // Load real application records from C++ backend.
    await loadAdminApplications();

    console.log("JOBNEST Admin Dashboard loaded successfully!");
}

document.addEventListener(
    "DOMContentLoaded",
    initializeAdminDashboard
);
