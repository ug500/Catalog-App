const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token (authentication)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' });
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ error: 'No token provided' });
    }
};

// Middleware to check if the user is an admin (authorization)
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ error: 'Not authorized' });
    }
};

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { user_name, first_name, last_name, email, birth_date, password } = req.body;

        const existingUser = await User.findOne({ user_name });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            user_name,
            first_name,
            last_name,
            email,
            birth_date,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { user_name, password } = req.body;

        const user = await User.findOne({ user_name });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, username: user.user_name });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
});

// Get All Users (Admin Only)
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get current user's profile
router.get('/users/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            user: {
                ...user.toObject(),
                preferences: {
                    page_size: user.Preferences?.Page_size || 12,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Update User (Admin or User Updating Self)
router.put('/users/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, birth_date, Preferences, preferences } = req.body;

        if (req.user.isAdmin || req.user.userId === id) {
            let updateFields = {
                first_name,
                last_name,
                email,
                birth_date,
            };
            if (Preferences) {
                updateFields.Preferences = { Page_size: Preferences.page_size };
            } else if (preferences) {
                updateFields.Preferences = { Page_size: preferences.page_size };
            }

            const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
                new: true,
                runValidators: true,
            });

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User updated successfully', user: updatedUser });
        } else {
            res.status(403).json({ error: 'Not authorized to update this user' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
});

// Delete User (Admin Only)
router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.userId === id) {
            return res.status(403).json({ error: 'Admins cannot delete their own accounts.' });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
});

// Get User by ID (Admin or User getting self)
router.get('/users/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.isAdmin || req.user.userId === id) {
            const user = await User.findById(id).select('-password');

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ user });
        } else {
            res.status(403).json({ error: 'Not authorized to get this user' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user', details: error.message });
    }
});

module.exports = router;