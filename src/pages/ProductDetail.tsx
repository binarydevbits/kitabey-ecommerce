import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Rating, 
  Chip,
  Divider,
  TextField,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardMedia,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  Avatar,
  Paper,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Stack
} from '@mui/material';
import { 
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { products } from '../data/products';
import { Product } from '../types/product';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `product-tab-${index}`,
    'aria-controls': `product-tabpanel-${index}`,
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Find the product
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center">
          Product not found
        </Typography>
      </Container>
    );
  }

  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product);
    setSnackbarMessage('Product added to cart');
    setSnackbarOpen(true);
  };
  
  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setSnackbarMessage('Removed from wishlist');
    } else {
      addToWishlist(product);
      setSnackbarMessage('Added to wishlist');
    }
    setSnackbarOpen(true);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/products" color="inherit">
          Products
        </MuiLink>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="500"
              image={product.image}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>
        
        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            {product.discount > 0 && (
              <Chip
                label={`${product.discount}% OFF`}
                color="error"
                size="small"
                sx={{ mb: 1 }}
              />
            )}
            
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.reviews} reviews)
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Category: {product.category}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {product.discount > 0 ? (
                <>
                  <Typography
                    variant="h4"
                    color="primary.main"
                    sx={{ fontWeight: 'bold', mr: 2 }}
                  >
                    ₹{discountedPrice.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ₹{product.price.toFixed(2)}
                  </Typography>
                </>
              ) : (
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  ₹{product.price.toFixed(2)}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Quantity:
              </Typography>
                <IconButton
                onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                type="number"
                  size="small"
                sx={{ width: 60, mx: 1 }}
                inputProps={{ min: 1, max: product.stock }}
                />
                <IconButton
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                >
                  <AddIcon />
                </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                fullWidth
              >
                Add to Cart
              </Button>
              <IconButton 
                onClick={handleToggleWishlist}
                color={isInWishlist(product.id) ? "secondary" : "default"}
                sx={{ 
                  border: '1px solid',
                  borderColor: isInWishlist(product.id) ? 'secondary.main' : 'divider',
                  borderRadius: '50%',
                  p: 1
                }}
              >
                {isInWishlist(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <CheckIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      {/* Product Tabs */}
      <Box sx={{ mt: 4 }}>
          <Tabs
          value={selectedTab}
            onChange={handleTabChange}
            aria-label="product tabs"
          >
            <Tab label="Description" {...a11yProps(0)} />
            <Tab label="Specifications" {...a11yProps(1)} />
          <Tab label="Reviews" {...a11yProps(2)} />
          </Tabs>

        <TabPanel value={selectedTab} index={0}>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
        </TabPanel>
        
        <TabPanel value={selectedTab} index={1}>
          <List>
            <ListItem>
              <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                Author:
            </Typography>
              <Typography>{product.author}</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                Category:
              </Typography>
              <Typography>{product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                Rating:
            </Typography>
              <Typography>{product.rating} / 5</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                Reviews:
                          </Typography>
              <Typography>{product.reviews}</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                Sales:
                    </Typography>
              <Typography>{product.sales}</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                Stock:
                    </Typography>
              <Typography>{product.stock}</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                Date Added:
                      </Typography>
              <Typography>{product.dateAdded}</Typography>
                </ListItem>
          </List>
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Reviews ({product.reviews})
        </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Average Rating: {product.rating} / 5
                  </Typography>
          <Typography variant="body2" color="text.secondary">
            No detailed reviews available yet.
                  </Typography>
        </TabPanel>
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default ProductDetail; 