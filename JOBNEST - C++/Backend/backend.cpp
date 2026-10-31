#define _WIN32_WINNT 0x0600
#include <cstdio>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <cstdlib>
#include <unordered_map>
#include <random>

using namespace std;

const int PORT = 8080;

// Admin sessions are stored in backend memory.
// Restarting the backend invalidates all existing sessions.
unordered_map<string, bool> adminSessions;

// Generate a random admin session token.
string generateAdminToken() {
    static const char* chars = "0123456789abcdef";
    static random_device rd;

    string token;

    for (int i = 0; i < 64; i++) {
        token += chars[rd() % 16];
    }

    return token;
}

bool isAdminAuthenticated(const string& token) {
    return !token.empty() &&
           adminSessions.find(token) != adminSessions.end();
}

// Escape text before placing it inside JSON.
string esc(const string& s) {
    string o;

    for (char c : s) {
        if (c == '"') o += "\\\"";
        else if (c == '\\') o += "\\\\";
        else if (c == '\n') o += "\\n";
        else if (c == '\r') o += "\\r";
        else if (c == '\t') o += "\\t";
        else if ((unsigned char)c >= 32) o += c;
    }

    return o;
}

string trim(const string& s) {
    size_t a = s.find_first_not_of(" \t\r\n");

    if (a == string::npos) return "";

    size_t b = s.find_last_not_of(" \t\r\n");

    return s.substr(a, b - a + 1);
}

// Read a string value from a simple JSON request body.
string value(const string& j, const string& key) {
    string k = "\"" + key + "\"";

    size_t p = j.find(k);

    if (p == string::npos) return "";

    p = j.find(':', p + k.size());

    if (p == string::npos) return "";

    p = j.find('"', p + 1);

    if (p == string::npos) return "";

    string v;
    bool e = false;

    for (++p; p < j.size(); ++p) {
        char c = j[p];

        if (e) {
            if (c == 'n') v += '\n';
            else if (c == 'r') v += '\r';
            else if (c == 't') v += '\t';
            else v += c;

            e = false;
        }
        else if (c == '\\') {
            e = true;
        }
        else if (c == '"') {
            break;
        }
        else {
            v += c;
        }
    }

    return v;
}

// Split pipe-separated database records.
vector<string> split(const string& s) {
    vector<string> a;
    string x;
    stringstream ss(s);

    while (getline(ss, x, '|')) {
        a.push_back(x);
    }

    if (!s.empty() && s.back() == '|') {
        a.push_back("");
    }

    return a;
}

bool invalid(const string& s) {
    return s.find('|') != string::npos ||
           s.find('\n') != string::npos ||
           s.find('\r') != string::npos;
}

string msg(bool ok, const string& m) {
    return string("{\"success\":") +
           (ok ? "true" : "false") +
           ",\"message\":\"" + esc(m) + "\"}";
}

// Return all jobs.
string jobs() {
    ifstream f("jobs.txt");

    string l;
    string o = "{\"success\":true,\"jobs\":[}";
    bool first = true;

    if (!f) {
        return "{\"success\":true,\"jobs\":[]}";
    }

    o = "{\"success\":true,\"jobs\":[";

    while (getline(f, l)) {
        vector<string> x = split(l);

        if (x.size() < 6) continue;

        if (!first) o += ",";

        first = false;

        o += "{\"jobID\":\"" + esc(x[0]) +
             "\",\"companyName\":\"" + esc(x[1]) +
             "\",\"jobTitle\":\"" + esc(x[2]) +
             "\",\"salary\":\"" + esc(x[3]) +
             "\",\"skills\":\"" + esc(x[4]) +
             "\",\"category\":\"" + esc(x[5]) + "\"}";
    }

    return o + "]}";
}

// Return applications belonging to a particular applicant.
string apps(const string& name) {
    ifstream f("applications.txt");

    string l;
    string o = "{\"success\":true,\"applications\":[";
    bool first = true;

    while (getline(f, l)) {
        vector<string> x = split(l);

        if (x.size() < 4 || x[0] != name) continue;

        if (!first) o += ",";

        first = false;

        o += "{\"applicantName\":\"" + esc(x[0]) +
             "\",\"companyName\":\"" + esc(x[1]) +
             "\",\"jobTitle\":\"" + esc(x[2]) +
             "\",\"status\":\"" + esc(x[3]) + "\"}";
    }

    return o + "]}";
}

