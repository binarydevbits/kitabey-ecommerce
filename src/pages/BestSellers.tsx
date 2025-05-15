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
  Tab
} from '@mui/material';
import {
  FavoriteBorder,
  ShoppingCart,
  Visibility
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { products } from '../data/products';

const BestSellers: React.FC = () => {
  const { addToCart } = useCart();
  const [page, setPage] = React.useState(1);
  const [tabValue, setTabValue] = React.useState(0);
  const productsPerPage = 12;

  // Sort products by different criteria based on tab
  const getSortedProducts = () => {
    switch (tabValue) {
      case 0: // Most Popular (based on sales)
        return [...products].sort((a, b) => b.sales - a.sales);
      case 1: // Highest Rated
        return [...products].sort((a, b) => b.rating - a.rating);
      case 2: // Most Reviews
        return [...products].sort((a, b) => b.reviews - a.reviews);
      default:
        return [...products].sort((a, b) => b.sales - a.sales);
    }
  };

  const bestSellers = getSortedProducts();

  // Pagination
  const totalPages = Math.ceil(bestSellers.length / productsPerPage);
  const paginatedProducts = bestSellers.slice(
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
            Best Sellers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover our most popular and highly rated books
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Most Popular" />
            <Tab label="Highest Rated" />
            <Tab label="Most Reviews" />
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
                  {product.discount > 0 && (
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
                  )}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h6" color="primary">
                      ₹{product.discount > 0
                        ? (product.price * (1 - product.discount / 100)).toFixed(2)
                        : product.price.toFixed(2)}
                    </Typography>
                    {product.discount > 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₹{product.price.toFixed(2)}
                      </Typography>
                    )}
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
      </Container>
    </Box>
  );
};

export default BestSellers; 