import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

// Sub-components
const Navbar = ({ isScrolled, onLogin, onRegister }) => (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">
            <span className="logo-icon"></span> OrderFlow
        </div>
        <div className="nav-actions">
            <button className="btn btn-text" onClick={onLogin}>Log In</button>
            <button className="btn btn-primary" onClick={onRegister}>Sign Up</button>
        </div>
    </nav>
);

const SearchBar = ({ onFindFood }) => (
    <div className="search-wrapper fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="search-container">
            <span className="search-pin">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            </span>
            <input 
                type="text" 
                className="search-input" 
                placeholder="Enter your delivery address" 
            />
            <button className="btn btn-primary search-btn" onClick={onFindFood}>
                Find Food
            </button>
        </div>
        <p className="search-hint">Sign in to see nearby restaurants and exclusive offers.</p>
    </div>
);

const Categories = ({ onCategoryClick }) => {
    const cats = [
        { icon: '🍕', label: 'Pizza' },
        { icon: '🍔', label: 'Burgers' },
        { icon: '🥗', label: 'Healthy' },
        { icon: '🍣', label: 'Asian' },
        { icon: '☕', label: 'Cafe' },
        { icon: '🍰', label: 'Desserts' },
    ];
    return (
        <div className="categories-section fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="categories-title">Popular top categories</h3>
            <div className="categories-scroll">
                {cats.map(c => (
                    <div key={c.label} className="category-pill" onClick={onCategoryClick}>
                        <div className="category-icon">{c.icon}</div>
                        <span>{c.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HeroSection = ({ onFindFood }) => (
    <section className="hero-section">
        <div className="hero-content">
            <h1 className="hero-title fade-in-up">
                Hungry? <br/>
                <span className="text-highlight">You're in the right place.</span>
            </h1>
            <p className="hero-subtitle fade-in-up" style={{ animationDelay: '0.1s' }}>
                Get your favorite meals from local restaurants delivered to your door at lightning speed.
            </p>
            <SearchBar onFindFood={onFindFood} />
            <Categories onCategoryClick={onFindFood} />
        </div>
        <div className="hero-image-container fade-in-up" style={{ animationDelay: '0.3s' }}>
            <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80" 
                alt="Delicious food display" 
                className="hero-img"
            />
            <div className="floating-card card-1">
                <span className="float-icon">🚚</span> Fast Delivery
            </div>
            <div className="floating-card card-2">
                ⭐ 4.9 Top Rated
            </div>
        </div>
    </section>
);

const HowItWorks = () => {
    const steps = [
        { icon: '📱', title: '1. Browse & Order', text: 'Select from a wide variety of local restaurants.' },
        { icon: '🧑‍🍳', title: '2. They Prepare', text: 'Chefs prepare your meal with love and care.' },
        { icon: '🛵', title: '3. Fast Delivery', text: 'Your food is delivered hot and fresh to your door.' }
    ];

    return (
        <section className="how-it-works">
            <h2 className="section-title">How OrderFlow Works</h2>
            <div className="steps-grid">
                {steps.map((step, idx) => (
                    <div key={idx} className="step-card">
                        <div className="step-icon">{step.icon}</div>
                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-text">{step.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const SellerCta = ({ onRegister }) => (
    <section className="seller-cta">
        <div className="seller-content">
            <h2>Partner with OrderFlow</h2>
            <p>Join thousands of restaurants reaching more customers every day. Setup is fast and easy.</p>
            <button className="btn btn-outline-white" onClick={onRegister}>Become a Partner</button>
        </div>
    </section>
);

const Footer = () => (
    <footer className="landing-footer">
        <div className="footer-content">
            <div className="footer-brand">
                <h3>OrderFlow</h3>
                <p>Delivering happiness to your doorstep.</p>
            </div>
            <div className="footer-links">
                <span>© {new Date().getFullYear()} OrderFlow. All rights reserved.</span>
            </div>
        </div>
    </footer>
);

function Landing() {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="landing-container">
            <Navbar 
                isScrolled={isScrolled} 
                onLogin={() => navigate('/login')} 
                onRegister={() => navigate('/register')} 
            />
            <main className="landing-main">
                <HeroSection onFindFood={() => navigate('/login')} />
                <HowItWorks />
                <SellerCta onRegister={() => navigate('/register')} />
            </main>
            <Footer />
        </div>
    );
}

export default Landing;