// Return notifications belonging to a particular applicant.
string notices(const string& name) {
    ifstream f("notifications.txt");

    string l;
    string o = "{\"success\":true,\"notifications\":[";
    bool first = true;

    while (getline(f, l)) {
        size_t p = l.find('|');

        if (p == string::npos || l.substr(0, p) != name) {
            continue;
        }

        if (!first) o += ",";

        first = false;

        o += "{\"message\":\"" + esc(l.substr(p + 1)) + "\"}";
    }

    return o + "]}";
}

// Update an application status and notify the applicant.
string updateApplicationStatus(
    const string& applicant,
    const string& company,
    const string& job,
    const string& newStatus
) {
    if (applicant.empty() || company.empty() ||
        job.empty() || newStatus.empty()) {
        return msg(false, "All application details and status are required.");
    }

    if (invalid(applicant) || invalid(company) ||
        invalid(job) || invalid(newStatus)) {
        return msg(false, "Invalid field value.");
    }

    ifstream in("applications.txt");

    if (!in) {
        return msg(false, "Cannot open applications.txt.");
    }

    ofstream temp("applications_temp.txt");

    if (!temp) {
        return msg(false, "Cannot create temporary application file.");
    }

    string line;
    bool found = false;

    while (getline(in, line)) {
        vector<string> fields = split(line);

        if (fields.size() >= 4 &&
            fields[0] == applicant &&
            fields[1] == company &&
            fields[2] == job) {

            fields[3] = newStatus;
            found = true;

            temp << fields[0] << "|"
                 << fields[1] << "|"
                 << fields[2] << "|"
                 << fields[3] << "\n";
        }
        else {
            temp << line << "\n";
        }
    }

    in.close();
    temp.close();

    if (!found) {
        remove("applications_temp.txt");
        return msg(false, "Matching application not found.");
    }

    if (remove("applications.txt") != 0) {
        remove("applications_temp.txt");
        return msg(false, "Could not replace applications.txt.");
    }

    if (rename("applications_temp.txt", "applications.txt") != 0) {
        return msg(false, "Could not save updated applications.");
    }

    // Automatically create a notification for the applicant.
    ofstream notificationFile("notifications.txt", ios::app);

    if (!notificationFile) {
        return msg(false, "Status updated, but notification could not be saved.");
    }

    notificationFile
        << applicant
        << "|Your application for "
        << job
        << " at "
        << company
        << " has been updated to: "
        << newStatus
        << "\n";

    notificationFile.close();

    return msg(true, "Application status updated and notification sent.");
}

// Return all applications for the admin.
string allApplications() {
    ifstream f("applications.txt");

    string line;
    string output = "{\"success\":true,\"applications\":[";
    bool first = true;

    if (!f) {
        return "{\"success\":true,\"applications\":[]}";
    }

    while (getline(f, line)) {
        vector<string> fields = split(line);

        if (fields.size() < 4) continue;

        if (!first) output += ",";

        first = false;

        output += "{\"applicantName\":\"" + esc(fields[0]) +
                  "\",\"companyName\":\"" + esc(fields[1]) +
                  "\",\"jobTitle\":\"" + esc(fields[2]) +
                  "\",\"status\":\"" + esc(fields[3]) + "\"}";
    }

    output += "]}";

    return output;
}

