import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './../../UserList.module.css'; // Import the CSS module

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                setIsAdmin(decoded.isAdmin);
                setLoggedInUserId(decoded.userId);
                if (!decoded.isAdmin) {
                    navigate('/profile');
                    return;
                }
                const response = await fetch('http://localhost:9000/auth/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users);
                } else if (response.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleDelete = async (id, userName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${userName}?`);
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:9000/auth/users/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setUsers(users.filter(user => user._id !== id));
                    alert('User deleted successfully');
                } else if (response.status === 401) {
                    navigate('/login');
                } else {
                    const errorData = await response.json();
                    setError(`Failed to delete user: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                setError('Network error. Please try again.');
            }
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    if (!isAdmin) return <div>Not authorized</div>;

    return (
        <div className={styles.userList}>
            <h2>Manage Users</h2>
            {users.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Username</th>
                            <th className={styles.th}>Email</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className={styles.tr}>
                                <td className={styles.td}>{user.user_name}</td>
                                <td className={styles.td}>{user.email}</td>
                                <td className={styles.td}>
                                    <button onClick={() => navigate(`/edit-user/${user._id}`)} className={styles.button}>Edit</button>
                                    {loggedInUserId !== user._id && (
                                        <button onClick={() => handleDelete(user._id, user.user_name)} className={styles.button}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No users available.</div>
            )}
        </div>
    );
}

export default AdminUsers;