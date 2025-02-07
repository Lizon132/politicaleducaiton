import React, { useState } from 'react';
import axios from 'axios';

const ProfileForm = ({ userId, onProfileCreated }) => {
    const [profileName, setProfileName] = useState('');
    const [responses, setResponses] = useState(Array(10).fill(''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const questions = [
        "What are your biggest concerns regarding education policy?",
        "How do you feel about healthcare accessibility and affordability?",
        "What is your stance on taxation and government spending?",
        "Do you have concerns about housing affordability?",
        "What are your thoughts on climate change policies?",
        "How do you feel about minimum wage policies?",
        "What is your stance on gun control laws?",
        "Do you have concerns about voting rights and election security?",
        "What is your opinion on immigration policies?",
        "What political issues are most important to you?"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/profile/submit`, {
                userId,
                profileName,
                responses: questions.map((q, i) => ({ questionId: i + 1, response: responses[i] }))
            });

            setSuccessMessage('Profile created successfully!');
            setProfileName('');
            setResponses(Array(10).fill(''));

            if (onProfileCreated) onProfileCreated();
        } catch (err) {
            setError('Error creating profile. Please try again.');
            console.error('Profile creation error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-form">
            <h2>Create a New Profile</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Profile Name</label>
                    <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        maxLength={50}
                        placeholder="Enter a profile name"
                    />
                </div>
                {questions.map((question, index) => (
                    <div key={index} className="form-group">
                        <label>{question}</label>
                        <textarea
                            value={responses[index]}
                            onChange={(e) => {
                                const newResponses = [...responses];
                                newResponses[index] = e.target.value;
                                setResponses(newResponses);
                            }}
                            placeholder="Type your response..."
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default ProfileForm;
