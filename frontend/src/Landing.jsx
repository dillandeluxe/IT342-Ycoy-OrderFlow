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

    const experienceItems = [
        {
            icon: '✨',
            title: 'Curated Discovery',
            text: 'Browse premium local favorites, from comfort classics to trending new kitchens.'
        },
        {
            icon: '🛵',
            title: 'Reliable Delivery Flow',
            text: 'Transparent timing and smooth order progression keep every meal experience stress-free.'
        },
        {
            icon: '🍽️',
            title: 'Restaurant-First Tools',
            text: 'Sellers manage menus and inventory in a polished dashboard built for daily operations.'
        }
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
                    display: 'flex',
                    flexDirection: 'column',
                    padding: isCompact ? '30px 16px 0 16px' : '44px 20px 0 20px',
                    transition: 'padding 0.28s ease'
                }}
            >
                <section
                    style={{
                        background: `linear-gradient(145deg, ${colors.cardBg} 0%, #F7FAFF 100%)`,
                        borderRadius: '32px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                        padding: isCompact ? '42px 18px' : '80px 28px',
                        textAlign: 'center',
                        marginBottom: '24px',
                        transition: 'padding 0.28s ease, margin 0.28s ease'
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            color: colors.primary,
                            fontSize: isCompact ? '38px' : '56px',
                            lineHeight: 1.05,
                            letterSpacing: '-1px',
                            fontWeight: 800
                        }}
                    >
                        Food delivery, Elevated.
                    </h1>

                    <p
                        style={{
                            margin: '18px auto 0 auto',
                            maxWidth: '760px',
                            color: colors.textLight,
                            fontSize: isCompact ? '16px' : '19px',
                            lineHeight: 1.6
                        }}
                    >
                        A premium ordering experience for hungry customers and ambitious local restaurants.
                        Discover standout meals, place orders faster, and grow your reach with confidence.
                    </p>

                    <div
                        style={{
                            marginTop: '30px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            maxWidth: '780px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '50px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                            padding: isCompact ? '10px' : '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flexDirection: isCompact ? 'column' : 'row'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search restaurants, dishes, or cuisines"
                            onFocus={(e) => {
                                e.currentTarget.style.outline = 'none';
                            }}
                            style={{
                                flex: 1,
                                width: '100%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                outline: 'none',
                                padding: '12px 16px',
                                fontSize: '15px',
                                color: colors.text
                            }}
                        />
                        <button
                            onClick={() => navigate('/login')}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#1557B0';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = colors.primary;
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            style={{
                                border: 'none',
                                borderRadius: '50px',
                                backgroundColor: colors.primary,
                                color: '#FFFFFF',
                                fontWeight: '700',
                                cursor: 'pointer',
                                padding: '12px 22px',
                                transition: 'all 0.2s ease',
                                minWidth: isCompact ? '100%' : 'auto'
                            }}
                        >
                            Find Food
                        </button>
                    </div>
                </section>

                <section
                    style={{
                        minHeight: 'auto',
                        display: 'flex',
                        alignItems: 'stretch',
                        marginTop: 'auto',
                        width: '100vw',
                        marginLeft: 'calc(50% - 50vw)',
                        marginRight: 'calc(50% - 50vw)',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                        padding: isCompact ? '34px 20px' : '42px 20px',
                        marginBottom: '0'
                    }}
                >
                    <div style={{ maxWidth: '1120px', margin: '0 auto', width: '100%' }}>
                        <h2
                            style={{
                                margin: 0,
                                textAlign: 'center',
                                color: colors.primary,
                                fontWeight: 800,
                                fontSize: isCompact ? '34px' : '44px',
                                letterSpacing: '-0.6px'
                            }}
                        >
                            The OrderFlow experience
                        </h2>
                        <p
                            style={{
                                margin: '14px auto 0 auto',
                                maxWidth: '700px',
                                textAlign: 'center',
                                color: colors.textLight,
                                fontSize: '17px',
                                lineHeight: 1.6
                            }}
                        >
                            A refined ordering journey designed for speed, confidence, and delightful food discovery.
                        </p>

                        <div
                            style={{
                                marginTop: '32px',
                                display: 'grid',
                                gridTemplateColumns: isCompact ? '1fr' : 'repeat(3, 1fr)',
                                gap: '32px'
                            }}
                        >
                            {experienceItems.map((item) => (
                                <div key={item.title} style={{ padding: '8px 6px' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '18px' }}>{item.icon}</div>
                                    <h3 style={{ margin: '0 0 10px 0', color: colors.text, fontSize: '24px', fontWeight: 800 }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ margin: 0, color: colors.textLight, fontSize: '16px', lineHeight: 1.7 }}>
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            <footer
                style={{
                    marginTop: 0,
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
