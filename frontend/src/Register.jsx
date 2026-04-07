import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from './services/api'; 

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('SELLER'); // NEW: Role is now a state variable
  
  // NEW: State for showing/hiding passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    
    if (password !== confirmPassword) {
        setIsError(true);
        setMessage("Registration Failed: Passwords do not match.");
        return; 
    }
    
    try {
      await register({ email, password, fullName, role });
      
      setIsError(false);
      setMessage("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
          navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error("Registration error:", err);
      setIsError(true);
      if (err.response) {
        setMessage("Registration Failed: " + (err.response?.data?.error || `Server error: ${err.response.status}`));
      } else if (err.request) {
        setMessage("Registration Failed: Cannot connect to server. Check if backend is running.");
      } else {
        setMessage("Registration Failed: " + err.message);
      }
    }
  };

  const colors = {
      primary: '#1A73E8',     
      bg: '#F4F7FC',          
      cardBg: '#FFFFFF',      
      text: '#333333',        
      textLight: '#666666',   
      border: '#E2E8F0',
      errorBg: '#FFEBEE',
      errorText: '#C62828'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: colors.bg, backgroundImage: 'radial-gradient(circle at 15% 10%, #E8F1FF 0%, #F4F7FC 55%)', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${colors.border}`,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div onClick={() => navigate('/')} style={{ fontSize: '24px', fontWeight: '800', color: colors.primary, letterSpacing: '-0.5px', cursor: 'pointer' }}>
          OrderFlow
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', borderRadius: '30px', border: `1px solid ${colors.border}`, backgroundColor: colors.cardBg, color: colors.text, fontWeight: '700', cursor: 'pointer' }}>
            Sign In
          </button>
          <button style={{ padding: '10px 20px', borderRadius: '30px', border: 'none', backgroundColor: colors.primary, color: 'white', fontWeight: '700', cursor: 'default' }}>
            Register
          </button>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
      <div style={{ backgroundColor: colors.cardBg, padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', border: `1px solid ${colors.border}` }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: colors.primary, margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>OrderFlow</h1>
            {/* NEW: Updated to a Motto */}
            <p style={{ color: colors.textLight, margin: 0, fontSize: '15px' }}>Your ultimate food ordering companion.</p>
        </div>

        {message && (
            <div style={{ padding: '12px 16px', marginBottom: '24px', borderRadius: '6px', backgroundColor: isError ? colors.errorBg : '#E8F5E9', color: isError ? colors.errorText : '#2E7D32', fontSize: '14px', fontWeight: '500', lineHeight: '1.4' }}>
                {message}
            </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* NEW: Role Selection Buttons */}
          <div style={{ display: 'flex', gap: '10px', backgroundColor: '#FAFAFA', padding: '6px', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
              <button 
                type="button" 
                onClick={() => setRole('SELLER')}
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', backgroundColor: role === 'SELLER' ? colors.primary : 'transparent', color: role === 'SELLER' ? 'white' : colors.textLight }}
              >
                  Seller
              </button>
              <button 
                type="button" 
                onClick={() => setRole('BUYER')}
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', backgroundColor: role === 'BUYER' ? colors.primary : 'transparent', color: role === 'BUYER' ? 'white' : colors.textLight }}
              >
                  Buyer
              </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* NEW: Label changes based on Role */}
              <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>
                  {role === 'SELLER' ? 'Restaurant Name' : 'Full Name'}
              </label>
              <input 
                type="text" 
                placeholder={role === 'SELLER' ? "Enter your restaurant name" : "Enter your full name"} 
                value={fullName}
                onChange={e => setFullName(e.target.value)} 
                required 
                style={{ padding: '14px', border: `1px solid ${colors.border}`, borderRadius: '8px', outline: 'none', fontSize: '15px', backgroundColor: '#FAFAFA' }}
              />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={e => setEmail(e.target.value)} 
                required 
                style={{ padding: '14px', border: `1px solid ${colors.border}`, borderRadius: '8px', outline: 'none', fontSize: '15px', backgroundColor: '#FAFAFA' }}
              />
          </div>

          {/* NEW: Password with Eye Toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '14px', paddingRight: '45px', border: `1px solid ${colors.border}`, borderRadius: '8px', outline: 'none', fontSize: '15px', backgroundColor: '#FAFAFA', boxSizing: 'border-box' }}
                  />
                  <span 
                    onClick={() => setShowPassword(!showPassword)} 
                    style={{ position: 'absolute', right: '14px', cursor: 'pointer', fontSize: '18px', userSelect: 'none' }}
                  >
                      {showPassword ? '⌣' : '👁'}
                  </span>
              </div>
          </div>

          {/* NEW: Confirm Password with Eye Toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Confirm Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Re-enter your password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '14px', paddingRight: '45px', border: `1px solid ${colors.border}`, borderRadius: '8px', outline: 'none', fontSize: '15px', backgroundColor: '#FAFAFA', boxSizing: 'border-box' }}
                  />
                  <span 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    style={{ position: 'absolute', right: '14px', cursor: 'pointer', fontSize: '18px', userSelect: 'none' }}
                  >
                      {showConfirmPassword ? '⌣' : '👁'}
                  </span>
              </div>
          </div>

          <button 
            type="submit" 
            style={{ marginTop: '8px', padding: '14px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 4px 6px rgba(26, 115, 232, 0.2)' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1557B0'}
            onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
          >
            Create Account
          </button>

        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <span 
                onClick={() => navigate('/login')} 
                style={{ color: colors.primary, fontSize: '14px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
            >
                Already have an account? Sign In
            </span>
        </div>

      </div>
      </div>
    </div>
  );
}

export default Register;