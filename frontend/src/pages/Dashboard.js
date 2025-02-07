import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileDashboard from '../components/ProfileDashboard';

const DashboardPage = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessionAndProfiles = async () => {
            try {
                // Fetch session first
                const sessionResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/session`, {
                    withCredentials: true,
                });

                if (sessionResponse.data.loggedIn) {
                    setUser(sessionResponse.data.user);
                    
                    // Fetch profiles only if the user is authenticated
                    const profileResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile/${sessionResponse.data.user.id}`, {
                        withCredentials: true,
                    });

                    setProfiles(profileResponse.data);
                } else {
                    navigate('/login');
                }
            } catch (err) {
                console.error('Error checking session or fetching profiles:', err);
                setError('Failed to authenticate or load profiles.');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchSessionAndProfiles();
    }, [navigate]);

    const handleCreateProfile = () => {
        navigate('/create-profile');
    };

    const handleEditProfile = (id) => {
        navigate(`/edit-profile/${id}`);
    };

    const handleDeleteProfile = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/profile/${id}`, {
                withCredentials: true,
            });

            setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== id));
        } catch (err) {
            console.error('Error deleting profile:', err);
            setError('Failed to delete profile. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            <h1>Welcome, {user ? user.username : 'User'}!</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <p>Loading profiles...</p>
            ) : (
                <>
                    <h2>Your Profiles</h2>
                    {profiles.length > 0 ? (
                        <div className="list-group">
                            {profiles.map((profile) => (
                                <div key={profile.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{profile.name}</strong> - {profile.visibility}
                                    </div>
                                    <div>
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditProfile(profile.id)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProfile(profile.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>You haven't created any profiles yet.</p>
                    )}
                    {profiles.length < 10 && (
                        <button className="btn btn-success mt-3" onClick={handleCreateProfile}>
                            Create New Profile
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default DashboardPage;
