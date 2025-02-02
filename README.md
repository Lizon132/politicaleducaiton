# README: Political Education App

## Description
The **Political Education App** is a web-based application that allows users to create profiles based on their demographic and political concerns. Users can input their preferences and information in free-form text, which is analyzed and categorized by an AI model. The app provides features such as creating, editing, and deleting profiles, viewing personalized dashboards, and comparing profiles to political candidates' platforms.

Key features:
- **User Authentication**: Secure login and registration with sessions.
- **Profile Management**: Create, edit, view, and delete profiles.
- **Settings Page**: Customize app appearance and settings.
- **Protected Routes**: Ensure secure access to user-specific pages.

## Prerequisites
- **Node.js**: Ensure you have Node.js installed on your machine.
- **SQLite3**: Database engine to store user and profile data.
- **npm/yarn**: Package manager for dependency installation.

---

## Installation

### 1. Clone the Repository
```bash
git clone <repository_url>
cd political-education-app
```

### 2. Set Up Backend
Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory with the following content:
```
SESSION_SECRET=your-secret-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
PORT=3000
API_BASE_URL=http://localhost:3000
```

Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:3000`.

### 3. Set Up Frontend
Navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `frontend` directory with the following content:
```
PORT=3001
REACT_APP_BACKEND_URL=http://localhost:3000
```

Start the frontend development server:
```bash
npm start
```
The frontend will run on `http://localhost:3001`.

---

## Usage

### User Authentication
1. Navigate to `http://localhost:3001`.
2. Register a new account or log in with existing credentials.

### Profile Management
1. Once logged in, navigate to the **Dashboard**.
2. Create, edit, or delete profiles as needed.
3. Profiles can include free-form text for demographic and political preferences.

### Settings
1. Access the **Settings** page from the navigation bar.
2. Customize application themes or other preferences.

### Logout
Click the **Logout** button in the navigation bar to securely log out of your account.

---

## Development Notes

### Backend Endpoints
- **POST `/user/login`**: Logs in a user.
- **POST `/user/logout`**: Logs out a user.
- **GET `/user/session`**: Checks the session status.
- **GET `/user/:id/profiles`**: Fetches profiles for a user.

### Frontend Structure
- **Pages**:
  - Home
  - Login
  - Register
  - Dashboard
  - Settings
- **Components**:
  - Navbar
  - ProtectedRoute

---

## Troubleshooting

### Common Issues
1. **Port Conflicts**:
   - Ensure ports `3000` and `3001` are not in use by other processes. Use `lsof -i :port` (Linux/macOS) or `netstat -ano | findstr :port` (Windows) to identify conflicts.

2. **CORS Errors**:
   - Verify `CORS_ORIGIN` in the backend `.env` file matches the frontend's URL.

3. **Session Not Persisting**:
   - Ensure cookies are enabled in your browser.
   - Use HTTPS in production for secure cookies.

---

## Future Features
- Integration with AI models for better categorization of user inputs.
- Enhanced analysis of political candidate platforms.
- Advanced user settings and preferences.

---

## License
This project is licensed under the MIT License.

