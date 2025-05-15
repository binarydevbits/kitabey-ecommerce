import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
  IconButton,
  Tooltip,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  FavoriteRounded as FavoriteIcon
} from '@mui/icons-material';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
          border: '1px solid #eaeaea',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              My Wishlist
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </Typography>
          </Box>
          {items.length > 0 && (
            <Button 
              color="error" 
              variant="outlined" 
              onClick={clearWishlist}
              startIcon={<DeleteIcon />}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Paper>

      {items.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          border: '1px dashed #ccc',
          mt: 2
        }}>
          <FavoriteIcon color="error" sx={{ fontSize: 60, opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            You haven't added any books to your wishlist yet. Browse our collection and save items for later!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/products"
            sx={{ mt: 2 }}
          >
            Explore Books
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image || 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <IconButton 
                    aria-label="remove from wishlist"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'error.main' 
                      } 
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {product.category || 'Uncategorized'}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    component={Link} 
                    to={`/product/${product.id}`}
                    sx={{ 
                      textDecoration: 'none', 
                      color: 'text.primary',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      mb: 1,
                      height: '2.4em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    by {product.author || 'Unknown Author'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating || 0} precision={0.5} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.reviews || 0})
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', mb: 2 }}>
                    ₹{product.discount > 0 
                      ? ((product.price || 0) * (1 - (product.discount || 0) / 100)).toFixed(2)
                      : (product.price || 0).toFixed(2)
                    }
                    {product.discount > 0 && (
                      <Typography 
                        component="span"
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ textDecoration: 'line-through', ml: 1 }}
                      >
                        ₹{(product.price || 0).toFixed(2)}
                      </Typography>
                    )}
                  </Typography>
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                      sx={{ mb: 1 }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      component={Link}
                      to={`/product/${product.id}`}
                      fullWidth
                      startIcon={<VisibilityIcon />}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Wishlist; 