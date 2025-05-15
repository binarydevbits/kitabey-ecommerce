import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import UserList from './users/UserList';
import ProductList from './products/ProductList';
import OrderList from './orders/OrderList';
import { Box, CircularProgress } from '@mui/material';

const AdminRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // In a real app, this would check with your backend API
    // to verify the user's authentication status and admin role
    const checkAuth = async () => {
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        
        if (!adminAuth) {
          setIsAuthenticated(false);
          navigate('/admin/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Box>
  );
};

export default AdminRoutes; 