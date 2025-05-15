import React, { useState, useEffect, useRef } from 'react';
import { featuredProducts, trendingProducts } from '../../data/products';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  InputBase, 
  Box, 
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Avatar,
  Tooltip,
  Paper,
  useTheme,
  ListItemButton
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  ShoppingCart as ShoppingCartIcon, 
  AccountCircle as AccountCircleIcon, 
  Menu as MenuIcon,
  Language as LanguageIcon,
  Favorite as FavoriteIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  LocalShipping as ShippingIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Category as CategoryIcon,
  LocalOffer as OfferIcon,
  Bookmark as BookmarkIcon,
  NewReleases as NewReleasesIcon,
  Book as BookIcon,
  MenuBook as MenuBookIcon,
  AutoStories as AutoStoriesIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  SupportAgent as SupportAgentIcon
} from '@mui/icons-material';
import { debounce } from '@mui/material/utils';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.07),
  },
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: '45ch',
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '0.95rem',
  padding: theme.spacing(0.5, 1.5),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    color: theme.palette.primary.main,
  },
}));

// Add these types after the existing SearchResult interface
interface Author {
  id: number;
  name: string;
  image: string;
}

interface Genre {
  id: number;
  name: string;
  image: string;
}

interface SearchResult {
  id: number;
  name: string;
  category: string;
  image: string;
  type: 'product' | 'author' | 'genre';
}

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Add search reference
  const searchRef = useRef<HTMLDivElement>(null);

  // State for various menus
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElCategories, setAnchorElCategories] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Use cart context
  const { getCartCount } = useCart();
  // Use wishlist context
  const { getWishlistCount } = useWishlist();
  
  // Handlers for menu opening/closing
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleOpenCategoriesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCategories(event.currentTarget);
  };
  
  const handleCloseCategoriesMenu = () => {
    setAnchorElCategories(null);
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Categories for dropdown
  const categories = [
    { name: 'Fiction', path: '/category/fiction', icon: <AutoStoriesIcon fontSize="small" color="primary" /> },
    { name: 'Non-Fiction', path: '/category/non-fiction', icon: <MenuBookIcon fontSize="small" color="primary" /> },
    { name: 'Children\'s Books', path: '/category/children', icon: <BookIcon fontSize="small" color="primary" /> },
    { name: 'Textbooks', path: '/category/textbooks', icon: <BookIcon fontSize="small" color="primary" /> },
    { name: 'Magazines', path: '/category/magazines', icon: <MenuBookIcon fontSize="small" color="primary" /> },
    { name: 'Rare Collections', path: '/category/rare', icon: <AutoStoriesIcon fontSize="small" color="primary" /> },
  ];

  // Mock data for authors and genres
  const authors: Author[] = [
    {
      id: 1,
      name: 'J.K. Rowling',
      image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 2,
      name: 'Stephen King',
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const genres = [
    {
      id: 1,
      name: 'Fiction',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 2,
      name: 'Mystery',
      image: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
  ];

  // Combined products array for search
  const allProducts = [...featuredProducts, ...trendingProducts].map(product => ({
    ...product,
    type: 'product'
  }));

  // Enhanced search function with reduced debounce delay
  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    // Immediate feedback for short queries (client-side only)
    if (query.length < 3) {
      const quickResults = allProducts
        .filter((product: any) => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5) // Limit to 5 results for quick feedback
        .map((product: any) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          type: 'product' as const
        }));
      
      setSearchResults(quickResults);
      setShowResults(true);
      setIsSearching(false);
      return;
    }

    // For longer queries, use the full search with a short delay
    setTimeout(() => {
      const results: SearchResult[] = [];
      
      // Search in products
      const productResults = allProducts
        .filter((product: any) => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        .map((product: any) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          type: 'product' as const
        }));
      results.push(...productResults);

      // Search in authors
      const authorResults = authors
        .filter(author => 
          author.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(author => ({
          id: author.id,
          name: author.name,
          category: 'Author',
          image: author.image,
          type: 'author' as const
        }));
      results.push(...authorResults);

      // Search in genres
      const genreResults = genres
        .filter(genre => 
          genre.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(genre => ({
          id: genre.id,
          name: genre.name,
          category: 'Genre',
          image: genre.image,
          type: 'genre' as const
        }));
      results.push(...genreResults);

      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, 150); // Reduced delay from 300ms to 150ms
  }, 100); // Reduced debounce delay from 300ms to 100ms

  // Handle search result click based on type
  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setSearchQuery('');
    
    switch (result.type) {
      case 'product':
        navigate(`/product/${result.id}`);
        break;
      case 'author':
        navigate(`/author/${result.id}`);
        break;
      case 'genre':
        navigate(`/genre/${result.id}`);
        break;
    }
  };

  // Handle keyboard navigation
  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  // Add click outside handler for search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          bgcolor: 'background.paper', 
          borderBottom: 1, 
          borderColor: 'divider',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar disableGutters sx={{ minHeight: { xs: 70, md: 80 }, py: 1, justifyContent: 'space-between' }}>
            {/* Left Section: Logo and Mobile Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Mobile Menu Icon */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleMobileDrawer}
                sx={{ mr: 1, display: { md: 'none' }, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
              
              {/* Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BookIcon 
                  sx={{ 
                    color: 'primary.main', 
                    mr: 1, 
                    fontSize: { xs: 28, md: 32 },
                    transform: 'rotate(-10deg)'
                  }} 
                />
                <Typography
                  variant="h5"
              component={Link}
              to="/"
              sx={{ 
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: { xs: '1.5rem', md: '1.8rem' }
                  }}
                >
                  KITABEY
                </Typography>
              </Box>
            </Box>
            
            {/* Center Section: Categories and Search */}
            <Box sx={{ 
              display: 'flex', 
              flexGrow: 1, 
              justifyContent: 'center',
              mx: { xs: 1, md: 4 },
              alignItems: 'center'
            }}>
              {/* Categories Dropdown - Desktop */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
              <Button 
                  onClick={handleOpenCategoriesMenu}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                  }}
              >
                Categories
              </Button>
                <Menu
                  anchorEl={anchorElCategories}
                  open={Boolean(anchorElCategories)}
                  onClose={handleCloseCategoriesMenu}
                  sx={{ mt: 1.5 }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      width: 240,
                      borderRadius: 2,
                      overflow: 'visible',
                      mt: 1.5,
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    }
                  }}
                  transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                >
                  {categories.map((category) => (
                    <MenuItem 
                      key={category.name} 
                      component={Link} 
                      to={category.path}
                      onClick={handleCloseCategoriesMenu}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        {category.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={category.name} 
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              
              {/* Search Bar */}
              <Search 
                ref={searchRef}
                sx={{ 
                  flexGrow: 1, 
                  maxWidth: { xs: '100%', sm: 400, md: 500, lg: 600 },
                  borderRadius: 2,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  position: 'relative'
                }}
              >
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                  placeholder="Search for books, authors, genres..."
                  inputProps={{ 
                    'aria-label': 'search',
                    onKeyDown: handleSearchKeyDown
                  }}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                
                {/* Search Results Dropdown */}
                {showResults && (searchResults.length > 0 || searchQuery) && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      maxHeight: '400px',
                      overflow: 'auto',
                    }}
                  >
                    {searchResults.length > 0 ? (
                      <>
                        <List>
                          {searchResults.map((result) => (
                            <ListItem
                              key={`${result.type}-${result.id}`}
                              disablePadding
                            >
                              <ListItemButton onClick={() => handleResultClick(result)}>
                                <ListItemIcon>
                                  <Box
                                    component="img"
                                    src={result.image}
                                    alt={result.name}
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: 1,
                                      objectFit: 'cover',
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={result.name}
                                  secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {result.type === 'product' && <ShoppingCartIcon sx={{ fontSize: 16 }} />}
                                      {result.type === 'author' && <PersonIcon sx={{ fontSize: 16 }} />}
                                      {result.type === 'genre' && <CategoryIcon sx={{ fontSize: 16 }} />}
                                      <Typography variant="body2" color="text.secondary">
                                        {result.category}
                                      </Typography>
                                    </Box>
                                  }
                                  primaryTypographyProps={{
                                    variant: 'body1',
                                    fontWeight: 500,
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                          <Button
                fullWidth
                            component={Link}
                            to={`/search?q=${encodeURIComponent(searchQuery)}`}
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => setShowResults(false)}
                          >
                            View all results
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary" gutterBottom>
                          No results found for "{searchQuery}"
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try different keywords or browse our categories
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                )}
            </Search>
            </Box>
            
            {/* Right Section: Action Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <Tooltip title="Notifications">
                  <IconButton 
                    sx={{ 
                      mx: 1, 
                      color: 'text.primary',
                      transition: 'all 0.2s',
                      '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  >
                    <StyledBadge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Wishlist">
              <IconButton 
                    component={Link} 
                    to="/wishlist"
                    sx={{ 
                      mx: 1, 
                      color: 'text.primary',
                      transition: 'all 0.2s',
                      '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  >
                    <StyledBadge badgeContent={getWishlistCount()} color="error">
                      <FavoriteIcon />
                    </StyledBadge>
              </IconButton>
                </Tooltip>
              
                <Tooltip title="Shopping Cart">
              <IconButton
                component={Link}
                to="/cart"
                    sx={{ 
                      mx: 1, 
                      color: 'text.primary',
                      transition: 'all 0.2s',
                      '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  >
                    <StyledBadge badgeContent={getCartCount()} color="error">
                  <ShoppingCartIcon />
                </StyledBadge>
              </IconButton>
                </Tooltip>
                
                <Tooltip title="Account">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ 
                      ml: 1, 
                      color: 'text.primary',
                      transition: 'all 0.2s',
                      '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {/* User Menu */}
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                sx={{ mt: 1.5 }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    width: 240,
                    borderRadius: 2,
                    overflow: 'visible',
                    mt: 1.5,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Welcome!</Typography>
                  <Typography variant="body2" color="text.secondary">Manage your account</Typography>
            </Box>
            
                <Divider />
                
                <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </MenuItem>
                
                <MenuItem component={Link} to="/orders" onClick={handleCloseUserMenu} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <ShippingIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="My Orders" />
                </MenuItem>
                
                <MenuItem component={Link} to="/wishlist" onClick={handleCloseUserMenu} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <FavoriteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Wishlist" />
                </MenuItem>
                
                <Divider />
                
                <MenuItem component={Link} to="/settings" onClick={handleCloseUserMenu} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </MenuItem>
                
                <MenuItem component={Link} to="/help" onClick={handleCloseUserMenu} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <HelpIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Help Center" />
                </MenuItem>
                
                <MenuItem component={Link} to="/admin" onClick={handleCloseUserMenu} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" primaryTypographyProps={{ color: 'primary' }} />
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleCloseUserMenu} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
              
              {/* Mobile Icons */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
                <IconButton 
                  component={Link} 
                  to="/search"
                  sx={{ color: 'text.primary' }}
                >
                  <SearchIcon />
                </IconButton>
                
              <IconButton
                component={Link}
                to="/cart"
                  sx={{ ml: 1, color: 'text.primary' }}
              >
                  <StyledBadge badgeContent={getCartCount()} color="error">
                  <ShoppingCartIcon />
                </StyledBadge>
              </IconButton>
              </Box>
            </Box>
          </Toolbar>
          
          {/* Navigation Links - Desktop */}
          <Paper
            elevation={0}
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              py: 1,
              justifyContent: 'center',
              gap: 1,
              bgcolor: 'transparent',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Button
              component={Link}
              to="/"
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                px: 1.5,
                py: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  color: theme.palette.primary.main,
                },
              }}
            >
              Home
            </Button>
            
            <Button
              component={Link}
              to="/new-arrivals"
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                px: 1.5,
                py: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  color: theme.palette.primary.main,
                },
              }}
            >
              New Arrivals
            </Button>
            
            <Button
              component={Link}
              to="/best-sellers"
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                px: 1.5,
                py: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  color: theme.palette.primary.main,
                },
              }}
            >
              Best Sellers
            </Button>
            
            <Button
              component={Link}
              to="/deals"
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                px: 1.5,
                py: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  color: theme.palette.primary.main,
                },
              }}
            >
              Deals
            </Button>
            
            <Button
              component={Link}
              to="/authors"
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                px: 1.5,
                py: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  color: theme.palette.primary.main,
                },
              }}
            >
              Authors
            </Button>
            
            <Button
              component={Link}
              to="/blog"
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                px: 1.5,
                py: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  color: theme.palette.primary.main,
                },
              }}
            >
              Blog
            </Button>
            
            <Button
              component={Link}
              to="/contact"
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                px: 1.5,
                py: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  color: theme.palette.primary.main,
                },
              }}
            >
              Contact
            </Button>
          </Paper>
        </Container>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
        sx={{
          '& .MuiDrawer-paper': { 
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookIcon 
            sx={{ 
              color: 'primary.main', 
              mr: 1, 
              fontSize: 24,
              transform: 'rotate(-10deg)'
            }} 
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            onClick={toggleMobileDrawer}
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
            }}
          >
            KITABEY
          </Typography>
    </Box>
        
        <Divider />
        
        <List>
          <ListItem 
            component={Link} 
            to="/" 
            onClick={toggleMobileDrawer}
            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          
          <ListItem 
            component={Link} 
            to="/new-arrivals" 
            onClick={toggleMobileDrawer}
            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItemIcon>
              <NewReleasesIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="New Arrivals" />
          </ListItem>
          
          <ListItem 
            component={Link} 
            to="/best-sellers" 
            onClick={toggleMobileDrawer}
            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItemIcon>
              <BookmarkIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Best Sellers" />
          </ListItem>
          
          <ListItem 
            component={Link} 
            to="/deals" 
            onClick={toggleMobileDrawer}
            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItemIcon>
              <OfferIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Deals" />
          </ListItem>
          
          <ListItem 
            component={Link} 
            to="/contact" 
            onClick={toggleMobileDrawer}
            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItemIcon>
              <SupportAgentIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Contact" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem 
            onClick={toggleMobileDrawer}
            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItemIcon>
              <CategoryIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItem>
          
          {categories.map((category) => (
            <ListItem 
              key={category.name}
              component={Link} 
              to={category.path}
              onClick={toggleMobileDrawer}
              sx={{ pl: 4, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <List>
          <ListItem 
            component={Link} 
            to="/profile" 
            onClick={toggleMobileDrawer}
            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItemIcon>
              <AccountCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="My Account" />
          </ListItem>
          
          <ListItem 
            component={Link} 
            to="/wishlist" 
            onClick={toggleMobileDrawer}
            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItemIcon>
              <FavoriteIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Wishlist" />
          </ListItem>
          
          <ListItem 
            component={Link} 
            to="/cart" 
            onClick={toggleMobileDrawer}
            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
          >
            <ListItemIcon>
              <ShoppingCartIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Header; 