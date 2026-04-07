import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();
    const [isCompact, setIsCompact] = useState(window.innerWidth < 900);

    useEffect(() => {
        const onResize = () => setIsCompact(window.innerWidth < 900);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const colors = {
        primary: '#1A73E8',
        bg: '#F8FAFC',
        cardBg: '#FFFFFF',
        text: '#1E293B',
        textLight: '#64748B',
        border: '#E2E8F0',
        accent: '#F59E0B'
    };

    const fontFamily = "'Inter', 'Segoe UI', sans-serif";

    const featureCards = [
        {
            title: 'For Buyers',
            icon: '🛍️',
            description: 'Discover local meals, compare menus, and check out in just a few taps.'
        },
        {
            title: 'For Sellers',
            icon: '📦',
            description: 'Manage inventory, update products, and track incoming orders in real-time.'
        },
        {
            title: 'Mobile Ready',
            icon: '📱',
            description: 'Built for cross-device experience today.'
        }
    ];

    const quickStats = [
        { label: 'Faster menu updates', value: 'Real-time' },
        { label: 'Seller dashboard control', value: 'Complete' },
        { label: 'Buyer search experience', value: 'Smart filters' }
    ];


    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: colors.bg,
                backgroundImage: 'radial-gradient(circle at 15% 10%, #E8F1FF 0%, #F8FAFC 55%)',
                fontFamily
            }}
        >
            <nav
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(8px)',
                    borderBottom: `1px solid ${colors.border}`,
                    padding: isCompact ? '14px 16px' : '16px 40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'padding 0.28s ease'
                }}
            >
                <div style={{ fontSize: '24px', fontWeight: '800', color: colors.primary, letterSpacing: '-0.5px' }}>
                    OrderFlow
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/login')}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#F8FAFC';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = colors.cardBg;
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '30px',
                            border: `1px solid ${colors.border}`,
                            backgroundColor: colors.cardBg,
                            color: colors.text,
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#1557B0';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primary;
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '30px',
                            border: 'none',
                            backgroundColor: colors.primary,
                            color: '#FFFFFF',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Register
                    </button>
                </div>
            </nav>

            <main
                style={{
                    maxWidth: '1120px',
                    margin: '0 auto',
                    width: '100%',
                    flex: 1,
                    padding: isCompact ? '28px 16px 28px 16px' : '56px 24px 40px 24px',
                    transition: 'padding 0.28s ease'
                }}
            >
                <section
                    style={{
                        background: `linear-gradient(140deg, ${colors.cardBg} 0%, #F6F9FF 100%)`,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        padding: isCompact ? '28px 18px' : '56px 32px',
                        textAlign: 'center',
                        marginBottom: '36px',
                        transition: 'padding 0.28s ease, margin 0.28s ease'
                    }}
                >
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '14px',
                            backgroundColor: '#FFF4D8',
                            color: '#945C00',
                            borderRadius: '30px',
                            padding: '6px 14px',
                            fontSize: '13px',
                            fontWeight: '700'
                        }}
                    >
                        <span style={{ color: colors.accent }}>●</span> Trusted by local food businesses
                    </div>

                    <h1 style={{ margin: 0, color: colors.text, fontSize: isCompact ? '32px' : '46px', lineHeight: 1.15, fontWeight: 800 }}>
                        Your ultimate food ordering companion. 🍔
                    </h1>
                    <p
                        style={{
                            margin: '16px auto 0 auto',
                            maxWidth: '780px',
                            color: colors.textLight,
                            fontSize: isCompact ? '15px' : '17px',
                            lineHeight: 1.6
                        }}
                    >
                        Whether you're a local restaurant looking to expand your reach, or a hungry customer craving your
                        next meal, OrderFlow brings it all together.
                    </p>

                    <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/login')}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#1557B0';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = colors.primary;
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '30px',
                                border: 'none',
                                backgroundColor: colors.primary,
                                color: '#FFFFFF',
                                fontWeight: '700',
                                fontSize: '15px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s ease'
                            }}
                        >
                            Order Now
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#E8F1FF';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = colors.cardBg;
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '30px',
                                border: `1px solid ${colors.primary}`,
                                backgroundColor: colors.cardBg,
                                color: colors.primary,
                                fontWeight: '700',
                                fontSize: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Become a Seller
                        </button>
                    </div>

                    <div
                        style={{
                            marginTop: '26px',
                            display: 'grid',
                            gridTemplateColumns: isCompact ? '1fr' : 'repeat(3, 1fr)',
                            gap: '10px',
                            transition: 'all 0.28s ease'
                        }}
                    >
                        {quickStats.map((stat) => (
                            <div
                                key={stat.label}
                                style={{
                                    border: `1px solid ${colors.border}`,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '12px',
                                    padding: '12px'
                                }}
                            >
                                <div style={{ fontSize: '20px', fontWeight: '800', color: colors.primary }}>{stat.value}</div>
                                <div style={{ fontSize: '13px', color: colors.textLight, marginTop: '2px' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                            gap: '16px',
                            transition: 'all 0.28s ease'
                        }}
                    >
                        {featureCards.map((feature) => (
                            <div
                                key={feature.title}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,115,232,0.12)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                                }}
                                style={{
                                    backgroundColor: colors.cardBg,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                    padding: '24px',
                                    transition: 'transform 0.22s ease, box-shadow 0.22s ease'
                                }}
                            >
                                <div style={{ fontSize: '22px', marginBottom: '8px' }}>{feature.icon}</div>
                                <h3 style={{ margin: '0 0 8px 0', color: colors.text, fontSize: '20px', fontWeight: 800 }}>
                                    {feature.title}
                                </h3>
                                <p style={{ margin: 0, color: colors.textLight, fontSize: '15px', lineHeight: 1.55 }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <footer
                style={{
                    marginTop: '28px',
                    padding: '18px 24px',
                    textAlign: 'center',
                    color: colors.textLight,
                    fontSize: '14px',
                    borderTop: `1px solid ${colors.border}`,
                    backgroundColor: colors.cardBg
                }}
            >
                © {new Date().getFullYear()} OrderFlow. All rights reserved.
            </footer>
        </div>
    );
}

export default Landing;
