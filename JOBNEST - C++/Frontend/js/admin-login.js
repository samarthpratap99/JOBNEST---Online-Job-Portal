
// ==========================================
// JOBNEST - ADMIN LOGIN SYSTEM
// C++ Winsock Backend Integration
// ==========================================

const API_URL = "http://127.0.0.1:8080/api";

document.addEventListener("DOMContentLoaded", function () {

    console.log("JOBNEST Admin Login JavaScript loaded!");

    // Get HTML elements
    const loginForm = document.getElementById("adminLoginForm");
    const emailInput = document.getElementById("adminEmail");
    const passwordInput = document.getElementById("adminPassword");
    const messageBox = document.getElementById("loginMessage");

    // Check whether required HTML elements exist
    if (!loginForm || !emailInput || !passwordInput || !messageBox) {

        console.error("Admin login HTML elements are missing!");

        alert("Login page error! Please check the HTML element IDs.");

        return;
    }

    const loginButton = loginForm.querySelector(
        'button[type="submit"]'
    );

    // ======================================
    // DISPLAY MESSAGE
    // ======================================

    function showMessage(message, type = "error") {

        messageBox.textContent = message;

        messageBox.className = "login-message " + type;

        messageBox.style.display = "block";
    }

    // ======================================
    // HIDE MESSAGE
    // ======================================

    function hideMessage() {

        messageBox.textContent = "";

        messageBox.style.display = "none";
    }

    // ======================================
    // VERIFY EXISTING ADMIN SESSION
    // ======================================

    async function checkExistingSession() {

        const token = localStorage.getItem("jobnestAdminToken");

        if (!token) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/admin/verify`,
                {
                    method: "GET",

                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            const result = await response.json();

            if (response.ok && result.success === true) {

                console.log("Admin session already active.");

                window.location.replace("admin.html");

            } else {

                localStorage.removeItem("jobnestAdminToken");

            }

        } catch (error) {

            console.error("Session verification error:", error);

            // Keep the login page available if the backend is offline.
            localStorage.removeItem("jobnestAdminToken");
        }
    }

    // ======================================
    // ADMIN LOGIN
    // ======================================

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("Admin login button clicked!");

        hideMessage();

        const email = emailInput.value.trim();

        const password = passwordInput.value;

        // Validate inputs
        if (!email || !password) {

            showMessage("Please enter your admin email and password.");

            return;
        }

        // Disable button while processing
        if (loginButton) {

            loginButton.disabled = true;

            loginButton.textContent = "Logging in...";
        }

        try {

            console.log("Connecting to JOBNEST C++ backend...");

            // Send login request
            const response = await fetch(
                `${API_URL}/admin/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const result = await response.json();

            console.log("Backend response:", result);

            // Check login response
            if (!response.ok || result.success !== true) {

                showMessage(
                    result.message || "Invalid admin email or password."
                );

                return;
            }

            // Check token
            if (!result.token) {

                showMessage(
                    "Login failed: Admin authentication token not received."
                );

                return;
            }

            // Save admin token
            localStorage.setItem(
                "jobnestAdminToken",
                result.token
            );

            console.log("Admin authentication successful!");

            showMessage(
                "Login successful! Redirecting to dashboard...",
                "success"
            );

            // Redirect to admin dashboard
            setTimeout(function () {

                window.location.replace("admin.html");

            }, 700);

        } catch (error) {

            console.error("Admin login error:", error);

            showMessage(
                "Unable to connect to JOBNEST backend. Please start backend.exe and try again."
            );

        } finally {

            if (loginButton) {

                loginButton.disabled = false;

                loginButton.textContent = "Login to Dashboard";
            }
        }
    });

    // ======================================
    // CHECK EXISTING SESSION ON PAGE LOAD
    // ======================================

    checkExistingSession();

});

// ==========================================
// END OF JOBNEST ADMIN LOGIN
// ==========================================
