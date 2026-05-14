import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoodItems, addFoodItem, updateFoodItem, deleteFoodItem } from '../services/api';
import './Dashboard.css';

// --- Subcomponents ---

const Sidebar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'Dashboard', icon: '📊' },
        { id: 'Products', icon: '🍔' },
        { id: 'Orders', icon: '📦' }
    ];
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span style={{ marginRight: '8px' }}></span> OrderFlow
            </div>
            <nav className="sidebar-nav">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span style={{ fontSize: '18px', opacity: activeTab === tab.id ? 1 : 0.7 }}>{tab.icon}</span>
                        {tab.id}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

const Header = ({ activeTab, userName, showDropdown, setShowDropdown, handleLogout }) => (
    <header className="top-header">
        <div className="header-title">
            <h1>{activeTab} Management</h1>
            <p>Manage your restaurant's {activeTab.toLowerCase()} and settings.</p>
        </div>
        <div className="user-dropdown-container">
            <div className="user-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="user-avatar">
                    {userName.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{userName} ▼</span>
            </div>
            {showDropdown && (
                <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={handleLogout}>Log Out</div>
                </div>
            )}
        </div>
    </header>
);

const StatCard = ({ icon, title, value, subtext, subtextColor = 'var(--text-light)' }) => (
    <div className="stat-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div className="stat-title" style={{ marginBottom: 0 }}>{title}</div>
            {icon && <div style={{ fontSize: '24px', opacity: 0.9, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>{icon}</div>}
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-sub" style={{ color: subtextColor }}>{subtext}</div>
    </div>
);

const DashboardHome = ({ userName, foodItems, formatPeso, setActiveTab, orders }) => {
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');
    const revenue = completedOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const pending = orders.filter(o => o.status === 'PENDING').length;

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="welcome-banner">
                <h2>Welcome back, {userName}! 👋</h2>
                <p>Here is what's happening with your restaurant today.</p>
            </div>

            <div className="stats-grid">
                <StatCard
                    icon="🍽️"
                    title="Total Menu Items"
                    value={foodItems.length}
                    subtext="↑ Live from Database"
                    subtextColor="var(--success)"
                />
                <StatCard
                    icon="🔔"
                    title="Pending Orders"
                    value={pending}
                    subtext={pending > 0 ? '⚡ Needs attention' : 'All caught up!'}
                    subtextColor={pending > 0 ? 'var(--warning)' : 'var(--success)'}
                />
                <StatCard
                    icon="📈"
                    title="Total Revenue"
                    value={formatPeso(revenue)}
                    subtext={`From ${completedOrders.length} completed orders`}
                    subtextColor="var(--success)"
                />
            </div>

            <div className="action-banner">
                <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text)' }}>Prepare for Mobile Launch</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '14px', maxWidth: '600px', lineHeight: '1.5' }}>
                        Your menu currently has <strong>{foodItems.length} items</strong>. Ensure your menu is populated before the mobile application goes live.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-light" onClick={() => setActiveTab('Orders')}>
                        View Orders ➔
                    </button>
                    <button className="btn btn-primary" onClick={() => setActiveTab('Products')}>
                        Manage Products ➔
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProductForm = ({ formData, handleChange, handleSubmit, editingId, handleCancelEdit, message, categoryOptions }) => {
    const isEditing = !!editingId;
    return (
        <div className={`form-card fade-in ${isEditing ? 'editing' : ''}`}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: isEditing ? '#D97706' : 'var(--primary)' }}>
                {isEditing ? '✏️ Edit Menu Item' : '+ Add New Menu Item'}
            </h2>

            {message && (
                <div className={`alert-message ${message.includes('Error') ? 'alert-error' : 'alert-success'}`} style={{ backgroundColor: message.includes('Error') ? 'var(--danger-bg)' : 'var(--success-bg)', color: message.includes('Error') ? 'var(--danger)' : 'var(--success)' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-row two-cols">
                    <div className="input-group">
                        <label>Item Name</label>
                        <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} required placeholder="e.g. Cheeseburger" />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <input type="text" name="description" className="input-field" value={formData.description} onChange={handleChange} required placeholder="Ingredients, flavor, etc." />
                    </div>
                </div>

                <div className="form-row multi-cols">
                    <div className="input-group">
                        <label>Category</label>
                        <select name="category" className="input-field" value={formData.category} onChange={handleChange} required style={{ cursor: 'pointer' }}>
                            {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Price (PHP)</label>
                        <input type="number" step="0.01" name="price" className="input-field" value={formData.price} onChange={handleChange} required placeholder="0.00" />
                    </div>

                    <div className="input-group">
                        <label>Stock</label>
                        <input type="number" name="stock" className="input-field" value={formData.stock} onChange={handleChange} required placeholder="Quantity" min="0" />
                    </div>
                </div>

                <div className="form-row single-col" style={{ gridColumn: '1 / -1' }}>
                    <div className="input-group">
                        <label>Image URL (Optional)</label>
                        <input type="url" name="imageUrl" className="input-field" value={formData.imageUrl} onChange={handleChange} placeholder="e.g. https://example.com/burger.jpg" />
                    </div>
                </div>

                <div className="form-row multi-cols">
                    <button type="submit" className={`btn ${isEditing ? 'btn-warning' : 'btn-primary'}`}>
                        {isEditing ? 'Update Item' : 'Save Item'}
                    </button>

                    {isEditing && (
                        <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

const ProductTable = ({ foodItems, handleEditClick, triggerDelete, editingId, formatPeso }) => (
    <div className="table-card fade-in">
        <div className="table-header">
            <h2 style={{ margin: 0, fontSize: '16px', color: 'var(--text)', fontWeight: '700' }}>Current Menu Inventory</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th style={{ textAlign: 'center' }}>Stock</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {foodItems.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)', fontStyle: 'italic' }}>
                                Your menu is empty. Add items above to see them here!
                            </td>
                        </tr>
                    ) : (
                        foodItems.map(item => (
                            <tr key={item.id} className={editingId === item.id ? 'row-editing' : ''}>
                                <td style={{ fontWeight: '600', color: 'var(--text)' }}>{item.name}</td>
                                <td style={{ color: 'var(--text-light)' }}>{item.description}</td>
                                <td>
                                    <span className="badge badge-category">{item.category || 'Uncategorized'}</span>
                                </td>
                                <td className="price-tag">{formatPeso(item.price)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`badge ${item.stock <= 5 ? 'badge-warning' : 'badge-success'}`}>
                                        {item.stock} {item.stock <= 5 && '⚠️'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn btn-light btn-small" onClick={() => handleEditClick(item)}>Edit</button>
                                        <button className="btn btn-danger btn-small" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }} onClick={() => triggerDelete(item.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// ─── Orders Panel ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    COMPLETED: { bg: 'var(--success-bg)', color: 'var(--success)', label: 'Completed' },
    PENDING: { bg: 'var(--warning-bg)', color: 'var(--warning)', label: 'Pending' },
    CANCELLED: { bg: 'var(--danger-bg)', color: 'var(--danger)', label: 'Cancelled' },
};

const OrdersPanel = ({ formatPeso, sellerId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [expandedId, setExpandedId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/transactions/seller/${sellerId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Sort newest first
                setOrders(data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
            } else {
                setOrders([]);
            }
        } catch (e) {
            console.error('Failed to fetch orders', e);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [sellerId]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const updateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:8080/api/transactions/${orderId}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (e) {
            console.error('Failed to update status', e);
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = orders.filter(order => {
        const matchSearch = order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
            order.shippingAddress?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || order.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const totalRevenue = orders.filter(o => o.status === 'COMPLETED')
        .reduce((s, o) => s + Number(o.totalAmount || 0), 0);
    const pendingCount = orders.filter(o => o.status === 'PENDING').length;

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── Stats Row ── */}
            <div className="stats-grid">
                <StatCard icon="📦" title="Total Orders" value={orders.length} subtext="All time orders" />
                <StatCard icon="⏳" title="Pending" value={pendingCount} subtext={pendingCount > 0 ? '⚡ Needs attention' : 'All caught up!'} subtextColor={pendingCount > 0 ? 'var(--warning)' : 'var(--success)'} />
                <StatCard icon="💰" title="Total Revenue" value={formatPeso(totalRevenue)} subtext="From completed orders" subtextColor="var(--success)" />
            </div>

            {/* ── Orders Table Card ── */}
            <div className="table-card">
                {/* Toolbar */}
                <div className="orders-toolbar">
                    <div className="orders-search-wrap">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            className="orders-search"
                            placeholder="Search order number or address…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="orders-filters">
                        {['ALL', 'PENDING', 'COMPLETED', 'CANCELLED'].map(s => (
                            <button
                                key={s}
                                className={`filter-pill ${filterStatus === s ? 'active' : ''}`}
                                onClick={() => setFilterStatus(s)}
                            >
                                {s === 'ALL' ? 'All' : STATUS_STYLES[s]?.label || s}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-light btn-small" onClick={fetchOrders} title="Refresh">
                        ↻ Refresh
                    </button>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Pickup</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center' }}>
                                    <div className="orders-loading">Loading orders…</div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-light)' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
                                    <div style={{ fontWeight: 600 }}>{search || filterStatus !== 'ALL' ? 'No orders match your filter.' : 'No orders yet.'}</div>
                                    <div style={{ fontSize: '13px', marginTop: '6px' }}>Orders placed by buyers will appear here.</div>
                                </td></tr>
                            ) : filtered.map(order => {
                                const style = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING;
                                const isExpanded = expandedId === order.id;
                                return (
                                    <React.Fragment key={order.id}>
                                        <tr
                                            className="order-row"
                                            onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                        >
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span className="expand-arrow" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s', color: 'var(--text-light)', fontSize: '11px' }}>▶</span>
                                                    <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{order.orderNumber}</span>
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--text-light)', fontSize: '13px' }}>{order.shippingAddress || 'Pick-up at Store'}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>{formatPeso(order.totalAmount)}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="badge" style={{ background: style.bg, color: style.color }}>{style.label}</span>
                                            </td>
                                            <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                                                <div className="action-buttons" style={{ justifyContent: 'center', gap: '8px' }}>
                                                    {/* Status toggle chip — click to flip PENDING ↔ COMPLETED */}
                                                    {order.status !== 'CANCELLED' && (
                                                        <button
                                                            className="status-toggle-chip"
                                                            data-status={order.status.toLowerCase()}
                                                            disabled={updatingId === order.id}
                                                            onClick={() => updateStatus(
                                                                order.id,
                                                                order.status === 'PENDING' ? 'COMPLETED' : 'PENDING'
                                                            )}
                                                            title={order.status === 'PENDING' ? 'Mark as Completed' : 'Mark back as Pending'}
                                                        >
                                                            {updatingId === order.id ? (
                                                                <span className="chip-spinner" />
                                                            ) : order.status === 'PENDING' ? (
                                                                <>⏳ Pending &rarr; Complete</>
                                                            ) : (
                                                                <>✓ Completed &rarr; Pending</>
                                                            )}
                                                        </button>
                                                    )}
                                                    {/* Cancel — only for PENDING */}
                                                    {order.status === 'PENDING' && (
                                                        <button
                                                            className="btn btn-small"
                                                            style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: 'none', flexShrink: 0 }}
                                                            disabled={updatingId === order.id}
                                                            onClick={() => updateStatus(order.id, 'CANCELLED')}
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                    {/* Cancelled — static label */}
                                                    {order.status === 'CANCELLED' && (
                                                        <span style={{ fontSize: '12px', color: 'var(--danger)', fontWeight: 600 }}>✕ Cancelled</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded detail row */}
                                        {isExpanded && (
                                            <tr className="order-detail-row">
                                                <td colSpan="5" style={{ padding: 0 }}>
                                                    <div className="order-detail-panel">
                                                        <div className="order-detail-grid">
                                                            <div>
                                                                <div className="detail-label">Order Number</div>
                                                                <div className="detail-value mono">{order.orderNumber}</div>
                                                            </div>
                                                            <div>
                                                                <div className="detail-label">Status</div>
                                                                <div className="detail-value">
                                                                    <span className="badge" style={{ background: style.bg, color: style.color }}>{style.label}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="detail-label">Total Amount</div>
                                                                <div className="detail-value" style={{ color: 'var(--success)', fontWeight: 700 }}>{formatPeso(order.totalAmount)}</div>
                                                            </div>
                                                            <div>
                                                                <div className="detail-label">Shipping / Pickup</div>
                                                                <div className="detail-value">{order.shippingAddress || 'Pick-up at Store'}</div>
                                                            </div>
                                                        </div>
                                                        {order.orderItems && order.orderItems.length > 0 && (
                                                            <div className="order-items-list">
                                                                <div className="detail-label" style={{ marginBottom: '8px' }}>Items Ordered</div>
                                                                {order.orderItems.map((oi, i) => (
                                                                    <div key={i} className="order-item-row">
                                                                        <span>{oi.productName}</span>
                                                                        <span style={{ color: 'var(--text-light)' }}>x{oi.quantity}</span>
                                                                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>{formatPeso(oi.price * oi.quantity)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer count */}
                {!loading && (
                    <div className="table-footer">
                        Showing {filtered.length} of {orders.length} orders
                    </div>
                )}
            </div>
        </div>
    );
};

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-info">
                    <div className="modal-icon">⚠️</div>
                    <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '20px', fontWeight: '700' }}>Delete Menu Item</h3>
                </div>
                <p style={{ color: 'var(--text-light)', lineHeight: '1.5', margin: '0 0 24px 0', fontSize: '15px' }}>
                    Are you sure you want to permanently delete this item? This action cannot be undone and it will be removed from the buyer app immediately.
                </p>
                <div className="modal-actions">
                    <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete It</button>
                </div>
            </div>
        </div>
    );
};

// --- Main Application Component ---

function Dashboard() {
    const [foodItems, setFoodItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [userName, setUserName] = useState('');
    const [sellerId, setSellerId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'Uncategorized',
        imageUrl: ''
    });

    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('Dashboard');

    const [editingId, setEditingId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null });

    const navigate = useNavigate();

    const categoryOptions = ['Pizza', 'Burgers', 'Rice Meals', 'Drinks', 'Desserts', 'Uncategorized'];

    useEffect(() => {
        fetchItems();
        const storedName = localStorage.getItem('fullName') || localStorage.getItem('restaurantName') || 'Guest';
        const id = localStorage.getItem('userId');
        setUserName(storedName);
        setSellerId(id);

        // Fetch orders for the dashboard stats
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:8080/api/transactions/seller/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setOrders(await res.json());
            } catch (e) { /* silent */ }
        };
        fetchOrders();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getFoodItems();
            const currentSellerId = localStorage.getItem('userId');

            const myMenu = response.data.filter(item =>
                item.seller && item.seller.id.toString() === currentSellerId
            );

            setFoodItems(myMenu);
        } catch (error) {
            console.error("Error fetching items", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const savedId = localStorage.getItem('userId');
            const sellerId = Number(savedId);
            const parsedPrice = parseFloat(formData.price);
            const parsedStock = parseInt(formData.stock, 10);

            if (!Number.isInteger(sellerId) || sellerId <= 0) {
                setMessage('Error adding food item: missing seller ID. Please log in again.');
                return;
            }

            if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
                setMessage('Error adding food item: price must be a valid non-negative number.');
                return;
            }

            if (!Number.isInteger(parsedStock) || parsedStock < 0) {
                setMessage('Error adding food item: stock must be a valid non-negative whole number.');
                return;
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                price: parsedPrice,
                stock: parsedStock,
                category: formData.category,
                imageUrl: formData.imageUrl,
                seller: { id: sellerId }
            };

            if (editingId) {
                await updateFoodItem(editingId, payload);
                setMessage('Food item updated successfully!');
                setEditingId(null);
            } else {
                await addFoodItem(payload);
                setMessage('Food item added successfully!');
            }

            setFormData({ name: '', description: '', price: '', stock: '', category: 'Uncategorized', imageUrl: '' });
            fetchItems();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            const backendError = error.response?.data?.error || error.response?.data?.message;
            setMessage(backendError || `Error ${editingId ? 'updating' : 'adding'} food item. Check console.`);
            console.error(error);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            stock: item.stock || 0,
            category: item.category || 'Uncategorized',
            imageUrl: item.imageUrl || ''
        });
        setActiveTab('Products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', price: '', stock: '', category: 'Uncategorized' });
    };

    const triggerDelete = (id) => {
        setDeleteModal({ isOpen: true, itemId: id });
    };

    const executeDelete = async () => {
        if (!deleteModal.itemId) return;

        try {
            await deleteFoodItem(deleteModal.itemId);
            setMessage('Food item deleted successfully!');
            setDeleteModal({ isOpen: false, itemId: null });
            fetchItems();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error deleting food item.');
            console.error(error);
            setDeleteModal({ isOpen: false, itemId: null });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('restaurantName');
        localStorage.removeItem('fullName');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const formatPeso = (value) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(Number(value || 0));

    return (
        <div className="dashboard-layout">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="main-wrapper">
                <Header
                    activeTab={activeTab}
                    userName={userName}
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                    handleLogout={handleLogout}
                />

                <main className="content-scroll">
                    {activeTab === 'Dashboard' && (
                        <DashboardHome
                            userName={userName}
                            foodItems={foodItems}
                            formatPeso={formatPeso}
                            setActiveTab={setActiveTab}
                            orders={orders}
                        />
                    )}

                    {activeTab === 'Products' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <ProductForm
                                formData={formData}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                editingId={editingId}
                                handleCancelEdit={handleCancelEdit}
                                message={message}
                                categoryOptions={categoryOptions}
                            />
                            <ProductTable
                                foodItems={foodItems}
                                handleEditClick={handleEditClick}
                                triggerDelete={triggerDelete}
                                editingId={editingId}
                                formatPeso={formatPeso}
                            />
                        </div>
                    )}

                    {activeTab === 'Orders' && (
                        <OrdersPanel formatPeso={formatPeso} sellerId={sellerId} />
                    )}
                </main>
            </div>

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, itemId: null })}
                onConfirm={executeDelete}
            />
        </div>
    );
}

export default Dashboard;