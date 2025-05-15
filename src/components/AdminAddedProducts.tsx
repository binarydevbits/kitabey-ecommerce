import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Chip,
  IconButton,
  alpha,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  ArrowForward as ArrowForwardIcon,
  Shop as ShopIcon
} from '@mui/icons-material';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Product } from '../types/product';

const AdminAddedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        console.log('Fetching featured products...');
        const response = await productService.getFeaturedProducts();
        console.log('Response from getFeaturedProducts:', response);
        
        if (response.success) {
          // Sort by most recent date (createdAt or dateAdded)
          const sortedProducts = response.products.sort((a, b) => {
            const dateA = a.createdAt || a.dateAdded || '1970-01-01';
            const dateB = b.createdAt || b.dateAdded || '1970-01-01';
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
          
          setProducts(sortedProducts);
        } else {
          console.error('Error response:', response.message);
          setError(response.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Exception in fetchFeaturedProducts:', error);
        setError('An unexpected error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
  };
  
  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setSnackbarMessage(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      setSnackbarMessage(`${product.name} added to wishlist`);
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: { xs: 5, md: 6 }
        }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.2rem', sm: '2.7rem', md: '3.2rem' },
              background: 'linear-gradient(90deg, #004d40 0%, #26a69a 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            Our Latest Additions
          </Typography>
        </Box>
        <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" gutterBottom>No featured books available yet</Typography>
          <Typography variant="body1" color="text.secondary">
            The admin is working on adding exciting new titles to our collection. Check back soon for our latest additions!
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: { xs: 5, md: 6 }
      }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 800,
            fontSize: { xs: '2.2rem', sm: '2.7rem', md: '3.2rem' },
            background: 'linear-gradient(90deg, #004d40 0%, #26a69a 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}
        >
          Our Latest Additions
        </Typography>
        
        <Button
          component={Link}
          to="/products"
          endIcon={<ArrowForwardIcon />}
          color="primary"
          size="large"
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.2rem' },
            py: 1.5,
            px: 4,
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.8)})`,
            transition: 'all 0.3s ease',
            color: 'white',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
            }
          }}
        >
          View All
        </Button>
      </Box>
      
      <Grid container spacing={4}>
        {products.slice(0, 8).map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s ease',
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 30px rgba(0,0,0,0.1)',
                  '& .product-actions': {
                    opacity: 1,
                  }
                }
              }}
            >
              {product.discount > 0 && (
                <Chip
                  label={`${product.discount}% OFF`}
                  color="error"
                  size="medium"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 1,
                    fontSize: '1rem',
                    py: 1
                  }}
                />
              )}
              
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                  alt={product.name}
                  sx={{
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                <Box 
                  className="product-actions"
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    gap: 2
                  }}
                >
                  <IconButton 
                    aria-label="add to favorites" 
                    onClick={() => handleToggleWishlist(product)}
                    sx={{ 
                      bgcolor: 'white', 
                      width: 48,
                      height: 48,
                      color: isInWishlist(product.id) ? 'secondary.main' : 'inherit',
                      '&:hover': { 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        transform: 'scale(1.1)'
                      } 
                    }}
                  >
                    {isInWishlist(product.id) ? 
                      <FavoriteIcon sx={{ fontSize: 24 }} /> : 
                      <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                    }
                  </IconButton>
                  <IconButton 
                    aria-label="add to cart" 
                    sx={{ 
                      bgcolor: 'white', 
                      width: 48,
                      height: 48,
                      '&:hover': { 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        transform: 'scale(1.1)'
                      } 
                    }}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCartIcon sx={{ fontSize: 24 }} />
                  </IconButton>
                  <IconButton 
                    aria-label="quick view" 
                    component={Link} 
                    to={`/product/${product.id}`}
                    sx={{ 
                      bgcolor: 'white', 
                      width: 48,
                      height: 48,
                      '&:hover': { 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        transform: 'scale(1.1)'
                      } 
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: 24 }} />
                  </IconButton>
                </Box>
              </Box>
              
              <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ fontSize: '1rem' }}
                >
                  {product.category || 'Uncategorized'}
                </Typography>
                <Typography 
                  variant="h5" 
                  component={Link} 
                  to={`/product/${product.id}`}
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'text.primary',
                    fontWeight: 'bold',
                    '&:hover': { color: 'primary.main' },
                    display: 'block',
                    mb: 2,
                  }}
                >
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    By {product.author || 'Unknown Author'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={product.rating || 0} precision={0.5} size="medium" readOnly />
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.reviews || 0})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {product.discount > 0 ? (
                    <>
                      <Typography 
                        variant="h5" 
                        color="primary.main" 
                        sx={{ fontWeight: 'bold', mr: 2 }}
                      >
                        ₹{((product.price || 0) * (1 - (product.discount || 0) / 100)).toFixed(2)}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color="text.secondary" 
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₹{(product.price || 0).toFixed(2)}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      ₹{(product.price || 0).toFixed(2)}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ShopIcon />}
                    component={Link}
                    to={`/product/${product.id}`}
                    sx={{ mb: 2 }}
                  >
                    Shop Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminAddedProducts; 