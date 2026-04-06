import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // NEW: Added for Logout routing
import { getFoodItems, addFoodItem } from './services/api';

function Dashboard() {
    const [foodItems, setFoodItems] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: '' });
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('Products'); 
    
    // NEW: State for the Profile Dropdown
    const [showDropdown, setShowDropdown] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getFoodItems();
            setFoodItems(response.data);
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
            // Ensure price is treated as a number before sending to Spring Boot
            const payload = {
                ...formData,
                price: parseFloat(formData.price) 
            };
            
            await addFoodItem(payload);
            setMessage('Food item added successfully!');
            setFormData({ name: '', description: '', price: '' }); // Clear form
            
            // Refresh the table immediately so the user sees the new item
            fetchItems(); 
            
            setTimeout(() => setMessage(''), 3000); 
        } catch (error) {
            setMessage('Error adding food item. Check your Spring Boot terminal.');
            console.error(error);
        }
    };

    // NEW: Logout Function
    const handleLogout = () => {
        
        // For now, just send them back to the login screen!
        localStorage.removeItem('token');
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
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: colors.bg }}>
            
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
                
                {/* Header Profile Section */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: colors.text, fontSize: '28px' }}>{activeTab} Management</h1>
                        <p style={{ margin: '8px 0 0 0', color: colors.textLight }}>Manage your restaurant's {activeTab.toLowerCase()} and settings.</p>
                    </div>
                    
                    {/* NEW: Clickable Profile Dropdown Area */}
                    <div style={{ position: 'relative' }}>
                        <div 
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: colors.cardBg, padding: '8px 16px', borderRadius: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', userSelect: 'none' }}
                        >
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: colors.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                S
                            </div>
                            <span style={{ fontWeight: '600', color: colors.text, fontSize: '14px' }}>Seller Admin ▼</span>
                        </div>

                        {/* The Logout Menu */}
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

                {activeTab === 'Products' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* ADD PRODUCT FORM */}
                        <div style={{ backgroundColor: colors.cardBg, padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}` }}>
                            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: colors.primary }}>+ Add New Menu Item</h2>
                            
                            {message && (
                                <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', backgroundColor: message.includes('Error') ? '#FFEBEE' : '#E8F5E9', color: message.includes('Error') ? '#C62828' : '#2E7D32', fontWeight: '600', fontSize: '14px' }}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Item Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Cheeseburger" style={{ padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '6px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Description</label>
                                    <input type="text" name="description" value={formData.description} onChange={handleChange} required placeholder="Ingredients, flavor, etc." style={{ padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '6px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Price ($)</label>
                                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required placeholder="0.00" style={{ padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '6px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <button type="submit" style={{ padding: '0 24px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', height: '43px', transition: 'background-color 0.2s', fontSize: '14px' }}>
                                    Save Item
                                </button>
                            </form>
                        </div>

                        {/* PRODUCT TABLE */}
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
                                            <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                                <td style={{ padding: '16px 24px', fontWeight: '600', color: colors.text }}>{item.name}</td>
                                                <td style={{ padding: '16px 24px', color: colors.textLight, fontSize: '14px' }}>{item.description}</td>
                                                <td style={{ padding: '16px 24px', fontWeight: '700', color: '#2E7D32' }}>${item.price.toFixed(2)}</td>
                                                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                    <button style={{ background: '#E3F2FD', border: 'none', color: '#1976D2', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontSize: '12px', fontWeight: '600' }}>Edit</button>
                                                    <button style={{ background: '#FFEBEE', border: 'none', color: '#D32F2F', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '60px', textAlign: 'center', backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px dashed ${colors.border}` }}>
                        <h3 style={{ color: colors.textLight }}>This section is currently under construction.</h3>
                        <p style={{ color: colors.textLight }}>Please click the <strong>Products</strong> tab in the sidebar to use the Phase 3 Main Feature.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;