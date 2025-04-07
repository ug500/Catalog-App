import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './../../Header.module.css';

function Header() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const lastName = localStorage.getItem('lastName');
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('lastName');
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Catalog Management App</h1>
            {isLoggedIn && (username || lastName) && (
                <div className={styles.welcome}>
                    Welcome {username} {lastName}
                </div>
            )}
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </header>
    );
}

export default Header;