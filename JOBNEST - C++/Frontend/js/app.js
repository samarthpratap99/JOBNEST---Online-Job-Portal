
// JOBNEST - Frontend interactions

const searchForm = document.getElementById("searchForm");
const jobSearch = document.getElementById("jobSearch");
const locationSearch = document.getElementById("locationSearch");
const jobCards = [...document.querySelectorAll(".job-card")];
const noResults = document.getElementById("noResults");

function filterJobs(keyword = "", location = "") {
    let visibleCount = 0;

    jobCards.forEach(card => {
        const title = card.dataset.title.toLowerCase();
        const place = card.dataset.location.toLowerCase();

        const matchesKeyword = title.includes(keyword.toLowerCase());
        const matchesLocation = place.includes(location.toLowerCase());

        const visible = matchesKeyword && matchesLocation;

        card.style.display = visible ? "" : "none";

        if (visible) visibleCount++;
    });

    noResults.hidden = visibleCount !== 0;
}

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    filterJobs(jobSearch.value.trim(), locationSearch.value.trim());

    document.getElementById("jobs").scrollIntoView({
        behavior: "smooth"
    });
});

// Popular search shortcuts
document.querySelectorAll("[data-search]").forEach(link => {
    link.addEventListener("click", function() {
        jobSearch.value = this.dataset.search;
        locationSearch.value = "";
        filterJobs(jobSearch.value);
    });
});

// Category shortcuts
document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", function() {
        jobSearch.value = this.dataset.category;
        locationSearch.value = "";
        filterJobs(jobSearch.value);

        document.getElementById("jobs").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Save job buttons
document.querySelectorAll(".save-btn").forEach(button => {
    button.addEventListener("click", function() {
        this.classList.toggle("saved");
        this.textContent = this.classList.contains("saved") ? "♥" : "♡";
    });
});

// Demo action buttons
document.getElementById("loginBtn").addEventListener("click", function(event) {
    event.preventDefault();
    alert("Login page will be connected in the next development step.");
});

document.getElementById("signupBtn").addEventListener("click", function(event) {
    event.preventDefault();
    alert("Registration page will be created in the next development step.");
});

document.querySelectorAll(".apply-btn").forEach(button => {
    button.addEventListener("click", function() {
        const job = this.closest(".job-card").dataset.title;
        alert("You selected: " + job + "\nApplication functionality will be connected to the C++ backend.");
    });
});

document.getElementById("viewAll").addEventListener("click", function(event) {
    event.preventDefault();
    jobSearch.value = "";
    locationSearch.value = "";
    filterJobs();
    document.getElementById("jobs").scrollIntoView({behavior: "smooth"});
});

console.log("JOBNEST frontend loaded successfully!");
