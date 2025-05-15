import React, { useState } from 'react';
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
  Chip,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Drawer,
  List,
  ListItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Slider,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Pagination,
  useMediaQuery,
  useTheme,
  Paper,
  Snackbar,
  Alert,
  Stack
} from '@mui/material';
import { 
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material/Select';
import { useCart } from '../contexts/CartContext';
import { products } from '../data/products';
import { Product } from '../types/product';

// Mock data for categories
const categories = [
  'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Business', 'Self-Help'
];

const ProductList: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for filters
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryId ? [categoryId] : []
  );
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // State for snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Use cart context
  const { addToCart } = useCart();
  
  const productsPerPage = 12;
  
  // Handle price range change
  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };
  
  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };
  
  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setSnackbarMessage(`Added ${product.name} to cart`);
    setSnackbarOpen(true);
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  // Filter and sort products
  const filteredProducts = products.filter(product => {
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Filter by category
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'top-rated':
        return b.rating - a.rating;
      case 'newest':
        const dateA = a.dateAdded || a.createdAt || '1970-01-01';
        const dateB = b.dateAdded || b.createdAt || '1970-01-01';
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      default:
        return 0; // featured
    }
  });
  
  // Paginate products
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  
  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };
  
  // Render filters
  const renderFilters = () => (
    <Box sx={{ p: 2 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={toggleMobileFilters}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Search
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={10}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">₹{priceRange[0]}</Typography>
          <Typography variant="body2">₹{priceRange[1]}</Typography>
        </Box>
      </Box>
      
      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Categories
        </Typography>
        <List dense disablePadding>
          {categories.map((category) => (
            <ListItem
              key={category}
              component="div"
              sx={{
                cursor: 'pointer',
                bgcolor: selectedCategories.includes(category) ? 'action.selected' : 'transparent'
              }}
              onClick={() => handleCategoryChange(category)}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    size="small"
                  />
                }
                label={category}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Clear Filters Button */}
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={() => {
          setPriceRange([0, 1000]);
          setSelectedCategories(categoryId ? [categoryId] : []);
          setSearchQuery('');
        }}
      >
        Clear All Filters
      </Button>
    </Box>
  );
  
  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {categoryId || 'All Products'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse our collection of {categoryId ? `${categoryId} books` : 'books'}
          </Typography>
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
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                    <IconButton>
                      <FavoriteBorderIcon />
                    </IconButton>
                    <IconButton>
                      <VisibilityIcon />
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

        {paginatedProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products found in this category
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductList; 