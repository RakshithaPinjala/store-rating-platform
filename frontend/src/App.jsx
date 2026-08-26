import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import UserStoreList from './pages/UserStoreList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-stone-50 font-sans">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
              <Route path="/owner" element={<OwnerDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['NORMAL_USER']} />}>
              <Route path="/stores" element={<UserStoreList />} />
            </Route>
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
