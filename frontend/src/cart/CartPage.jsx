import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.foodItem.price * item.quantity);
        }, 0);
    };

    const formatPeso = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    return (
        <div className="cart-page-container">
            <header className="cart-header">
                <button className="back-btn" onClick={() => navigate('/buyer-dashboard')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Continue Shopping
                </button>
                <h2>Your Shopping Cart</h2>
            </header>

            {cartItems.length === 0 ? (
                <div className="empty-cart-state">
                    <h3>Your cart is currently empty</h3>
                    <button className="browse-menu-btn" onClick={() => navigate('/buyer-dashboard')}>
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cartItems.map((item) => {
                            const bgImage = item.foodItem.imageUrl && item.foodItem.imageUrl.trim() !== "" 
                            ? item.foodItem.imageUrl 
                            : 'https://placehold.co/100x100/F3F4F6/9CA3AF?text=Food&font=Montserrat';

                            return (
                                <div key={item.id} className="cart-item-card">
                                    <div 
                                        className="cart-item-image"
                                        style={{ backgroundImage: `url("${bgImage}")` }}
                                    ></div>
                                    <div className="cart-item-details">
                                        <h4>{item.foodItem.name}</h4>
                                        <p className="cart-item-price">{formatPeso(item.foodItem.price)}</p>
                                        <div className="cart-item-meta">
                                            <span>Qty: {item.quantity}</span>
                                            <span style={{ margin: '0 8px', color: '#CBD5E1' }}>|</span>
                                            <span className="cart-item-subtotal">
                                                Total: {formatPeso(item.foodItem.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="cart-item-actions">
                                        <button 
                                            className="remove-btn" 
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatPeso(calculateTotal())}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>{formatPeso(calculateTotal())}</span>
                        </div>
                        <button className="checkout-btn" onClick={() => alert("Checkout flow to be implemented!")}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;