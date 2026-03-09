import React, { useState } from 'react';
import api from './services/api';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role] = useState('customer'); // Default to customer
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    try {
      const res = await api.post('/auth/register', { 
        email, 
        password, 
        fullName, 
        role 
      });
      setMessage("Registration successful! You can now login.");
      // Clear form
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        // Server responded with error status
        setMessage("Registration Failed: " + (err.response?.data?.error || `Server error: ${err.response.status}`));
      } else if (err.request) {
        // Request was made but no response received (network error)
        setMessage("Registration Failed: Cannot connect to server. Check if backend is running.");
      } else {
        // Something happened in setting up the request
        setMessage("Registration Failed: " + err.message);
      }
    }
  };

  return (
    <div style={{margin: '20px'}}>
      <form onSubmit={handleRegister} style={{display:'flex', flexDirection:'column', gap:'10px', width:'300px'}}>
        <h2>OrderFlow Registration</h2>
        <input 
          type="text" 
          placeholder="Full Name" 
          value={fullName}
          onChange={e => setFullName(e.target.value)} 
          required 
        />
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
        <button type="submit">Register</button>
      </form>
      {message && <p style={{marginTop: '10px', color: message.includes('successful') ? 'green' : 'red'}}>{message}</p>}
    </div>
  );
}

export default Register;