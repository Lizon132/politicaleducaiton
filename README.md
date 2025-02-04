# Political Education App

## Overview
The **Political Education App** is a web-based platform designed to help users understand how political candidates' policies align with their personal interests. The app enables users to create detailed profiles based on demographic, economic, and social factors, allowing for an AI-assisted analysis of political policies relevant to them.

### 🔹 **Goals of the Application**
- **Personalized Political Education**: Help users understand how policies affect their lives based on their profile data.
- **AI-Assisted Analysis**: Use AI to categorize user concerns and compare them against official candidate positions.
- **User-Centric Profile Creation**: Allow users to input free-form text to describe their concerns instead of selecting from predefined categories.
- **Security & Privacy**: Use session-based authentication with secure HTTP-only cookies.
- **Dynamic Navigation**: Display different UI elements based on login status.

## 🚀 Features
- **User Authentication**: Register, login, logout, and manage account settings.
- **Profile Management**: Create and edit profiles with detailed information.
- **Candidate Policy Matching**: AI-powered categorization of user data to match relevant political stances.
- **Secure Sessions**: Authentication with HTTP-only cookies and session handling.
- **Customizable Settings**: Update user email, password, and other personal preferences.
- **Dynamic Navbar**: Adjusts based on login status to show relevant pages.

## 📂 Project Structure
```
politicaleducation/
│── backend/              # Express.js backend
│   ├── database.js       # SQLite3 database connection
│   ├── server.js         # Main backend application
│   ├── routes/           # API routes for users and profiles
│   ├── .env              # Environment variables
│   └── package.json      # Backend dependencies
│
│── frontend/             # React.js frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # App pages (Dashboard, Settings, etc.)
│   │   ├── App.js        # Main application logic
│   │   ├── index.js      # Root file
│   │   ├── styles/       # CSS files
│   ├── public/           # Static assets
│   ├── .env              # Frontend environment variables
│   └── package.json      # Frontend dependencies
```

## 🛠️ Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Lizon132/politicaleducation.git
cd politicaleducation
```
### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/`:
```
SESSION_SECRET=your-secret-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
PORT=3000
API_BASE_URL=http://localhost:3000
```
Start the backend:
```bash
npm start
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file inside `frontend/`:
```
PORT=3001
REACT_APP_BACKEND_URL=http://localhost:3000
```
Start the frontend:
```bash
npm start
```

## 📌 Usage
1. **Register/Login** at `http://localhost:3001`.
2. **Create a Profile** to input personal concerns and preferences.
3. **View Analysis** of how policies affect your life.
4. **Update Settings** (email, password, preferences) through the Settings page.
5. **Logout** securely to end the session.

## 🔧 Development Notes
### Backend API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/user/login` | Logs in the user and starts a session |
| POST | `/user/logout` | Ends the user's session |
| GET | `/user/session` | Checks if the user is logged in |
| POST | `/user/register` | Registers a new user |
| GET | `/user/:id/profiles` | Fetches user profiles |

### Frontend Components
- **Navbar**: Adjusts based on authentication status.
- **ProtectedRoute**: Ensures authenticated users can access specific pages.
- **Forms**: Implement validation for registration and settings.

## 🔍 Troubleshooting
### Port Conflicts
- Ensure ports `3000` (backend) and `3001` (frontend) are available.
- Kill processes using those ports if necessary:
```bash
npx kill-port 3000 3001
```

### CORS Issues
- Ensure the backend’s `CORS_ORIGIN` matches the frontend’s URL in the `.env` file.

### Sessions Not Persisting
- Enable cookies in your browser.
- Restart the backend with `npm start`.

## 🔜 Future Improvements
- **Better AI Processing**: Improved policy-matching algorithms.
- **User Dashboard Enhancements**: More visual elements for tracking policy matches.
- **Mobile Responsiveness**: Improved UI for mobile devices.

## 📜 License
This project is licensed under the MIT License.

---
Made with ❤️ by Lizon132