// Main API routing function.
string route(
    const string& method,
    const string& path,
    const string& b,
    const string& adminToken
) {

    if (method == "GET" && path == "/api/health") {
        return msg(true, "JOBNEST backend is running");
    }

    if (method == "GET" && path == "/api/jobs") {
        return jobs();
    }

    // ADMIN LOGIN
    if (method == "POST" && path == "/api/admin/login") {

        string email = value(b, "email");
        string password = value(b, "password");

        if (email.empty() || password.empty()) {
            return msg(false, "Email and password are required.");
        }

        ifstream adminFile("admin.txt");

        if (!adminFile) {
            return msg(false, "Admin credentials file not found.");
        }

        string line;
        bool validAdmin = false;

        while (getline(adminFile, line)) {
            vector<string> fields = split(line);

            if (fields.size() >= 2 &&
                fields[0] == email &&
                fields[1] == password) {

                validAdmin = true;
                break;
            }
        }

        adminFile.close();

        if (!validAdmin) {
            return msg(false, "Invalid admin email or password.");
        }

        string token = generateAdminToken();

        adminSessions[token] = true;

        return "{\"success\":true,"
               "\"message\":\"Admin login successful\","
               "\"token\":\"" + token + "\"}";
    }

    // VERIFY ADMIN SESSION
    if (method == "GET" && path == "/api/admin/verify") {

        if (!isAdminAuthenticated(adminToken)) {
            return msg(false, "Unauthorized admin access.");
        }

        return msg(true, "Admin session is valid.");
    }

    // ADMIN LOGOUT
    if (method == "POST" && path == "/api/admin/logout") {

        if (!isAdminAuthenticated(adminToken)) {
            return msg(false, "Unauthorized admin access.");
        }

        adminSessions.erase(adminToken);

        return msg(true, "Admin logged out successfully.");
    }

    // ADMIN APPLICATIONS - PROTECTED
    if (method == "GET" && path == "/api/admin/applications") {

        if (!isAdminAuthenticated(adminToken)) {
            return msg(false, "Unauthorized admin access.");
        }

        return allApplications();
    }

    // USER REGISTRATION
    if (method == "POST" && path == "/api/register") {

        string n = value(b, "name");
        string e = value(b, "email");
        string p = value(b, "password");
        string ph = value(b, "phone");
        string q = value(b, "qualification");
        string s = value(b, "skills");

        if (n.empty() || e.empty() || p.empty()) {
            return msg(false, "Name, email and password are required.");
        }

        if (invalid(n) || invalid(e) || invalid(p) ||
            invalid(ph) || invalid(q) || invalid(s)) {
            return msg(false, "Fields cannot contain | or line breaks.");
        }

        ifstream in("users.txt");
        string l;

        while (getline(in, l)) {
            vector<string> x = split(l);

            if (x.size() >= 2 && x[1] == e) {
                return msg(false, "This email is already registered.");
            }
        }

        in.close();

        ofstream out("users.txt", ios::app);

        if (!out) {
            return msg(false, "Cannot write users.txt.");
        }

        out << n << "|" << e << "|" << p << "|"
            << ph << "|" << q << "|" << s << "\n";

        out.close();

        return msg(true, "Registration successful. Please log in.");
    }

    // USER LOGIN
    if (method == "POST" && path == "/api/login") {

        string e = value(b, "email");
        string p = value(b, "password");

        if (e.empty() || p.empty()) {
            return msg(false, "Email and password are required.");
        }

        ifstream in("users.txt");
        string l;

        while (getline(in, l)) {
            vector<string> x = split(l);

            if (x.size() >= 6 && x[1] == e && x[2] == p) {

                return "{\"success\":true,"
                       "\"message\":\"Login successful\","
                       "\"user\":{\"name\":\"" + esc(x[0]) +
                       "\",\"email\":\"" + esc(x[1]) +
                       "\",\"phone\":\"" + esc(x[3]) +
                       "\",\"qualification\":\"" + esc(x[4]) +
                       "\",\"skills\":\"" + esc(x[5]) + "\"}}";
            }
        }

        return msg(false, "Invalid email or password.");
    }

    // APPLY FOR JOB
    if (method == "POST" && path == "/api/apply") {

        string n = value(b, "applicantName");
        string c = value(b, "companyName");
        string t = value(b, "jobTitle");

        if (n.empty() || c.empty() || t.empty()) {
            return msg(false, "Applicant, company and job title are required.");
        }

        if (invalid(n) || invalid(c) || invalid(t)) {
            return msg(false, "Invalid field value.");
        }

        ifstream in("applications.txt");
        string l;

        while (getline(in, l)) {
            vector<string> x = split(l);

            if (x.size() >= 3 &&
                x[0] == n && x[1] == c && x[2] == t) {
                return msg(false, "You have already applied for this job.");
            }
        }

        in.close();

        ofstream out("applications.txt", ios::app);

        if (!out) {
            return msg(false, "Cannot write applications.txt.");
        }

        out << n << "|" << c << "|" << t << "|Applied\n";

        return msg(true, "Application submitted successfully.");
    }

    // USER APPLICATIONS
    if (method == "POST" && path == "/api/applications") {

        string n = value(b, "name");

        if (n.empty()) {
            return msg(false, "Applicant name is required.");
        }

        return apps(n);
    }

    // SAVE JOB
    if (method == "POST" && path == "/api/saved-jobs") {

        string n = value(b, "userName");
        string id = value(b, "jobID");

        if (n.empty() || id.empty() || invalid(n) || invalid(id)) {
            return msg(false, "Valid user name and job ID are required.");
        }

        ofstream out("savedjobs.txt", ios::app);

        if (!out) {
            return msg(false, "Cannot write savedjobs.txt.");
        }

        out << n << "|" << id << "\n";

        return msg(true, "Job saved successfully.");
    }

    // USER NOTIFICATIONS
    if (method == "POST" && path == "/api/notifications") {

        string n = value(b, "name");

        if (n.empty()) {
            return msg(false, "Applicant name is required.");
        }

        return notices(n);
    }

    // UPDATE APPLICATION STATUS - PROTECTED
    if (method == "POST" &&
        path == "/api/update-application-status") {

        if (!isAdminAuthenticated(adminToken)) {
            return msg(false, "Unauthorized admin access.");
        }

        string applicant = value(b, "applicantName");
        string company = value(b, "companyName");
        string job = value(b, "jobTitle");
        string status = value(b, "status");

        return updateApplicationStatus(
            applicant,
            company,
            job,
            status
        );
    }

    return msg(false, "API route not found.");
}

