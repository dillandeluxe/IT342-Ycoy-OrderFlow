import React, { useState } from 'react';
import api from './services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    try {
      const res = await api.post('/auth/login', { email, password });
      setMessage(`Welcome, ${res.data.fullName}!`);
      // Clear form
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        // Server responded with error status
        setMessage("Login Failed: " + (err.response?.data?.error || `Server error: ${err.response.status}`));
      } else if (err.request) {
        // Request was made but no response received (network error)
        setMessage("Login Failed: Cannot connect to server. Check if backend is running.");
      } else {
        // Something happened in setting up the request
        setMessage("Login Failed: " + err.message);
      }
    }
  };

  return (
    <div style={{margin: '20px'}}>
      <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'10px', width:'300px'}}>
        <h2>OrderFlow Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
      </form>
      {message && <p style={{marginTop: '10px', color: message.includes('Welcome') ? 'green' : 'red'}}>{message}</p>}
    </div>
  );
}

export default Login;