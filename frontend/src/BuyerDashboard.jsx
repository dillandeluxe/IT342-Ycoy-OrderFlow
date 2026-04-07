import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoodItems } from './services/api';

function BuyerDashboard() {
    const [foodItems, setFoodItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const getRestaurantName = (item) => {
        return (
            item?.sellerName?.trim() ||
            item?.restaurantName?.trim() ||
            item?.seller?.fullName?.trim() ||
            item?.seller?.name?.trim() ||
            'SELLER'
        );
    };

    // NEW: Smart filtering logic for Categories and Search Bar
    const filteredItems = foodItems.filter(item => {
        // 1. Filter by Category
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        
        // 2. Filter by Search Query (checks name, description, and restaurant)
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            item.name?.toLowerCase().includes(query) || 
            item.description?.toLowerCase().includes(query) ||
            getRestaurantName(item).toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    const categories = ['All', 'Pizza', 'Burgers', 'Rice Meals', 'Drinks', 'Desserts', 'Uncategorized'];

    const colors = {
        primary: '#1A73E8',     
        bg: '#F8FAFC',          
        cardBg: '#FFFFFF',      
        text: '#1E293B',        
        textLight: '#64748B',   
        border: '#E2E8F0',
        accent: '#F59E0B' 
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: colors.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            
            {/* NAVIGATION BAR */}
            <nav style={{ backgroundColor: colors.cardBg, padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
                
                <div style={{ fontSize: '24px', fontWeight: '800', color: colors.primary, letterSpacing: '-0.5px' }}>
                    OrderFlow
                </div>

                <div style={{ flex: 1, maxWidth: '400px', margin: '0 40px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: colors.textLight, fontSize: '14px' }}>
                        🔍
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search meals or restaurants" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '30px', border: `1px solid ${colors.border}`, backgroundColor: colors.bg, outline: 'none', fontSize: '14px', transition: 'border-color 0.2s' }} 
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = colors.border}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#E3F2FD', color: colors.primary, border: 'none', borderRadius: '30px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#BBDEFB'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E3F2FD'}>
                        🛒 Cart <span style={{ backgroundColor: colors.primary, color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>0</span>
                    </button>

                    <div style={{ position: 'relative' }}>
                        <div 
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.bg, padding: '8px 16px', borderRadius: '30px', cursor: 'pointer', border: `1px solid ${colors.border}` }}
                        >
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: colors.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                C
                            </div>
                            <span style={{ fontWeight: '600', color: colors.text, fontSize: '14px' }}>Customer ▼</span>
                        </div>

                        {showDropdown && (
                            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', minWidth: '150px', border: `1px solid ${colors.border}` }}>
                                <div 
                                    onClick={handleLogout}
                                    style={{ padding: '12px 16px', color: '#D32F2F', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#FFEBEE'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    Log Out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '36px', color: colors.text, margin: '0 0 8px 0', fontWeight: '800' }}>
                        What are you craving today? 🍔
                    </h1>
                    <p style={{ fontSize: '16px', color: colors.textLight, margin: 0 }}>
                        Browse the active menu from your local OrderFlow sellers.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{ 
                                padding: '10px 24px', 
                                border: 'none', 
                                backgroundColor: activeCategory === cat ? colors.primary : colors.cardBg, 
                                color: activeCategory === cat ? '#FFF' : colors.textLight, 
                                cursor: 'pointer', 
                                borderRadius: '30px', 
                                fontWeight: '600',
                                fontSize: '14px',
                                boxShadow: activeCategory === cat ? '0 4px 10px rgba(26,115,232,0.3)' : '0 2px 4px rgba(0,0,0,0.02)',
                                transition: 'all 0.2s',
                                border: activeCategory !== cat ? `1px solid ${colors.border}` : 'none'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Food Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    
                    {/* NEW: Use the filteredItems array instead of all foodItems */}
                    {filteredItems.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', backgroundColor: colors.cardBg, borderRadius: '16px', border: `2px dashed ${colors.border}` }}>
                            <h3 style={{ color: colors.textLight, margin: 0 }}>No meals found.</h3>
                            <p style={{ color: colors.textLight, fontSize: '14px' }}>Try adjusting your search or category filter!</p>
                        </div>
                    ) : (
                        filteredItems.map(item => (
                            <div key={item.id} style={{ backgroundColor: colors.cardBg, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${colors.border}`, transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', position: 'relative' }}>
                                
                                {/* NEW: SOLD OUT Badge */}
                                {item.stock === 0 && (
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#D32F2F', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', zIndex: 10 }}>
                                        SOLD OUT
                                    </div>
                                )}

                                {/* NEW: Uses item.imageUrl if it exists, otherwise falls back to placeholder */}
                                <div style={{ 
                                    height: '180px', 
                                    backgroundImage: `url("${item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : 'https://placehold.co/600x400/E3F2FD/1A73E8?text=Delicious+Food&font=Montserrat'}")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderBottom: `1px solid ${colors.border}`,
                                    opacity: item.stock === 0 ? 0.6 : 1 // Dims the image if sold out
                                }}></div>

                                <div style={{ padding: '20px', opacity: item.stock === 0 ? 0.6 : 1 }}>
                                    
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                    {getRestaurantName(item)}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h3 style={{ margin: 0, fontSize: '18px', color: colors.text, fontWeight: '700' }}>
                                            {item.name}
                                        </h3>
                                        <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '4px 8px', borderRadius: '8px', fontWeight: '700', fontSize: '14px' }}>
                                            ${item.price.toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <p style={{ margin: '0 0 16px 0', color: colors.textLight, fontSize: '14px', lineHeight: '1.5', minHeight: '42px' }}>
                                        {item.description}
                                    </p>

                                    <button 
                                        style={{ 
                                            width: '100%', 
                                            padding: '12px', 
                                            backgroundColor: item.stock === 0 ? '#F1F5F9' : '#E3F2FD', 
                                            color: item.stock === 0 ? '#94A3B8' : colors.primary, 
                                            border: 'none', 
                                            borderRadius: '8px', 
                                            fontWeight: '700', 
                                            fontSize: '14px', 
                                            cursor: item.stock === 0 ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        disabled={item.stock === 0}
                                        title={item.stock === 0 ? "Item out of stock" : "Checkout will be available in Phase 5"}
                                    >
                                        {item.stock === 0 ? "Out of Stock" : "Add to Cart (Coming Soon)"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </main>
        </div>
    );
}

export default BuyerDashboard;