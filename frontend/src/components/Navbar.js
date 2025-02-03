import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/session`, {
                    withCredentials: true,
                });
                setIsLoggedIn(response.data.loggedIn);
            } catch (error) {
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, [setIsLoggedIn]);

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/logout`, {}, { withCredentials: true });
            setIsLoggedIn(false);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <NavLink className="navbar-brand" to="/">MyApp</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/settings">Settings</NavLink>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">Register</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    setIsLoggedIn: PropTypes.func.isRequired,
};

export default Navbar;
