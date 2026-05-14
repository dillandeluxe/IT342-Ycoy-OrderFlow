import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBuyerOrderHistory } from '../services/api';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const buyerId = localStorage.getItem('userId');
            if (!buyerId) {
                navigate('/login');
                return;
            }

            try {
                const response = await getBuyerOrderHistory(buyerId);
                if (response.data) {
                    // Sort orders by id or date descending
                    const sortedOrders = [...response.data].sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
                        return dateB - dateA;
                    });
                    setOrders(sortedOrders);
                }
            } catch (error) {
                console.error("Error fetching order history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    return (
        <div className="order-history-container">
            <header className="order-history-header">
                <button className="back-btn" onClick={() => navigate('/buyer-dashboard')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back
                </button>
                <h1>My Order History</h1>
                <div className="header-spacer"></div>
            </header>

            <div className="orders-wrapper">
                {loading ? (
                    <div className="loading-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" style={{marginBottom: '16px'}}>
                            <line x1="12" y1="2" x2="12" y2="6"></line>
                            <line x1="12" y1="18" x2="12" y2="22"></line>
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                            <line x1="2" y1="12" x2="6" y2="12"></line>
                            <line x1="18" y1="12" x2="22" y2="12"></line>
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                            <line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line>
                        </svg>
                        <p>Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        <h2>No orders found</h2>
                        <p>You haven't placed any orders yet.</p>
                        <button className="btn-primary" onClick={() => navigate('/buyer-dashboard')} style={{marginTop: '8px'}}>
                            Start Ordering
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order, index) => (
                            <div key={order.id || index} className="order-card">
                                <div className="order-card-header">
                                    <div className="order-info-left">
                                        <span className="order-number">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                            Order #{order.orderNumber}
                                        </span>
                                        <span className="order-date">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleString(undefined, {
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit'
                                            }) : 'Recently Placed'}
                                        </span>
                                    </div>
                                    <div className="order-status-badge" data-status={order.status?.toLowerCase() || 'pending'}>
                                        {order.status?.toLowerCase() === 'completed' && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        )}
                                        {order.status?.toLowerCase() === 'pending' && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        )}
                                        {order.status || 'Pending'}
                                    </div>
                                </div>
                                <div className="order-items-list">
                                    {order.orderItems?.map((item, idx) => (
                                        <div key={idx} className="order-item-row">
                                            <span className="item-quantity">{item.quantity}x</span>
                                            <span className="item-name">{item.productName || item.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-card-footer">
                                    <span className="order-total-label">Total Amount</span>
                                    <span className="order-total-value">
                                        ₱{parseFloat(order.totalAmount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;