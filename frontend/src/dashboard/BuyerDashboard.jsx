import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoodItems } from './services/api';
import './BuyerDashboard.css';

// --- Subcomponents ---

const NavBar = ({ searchQuery, setSearchQuery, showDropdown, setShowDropdown, handleLogout }) => (
    <nav className="buyer-navbar">
        <div className="buyer-logo">
            <span style={{ marginRight: '8px' }}></span> OrderFlow
        </div>

        <div className="search-container">
            <span className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </span>
            <input 
                type="text" 
                className="search-input"
                placeholder="Search meals or restaurants..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        <div className="nav-actions">
            <button className="cart-btn" title="Cart functionality is currently disabled">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Cart <span className="cart-badge">0</span>
            </button>

            <div className="profile-dropdown-container">
                <div className="profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                    <div className="profile-avatar">C</div>
                    <span className="profile-name">Customer ▼</span>
                </div>

                {showDropdown && (
                    <div className="dropdown-menu">
                        <div className="dropdown-item" onClick={handleLogout}>Log Out</div>
                    </div>
                )}
            </div>
        </div>
    </nav>
);

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => {
    const categoryIcons = {
        'All': '🍽️',
        'Pizza': '🍕',
        'Burgers': '🍔',
        'Rice Meals': '🍚',
        'Drinks': '🥤',
        'Desserts': '🍰',
        'Uncategorized': '📦'
    };

    return (
        <div className="category-filter">
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                >
                    <span style={{ marginRight: '8px' }}>{categoryIcons[cat] || '🍽️'}</span>
                    {cat}
                </button>
            ))}
        </div>
    );
};

const FoodCard = ({ item, getRestaurantName, formatPeso, onViewProduct }) => {
    const isSoldOut = item.stock === 0;
    const bgImage = item.imageUrl && item.imageUrl.trim() !== "" 
        ? item.imageUrl 
        : 'https://placehold.co/600x400/F3F4F6/9CA3AF?text=Image+Coming+Soon&font=Montserrat'; // Generic placeholder for future image uploads

    return (
        <div className={`food-card ${isSoldOut ? 'sold-out' : ''}`}>
            {isSoldOut && <div className="sold-out-badge">SOLD OUT</div>}
            
            <div 
                className="food-image" 
                style={{ backgroundImage: `url("${bgImage}")` }}
            ></div>

            <div className="food-info">
                <div className="restaurant-name">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'text-bottom' }}>
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    {getRestaurantName(item)}
                </div>

                <div className="food-header">
                    <h3 className="food-name">{item.name}</h3>
                    <span className="food-price">{formatPeso(item.price)}</span>
                </div>
                
                <p className="food-desc">{item.description}</p>

                <div className="card-actions">
                    <button 
                        className="view-product-btn"
                        onClick={() => onViewProduct(item)}
                    >
                        View Details
                    </button>

                    <button 
                        className="add-to-cart-btn"
                        disabled={isSoldOut}
                        title="Cart functionality is currently disabled"
                    >
                        {isSoldOut ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FoodGrid = ({ filteredItems, getRestaurantName, formatPeso, onViewProduct }) => (
    <div className="food-grid">
        {filteredItems.length === 0 ? (
            <div className="empty-state">
                <h3 className="empty-title">No meals found.</h3>
                <p className="empty-subtitle">Try adjusting your search or category filter!</p>
            </div>
        ) : (
            filteredItems.map(item => (
                <FoodCard 
                    key={item.id} 
                    item={item} 
                    getRestaurantName={getRestaurantName} 
                    formatPeso={formatPeso} 
                    onViewProduct={onViewProduct}
                />
            ))
        )}
    </div>
);

// --- Main Application Component ---

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

    // Smart filtering logic for Categories and Search Bar
    const filteredItems = foodItems.filter(item => {
        // 1. Filter by Category
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        
        // 2. Filter by Search Query
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            item.name?.toLowerCase().includes(query) || 
            item.description?.toLowerCase().includes(query) ||
            getRestaurantName(item).toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    const categories = ['All', 'Pizza', 'Burgers', 'Rice Meals', 'Drinks', 'Desserts', 'Uncategorized'];

    const formatPeso = (value) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(Number(value || 0));

    return (
        <div className="buyer-layout">
            <NavBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                handleLogout={handleLogout}
            />

            <main className="buyer-main">
                <div className="header-section">
                    <h1>What are you craving today? 🍔</h1>
                    <p>Browse the active menu from your local OrderFlow sellers.</p>
                </div>

                <CategoryFilter 
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />

                <FoodGrid 
                    filteredItems={filteredItems}
                    getRestaurantName={getRestaurantName}
                    formatPeso={formatPeso}
                    onViewProduct={(item) => navigate(`/product/${item.id}`, { state: { item, restaurantName: getRestaurantName(item) } })}
                />
            </main>
        </div>
    );
}

export default BuyerDashboard;