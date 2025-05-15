import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from '@mui/material';
import { 
  ShoppingBag, 
  People, 
  Inventory, 
  CurrencyRupee, 
  TrendingUp, 
  LocalShipping 
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { dashboardService, adminAuthService } from '../../services/adminService';

// Dashboard card component
const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color,
  loading
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: string;
  loading: boolean;
}) => (
  <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        {loading ? (
          <CircularProgress size={24} sx={{ my: 1 }} />
        ) : (
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
            {value}
          </Typography>
        )}
      </Box>
      <Box 
        sx={{ 
          backgroundColor: `${color}15`, 
          borderRadius: '50%', 
          width: 48, 
          height: 48, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}
      >
        <Box sx={{ color }}>{icon}</Box>
      </Box>
    </Box>
  </Paper>
);

// Order status chip component
const StatusChip = ({ status }: { status: string }) => {
  let color = "default";
  
  switch(status.toLowerCase()) {
    case "delivered":
      color = "success";
      break;
    case "shipped":
      color = "info";
      break;
    case "processing":
      color = "warning";
      break;
    case "cancelled":
      color = "error";
      break;
    case "pending":
      color = "default";
      break;
    default:
      color = "default";
  }
  
  return <Chip label={status} color={color as any} size="small" />;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    salesData: []
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!adminAuthService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await dashboardService.getStats();
        if (response.success) {
          // Ensure we have default values for all properties
          setStats({
            totalUsers: response.data?.totalUsers || 0,
            totalProducts: response.data?.totalProducts || 0,
            totalOrders: response.data?.totalOrders || 0,
            totalRevenue: response.data?.totalRevenue || 0,
            recentOrders: response.data?.recentOrders || [],
            salesData: response.data?.salesData || []
          });
        } else {
          console.error('Failed to fetch dashboard data:', response.message);
          // Set default values in case of error
          setStats({
            totalUsers: 0,
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: 0,
            recentOrders: [],
            salesData: []
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values in case of error
        setStats({
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          recentOrders: [],
          salesData: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeader title="Dashboard" />
        
        {/* Dashboard Summary Cards */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <DashboardCard 
              title="Total Users" 
              value={stats.totalUsers} 
              icon={<People fontSize="medium" />} 
              color="#3f51b5"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <DashboardCard 
              title="Total Products" 
              value={stats.totalProducts} 
              icon={<Inventory fontSize="medium" />} 
              color="#f44336"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <DashboardCard 
              title="Total Orders" 
              value={stats.totalOrders} 
              icon={<ShoppingBag fontSize="medium" />} 
              color="#4caf50"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <DashboardCard 
              title="Revenue" 
              value={loading ? '0' : `₹${(stats.totalRevenue || 0).toLocaleString()}`} 
              icon={<CurrencyRupee fontSize="medium" />} 
              color="#ff9800"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <DashboardCard 
              title="Growth" 
              value="+24%" 
              icon={<TrendingUp fontSize="medium" />} 
              color="#9c27b0"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <DashboardCard 
              title="Deliveries" 
              value="12" 
              icon={<LocalShipping fontSize="medium" />} 
              color="#2196f3"
              loading={loading}
            />
          </Grid>
        </Grid>
        
        {/* Sales Chart */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Sales Overview</Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={stats.salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
        
        {/* Recent Orders */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Recent Orders</Typography>
                <Button variant="outlined" size="small" onClick={() => navigate('/admin/orders')}>
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(stats.recentOrders || []).map((order: any) => (
                        <TableRow key={order.id}>
                          <TableCell component="th" scope="row">
                            #{order.id}
                          </TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>₹{(order.amount || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <StatusChip status={order.status} />
                          </TableCell>
                          <TableCell align="right">
                            <Button 
                              size="small" 
                              onClick={() => navigate(`/admin/orders/${order.id}`)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 