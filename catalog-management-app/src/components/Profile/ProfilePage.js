import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './../../UserProfile.module.css';

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [editedUser, setEditedUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:9000/auth/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setEditedUser({
                        first_name: data.user.first_name,
                        last_name: data.user.last_name,
                        email: data.user.email,
                        birth_date: data.user.birth_date,
                        page_size: data.user.preferences?.page_size,
                    });
                } else if (response.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const validate = () => {
        let tempErrors = {};
        tempErrors.first_name = editedUser.first_name ? '' : 'First name is required';
        tempErrors.last_name = editedUser.last_name ? '' : 'Last name is required';
        tempErrors.email = editedUser.email ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email) ? '' : 'Invalid email format') : 'Email is required';
        tempErrors.page_size = editedUser.page_size ? (/^\d+$/.test(editedUser.page_size) ? '' : 'Page size must be a number') : 'Page size is required';
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleUpdate = async () => {
        if (validate()) {
            try {
                const updateData = {
                    ...editedUser,
                    preferences: {
                        page_size: parseInt(editedUser.page_size, 10),
                    },
                };

                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:9000/auth/users/${user._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(updateData),
                });

                if (response.ok) {
                    alert('Profile updated successfully');
                    setUser({
                        ...user,
                        ...editedUser,
                        preferences: {
                            page_size: parseInt(editedUser.page_size, 10),
                        },
                    });
                    setIsEditing(false);
                } else if (response.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                setError('Network error. Please try again.');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleClear = () => {
        setEditedUser({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            birth_date: user.birth_date,
            page_size: user.preferences?.page_size,
        });
        setErrors({});
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!user) return <div>User data not available.</div>;

    return (
        <div className={styles.userProfile}>
            <h2>User Profile</h2>
            {isEditing ? (
                <form noValidate>
                    <div>
                        <label htmlFor="first_name">First Name: <span style={{ color: 'red' }}>*</span></label><br />
                        <input type="text" name="first_name" id="first_name" value={editedUser.first_name || ''} onChange={handleChange} placeholder="First Name" />
                        {errors.first_name && <p className={styles.error}>{errors.first_name}</p>}
                    </div>
                    <div>
                        <label htmlFor="last_name">Last Name: <span style={{ color: 'red' }}>*</span></label><br />
                        <input type="text" name="last_name" id="last_name" value={editedUser.last_name || ''} onChange={handleChange} placeholder="Last Name" />
                        {errors.last_name && <p className={styles.error}>{errors.last_name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email">Email: <span style={{ color: 'red' }}>*</span></label><br />
                        <input type="email" name="email" id="email" value={editedUser.email || ''} onChange={handleChange} placeholder="Email" />
                        {errors.email && <p className={styles.error}>{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="birth_date">Birth Date:</label><br />
                        <input type="date" name="birth_date" id="birth_date" value={editedUser.birth_date || ''} onChange={handleChange} placeholder="Birth Date" />
                    </div>
                    <div>
                        <label htmlFor="page_size">Page Size: <span style={{ color: 'red' }}>*</span></label><br />
                        <input type="number" name="page_size" id="page_size" value={editedUser.page_size || ''} onChange={handleChange} placeholder="Page Size" />
                        {errors.page_size && <p className={styles.error}>{errors.page_size}</p>}
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="button" onClick={handleUpdate} className={styles.button}>Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)} className={styles.button}>Cancel</button>
                        <button type="button" onClick={handleClear} className={styles.button}>Clear</button>
                    </div>
                </form>
            ) : (
                <div className={styles.profileInfo}>
                    <p><strong>Username:</strong> {user.user_name}</p>
                    <p><strong>First Name:</strong> {user.first_name}</p>
                    <p><strong>Last Name:</strong> {user.last_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Birth Date:</strong> {formatDate(user.birth_date)}</p>
                    <p><strong>Page Size:</strong> {user.preferences?.page_size}</p>
                    <button onClick={() => setIsEditing(true)} className={styles.button}>Edit Profile</button>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;