// Create HTTP response with CORS headers.
string response(const string& b) {

    string h =
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: application/json; charset=utf-8\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
        "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
        "Connection: close\r\n"
        "Content-Length: " + to_string(b.size()) + "\r\n\r\n";

    return h + b;
}

int main() {

    WSADATA w;

    if (WSAStartup(MAKEWORD(2, 2), &w) != 0) {
        cerr << "Winsock startup failed\n";
        return 1;
    }

    SOCKET server = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);

    if (server == INVALID_SOCKET) {
        cerr << "Socket creation failed\n";
        WSACleanup();
        return 1;
    }

    sockaddr_in a;

    a.sin_family = AF_INET;
    a.sin_port = htons(PORT);
    a.sin_addr.s_addr = inet_addr("127.0.0.1");

    if (bind(server, (sockaddr*)&a, sizeof(a)) == SOCKET_ERROR) {
        cerr << "Cannot bind port 8080. Is it already in use?\n";
        closesocket(server);
        WSACleanup();
        return 1;
    }

    if (listen(server, 10) == SOCKET_ERROR) {
        cerr << "Listen failed\n";
        closesocket(server);
        WSACleanup();
        return 1;
    }

    cout << "JOBNEST C++ API running at http://127.0.0.1:8080\n";
    cout << "Keep this terminal open.\n";

    while (true) {

        SOCKET client = accept(server, NULL, NULL);

        if (client == INVALID_SOCKET) {
            continue;
        }

        string req;
        char buf[4096];

        int n;
        size_t he = string::npos;
        size_t cl = 0;

        // Receive complete HTTP request.
        do {

            n = recv(client, buf, sizeof(buf), 0);

            if (n <= 0) break;

            req.append(buf, n);

            he = req.find("\r\n\r\n");

            if (he != string::npos) {

                size_t cp = req.find("Content-Length:");

                if (cp != string::npos && cp < he) {

                    size_t ep = req.find("\r\n", cp);

                    cl = (size_t)strtoul(
                        trim(req.substr(cp + 15, ep - cp - 15)).c_str(),
                        NULL,
                        10
                    );
                }

                if (req.size() >= he + 4 + cl) {
                    break;
                }
            }

        } while (n > 0);

        string method, path, body, adminToken;

        if (he != string::npos) {

            string headers = req.substr(0, he);

            stringstream ss(req.substr(0, req.find("\r\n")));

            ss >> method >> path;

            // Remove URL query parameters.
            size_t queryPos = path.find('?');

            if (queryPos != string::npos) {
                path = path.substr(0, queryPos);
            }

            // Extract Authorization: Bearer token.
            size_t authPos = headers.find("Authorization:");

            if (authPos != string::npos) {

                size_t authEnd = headers.find("\r\n", authPos);

                string authValue = trim(
                    headers.substr(
                        authPos + 14,
                        authEnd == string::npos
                            ? string::npos
                            : authEnd - authPos - 14
                    )
                );

                const string prefix = "Bearer ";

                if (authValue.compare(0, prefix.size(), prefix) == 0) {
                    adminToken = trim(authValue.substr(prefix.size()));
                }
            }

            body = req.substr(he + 4, cl);
        }

        string out;

        if (method == "OPTIONS") {
            out = "{}";
        }
        else {
            out = route(method, path, body, adminToken);
        }

        string res = response(out);

        send(client, res.c_str(), (int)res.size(), 0);

        shutdown(client, SD_SEND);
        closesocket(client);
    }

    closesocket(server);
    WSACleanup();

    return 0;
}
