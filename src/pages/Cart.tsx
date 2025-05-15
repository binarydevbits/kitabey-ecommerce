import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  IconButton, 
  Card, 
  CardMedia, 
  Divider, 
  TextField, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../contexts/CartContext';
import axios from 'axios';

// Mock data for frequently bought together items
const frequentlyBoughtTogether = [
  {
    id: 6,
    name: 'Wireless Charging Pad',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1622445275576-721325763afe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    discount: 0,
  },
  {
    id: 9,
    name: 'Portable Bluetooth Speaker',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    discount: 10,
  },
  {
    id: 12,
    name: 'Wireless Earbuds',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    discount: 5,
  },
];

const steps = ['Cart Review', 'Shipping Details', 'Order Confirmation'];

const Cart: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Use cart context
  const { items, removeFromCart, updateQuantity, getTotalPrice, placeOrder } = useCart();
  
  // State for promo code
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  // State for snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // State for checkout dialog
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // State for shipping details
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  // Calculate subtotal
  const subtotal = getTotalPrice();
  
  // Calculate shipping (free over ₹500)
  const shipping = subtotal > 500 ? 0 : 50;
  
  // Calculate total
  const total = subtotal + shipping - promoDiscount;
  
  // Handle quantity change
  const handleQuantityChange = (id: number, amount: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + amount;
      if (newQuantity >= 1 && newQuantity <= item.stock) {
        updateQuantity(id, newQuantity);
      }
    }
  };
  
  // Handle remove item
  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
    setSnackbarMessage('Item removed from cart');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  // Handle promo code
  const handlePromoCode = () => {
    // Mock promo codes
    const promoCodes = {
      'WELCOME10': 10,
      'SAVE20': 20,
      'SPECIAL30': 30
    };
    
    if (!promoCode) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    const discount = promoCodes[promoCode as keyof typeof promoCodes];
    if (discount) {
      const discountAmount = (subtotal * discount) / 100;
      setPromoDiscount(discountAmount);
      setPromoError('');
      setSnackbarMessage(`Promo code applied! You saved ₹${discountAmount.toFixed(2)}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      setPromoError('Invalid promo code');
      setPromoDiscount(0);
    }
  };
  
  // Handle shipping details change
  const handleShippingDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle next step
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate cart
      if (items.length === 0) {
        setSnackbarMessage('Your cart is empty');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
    } else if (activeStep === 1) {
      // Validate shipping details
      if (!shippingDetails.name || !shippingDetails.email || !shippingDetails.phone || 
          !shippingDetails.address || !shippingDetails.city || !shippingDetails.state || 
          !shippingDetails.zipCode || !shippingDetails.country) {
        setSnackbarMessage('Please fill in all shipping details');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle place order
  const handlePlaceOrder = async () => {
    try {
      // Show loading state
      setSnackbarMessage('Processing your order...');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      console.log('Preparing order data...');
      const fullAddress = `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zipCode}, ${shippingDetails.country}`;
      
      const orderData = {
        customerName: shippingDetails.name,
        customerEmail: shippingDetails.email,
        shippingAddress: fullAddress,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price
        })),
        totalAmount: total
      };
      
      console.log('Submitting order with customer email:', shippingDetails.email);
      console.log('Order data:', orderData);
      
      const result = await placeOrder(orderData);
      
      if (result.success) {
        setSnackbarMessage('Order placed successfully! Check your email for confirmation.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setCheckoutOpen(false);
        // Clear the form
        setShippingDetails({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        });
        // Navigate to home after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setSnackbarMessage(result.message || 'Failed to place order. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setSnackbarMessage(error instanceof Error ? error.message : 'An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Handle close dialog
  const handleCloseDialog = () => {
    setCheckoutOpen(false);
    setActiveStep(0);
    setShippingDetails({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });
  };
  
  // Handle checkout button click
  const handleCheckout = () => {
    if (items.length === 0) {
      setSnackbarMessage('Your cart is empty');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    setCheckoutOpen(true);
  };
  
  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Cart
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CardMedia
                            component="img"
                            sx={{ width: 50, height: 50, objectFit: 'cover', mr: 2 }}
                            image={item.image}
                            alt={item.name}
                          />
                          <Typography>{item.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">₹{item.price}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">₹{item.price * item.quantity}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Subtotal: ₹{subtotal}
              </Typography>
              <Typography variant="subtitle1">
                Shipping: ₹{shipping}
              </Typography>
              {promoDiscount > 0 && (
                <Typography variant="subtitle1" color="success.main">
                  Discount: -₹{promoDiscount}
                </Typography>
              )}
              <Typography variant="h6">
                Total: ₹{total}
              </Typography>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={shippingDetails.name}
                  onChange={handleShippingDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={shippingDetails.email}
                  onChange={handleShippingDetailsChange}
                  required
                  error={Boolean(shippingDetails.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingDetails.email)}
                  helperText={Boolean(shippingDetails.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingDetails.email) ? "Please enter a valid email address" : ""}
                  placeholder="your.email@example.com"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleShippingDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={2}
                  value={shippingDetails.address}
                  onChange={handleShippingDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleShippingDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleShippingDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  name="zipCode"
                  value={shippingDetails.zipCode}
                  onChange={handleShippingDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={shippingDetails.country}
                  onChange={handleShippingDetailsChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Please review your order details before confirming:
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                <strong>Shipping To:</strong>
              </Typography>
              <Typography>
                {shippingDetails.name}<br />
                {shippingDetails.address}<br />
                {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}<br />
                {shippingDetails.country}
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                <strong>Order Items:</strong>
              </Typography>
              {items.map((item) => (
                <Typography key={item.id}>
                  {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                </Typography>
              ))}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Subtotal: ₹{subtotal}
              </Typography>
              <Typography variant="subtitle1">
                Shipping: ₹{shipping}
              </Typography>
              {promoDiscount > 0 && (
                <Typography variant="subtitle1" color="success.main">
                  Discount: -₹{promoDiscount}
                </Typography>
              )}
              <Typography variant="h6">
                Total: ₹{total}
              </Typography>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      
      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/products"
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {items.map((item) => (
              <Card key={item.id} sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4} sm={3}>
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.name}
                      sx={{ borderRadius: 1, aspectRatio: '3/4', objectFit: 'cover' }}
                    />
                  </Grid>
                  <Grid item xs={8} sm={9}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        by {item.author}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" color="primary">
                          ₹{item.discount > 0
                            ? ((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2)
                            : (item.price * item.quantity).toFixed(2)}
                        </Typography>
                        {item.discount > 0 && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through', ml: 1 }}
                          >
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <AddIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                          sx={{ ml: 'auto' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1">
                  Subtotal: ₹{subtotal}
                    </Typography>
                <Typography variant="subtitle1">
                  Shipping: ₹{shipping}
                    </Typography>
                  {promoDiscount > 0 && (
                  <Typography variant="subtitle1" color="success.main">
                    Discount: -₹{promoDiscount}
                        </Typography>
                  )}
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6">
                  Total: ₹{total}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  error={!!promoError}
                  helperText={promoError}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handlePromoCode}
                  sx={{ mb: 2 }}
                >
                  Apply Promo Code
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCheckout}
                  startIcon={<ShoppingCartIcon />}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Checkout Dialog */}
      <Dialog
        open={checkoutOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShoppingCartIcon sx={{ mr: 1 }} />
            Checkout
          </Box>
          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogTitle>
        <DialogContent>
          {getStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {activeStep > 0 && (
            <Button onClick={handleBack}>Back</Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart; 