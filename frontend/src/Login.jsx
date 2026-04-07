import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './services/api'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // NEW: State for eye toggle
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); 
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setIsError(false);

    try {
      const res = await login({ email, password });
      
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('restaurantName', res.data.fullName);
      } else {
       localStorage.removeItem('token');
        localStorage.removeItem('restaurantName');
      }

      // SMART ROUTING: Check the role and send them to the correct dashboard!
      if (res.data.role === 'SELLER') {
          navigate('/dashboard'); 
      } else if (res.data.role === 'BUYER') {
          navigate('/buyer-dashboard'); 
      } else {
          navigate('/dashboard'); // Fallback just in case
      }

    } catch (err) {
      console.error("Login error:", err);
      setIsError(true);
      
      if (err.response) {
        setMessage("Login Failed: " + (err.response?.data?.error || err.response?.data?.message || "Invalid credentials"));
      } else if (err.request) {
        setMessage("Login Failed: Cannot connect to server. Is Spring Boot running?");
      } else {
        setMessage("Login Failed: " + err.message);
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: colors.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      
      <div style={{ backgroundColor: colors.cardBg, padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', border: `1px solid ${colors.border}` }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ color: colors.primary, margin: '0 0 8px 0', fontSize: '28px', letterSpacing: '1px' }}>OrderFlow</h1>
            {/* NEW: Updated to match the motto from Register */}
            <p style={{ color: colors.textLight, margin: 0, fontSize: '15px' }}>Your ultimate food ordering companion.</p>
        </div>

        {message && (
            <div style={{ padding: '12px 16px', marginBottom: '24px', borderRadius: '6px', backgroundColor: isError ? colors.errorBg : '#E8F5E9', color: isError ? colors.errorText : '#2E7D32', fontSize: '14px', fontWeight: '500', lineHeight: '1.4' }}>
                {message}
            </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter Your Email" 
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

          <button 
            type="submit" 
            style={{ marginTop: '8px', padding: '14px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 4px 6px rgba(26, 115, 232, 0.2)' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1557B0'}
            onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
          >
            Sign In
          </button>

        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <span 
                onClick={() => navigate('/register')} 
                style={{ color: colors.primary, fontSize: '14px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
            >
                Don't have an account? Register here
            </span>
        </div>

      </div>
    </div>
  );
}

export default Login;