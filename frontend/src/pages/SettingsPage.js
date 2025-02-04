import React, { useState } from 'react';
import axios from 'axios';

const SettingsPage = () => {
    const [email, setEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Handle email update
    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/user/update-email`,
                { newEmail, currentPassword },
                { withCredentials: true }
            );

            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update email');
            setMessage('');
        }
    };

    // Handle password update
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/user/update-password`,
                { currentPassword, newPassword },
                { withCredentials: true }
            );

            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update password');
            setMessage('');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Settings</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Update Email */}
            <form onSubmit={handleUpdateEmail} className="mb-4">
                <h4>Update Email</h4>
                <div className="mb-3">
                    <label className="form-label">New Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Current Password (Required)</label>
                    <input
                        type="password"
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Email</button>
            </form>

            {/* Update Password */}
            <form onSubmit={handleUpdatePassword}>
                <h4>Update Password</h4>
                <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
        </div>
    );
};

export default SettingsPage;
