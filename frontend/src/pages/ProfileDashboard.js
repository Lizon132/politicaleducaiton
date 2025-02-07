import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileForm from './ProfileForm';

const ProfileDashboard = ({ userId }) => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile/${userId}`);
            setProfiles(response.data);
        } catch (err) {
            setError('Failed to fetch profiles.');
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (profileId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/profile/${profileId}`);
            setProfiles(profiles.filter(profile => profile.id !== profileId));
        } catch (err) {
            setError('Error deleting profile.');
        }
    };

    return (
        <div className="profile-dashboard">
            <h2>Your Profiles</h2>
            {error && <p className="error-message">{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {profiles.length < 10 && <ProfileForm userId={userId} onProfileCreated={fetchProfiles} />}
                    <ul>
                        {profiles.map(profile => (
                            <li key={profile.id}>
                                <strong>{profile.profileName}</strong> - Confidence Score: {profile.confidence_level}
                                <button className="btn btn-danger" onClick={() => handleDelete(profile.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileDashboard;
