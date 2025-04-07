import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './../../UserProfile.module.css'; // Import the CSS module

function EditUser() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({}); // State for validation errors
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:9000/auth/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser({
                        ...data.user,
                        preferences: { page_size: data.user.Preferences?.Page_size || 12 },
                    });
                } else if (response.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to fetch user');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, navigate]);

    const validate = () => {
        let tempErrors = {};
        tempErrors.user_name = user.user_name ? '' : 'Username is required';
        tempErrors.first_name = user.first_name ? '' : 'First name is required';
        tempErrors.last_name = user.last_name ? '' : 'Last name is required';
        tempErrors.email = user.email ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) ? '' : 'Invalid email format') : 'Email is required';
        tempErrors.page_size = user.preferences?.page_size ? (/^\d+$/.test(user.preferences.page_size) ? '' : 'Page size must be a number') : 'Page size is required';
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
            preferences: name === 'page_size' ? { ...user.preferences, page_size: parseInt(value, 10) } : user.preferences,
        });
    };

    const handleUpdate = async () => {
        if (validate()) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:9000/auth/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...user,
                        Preferences: user.preferences,
                    }),
                });

                if (response.ok) {
                    alert('User updated successfully');
                    navigate('/admin-users');
                } else if (response.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to update user');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                setError('Network error. Please try again.');
            }
        }
    };

    const handleClear = () => {
        setUser({
            user_name: '',
            first_name: '',
            last_name: '',
            email: '',
            preferences: { page_size: 12 },
        });
        setErrors({});
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!user) return <div>User not found.</div>;

    return (
        <div className={styles.userProfile}>
            <h2>Edit User</h2>
            <form noValidate>
                <div>
                    <label htmlFor="user_name">Username: <span style={{ color: 'red' }}>*</span></label><br />
                    <input type="text" name="user_name" id="user_name" value={user.user_name || ''} onChange={handleChange} placeholder="Username" /><br />
                    {errors.user_name && <p className={styles.error}>{errors.user_name}</p>}
                </div>
                <div>
                    <label htmlFor="first_name">First Name: <span style={{ color: 'red' }}>*</span></label><br />
                    <input type="text" name="first_name" id="first_name" value={user.first_name || ''} onChange={handleChange} placeholder="First Name" /><br />
                    {errors.first_name && <p className={styles.error}>{errors.first_name}</p>}
                </div>
                <div>
                    <label htmlFor="last_name">Last Name: <span style={{ color: 'red' }}>*</span></label><br />
                    <input type="text" name="last_name" id="last_name" value={user.last_name || ''} onChange={handleChange} placeholder="Last Name" /><br />
                    {errors.last_name && <p className={styles.error}>{errors.last_name}</p>}
                </div>
                <div>
                    <label htmlFor="email">Email: <span style={{ color: 'red' }}>*</span></label><br />
                    <input type="email" name="email" id="email" value={user.email || ''} onChange={handleChange} placeholder="Email" /><br />
                    {errors.email && <p className={styles.error}>{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="page_size">Page Size: <span style={{ color: 'red' }}>*</span></label><br />
                    <input type="number" name="page_size" id="page_size" value={user.preferences?.page_size || ''} onChange={handleChange} placeholder="Page Size" /><br />
                    {errors.page_size && <p className={styles.error}>{errors.page_size}</p>}
                </div>
                <div className={styles.buttonContainer}>
                    <button type="button" onClick={handleUpdate} className={styles.button}>Save Changes</button>
                    <button type="button" onClick={() => navigate('/admin-users')} className={styles.button}>Cancel</button>
                    <button type="button" onClick={handleClear} className={styles.button}>Clear</button>
                </div>
            </form>
        </div>
    );
}

export default EditUser;