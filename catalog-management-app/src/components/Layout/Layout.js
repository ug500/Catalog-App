import React from 'react';
import Header from './Header';
import LeftMenu from './LeftMenu';
import Footer from './Footer';
import styles from './../../Layout.module.css'; // Import the CSS module

function Layout({ children }) {
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <LeftMenu isLoggedIn={isLoggedIn} key={isLoggedIn ? 'loggedIn' : 'loggedOut'} />
                <main className={styles.main}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Layout;