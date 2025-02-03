import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/session`, {
                    withCredentials: true,
                });

                if (response.data.loggedIn) {
                    setUser(response.data.user);
                } else {
                    navigate('/login');
                }
            } catch (err) {
                console.error('Error checking session:', err);
                navigate('/login');
            }
        };

        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/profiles`, {
                    withCredentials: true,
                });
                setProfiles(response.data);
            } catch (err) {
                console.error('Error fetching profiles:', err);
                setError('Failed to load profiles. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
        fetchProfiles();
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
        <div style={{ padding: '20px' }}>
            <h1>Welcome {user ? user.username : 'User'}!</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading profiles...</p>
            ) : (
                <>
                    <h2>Your Profiles</h2>
                    {profiles.length > 0 ? (
                        <ul>
                            {profiles.map((profile) => (
                                <li key={profile.id} style={{ marginBottom: '10px' }}>
                                    <strong>{profile.name}</strong> - {profile.visibility}
                                    <div>
                                        <button className="btn btn-primary" onClick={() => handleEditProfile(profile.id)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteProfile(profile.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You haven't created any profiles yet.</p>
                    )}
                    <button className="btn btn-success" onClick={handleCreateProfile}>
                        Create New Profile
                    </button>
                </>
            )}
        </div>
    );
};

export default DashboardPage;
