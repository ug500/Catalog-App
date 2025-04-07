import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Auth/LoginForm';
import RegistrationForm from './Auth/RegistrationForm';
import ProductList from './components/Product/ProductList';
import ProductForm from './components/Product/ProductForm';
import ProfilePage from './components/Profile/ProfilePage';
import AdminUsers from './components/Admin/AdminUsers';
import Layout from './components/Layout/Layout';
import UserList from './components/Admin/UserList';
import EditUser from './components/Admin/EditUser';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin-users" element={<Layout><AdminUsers /></Layout>} />
                <Route path="/login" element={<Layout><LoginForm /></Layout>} />
                <Route path="/register" element={<Layout><RegistrationForm /></Layout>} />
                <Route path="/products" element={<Layout><ProductList /></Layout>} />
                <Route path="/products/add" element={<Layout><ProductForm /></Layout>} />
                <Route path="/products/edit/:id" element={<Layout><ProductForm /></Layout>} />
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                <Route path="/" element={<Layout><LoginForm /></Layout>} />
                <Route path="/users" element={<Layout><UserList /></Layout>} />
                <Route path="/edit-user/:id" element={<Layout><EditUser /></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;