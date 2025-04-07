import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './../../UserProfile.module.css'; // Import the CSS module

function ProductForm() {
    const [product_id, setProductId] = useState('0');
    const [product_name, setProductName] = useState('');
    const [product_description, setProductDescription] = useState('');
    const [current_stock_level, setCurrentStockLevel] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            fetchProductDetails(id);
        }
    }, [id]);

    const fetchProductDetails = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:9000/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProductId(data.product_id);
                setProductName(data.product_name);
                setProductDescription(data.product_description);
                setCurrentStockLevel(data.current_stock_level);
            } else {
                setError('Failed to fetch product details');
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Network error. Please try again.');
        }
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.product_id = product_id ? (/^\d+$/.test(product_id) ? '' : 'Product ID must be a number') : 'Product ID is required';
        tempErrors.product_name = product_name ? '' : 'Product name is required';
        tempErrors.product_description = product_description ? '' : 'Product description is required';
        tempErrors.current_stock_level = current_stock_level ? (/^\d+$/.test(current_stock_level) ? '' : 'Stock level must be a number') : 'Stock level is required';
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validate()) {
            try {
                const token = localStorage.getItem('token');
                const method = isEditMode ? 'PUT' : 'POST';
                const url = isEditMode ? `http://localhost:9000/products/${id}` : 'http://localhost:9000/products';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ product_id, product_name, product_description, current_stock_level }),
                });

                if (response.ok) {
                    navigate('/products');
                } else if (response.status === 403) {
                    setError('Not authorized to perform this action.');
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to save product');
                }
            } catch (error) {
                console.error('Error saving product:', error);
                setError('Network error. Please try again.');
            }
        }
    };

    const handleClear = () => {
        setProductId('0');
        setProductName('');
        setProductDescription('');
        setCurrentStockLevel('');
        setErrors({});
    };

    return (
        <div className={styles.userProfile}>
            <h2>{isEditMode ? 'Edit Product' : 'Add Product'}</h2>
            {error && <p className={styles.error}>{error}</p>}
            <form noValidate onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="product_id">Product ID: <span style={{ color: 'red' }}>*</span></label>
                    <input type="number" id="product_id" value={product_id} onChange={(e) => setProductId(parseInt(e.target.value))} />
                    {errors.product_id && <p className={styles.error}>{errors.product_id}</p>}
                </div>
                <div>
                    <label htmlFor="product_name">Product Name: <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="product_name" value={product_name} onChange={(e) => setProductName(e.target.value)} />
                    {errors.product_name && <p className={styles.error}>{errors.product_name}</p>}
                </div>
                <div>
                    <label htmlFor="product_description">Product Description: <span style={{ color: 'red' }}>*</span></label>
                    <textarea id="product_description" value={product_description} onChange={(e) => setProductDescription(e.target.value)} />
                    {errors.product_description && <p className={styles.error}>{errors.product_description}</p>}
                </div>
                <div>
                    <label htmlFor="current_stock_level">Current Stock Level: <span style={{ color: 'red' }}>*</span></label>
                    <input type="number" id="current_stock_level" value={current_stock_level} onChange={(e) => setCurrentStockLevel(e.target.value)} />
                    {errors.current_stock_level && <p className={styles.error}>{errors.current_stock_level}</p>}
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>{isEditMode ? 'Update Product' : 'Add Product'}</button>
                    <button type="button" onClick={() => navigate('/products')} className={styles.button}>Cancel</button>
                    <button type="button" onClick={handleClear} className={styles.button}>Clear</button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;