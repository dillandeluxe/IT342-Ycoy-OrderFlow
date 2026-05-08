import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [item, setItem] = useState(null);
    const [restaurantName, setRestaurantName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // First try to get data from navigation state (fastest path)
        if (location.state && location.state.item) {
            setItem(location.state.item);
            setRestaurantName(location.state.restaurantName || "Local Seller");
            setLoading(false);
            return;
        }

        // If no state, we would fetch from API based on ID.
        // For now, we simulate pulling from our localStorage DB since API isn't fully wired for this param
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        try {
            // Find item globally (hack for now without standard GET /api/items/{id} implemented)
            // Just redirect back to dashboard if we don't have state for now to keep it safe
            console.warn("ProductDetails accessed without state, redirecting...");
            navigate('/buyer-dashboard');
        } catch (error) {
            console.error("Error loading product", error);
            setLoading(false);
        }
    }, [id, location.state, navigate]);

    if (loading) {
        return <div className="product-details-container"><p>Loading item details...</p></div>;
    }

    if (!item) {
        return (
            <div className="product-details-container">
                <div className="error-state">
                    <h2>Item not found</h2>
                    <button className="back-btn" onClick={() => navigate('/buyer-dashboard')}>
                        Return to Menu
                    </button>
                </div>
            </div>
        );
    }

    const isSoldOut = item.stock === 0;
    const bgImage = item.imageUrl && item.imageUrl.trim() !== "" 
        ? item.imageUrl 
        : 'https://placehold.co/800x600/F3F4F6/9CA3AF?text=Image+Coming+Soon&font=Montserrat';

    const formatPeso = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const handleIncrement = () => {
        if (quantity < item.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    return (
        <div className="product-details-container">
            <div className="product-details-wrapper">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Menu
                </button>

                <div className="product-card-large">
                    <div 
                        className="product-image-container"
                        style={{ backgroundImage: `url("${bgImage}")` }}
                    >
                        {isSoldOut && <div className="product-sold-out-badge">SOLD OUT</div>}
                    </div>
                    
                    <div className="product-info-container">
                        <div className="product-restaurant">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            {restaurantName}
                        </div>

                        <h1 className="product-name-large">{item.name}</h1>
                        <h2 className="product-price-large">{formatPeso(item.price)}</h2>
                        
                        <div className="product-meta">
                            <div className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                </svg>
                                {item.category || "Uncategorized"}
                            </div>
                            <div className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                                {item.stock} item{item.stock !== 1 ? 's' : ''} left
                            </div>
                        </div>

                        <p className="product-desc-large">
                            {item.description || "No description provided by the seller. This delicious item is prepared fresh and ready to satisfy your cravings!"}
                        </p>

                        {!isSoldOut && (
                            <div className="quantity-selector">
                                <span className="quantity-label">Quantity:</span>
                                <div className="quantity-controls">
                                    <button className="qty-btn" onClick={handleDecrement} disabled={quantity <= 1}>-</button>
                                    <span className="qty-value">{quantity}</span>
                                    <button className="qty-btn" onClick={handleIncrement} disabled={quantity >= item.stock}>+</button>
                                </div>
                            </div>
                        )}

                        <button 
                            className="add-to-cart-large"
                            disabled={isSoldOut}
                            title="Cart functionality is currently disabled"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {isSoldOut ? "Out of Stock" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;