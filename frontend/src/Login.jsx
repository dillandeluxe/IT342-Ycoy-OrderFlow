import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './services/api'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); 
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setIsError(false);

    try {
      const res = await login({ email, password });
      const userRole = res.data.role; 

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      } else {
        localStorage.removeItem('token');
      }

      if (userRole === 'SELLER') {
          navigate('/dashboard'); 
      } else if (userRole === 'BUYER') {
          setIsError(true);
          setMessage("Access Denied: As a Buyer, please use the OrderFlow Mobile App to place orders.");
      } else {
          navigate('/dashboard'); 
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
            <p style={{ color: colors.textLight, margin: 0, fontSize: '15px' }}>Seller Administration Portal</p>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textLight }}>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ padding: '14px', border: `1px solid ${colors.border}`, borderRadius: '8px', outline: 'none', fontSize: '15px', backgroundColor: '#FAFAFA' }}
              />
          </div>

          <button 
            type="submit" 
            style={{ marginTop: '8px', padding: '14px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 4px 6px rgba(26, 115, 232, 0.2)' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1557B0'}
            onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
          >
            Sign In to Dashboard
          </button>

        </form>

        {/* --- NEW REGISTER LINK ADDED HERE --- */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <span 
                onClick={() => navigate('/register')} 
                style={{ color: colors.primary, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
                Don't have an account? Register here
            </span>
        </div>

      </div>
    </div>
  );
}

export default Login;