import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard'; // The main feature we built!
import BuyerDashboard from './BuyerDashboard';
import Landing from './Landing';
import OAuth2RedirectHandler from './OAuth2RedirectHandler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </Router>
  );
}

export default App;