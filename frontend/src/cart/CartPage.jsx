import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, checkout, isCheckingOut } = useCart();
    const navigate = useNavigate();

    // Modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null); // { orderNumber, totalAmount }

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

    const handleCheckoutClick = () => {
        if (cartItems.length === 0) return;
        setShowConfirmModal(true);
    };

    const handleConfirmCheckout = async () => {
        setShowConfirmModal(false);
        const result = await checkout('CASH');
        if (result.success) {
            setOrderSuccess({
                orderNumber: result.orderNumber,
                totalAmount: result.totalAmount
            });
        }
    };

    // ── Order Success Screen ──────────────────────────────────────────
    if (orderSuccess) {
        return (
            <div className="cart-page-container">
                <div className="order-success-screen">
                    <div className="success-icon-ring">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="success-title">Order Placed!</h2>
                    <p className="success-subtitle">Your order is being prepared.</p>
                    <div className="success-receipt-card">
                        <div className="receipt-row">
                            <span className="receipt-label">Order Number</span>
                            <span className="receipt-value">{orderSuccess.orderNumber}</span>
                        </div>
                        <div className="receipt-divider" />
                        <div className="receipt-row">
                            <span className="receipt-label">Payment Method</span>
                            <span className="receipt-value">Cash on Delivery</span>
                        </div>
                        <div className="receipt-divider" />
                        <div className="receipt-row">
                            <span className="receipt-label">Total Paid</span>
                            <span className="receipt-value receipt-total">{formatPeso(orderSuccess.totalAmount)}</span>
                        </div>
                        <div className="receipt-divider" />
                        <div className="receipt-row">
                            <span className="receipt-label">Pickup At</span>
                            <span className="receipt-value">Pick-up at Store</span>
                        </div>
                    </div>
                    <button className="back-to-menu-btn" onClick={() => navigate('/buyer-dashboard')}>
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

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
                    <div className="empty-cart-icon">🛒</div>
                    <h3>Your cart is currently empty</h3>
                    <p>Add something delicious to get started!</p>
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
                        <div className="summary-row">
                            <span>Delivery</span>
                            <span className="free-tag">Free</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>{formatPeso(calculateTotal())}</span>
                        </div>
                        <div className="payment-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                <line x1="1" y1="10" x2="23" y2="10"></line>
                            </svg>
                            Cash on Delivery
                        </div>
                        <button
                            className={`checkout-btn ${isCheckingOut ? 'loading' : ''}`}
                            onClick={handleCheckoutClick}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? (
                                <>
                                    <span className="spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                    Proceed to Checkout
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Confirmation Modal ──────────────────────────────────── */}
            {showConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">🛍️</div>
                        <h3 className="modal-title">Confirm Your Order</h3>
                        <p className="modal-subtitle">
                            You're about to place an order for <strong>{formatPeso(calculateTotal())}</strong>
                            {' '}via <strong>Cash on Delivery</strong>.
                        </p>
                        <div className="modal-items-preview">
                            {cartItems.slice(0, 3).map(item => (
                                <div key={item.id} className="modal-item-row">
                                    <span>{item.foodItem.name}</span>
                                    <span>x{item.quantity}</span>
                                </div>
                            ))}
                            {cartItems.length > 3 && (
                                <div className="modal-item-row" style={{ color: '#94A3B8', fontStyle: 'italic' }}>
                                    <span>+{cartItems.length - 3} more items</span>
                                </div>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="modal-cancel-btn" onClick={() => setShowConfirmModal(false)}>
                                Cancel
                            </button>
                            <button className="modal-confirm-btn" onClick={handleConfirmCheckout}>
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;