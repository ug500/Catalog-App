// src/components/Admin/UserList.js

import React, { useState, useEffect } from 'react';
import styles from './../../UserList.module.css'; // Import the CSS module

function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:9000/auth/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
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

    if (loading) {
        return <div className={styles.loading}>Loading users...</div>;
    }

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <div className={styles.userList}>
            <h2>User List</h2>
            <ul className={styles.ul}>
                {users.map((user) => (
                    <li key={user._id} className={styles.li}>
                        {user.user_name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;