
// ==========================================
// JOBNEST - C++ BACKEND AUTHENTICATION
// ==========================================

const API_URL = "http://127.0.0.1:8080/api";

// Show / Hide Password
document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", function () {
        const input = document.getElementById(this.dataset.target);

        if (!input) return;

        if (input.type === "password") {
            input.type = "text";
            this.textContent = "Hide";
        } else {
            input.type = "password";
            this.textContent = "Show";
        }
    });
});

// Display Messages
function showMessage(element, text, success) {
    if (!element) return;

    element.textContent = text;
    element.className = success
        ? "form-message success"
        : "form-message error";
}

// ==========================================
// LOGIN FORM - CONNECTED TO C++ BACKEND
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");
        const submitButton = loginForm.querySelector(
            'button[type="submit"]'
        );

        if (!email || !password) {
            showMessage(message, "Enter your email and password.", false);
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Signing In...";

        try {
            const response = await fetch(API_URL + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                showMessage(
                    message,
                    result.message || "Login failed. Please try again.",
                    false
                );
                return;
            }

            // Store the authenticated user
            localStorage.setItem(
                "jobnestUser",
                JSON.stringify(result.user)
            );

            // Remember email only when selected
            const rememberMe = document.getElementById("rememberMe");

            if (rememberMe && rememberMe.checked) {
                localStorage.setItem("jobnestRememberedEmail", email);
            } else {
                localStorage.removeItem("jobnestRememberedEmail");
            }

            showMessage(
                message,
                "Login successful! Opening dashboard...",
                true
            );

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (error) {
            console.error("Login error:", error);

            showMessage(
                message,
                "Cannot connect to JOBNEST backend. Make sure backend.exe is running.",
                false
            );

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Sign In →";
        }
    });
}

// Restore remembered email
const rememberedEmail = localStorage.getItem("jobnestRememberedEmail");

if (rememberedEmail && document.getElementById("loginEmail")) {
    document.getElementById("loginEmail").value = rememberedEmail;

    const rememberMe = document.getElementById("rememberMe");
    if (rememberMe) rememberMe.checked = true;
}

// ==========================================
// SIGNUP FORM - CONNECTED TO C++ BACKEND
// ==========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const qualification =
            document.getElementById("qualification").value;

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const terms = document.getElementById("terms").checked;

        const message = document.getElementById("signupMessage");

        const submitButton = signupForm.querySelector(
            'button[type="submit"]'
        );

        if (!name || !email || !phone || !qualification) {
            showMessage(message, "Complete all required fields.", false);
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            showMessage(message, "Enter a valid 10-digit phone number.", false);
            return;
        }

        if (password.length < 8) {
            showMessage(message, "Password must contain at least 8 characters.", false);
            return;
        }

        if (password !== confirmPassword) {
            showMessage(message, "Passwords do not match.", false);
            return;
        }

        if (!terms) {
            showMessage(message, "Please accept the terms and conditions.", false);
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Creating Account...";

        try {
            const response = await fetch(API_URL + "/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                    qualification: qualification,
                    skills: ""
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                showMessage(
                    message,
                    result.message || "Registration failed.",
                    false
                );
                return;
            }

            showMessage(
                message,
                "Account created successfully! Redirecting to login...",
                true
            );

            signupForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);

        } catch (error) {
            console.error("Signup error:", error);

            showMessage(
                message,
                "Cannot connect to JOBNEST backend. Start backend.exe first.",
                false
            );

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Create Account →";
        }
    });
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", function (event) {
        event.preventDefault();

        showMessage(
            document.getElementById("loginMessage"),
            "Password recovery is not connected yet.",
            false
        );
    });
}

console.log("JOBNEST authentication connected to C++ API.");
