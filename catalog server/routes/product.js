// backend/routes/products.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');
const { faker } = require('@faker-js/faker');

// Middleware to verify JWT token (authentication)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Middleware to check if the user is an admin (authorization)
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.sendStatus(403);
    }
};

// Get all products (Registered users only)
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const query = req.query.query || '';

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const pageSize = user.Preferences.Page_size;

        let findQuery = {};

        if (query) {
            findQuery = {
                $or: [
                    { product_name: { $regex: query, $options: 'i' } },
                    { product_description: { $regex: query, $options: 'i' } }
                ]
            };
        }

        const totalProducts = await Product.countDocuments(findQuery);
        const totalPages = Math.ceil(totalProducts / pageSize);
        console.log('Search Query:', query);
        console.log("find query", findQuery);
        const products = await Product.find(findQuery)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();
        console.log('Found Products:', products);

        const productsWithImages = products.map(product => {
            let category = 'abstract';
            const productNameWords = product.product_name.toLowerCase().split(' ');
            if (productNameWords.length > 0) {
                category = productNameWords[productNameWords.length - 1];
            }
            if (category === "" || category === null) {
                category = faker.word.noun();
            }

            const seed = `${product._id}-${category}`;

            return {
                ...product,
                image: faker.image.urlLoremFlickr({ category: category, seed: seed }),
            };
        });

        res.json({
            products: productsWithImages,
            page,
            totalPages,
            totalProducts,
            pageSize: pageSize,
        });

    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: 'Failed to get products' });
    }
});

// Get a single product by ID (Registered users only)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let category = 'abstract';
        const productNameWords = product.product_name.toLowerCase().split(' ');
        if (productNameWords.length > 0) {
            category = productNameWords[productNameWords.length - 1];
        }
        if (category === "" || category === null) {
            category = faker.word.noun();
        }

        const seed = `${product._id}-${category}`;

        const productWithImage = {
            ...product,
            image: faker.image.urlLoremFlickr({ category: category, seed: seed }),
        };

        res.json(productWithImage);
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ error: 'Failed to get product' });
    }
});

// Add a new product (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { product_id, product_name, product_description, current_stock_level } = req.body;
        const numericProductId = Number(product_id);

        const newProduct = new Product({
            product_id: numericProductId,
            product_name,
            product_description,
            current_stock_level: Number(current_stock_level),
        });
        await newProduct.save();

        let category = 'abstract';
        const productNameWords = product_name.toLowerCase().split(' ');
        if (productNameWords.length > 0) {
            category = productNameWords[productNameWords.length - 1];
        }
        if (category === "" || category === null) {
            category = faker.word.noun();
        }

        const seed = `${newProduct._id}-${category}`;

        const productWithImage = {
            ...newProduct.toObject(),
            image: faker.image.urlLoremFlickr({ category: category, seed: seed }),
        };

        res.status(201).json({ message: 'Product added successfully', product: productWithImage });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Update a product (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { product_name, product_description, current_stock_level } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { product_name, product_description, current_stock_level },
            { new: true }
        ).lean();

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let category = 'abstract';
        const productNameWords = product_name.toLowerCase().split(' ');
        if (productNameWords.length > 0) {
            category = productNameWords[productNameWords.length - 1];
        }
        if (category === "" || category === null) {
            category = faker.word.noun();
        }

        const seed = `${updatedProduct._id}-${category}`;

        const productWithImage = {
            ...updatedProduct,
            image: faker.image.urlLoremFlickr({ category: category, seed: seed }),
        };

        res.json({ message: 'Product updated successfully', product: productWithImage });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a product (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;