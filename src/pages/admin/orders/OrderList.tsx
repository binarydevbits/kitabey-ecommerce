import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Chip,
  Menu,
  MenuItem,
  TablePagination,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import { orderService, adminAuthService } from '../../../services/adminService';

// Order interface to define the structure of order data
interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'unpaid';
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    // Check if user is authenticated
    if (!adminAuthService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    fetchOrders();
  }, [navigate]);
  
  useEffect(() => {
    applyFilters();
  }, [orders, searchQuery, statusFilter]);

  // Fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders();
      if (response.success) {
        setOrders(response.orders || []);
        setFilteredOrders(response.orders || []);
      } else {
        showSnackbar(response.message || 'Failed to fetch orders', 'error');
        // Set empty arrays in case of error
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar('An error occurred while fetching orders', 'error');
      // Set empty arrays in case of error
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to the orders
  const applyFilters = () => {
    let filtered = [...orders];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.customer.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  };
  
  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  // Handle status filter changes
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0); // Reset to first page when filtering
  };
  
  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle menu open/close
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, orderId: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentOrderId(orderId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentOrderId(null);
  };
  
  // Handle opening dialogs for view/edit/delete actions
  const openOrderActionDialog = (action: 'view' | 'status' | 'delete', order: Order) => {
    setSelectedOrder(order);
    
    if (action === 'view') {
      setOpenViewDialog(true);
    } else if (action === 'status') {
      setNewStatus(order.status);
      setOpenStatusDialog(true);
    } else if (action === 'delete') {
      setOpenDeleteDialog(true);
    }
    
    handleMenuClose();
  };
  
  // Handle closing dialogs
  const handleViewDialogClose = () => {
    setOpenViewDialog(false);
    setSelectedOrder(null);
  };
  
  const handleStatusDialogClose = () => {
    setOpenStatusDialog(false);
    setSelectedOrder(null);
    setNewStatus('');
  };
  
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedOrder(null);
  };
  
  // Handle status change
  const handleStatusChange = (event: SelectChangeEvent) => {
    setNewStatus(event.target.value);
  };
  
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      setLoading(true);
      const response = await orderService.updateOrderStatus(selectedOrder.id, { status: newStatus });
      
      if (response.success) {
        showSnackbar('Order status updated successfully', 'success');
        fetchOrders();
        handleStatusDialogClose();
      } else {
        showSnackbar(response.message || 'Failed to update order status', 'error');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showSnackbar('An error occurred while updating the order status', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle order deletion
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      setLoading(true);
      // In a real application, you would delete the order via the API
      // For now, we'll just simulate a successful deletion
      setTimeout(() => {
        const updatedOrders = orders.filter(order => order.id !== selectedOrder.id);
        setOrders(updatedOrders);
        showSnackbar('Order deleted successfully', 'success');
        handleDeleteDialogClose();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error deleting order:', error);
      showSnackbar('An error occurred while deleting the order', 'error');
      setLoading(false);
    }
  };
  
  // Handle sending email notifications
  const handleSendNotification = async (orderId: string) => {
    try {
      setLoading(true);
      // In a real application, you would send an email via the API
      // For now, we'll just simulate a successful email send
      setTimeout(() => {
        showSnackbar('Email notification sent successfully', 'success');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending notification:', error);
      showSnackbar('An error occurred while sending the notification', 'error');
      setLoading(false);
    }
  };
  
  // Format the date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Display snackbar notifications
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  // Render a status chip with the appropriate color
  const getStatusChip = (status: string) => {
    let color = "default";
    let icon = null;
    
    switch(status.toLowerCase()) {
      case "delivered":
        color = "success";
        icon = <CheckCircleIcon fontSize="small" />;
        break;
      case "shipped":
        color = "info";
        icon = <LocalShippingIcon fontSize="small" />;
        break;
      case "processing":
        color = "warning";
        break;
      case "cancelled":
        color = "error";
        icon = <CancelIcon fontSize="small" />;
        break;
      case "pending":
        color = "default";
        break;
      default:
        color = "default";
    }
    
    return (
      <Chip 
        label={status} 
        color={color as any} 
        size="small" 
        icon={icon || undefined}
      />
    );
  };
  
  // Calculate total price for an order
  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeader title="Order Management" />
        
        <Paper sx={{ width: '100%', mb: 2, mt: 3 }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Typography
              sx={{ flex: '1 1 100%', mb: 2 }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Orders
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Toolbar>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size="medium"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(filteredOrders || [])
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((order) => (
                        <TableRow
                          hover
                          key={order.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{formatDate(order.date)}</TableCell>
                          <TableCell align="right">₹{(order.total || 0).toLocaleString()}</TableCell>
                          <TableCell>{getStatusChip(order.status)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={order.paymentStatus} 
                              color={order.paymentStatus === 'paid' ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              aria-label="more"
                              onClick={(event) => handleMenuOpen(event, order.id)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    {(filteredOrders || []).length === 0 && (
                      <TableRow style={{ height: 53 }}>
                        <TableCell colSpan={7} align="center">
                          No orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={(filteredOrders || []).length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
      </Box>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => {
            const order = orders.find(o => o.id === currentOrderId);
            if (order) openOrderActionDialog('view', order);
          }}
        >
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem 
          onClick={() => {
            const order = orders.find(o => o.id === currentOrderId);
            if (order) openOrderActionDialog('status', order);
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Update Status
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (currentOrderId) handleSendNotification(currentOrderId);
            handleMenuClose();
          }}
        >
          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
          Send Notification
        </MenuItem>
        <MenuItem 
          onClick={() => {
            const order = orders.find(o => o.id === currentOrderId);
            if (order) openOrderActionDialog('delete', order);
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      {/* View Order Dialog */}
      <Dialog open={openViewDialog} onClose={handleViewDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600}>Customer Information</Typography>
                <Box sx={{ mt: 1, mb: 3 }}>
                  <Typography variant="body1">{selectedOrder.customer}</Typography>
                  <Typography variant="body2">{selectedOrder.email}</Typography>
                  <Typography variant="body2">{selectedOrder.phone}</Typography>
                </Box>
                
                <Typography variant="subtitle1" fontWeight={600}>Shipping Address</Typography>
                <Box sx={{ mt: 1, mb: 3 }}>
                  <Typography variant="body2">{selectedOrder.shippingAddress}</Typography>
                </Box>
                
                <Typography variant="subtitle1" fontWeight={600}>Payment Information</Typography>
                <Box sx={{ mt: 1, mb: 3 }}>
                  <Typography variant="body2">Method: {selectedOrder.paymentMethod}</Typography>
                  <Typography variant="body2">
                    Status: {' '}
                    <Chip 
                      label={selectedOrder.paymentStatus} 
                      color={selectedOrder.paymentStatus === 'paid' ? 'success' : 'error'}
                      size="small"
                    />
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600}>Order Summary</Typography>
                <Box sx={{ mt: 1, mb: 3 }}>
                  <Typography variant="body2">Order ID: {selectedOrder.id}</Typography>
                  <Typography variant="body2">Date: {formatDate(selectedOrder.date)}</Typography>
                  <Typography variant="body2">
                    Status: {getStatusChip(selectedOrder.status)}
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" fontWeight={600}>Items</Typography>
                <List sx={{ mt: 1, mb: 3, width: '100%', bgcolor: 'background.paper' }}>
                  {(selectedOrder.items || []).map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                ₹{(item.price || 0).toLocaleString()} × {item.quantity}
                              </Typography>
                              {` — ₹${((item.price || 0) * (item.quantity || 0)).toLocaleString()}`}
                            </>
                          }
                        />
                      </ListItem>
                      {index < (selectedOrder.items || []).length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    ₹{(selectedOrder.total || 0).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose}>Close</Button>
          <Button 
            onClick={() => {
              handleViewDialogClose();
              if (selectedOrder) openOrderActionDialog('status', selectedOrder);
            }} 
            color="primary"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={openStatusDialog} onClose={handleStatusDialogClose}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="update-status-label">Status</InputLabel>
              <Select
                labelId="update-status-label"
                id="update-status"
                value={newStatus}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color="primary"
            disabled={!!(loading || !newStatus || (selectedOrder && newStatus === selectedOrder.status))}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Order Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete Order{' '}
            <strong>{selectedOrder?.id}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button 
            onClick={handleDeleteOrder} 
            variant="contained" 
            color="error"
            disabled={!!loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderList; 