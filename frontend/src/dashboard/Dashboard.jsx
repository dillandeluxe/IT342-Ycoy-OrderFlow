import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoodItems, addFoodItem, updateFoodItem, deleteFoodItem } from './services/api';
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

const DashboardHome = ({ userName, foodItems, formatPeso, setActiveTab }) => (
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
                value="0" 
                subtext="Waiting for Phase 4 App" 
                subtextColor="var(--primary)" 
            />
            <StatCard 
                icon="📈"
                title="Total Revenue" 
                value={formatPeso(0)} 
                subtext="Lifetime earnings" 
            />
        </div>

        <div className="action-banner">
            <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text)' }}>Prepare for Mobile Launch</h3>
                <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '14px', maxWidth: '600px', lineHeight: '1.5' }}>
                    Your menu currently has <strong>{foodItems.length} items</strong>. Ensure your menu is populated before the mobile application goes live.
                </p>
            </div>
            <button className="btn btn-light" onClick={() => setActiveTab('Products')}>
                Manage Products ➔
            </button>
        </div>
    </div>
);

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
    
    // NEW: State to hold the dynamic user name (from GitHub, Google, or regular login)
    const [userName, setUserName] = useState('');
    
    const [formData, setFormData] = useState({ 
        name: '', 
        description: '', 
        price: '', 
        stock: '',
        category: 'Uncategorized' 
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
        
        // Grab the name from local storage when the dashboard loads
        const storedName = localStorage.getItem('fullName') || localStorage.getItem('restaurantName') || 'Guest';
        setUserName(storedName);
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
                imageUrl: "",
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
            
            setFormData({ name: '', description: '', price: '', stock: '', category: 'Uncategorized' }); 
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
            category: item.category || 'Uncategorized'
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
                        <div className="fade-in" style={{ padding: '60px', textAlign: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                            <h3 style={{ color: 'var(--text-light)' }}>Orders Module</h3>
                            <p style={{ color: 'var(--text-light)' }}>This section will connect to the Mobile App checkout flow in Phase 5.</p>
                        </div>
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