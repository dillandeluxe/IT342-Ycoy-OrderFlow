import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './services/api'; 
import './Login.css';

// --- Sub-components ---

const NavBar = ({ onNavHome, onNavRegister }) => (
  <nav className="login-navbar">
    <div className="nav-logo" onClick={onNavHome}>OrderFlow</div>
    <div className="nav-buttons">
      <button className="btn btn-static">Sign In</button>
      <button className="btn btn-primary" onClick={onNavRegister}>Register</button>
    </div>
  </nav>
);

const AlertMessage = ({ message, isError }) => {
  if (!message) return null;
  return (
    <div className={`alert-box ${isError ? 'alert-error' : 'alert-success'}`}>
      {message}
    </div>
  );
};

const FormInput = ({ label, type, placeholder, value, onChange, isPassword, showPassword, onTogglePassword }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        className={`input-field ${isPassword ? 'has-icon' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      {isPassword && (
        <span className="password-toggle" onClick={onTogglePassword}>
          {showPassword ? '⌣' : '👁'}
        </span>
      )}
    </div>
  </div>
);

const OAuthButton = ({ url, className, text }) => (
  <a href={url} className={`oauth-btn ${className}`}>
    {text}
  </a>
);

// --- Main Component ---

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); 
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setIsError(false);

    try {
      const res = await login({ email, password });

      if (res.data?.id) {
        localStorage.setItem('userId', String(res.data.id));
      }
      if (res.data?.fullName) {
        localStorage.setItem('restaurantName', res.data.fullName);
      }
      
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      } else {
       localStorage.removeItem('token');
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

  return (
    <div className="login-container">
      <NavBar 
        onNavHome={() => navigate('/')} 
        onNavRegister={() => navigate('/register')} 
      />

      <main className="login-main">
        <div className="login-card">
          
          <header className="login-header">
            <h1 className="login-title">OrderFlow</h1>
            <p className="login-subtitle">Your ultimate food ordering companion.</p>
          </header>

          <AlertMessage message={message} isError={isError} />

          <form className="login-form" onSubmit={handleLogin}>
            <FormInput
              label="Email Address"
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            
            <FormInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              isPassword={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <button type="submit" className="btn btn-primary submit-btn">
              Sign In
            </button>
          </form>

          {/* --- OAUTH SECTION --- */}
          <div className="oauth-divider">
            <hr /><span>or</span><hr />
          </div>

          <OAuthButton 
            url="http://localhost:8080/oauth2/authorization/github" 
            className="oauth-github" 
            text="Sign in with GitHub" 
          />
          
          <OAuthButton 
            url="http://localhost:8080/oauth2/authorization/google" 
            className="oauth-google" 
            text="Sign in with Google" 
          />

          <div className="register-link-container">
            <span className="register-link" onClick={() => navigate('/register')}>
              Don't have an account? Register here
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;