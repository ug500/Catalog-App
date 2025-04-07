import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './../../LeftMenu.module.css';
import { FaBoxes, FaUser, FaUsers, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

function LeftMenu() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            try {
                const decodedToken = jwtDecode(token);
                setIsAdmin(decodedToken.isAdmin || false);
            } catch (error) {
                console.error('Error decoding token:', error);
                setIsAdmin(false);
            }
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/login');
    };

    const handleUsersClick = () => {
        if (isAdmin) {
            navigate('/admin-users');
        } else {
            navigate('/users');
        }
    };

    const isUsersActive = location.pathname === '/users' || location.pathname === '/admin-users';

    if (loading) {
        return (
            <nav className={styles.menu}>
                <ul>
                    <li>
                        <NavLink to="/products" className={({ isActive }) => isActive ? styles.active : ''}>
                            <FaBoxes className={styles.icon} /> Products
                        </NavLink>
                    </li>
                </ul>
            </nav>
        );
    }

    return (
        <nav className={styles.menu}>
            <ul>
                <li>
                    <NavLink to="/products" className={({ isActive }) => isActive ? styles.active : ''}>
                        <FaBoxes className={styles.icon} /> Products
                    </NavLink>
                </li>
                {isLoggedIn && (
                    <>
                        <li>
                            <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : ''}>
                                <FaUser className={styles.icon} /> Profile
                            </NavLink>
                        </li>
                        {isAdmin && (
                            <li>
                                <nav onClick={handleUsersClick} className={isUsersActive ? styles.active : ''}>
                                    <FaUsers className={styles.icon} /> Users
                                </nav>
                            </li>
                        )}
                        <li>
                            <nav onClick={handleLogout} className={location.pathname === '/login' ? styles.active : ''}>
                                <FaSignOutAlt className={styles.icon} /> Logout
                            </nav>
                        </li>
                    </>
                )}
                {!isLoggedIn && (
                    <li>
                        <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : ''}>
                            <FaSignInAlt className={styles.icon} /> Login
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default LeftMenu;