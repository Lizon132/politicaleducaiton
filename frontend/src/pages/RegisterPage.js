import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/register`, {
                username,
                email,
                password,
            }, { withCredentials: true });

            console.log('Registration successful:', response.data);
            setMessage('Registration successful! Redirecting to Dashboard...');

            // Store session and redirect
            localStorage.setItem('userId', response.data.userId);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            const errorMessage =
                err.response && err.response.data && err.response.data.error
                    ? err.response.data.error
                    : 'An unexpected error occurred: ' + err.message;

            console.error('Error during registration:', errorMessage);
            setError(errorMessage);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h1>Register</h1>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleRegister} className="register-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
