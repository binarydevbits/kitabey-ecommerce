import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Pagination,
  Stack,
  Slider,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import {
  FilterList,
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  Visibility,
  Sort,
  Shop as ShopIcon,
  LocalOffer,
  Whatshot,
  NewReleases
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { products, newArrivals, featuredProducts, bestSellers, trendingProducts } from '../data/products';
import { Product } from '../types/product';
import { Link } from 'react-router-dom';

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
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Products: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const productsPerPage = isSmall ? 6 : isMobile ? 8 : 12;

  // Get unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filter products based on search, categories, and price range
  const filteredProducts = [...products, ...newArrivals].filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'top-rated':
        return b.rating - a.rating;
      case 'newest':
        const dateA = a.dateAdded || a.createdAt || '1970-01-01';
        const dateB = b.dateAdded || b.createdAt || '1970-01-01';
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const handleToggleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const FilterDrawer = () => (
    <Drawer
      anchor="left"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 300 } }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Categories
        </Typography>
        <List>
          {categories.map(category => (
            <ListItem
              key={category}
              component="div"
              onClick={() => handleCategoryToggle(category)}
              sx={{
                cursor: 'pointer',
                bgcolor: selectedCategories.includes(category) ? 'action.selected' : 'transparent'
              }}
            >
              <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Price Range
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
            step={10}
            marks
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">₹{priceRange[0]}</Typography>
            <Typography variant="body2">₹{priceRange[1]}</Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );

  const renderProductCard = (product: Product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
          transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          },
          borderRadius: '12px',
          overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
            height="220"
                    image={product.image}
                    alt={product.name}
            sx={{ 
              objectFit: 'cover',
              transition: 'transform 0.5s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
                  />
                  {product.discount > 0 && (
                    <Chip
                      label={`${product.discount}% OFF`}
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                right: 8,
                fontWeight: 'bold'
              }}
            />
          )}
          {product.isNew && (
            <Chip
              label="NEW"
              color="success"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>
        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {product.category}
                  </Typography>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', minHeight: '60px' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {product.author}
                  </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Rating value={product.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.reviews})
                    </Typography>
                  </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
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
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCart />}
                      onClick={() => addToCart(product)}
              sx={{ 
                borderRadius: '8px',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)'
                },
                transition: 'transform 0.2s'
              }}
                    >
                      Add to Cart
                    </Button>
            <IconButton 
              onClick={() => handleToggleWishlist(product)}
              color={isInWishlist(product.id) ? "secondary" : "default"}
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              {isInWishlist(product.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
            <IconButton
              component={Link}
              to={`/product/${product.id}`}
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
                      <Visibility />
                    </IconButton>
                  </Box>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<ShopIcon />}
            component={Link}
            to={`/product/${product.id}`}
            sx={{ 
              borderRadius: '8px',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                transform: 'translateY(-2px)'
              }
            }}
          >
            View Details
          </Button>
                </CardContent>
              </Card>
            </Grid>
  );

  return (
    <Box sx={{ py: 4, px: { xs: 1, sm: 2, md: 4 } }}>
      <Box sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
        {/* Hero Section */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4,
            p: { xs: 3, md: 6 },
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: 'url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2030)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              Discover Our Collection
            </Typography>
            <Typography variant="h6" component="h2" sx={{ mb: 3, maxWidth: '800px' }}>
              Explore our vast library of books from various genres and authors. Find your next favorite read!
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                sx={{ 
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  px: 3,
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                  },
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
              >
                Browse All Books
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                sx={{ 
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  borderColor: 'white',
                  px: 3,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                component={Link}
                to="/categories"
              >
                Browse Categories
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Latest Additions Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h2" fontWeight="bold">
              Latest Additions
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {newArrivals.map(product => renderProductCard(product))}
          </Grid>
        </Box>

        {/* Main Products Section with Tabs */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            All Products
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Discover our complete collection of books
          </Typography>

          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="product tabs"
              >
                <Tab icon={<ShopIcon />} label="All Products" />
                <Tab icon={<Whatshot />} label="Trending" />
                <Tab icon={<LocalOffer />} label="Featured" />
                <Tab icon={<Favorite />} label="Best Sellers" />
                <Tab icon={<NewReleases />} label="Latest Additions" />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  variant="outlined"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ maxWidth: 300, flexGrow: 1 }}
                />
                
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="featured">Featured</MenuItem>
                    <MenuItem value="price-asc">Price: Low to High</MenuItem>
                    <MenuItem value="price-desc">Price: High to Low</MenuItem>
                    <MenuItem value="top-rated">Highest Rated</MenuItem>
                    <MenuItem value="newest">Newest First</MenuItem>
                  </Select>
                </FormControl>

                {isMobile && (
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setFilterDrawerOpen(true)}
                  >
                    Filters
                  </Button>
                )}
              </Box>

              <Grid container spacing={3}>
                {paginatedProducts.map(product => renderProductCard(product))}
        </Grid>

        {totalPages > 1 && (
                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
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

        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products found matching your criteria
            </Typography>
          </Box>
        )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                {trendingProducts.map(product => renderProductCard(product))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                {featuredProducts.map(product => renderProductCard(product))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                {bestSellers.map(product => renderProductCard(product))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                {newArrivals.map(product => renderProductCard(product))}
              </Grid>
            </TabPanel>
          </Box>
        </Box>

        <FilterDrawer />
      </Box>
    </Box>
  );
};

export default Products; 