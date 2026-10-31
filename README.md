# JOBNEST – Online Job Portal

## 📌 Project Overview

**JOBNEST** is an Online Job Portal designed to connect job seekers with potential employers. It provides a platform where users can register, log in, explore available job opportunities, apply for jobs, save jobs, and receive notifications.

The project is developed using **HTML, CSS, JavaScript, and C++**. A C++ backend handles authentication and other API operations, while the frontend provides an interactive and user-friendly interface.

## 🚀 Features

### 👤 User Features
- User Registration and Login
- Secure login validation through the backend
- Remember Me functionality
- Password Show/Hide option
- User Dashboard
- Browse Available Jobs
- Apply for Jobs
- Save Jobs
- View Applied Jobs
- Receive Notifications
- User Profile Information

### 🔐 Admin Features
- Separate Admin Login
- Admin Authentication
- Admin Dashboard

### ⚙️ Backend Features
- C++ backend using Winsock
- REST-style API endpoints
- User registration and login authentication
- Job listing management
- Job application management
- Saved job management
- Notification management
- File-based data storage

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website Structure |
| CSS3 | Website Styling |
| JavaScript | Frontend Functionality |
| C++ | Backend Development |
| Winsock API | Server Communication |
| JSON | Data Exchange |
| LocalStorage | Client-side Data Storage |
| TXT Files | Data Storage |
| Visual Studio Code | Code Editor |

## 📂 Project Structure

```text
JOBNEST/
│
├── Backend/
│   ├── backend.cpp
│   ├── backend.exe
│   ├── users.txt
│   ├── jobs.txt
│   ├── applications.txt
│   ├── savedjobs.txt
│   └── notifications.txt
│
├── index.html
├── login.html
├── signup.html
├── dashboard.html
├── admin-login.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── auth.js
│   └── admin-login.js
│
├── README.md
└── ...
```

*Note: The folder structure above is a reference. Adjust filenames and folders according to your actual repository.*

## 💻 Installation and Setup

Follow these steps to run JOBNEST on your local computer.

### Step 1: Clone the Repository

Open your terminal and execute:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project folder:

```bash
cd JOBNEST
```

### Step 2: Open the Project

Open the project folder in Visual Studio Code.

### Step 3: Compile the C++ Backend

Open the terminal inside the Backend folder.

Compile the backend using MinGW:

```bash
g++ backend.cpp -o backend.exe -lws2_32
```

### Step 4: Run the Backend Server

Execute:

```bash
backend.exe
```

If the server starts successfully, you should see:

```text
JOBNEST C++ API running at http://127.0.0.1:8080
Keep this terminal open.
```

The backend server runs on port **8080**.

### Step 5: Run the Frontend

1. Open the project folder in Visual Studio Code.
2. Install the Live Server extension if it is not already installed.
3. Right-click on `index.html`.
4. Select **Open with Live Server**.
5. The JOBNEST website will open in your browser.

**Important:** Keep the backend terminal running while using the website.

## 🔗 Backend API Endpoints

The C++ backend provides the following API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend status |
| GET | `/api/jobs` | Retrieve available jobs |
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate a user |
| POST | `/api/apply` | Submit a job application |
| POST | `/api/applications` | Retrieve user applications |
| POST | `/api/saved-jobs` | Save a job |
| POST | `/api/notifications` | Retrieve notifications |

**Backend Base URL:**

```text
http://127.0.0.1:8080/api
```

## 📁 Data Storage

JOBNEST uses text files for storing backend information.

| File | Purpose |
|---|---|
| users.txt | Stores registered user information |
| jobs.txt | Stores available job information |
| applications.txt | Stores job application records |
| savedjobs.txt | Stores saved job records |
| notifications.txt | Stores user notifications |

These files are maintained by the C++ backend.

## 🔑 User Authentication

The registration and login systems communicate with the C++ backend through JavaScript Fetch API requests.

- Registration information is stored in `users.txt`.
- Login credentials are verified against registered records.
- Successful login information is stored in browser LocalStorage.
- Users are redirected to the dashboard after successful authentication.

## 🔧 Troubleshooting

**1. Backend is not connecting**

- Make sure `backend.exe` is running.
- Check whether port 8080 is available.
- Verify the API URL in your JavaScript files.

**2. Login is not working**

- Check your registered email and password.
- Make sure the backend server is running.
- Verify that `users.txt` contains the registered account.

**3. Dashboard is not opening**

- Check whether `dashboard.html` exists.
- Verify the login redirect path in JavaScript.

**4. Jobs are not displaying**

- Check whether `jobs.txt` exists.
- Verify that job records follow the expected data format.

## 🔮 Future Enhancements

- Password encryption and secure authentication
- Forgot Password and Password Recovery
- Employer Registration and Login
- Advanced Job Search and Filtering
- Resume Upload Functionality
- Email Notifications
- Online Database Integration
- Improved Admin Dashboard
- Responsive Mobile Interface

## 🔒 Security Note

This project is developed for educational and learning purposes.

The current backend stores user passwords in plain text files. It should not be deployed for real-world use without implementing password hashing, secure session management, input validation, and appropriate access controls.

Do not upload real user credentials or private information to GitHub.

## 👨‍💻 Author

**Project Name:** JOBNEST – Online Job Portal

**Project Type:** Web Development Project

**Frontend:** HTML, CSS, JavaScript

**Backend:** C++

**Communication:** HTTP and JSON

## ⭐ Acknowledgement

This project was developed as an effort to understand and implement frontend and backend integration, user authentication, API communication, and file-based data management.

Thank you for visiting the JOBNEST repository!

If you find this project useful, don't forget to give it a ⭐ on GitHub.
