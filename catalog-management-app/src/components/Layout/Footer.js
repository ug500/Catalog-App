import React from 'react';
import styles from './../../Footer.module.css'; // Import the CSS Module

function Footer() {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} Catalog Management App</p>
        </footer>
    );
}

export default Footer;