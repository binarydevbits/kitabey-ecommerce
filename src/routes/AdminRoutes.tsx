import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/admin/Login';
import AdminDashboard from '../pages/admin/Dashboard';
import ProductList from '../pages/admin/products/ProductList';
import UserList from '../pages/admin/users/UserList';
import OrderList from '../pages/admin/orders/OrderList';
import { adminAuthService } from '../services/adminService';

// Protected route component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = adminAuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public admin routes */}
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Protected admin routes */}
      <Route path="/dashboard" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />
      
      <Route path="/products" element={
        <ProtectedAdminRoute>
          <ProductList />
        </ProtectedAdminRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedAdminRoute>
          <UserList />
        </ProtectedAdminRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedAdminRoute>
          <OrderList />
        </ProtectedAdminRoute>
      } />
      
      {/* Redirect from /admin to /admin/dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Catch all route for admin section */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes; 