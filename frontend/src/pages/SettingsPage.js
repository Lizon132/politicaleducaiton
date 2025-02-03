import React, { useState } from 'react';

const SettingsPage = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const handleThemeChange = (e) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.body.className = newTheme; // Apply theme to body
    };

    return (
        <div className="container mt-4">
            <h1>Settings</h1>
            <div className="form-group">
                <label>Theme:</label>
                <select className="form-control" value={theme} onChange={handleThemeChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>
        </div>
    );
};

export default SettingsPage;
