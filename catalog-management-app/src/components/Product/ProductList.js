import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './../../ProductList.module.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const searchQueryRef = useRef('');
    const searchInputRef = useRef(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    useEffect(() => {
        let debounceTimer;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const decoded = jwtDecode(token);
                setIsAdmin(decoded.isAdmin);

                let url = `http://localhost:9000/products?page=${page}&query=${searchQueryRef.current}`;

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    let updatedProducts = data.products.map(product => {
                        if (product.current_stock_level === 0) {
                            return { ...product, status: false };
                        }
                        return product;
                    });
                    setProducts(updatedProducts);
                    setTotalPages(data.totalPages);
                    setPage(data.page);
                    setPageSize(data.pageSize);
                } else if (response.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetchProducts();
        }, 100);

        return () => clearTimeout(debounceTimer);
    }, [navigate, localSearchQuery, page]);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [products]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:9000/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
            setError('Failed to delete product.');
        }
    };

    const handleSearchChange = (event) => {
        setLocalSearchQuery(event.target.value);
        searchQueryRef.current = event.target.value;
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleFirstPage = () => {
        setPage(1);
    };

    const handleLastPage = () => {
        setPage(totalPages);
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.productList}>
            <h2>Product List</h2>
            <input
                type="text"
                placeholder="Search products..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                ref={searchInputRef}
            />
            <div>
                Page Size: {pageSize}
            </div>
            {isAdmin && (
                <button onClick={() => navigate('/products/add')}>Add Product</button>
            )}
            {Array.isArray(products) && products.length > 0 ? (
                <div>
                    <table className={styles.productListTable}>
                        <thead>
                            <tr>
                                <th className={styles.productListTh}>Product Name</th>
                                <th className={styles.productListTh}>Description</th>
                                <th className={styles.productListTh}>Status</th>
                                <th className={styles.productListTh}>Stock Level</th>
                                {isAdmin && <th className={styles.productListTh}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id} className={styles.productListTr}>
                                    <td className={styles.productListTd}>{product.product_name}</td>
                                    <td className={styles.productListTd}>{product.product_description}</td>
                                    <td className={styles.productListTd}>{product.status ? 'Active' : 'Inactive'}</td>
                                    <td className={styles.productListTd}>{product.current_stock_level}</td>
                                    {isAdmin && (
                                        <td className={styles.productListTd}>
                                            <button onClick={() => navigate(`/products/edit/${product._id}`)}>Edit</button>
                                            <button onClick={() => handleDelete(product._id)}>Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        <button disabled={page === 1} onClick={handleFirstPage}>First</button>
                        <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Previous</button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Next</button>
                        <button disabled={page === totalPages} onClick={handleLastPage}>Last</button>
                    </div>
                </div>
            ) : (
                <div>{Array.isArray(products) ? "No products available" : "Loading Products..."}</div>
            )}
        </div>
    );
}

export default ProductList;