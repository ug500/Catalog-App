import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import layoutStyles from './../Layout.module.css'; // Ensure this path is correct
import styles from './../LoginForm.module.css';


function LoginForm() {
    const [user_name, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        let tempErrors = {};
        tempErrors.user_name = user_name ? '' : 'Username is required';
        tempErrors.password = password ? '' : 'Password is required';
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validate()) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_name, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('role', data.role);
                    navigate('/products');
                } else {
                    setError(data.error || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                setError('Network error. Please try again.');
            }
        }
    };

    return (
        <div className={layoutStyles.main}>
            <div className={layoutStyles.cardWrapper}>
                <div className={styles.loginCard}>
                    <h2>Login</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <form noValidate onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username">Username: <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                id="username"
                                value={user_name}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.user_name && <p className={styles.error}>{errors.user_name}</p>}
                        </div>
                        <div>
                            <label htmlFor="password">Password: <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p className={styles.error}>{errors.password}</p>}
                        </div>
                        <button type="submit">Login</button>
                        <p>
                            Don't have an account? <a href="/register">Register</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;