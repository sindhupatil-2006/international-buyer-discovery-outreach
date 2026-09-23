import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindBuyers from './pages/FindBuyers';
import Buyers from './pages/Buyers';
import Outreach from './pages/Outreach';
import OutreachHistory from './pages/OutreachHistory';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Exporter Portal Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find-buyers" element={<FindBuyers />} />
          <Route path="/buyers" element={<Buyers />} />
          <Route path="/outreach" element={<Outreach />} />
          <Route path="/history" element={<OutreachHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
