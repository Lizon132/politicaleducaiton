import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check session status on page load
        const checkSession = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/session`, { withCredentials: true });
                if (response.data.loggedIn) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Session check failed:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    if (loading) return <p>Loading...</p>; // Prevent rendering before session check

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <RegisterPage setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/dashboard" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Dashboard /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute isLoggedIn={isLoggedIn}><SettingsPage /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
