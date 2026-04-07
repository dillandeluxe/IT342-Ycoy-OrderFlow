import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoodItems, addFoodItem, updateFoodItem, deleteFoodItem } from './services/api';

function Dashboard() {
    const [foodItems, setFoodItems] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: '' });
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('Dashboard'); 
    
    const [editingId, setEditingId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false); 
    
    // NEW: State for the modern custom delete modal
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null });
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getFoodItems();
            
            // NEW BUG FIX: Get the currently logged-in seller's name
            const currentSeller = localStorage.getItem('restaurantName') || 'Local Restaurant';
            
            // Filter the database so this seller ONLY sees their own food!
            const myMenu = response.data.filter(item => item.sellerName === currentSeller);
            
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
           const savedName = localStorage.getItem('restaurantName') || 'Local Restaurant';

            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                sellerName: savedName 
            };
            
            if (editingId) {
                await updateFoodItem(editingId, payload);
                setMessage('Food item updated successfully!');
                setEditingId(null); 
            } else {
                await addFoodItem(payload);
                setMessage('Food item added successfully!');
            }
            
            setFormData({ name: '', description: '', price: '' }); 
            fetchItems(); 
            setTimeout(() => setMessage(''), 3000); 
        } catch (error) {
            setMessage(`Error ${editingId ? 'updating' : 'adding'} food item. Check console.`);
            console.error(error);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price
        });
        setActiveTab('Products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', price: '' });
    };

    // NEW: Open the modern modal instead of the ugly browser alert
    const triggerDelete = (id) => {
        setDeleteModal({ isOpen: true, itemId: id });
    };

    // NEW: Actually execute the delete when they confirm on the modern modal
    const executeDelete = async () => {
        if (!deleteModal.itemId) return;
        
        try {
            await deleteFoodItem(deleteModal.itemId);
            setMessage('Food item deleted successfully!');
            setDeleteModal({ isOpen: false, itemId: null }); // Close modal
            fetchItems();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error deleting food item.');
            console.error(error);
            setDeleteModal({ isOpen: false, itemId: null }); // Close modal on error too
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('restaurantName'); // Clear name on logout
        navigate('/login');
    };

    const colors = {
        primary: '#1A73E8',     
        sidebarBg: '#0D47A1',   
        bg: '#F4F7FC',          
        cardBg: '#FFFFFF',      
        text: '#333333',        
        textLight: '#666666',   
        border: '#E2E8F0'       
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: colors.bg, position: 'relative' }}>
            
            {/* SIDEBAR */}
            <div style={{ width: '250px', backgroundColor: colors.sidebarBg, color: 'white', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', zIndex: 10 }}>
                <div style={{ padding: '24px', fontSize: '24px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', letterSpacing: '1px' }}>
                    OrderFlow
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', padding: '16px 0' }}>
                    {['Dashboard', 'Products', 'Orders'].map(tab => (
                        <div 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '16px 24px',
                                cursor: 'pointer',
                                backgroundColor: activeTab === tab ? 'rgba(255,255,255,0.15)' : 'transparent',
                                borderLeft: activeTab === tab ? '4px solid white' : '4px solid transparent',
                                fontWeight: activeTab === tab ? '600' : '400',
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                </nav>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: colors.text, fontSize: '28px' }}>{activeTab} Management</h1>
                        <p style={{ margin: '8px 0 0 0', color: colors.textLight }}>Manage your restaurant's {activeTab.toLowerCase()} and settings.</p>
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <div 
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: colors.cardBg, padding: '8px 16px', borderRadius: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', userSelect: 'none' }}
                        >
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: colors.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                S
                            </div>
                            <span style={{ fontWeight: '600', color: colors.text, fontSize: '14px' }}>
                                {localStorage.getItem('restaurantName') || 'Seller Admin'} ▼
                            </span>
                        </div>

                        {showDropdown && (
                            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 100, minWidth: '150px', border: `1px solid ${colors.border}` }}>
                                <div 
                                    onClick={handleLogout}
                                    style={{ padding: '12px 16px', color: '#D32F2F', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'background 0.2s' }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#FFEBEE'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    Log Out
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {activeTab === 'Dashboard' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ backgroundColor: colors.primary, color: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(26,115,232,0.25)', backgroundImage: 'linear-gradient(135deg, #1A73E8 0%, #1557B0 100%)' }}>
                            <h2 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '700' }}>Welcome back, {localStorage.getItem('restaurantName') || 'Chef'}! 👋</h2>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>Here is what's happening with your restaurant today.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                            <div style={{ backgroundColor: colors.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${colors.border}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ color: colors.textLight, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Total Menu Items</div>
                                <div style={{ color: colors.text, fontSize: '36px', fontWeight: 'bold' }}>{foodItems.length}</div>
                                <div style={{ color: '#2E7D32', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>↑ Live from Database</div>
                            </div>
                            <div style={{ backgroundColor: colors.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${colors.border}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ color: colors.textLight, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Pending Orders</div>
                                <div style={{ color: colors.text, fontSize: '36px', fontWeight: 'bold' }}>0</div>
                                <div style={{ color: colors.primary, fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>Waiting for Phase 4 App</div>
                            </div>
                            <div style={{ backgroundColor: colors.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${colors.border}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ color: colors.textLight, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Total Revenue</div>
                                <div style={{ color: colors.text, fontSize: '36px', fontWeight: 'bold' }}>$0.00</div>
                                <div style={{ color: colors.textLight, fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>Lifetime earnings</div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: colors.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${colors.border}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: '0 0 8px 0', color: colors.text, fontSize: '18px' }}>Prepare for Mobile Launch</h3>
                                <p style={{ margin: 0, color: colors.textLight, fontSize: '14px', maxWidth: '600px', lineHeight: '1.5' }}>
                                    Your menu currently has <strong>{foodItems.length} items</strong>. Ensure your menu is fully populated with accurate descriptions and pricing before the mobile application goes live for buyers.
                                </p>
                            </div>
                            <button 
                                onClick={() => setActiveTab('Products')}
                                style={{ padding: '12px 24px', backgroundColor: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px' }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#BBDEFB'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#E3F2FD'}
                            >
                                Manage Products ➔
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Products' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        <div style={{ backgroundColor: editingId ? '#FFF8E1' : colors.cardBg, padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: `1px solid ${editingId ? '#FFC107' : colors.border}`, transition: 'all 0.3s' }}>
                            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: editingId ? '#F57C00' : colors.primary }}>
                                {editingId ? '✏️ Edit Menu Item' : '+ Add New Menu Item'}
                            </h2>
                            
                            {message && (
                                <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', backgroundColor: message.includes('Error') ? '#FFEBEE' : '#E8F5E9', color: message.includes('Error') ? '#C62828' : '#2E7D32', fontWeight: '600', fontSize: '14px' }}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: editingId ? '1.5fr 2fr 1fr auto auto' : '1.5fr 2fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Item Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Cheeseburger" style={{ padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '6px', outline: 'none', fontSize: '14px', backgroundColor: '#FFF' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Description</label>
                                    <input type="text" name="description" value={formData.description} onChange={handleChange} required placeholder="Ingredients, flavor, etc." style={{ padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '6px', outline: 'none', fontSize: '14px', backgroundColor: '#FFF' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Price ($)</label>
                                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required placeholder="0.00" style={{ padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '6px', outline: 'none', fontSize: '14px', backgroundColor: '#FFF' }} />
                                </div>
                                <button type="submit" style={{ padding: '0 24px', backgroundColor: editingId ? '#F57C00' : colors.primary, color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', height: '43px', transition: 'background-color 0.2s', fontSize: '14px' }}>
                                    {editingId ? 'Update Item' : 'Save Item'}
                                </button>
                                
                                {editingId && (
                                    <button type="button" onClick={handleCancelEdit} style={{ padding: '0 24px', backgroundColor: '#F5F5F5', color: '#757575', border: '1px solid #CCC', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', height: '43px', fontSize: '14px' }}>
                                        Cancel
                                    </button>
                                )}
                            </form>
                        </div>

                        <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}`, backgroundColor: '#FAFAFA' }}>
                                <h2 style={{ margin: 0, fontSize: '16px', color: colors.text, fontWeight: '700' }}>Current Menu Inventory</h2>
                            </div>
                            
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                                        <th style={{ padding: '16px 24px', color: colors.textLight, fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Name</th>
                                        <th style={{ padding: '16px 24px', color: colors.textLight, fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Description</th>
                                        <th style={{ padding: '16px 24px', color: colors.textLight, fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Price</th>
                                        <th style={{ padding: '16px 24px', color: colors.textLight, fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foodItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: colors.textLight, fontStyle: 'italic' }}>
                                                Your menu is empty. Add items above to see them here!
                                            </td>
                                        </tr>
                                    ) : (
                                        foodItems.map(item => (
                                            <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: editingId === item.id ? '#FFF8E1' : 'transparent' }}>
                                                <td style={{ padding: '16px 24px', fontWeight: '600', color: colors.text }}>{item.name}</td>
                                                <td style={{ padding: '16px 24px', color: colors.textLight, fontSize: '14px' }}>{item.description}</td>
                                                <td style={{ padding: '16px 24px', fontWeight: '700', color: '#2E7D32' }}>${item.price.toFixed(2)}</td>
                                                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                    <button onClick={() => handleEditClick(item)} style={{ background: '#E3F2FD', border: 'none', color: '#1976D2', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontSize: '12px', fontWeight: '600' }}>
                                                        Edit
                                                    </button>
                                                    {/* NEW: Triggers the sleek custom modal instead of window.confirm */}
                                                    <button onClick={() => triggerDelete(item.id)} style={{ background: '#FFEBEE', border: 'none', color: '#D32F2F', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Orders' && (
                    <div style={{ padding: '60px', textAlign: 'center', backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px dashed ${colors.border}` }}>
                        <h3 style={{ color: colors.textLight }}>Orders Module</h3>
                        <p style={{ color: colors.textLight }}>This section will connect to the Mobile App checkout flow in Phase 5.</p>
                    </div>
                )}

            </div>

            {/* --- NEW: MODERN DELETE CONFIRMATION MODAL --- */}
            {deleteModal.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
                    <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
                                ⚠️
                            </div>
                            <h3 style={{ margin: 0, color: '#1E293B', fontSize: '20px', fontWeight: '700' }}>
                                Delete Menu Item
                            </h3>
                        </div>
                        <p style={{ color: '#64748B', lineHeight: '1.5', margin: '0 0 24px 0', fontSize: '15px' }}>
                            Are you sure you want to permanently delete this item? This action cannot be undone and it will be removed from the buyer app immediately.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => setDeleteModal({ isOpen: false, itemId: null })}
                                style={{ padding: '10px 16px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#E2E8F0'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#F1F5F9'}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={executeDelete}
                                style={{ padding: '10px 16px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#DC2626'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#EF4444'}
                            >
                                Yes, Delete It
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Dashboard;