import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  IconButton,
  Pagination,
  Stack,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  FavoriteBorder,
  ShoppingCart,
  Visibility,
  LocalOffer
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { products } from '../data/products';

const Deals: React.FC = () => {
  const { addToCart } = useCart();
  const [page, setPage] = React.useState(1);
  const [tabValue, setTabValue] = React.useState(0);
  const productsPerPage = 12;

  // Filter and sort products based on tab
  const getDealProducts = () => {
    switch (tabValue) {
      case 0: // All Deals
        return [...products].filter(p => p.discount > 0);
      case 1: // Biggest Discounts
        return [...products]
          .filter(p => p.discount > 0)
          .sort((a, b) => b.discount - a.discount);
      case 2: // Under ₹500
        return [...products]
          .filter(p => p.discount > 0 && p.price * (1 - p.discount / 100) < 500);
      default:
        return [...products].filter(p => p.discount > 0);
    }
  };

  const dealProducts = getDealProducts();

  // Pagination
  const totalPages = Math.ceil(dealProducts.length / productsPerPage);
  const paginatedProducts = dealProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1); // Reset to first page when changing tabs
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Special Deals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover amazing discounts on your favorite books
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Deals" />
            <Tab label="Biggest Discounts" />
            <Tab label="Under ₹500" />
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Chip
                    label={`${product.discount}% OFF`}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: 1,
                      p: 1
                    }}
                  >
                    <Typography variant="body2" color="white" align="center">
                      Limited Time Offer!
                    </Typography>
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {product.category}
                  </Typography>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {product.author}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.reviews})
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" color="primary">
                        ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₹{product.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="error">
                      Save ₹{(product.price * (product.discount / 100)).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCart />}
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                    <IconButton>
                      <FavoriteBorder />
                    </IconButton>
                    <IconButton>
                      <Visibility />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Stack>
          </Box>
        )}

        {dealProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <LocalOffer sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No deals available at the moment
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Deals; 