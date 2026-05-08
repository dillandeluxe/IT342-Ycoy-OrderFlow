import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './dashboard/Dashboard'; // The main feature we built!
import BuyerDashboard from './dashboard/BuyerDashboard';
import ProductDetails from './menu/ProductDetails';
import Landing from './dashboard/Landing';
import OAuth2RedirectHandler from './features/auth/OAuth2RedirectHandler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </Router>
  );
}

export default App;