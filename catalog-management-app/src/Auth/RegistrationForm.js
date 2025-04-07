import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './../UserProfile.module.css'; // Import the CSS module

function RegistrationForm() {
    const [user_name, setUsername] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [birth_date, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        let tempErrors = {};
        tempErrors.user_name = user_name ? '' : 'Username is required';
        tempErrors.first_name = first_name ? '' : 'First name is required';
        tempErrors.last_name = last_name ? '' : 'Last name is required';
        tempErrors.email = email ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Email is not valid') : 'Email is required';
        tempErrors.birth_date = birth_date ? '' : 'Birth date is required';
        tempErrors.password = password ? (password.length >= 6 ? '' : 'Password must be at least 6 characters') : 'Password is required';
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validate()) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_name, first_name, last_name, email, birth_date, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    navigate('/login');
                } else {
                    setError(data.error || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                setError('Network error. Please try again.');
            }
        }
    };

    return (
        <div className={styles.userProfile}>
            <h2>Registration</h2>
            {error && <p className={styles.error}>{error}</p>}
            <form noValidate onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username: <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="username" value={user_name} onChange={(e) => setUsername(e.target.value)} />
                    {errors.user_name && <p className={styles.error}>{errors.user_name}</p>}
                </div>
                <div>
                    <label htmlFor="firstName">First Name: <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="firstName" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                    {errors.first_name && <p className={styles.error}>{errors.first_name}</p>}
                </div>
                <div>
                    <label htmlFor="lastName">Last Name: <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="lastName" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                    {errors.last_name && <p className={styles.error}>{errors.last_name}</p>}
                </div>
                <div>
                    <label htmlFor="email">Email: <span style={{ color: 'red' }}>*</span></label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className={styles.error}>{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="birthDate">Date of Birth: <span style={{ color: 'red' }}>*</span></label>
                    <input type="date" id="birthDate" value={birth_date} onChange={(e) => setBirthDate(e.target.value)} />
                    {errors.birth_date && <p className={styles.error}>{errors.birth_date}</p>}
                </div>
                <div>
                    <label htmlFor="password">Password: <span style={{ color: 'red' }}>*</span></label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p className={styles.error}>{errors.password}</p>}
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>Register</button>
                </div>
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
}

export default RegistrationForm;