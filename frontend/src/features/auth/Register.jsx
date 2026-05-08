import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from './services/api'; 
import './Register.css';

// --- Sub-components ---

const NavBar = ({ onNavHome, onNavLogin }) => (
  <nav className="register-navbar">
    <div className="nav-logo" onClick={onNavHome}>OrderFlow</div>
    <div className="nav-buttons">
      <button className="btn btn-outline" onClick={onNavLogin}>Sign In</button>
      <button className="btn btn-primary btn-static">Register</button>
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

const RoleSelector = ({ role, onRoleChange }) => (
  <div className="role-toggle">
    <button 
      type="button" 
      className={`role-btn ${role === 'SELLER' ? 'active' : ''}`}
      onClick={() => onRoleChange('SELLER')}
    >
      Seller
    </button>
    <button 
      type="button" 
      className={`role-btn ${role === 'BUYER' ? 'active' : ''}`}
      onClick={() => onRoleChange('BUYER')}
    >
      Buyer
    </button>
  </div>
);

const OAuthButton = ({ url, className, text }) => (
  <a href={url} className={`oauth-btn ${className}`}>
    {text}
  </a>
);

// --- Main Component ---

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('SELLER'); 
  
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

  return (
    <div className="register-container">
      <NavBar 
        onNavHome={() => navigate('/')} 
        onNavLogin={() => navigate('/login')} 
      />

      <main className="register-main">
        <div className="register-card">
          
          <header className="register-header">
            <h1 className="register-title">OrderFlow</h1>
            <p className="register-subtitle">Your ultimate food ordering companion.</p>
          </header>

          <AlertMessage message={message} isError={isError} />

          <form className="register-form" onSubmit={handleRegister}>
            
            <RoleSelector role={role} onRoleChange={setRole} />

            <FormInput
              label={role === 'SELLER' ? 'Restaurant Name' : 'Full Name'}
              type="text"
              placeholder={role === 'SELLER' ? 'Enter your restaurant name' : 'Enter your full name'}
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />

            <FormInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
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

            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              isPassword={true}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <button type="submit" className="btn btn-primary submit-btn">
              Create Account
            </button>

          </form>

          {/* --- OAUTH SECTION --- */}
          <div className="oauth-divider">
            <hr /><span>or</span><hr />
          </div>

          <OAuthButton 
            url="http://localhost:8080/oauth2/authorization/github" 
            className="oauth-github" 
            text="Sign up with GitHub" 
          />
          
          <OAuthButton 
            url="http://localhost:8080/oauth2/authorization/google" 
            className="oauth-google" 
            text="Sign up with Google" 
          />

          <div className="login-link-container">
            <span className="login-link" onClick={() => navigate('/login')}>
              Already have an account? Sign In
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Register;