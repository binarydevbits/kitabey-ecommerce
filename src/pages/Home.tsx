import React, { useState, useEffect } from 'react';
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
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  AppBar,
  Toolbar,
  alpha,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Avatar,
  CircularProgress
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Notifications as NotificationsIcon,
  LocalShipping as LocalShippingIcon,
  AccountCircle as AccountCircleIcon,
  Category as CategoryIcon,
  Home as HomeIcon,
  LocalOffer as LocalOfferIcon,
  Logout as LogoutIcon,
  Language as LanguageIcon,
  Cached as CachedIcon,
  Security as SecurityIcon,
  SupportAgent as SupportAgentIcon,
  AccessTime as AccessTimeIcon,
  Book as BookIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Product } from '../types/product';
import { 
  categories, 
  dealsOfTheDay, 
  featuredProducts, 
  newArrivals, 
  bestSellers, 
  deals,
  trendingProducts 
} from '../data/products';
import AdminAddedProducts from '../components/AdminAddedProducts';

// Import custom images
import Banner1 from '../assets/images/banner1-alt.svg';
import Banner2 from '../assets/images/banner2-alt.svg';
import Banner3 from '../assets/images/banner3-alt.svg';
import CategoryElectronics from '../assets/images/category-electronics-alt.svg';
import CategoryFashion from '../assets/images/category-fashion-alt.svg';
import CategoryHome from '../assets/images/category-home-alt.svg';
import CategoryBooks from '../assets/images/category-books-alt.svg';
import CategoryBeauty from '../assets/images/category-beauty-alt.svg';

// Mock data for categories
const mockCategories = [
  {
    id: 1,
    name: 'Electronics',
    image: CategoryElectronics,
    path: '/category/electronics',
  },
  {
    id: 2,
    name: 'Fashion',
    image: CategoryFashion,
    path: '/category/fashion',
  },
  {
    id: 3,
    name: 'Home & Living',
    image: CategoryHome,
    path: '/category/home-living',
  },
  {
    id: 4,
    name: 'Books',
    image: CategoryBooks,
    path: '/category/books',
  },
  {
    id: 5,
    name: 'Beauty',
    image: CategoryBeauty,
    path: '/category/beauty',
  },
];

// Mock data for carousel
const carouselItems = [
  {
    id: 1,
    title: 'Summer Fashion Collection',
    description: 'Discover the latest trends in summer fashion',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Shop Now',
    buttonLink: '/category/fashion',
  },
  {
    id: 2,
    title: 'Premium Electronics',
    description: 'Explore our range of high-end gadgets',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Discover More',
    buttonLink: '/category/electronics',
  },
  {
    id: 3,
    title: 'Home Decor Collection',
    description: 'Transform your living space',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Shop Collection',
    buttonLink: '/category/home-living',
  },
  {
    id: 4,
    title: 'Book Paradise',
    description: 'Explore our vast collection of books',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Browse Books',
    buttonLink: '/category/books',
  },
  {
    id: 5,
    title: 'Beauty Essentials',
    description: 'Premium beauty and skincare products',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Shop Beauty',
    buttonLink: '/category/beauty',
  }
];

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Add new state variables
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<null | HTMLElement>(null);

  // State for snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Use cart context
  const { addToCart } = useCart();
  // Use wishlist context
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Countdown timer state
  const [countdowns, setCountdowns] = useState<{ [key: number]: { hours: number; minutes: number; seconds: number } }>({});

  // Initialize countdowns
  useEffect(() => {
    const initialCountdowns = dealsOfTheDay.reduce((acc, deal) => ({
      ...acc,
      [deal.id]: deal.countdown
    }), {});
    setCountdowns(initialCountdowns);
  }, []);

  // Update countdowns every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdowns(prev => {
        const newCountdowns = { ...prev };
        Object.keys(newCountdowns).forEach(dealId => {
          const deal = newCountdowns[Number(dealId)];
          if (deal.seconds > 0) {
            deal.seconds--;
          } else if (deal.minutes > 0) {
            deal.minutes--;
            deal.seconds = 59;
          } else if (deal.hours > 0) {
            deal.hours--;
            deal.minutes = 59;
            deal.seconds = 59;
          }
        });
        return newCountdowns;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCategoryMenuAnchor(null);
  };

  const handleCategoryMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCategoryMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setSnackbarMessage(`Added ${product.name} to cart`);
    setSnackbarOpen(true);
  };
  
  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setSnackbarMessage(`Removed ${product.name} from wishlist`);
    } else {
      addToWishlist(product);
      setSnackbarMessage(`Added ${product.name} to wishlist`);
    }
    setSnackbarOpen(true);
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    pauseOnHover: true,
    appendDots: (dots: React.ReactNode) => (
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 8, sm: 12, md: 16 },
          width: '100%',
          '& .slick-dots': {
            '& li': {
              mx: 0.5,
              '& button': {
                width: 8,
                height: 8,
                borderRadius: '50%',
                '&:before': {
                  fontSize: 8,
                  color: 'white',
                  opacity: 0.7,
                },
              },
              '&.slick-active button:before': {
                opacity: 1,
              },
            },
          },
        }}
      >
        {dots}
      </Box>
    ),
  };

  // Slider settings for different sections
  const categorySliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    cssEase: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    pauseOnHover: true,
    swipeToSlide: true,
    appendDots: (dots: React.ReactNode) => (
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10px',
          width: '100%',
          '& .slick-dots': {
            position: 'relative',
            bottom: 0,
            '& li': {
              mx: 0.7,
              '& button': {
                width: 10,
                height: 10,
                padding: 0,
                '&:before': {
                  fontSize: 10,
                  color: 'primary.main',
                  opacity: 0.4,
                  transition: 'all 0.3s ease',
                  width: 10,
                  height: 10
                },
              },
              '&.slick-active button:before': {
                opacity: 1,
                color: 'primary.main',
                transform: 'scale(1.2)',
              },
            },
          },
        }}
      >
        {dots}
      </Box>
    ),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          arrows: true,
        }
      }
    ]
  };

  const dealsSliderSettings = {
    ...categorySliderSettings,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          arrows: true,
        }
      }
    ]
  };

  // Add state for newsletter subscription
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  
  // Add function to handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscribeEmail) {
      setSubscribeError('Please enter your email address');
      return;
    }
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscribeEmail)) {
      setSubscribeError('Please enter a valid email address');
      return;
    }
    
    setSubscribing(true);
    setSubscribeError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/email/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscribeSuccess(true);
        setSubscribeEmail('');
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubscribeSuccess(false);
        }, 5000);
      } else {
        setSubscribeError(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setSubscribeError('Network error. Please try again.');
      console.error('Subscription error:', error);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <Box sx={{ 
      bgcolor: 'white',
      color: '#343a40',
      minHeight: '100vh',
      overflowX: 'hidden' // Add overflow-x: hidden to prevent horizontal scrolling
    }}>
      {/* Header has been removed */}

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        <MenuItem component={Link} to="/orders">
          <ListItemIcon>
            <LocalShippingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Orders" />
        </MenuItem>
        <MenuItem component={Link} to="/wishlist">
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Wishlist" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Categories Menu */}
      <Menu
        anchorEl={categoryMenuAnchor}
        open={Boolean(categoryMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 250,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            component={Link}
            to={`/category/${category.name.toLowerCase()}`}
            onClick={handleMenuClose}
            sx={{
              py: 1.5,
              '&:hover': {
                bgcolor: 'action.hover',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon>
              <CategoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={category.name} />
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Menu
          </Typography>
          <List>
            <ListItem component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Categories" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocalOfferIcon />
              </ListItemIcon>
              <ListItemText primary="Deals" />
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem component={Link} to="/profile">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem component={Link} to="/orders">
              <ListItemIcon>
                <LocalShippingIcon />
              </ListItemIcon>
              <ListItemText primary="My Orders" />
            </ListItem>
            <ListItem component={Link} to="/wishlist">
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="Wishlist" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Carousel */}
      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%', 
          height: { xs: '60vh', sm: '70vh', md: '85vh' },
          overflow: 'hidden',
          '& .slick-slider': {
            height: '100%',
          },
          '& .slick-list': {
            height: '100%',
          },
          '& .slick-track': {
            height: '100%',
          },
          '& .slick-slide > div': {
            height: '100%',
          },
          '& .slick-prev, & .slick-next': {
            width: { xs: 40, sm: 48, md: 56 },
            height: { xs: 40, sm: 48, md: 56 },
            zIndex: 2,
            '&:before': {
              display: 'none',
            },
            '& svg': {
              width: '100%',
              height: '100%',
              color: 'white',
              opacity: 0.8,
              transition: 'all 0.3s ease',
            },
            '&:hover svg': {
              opacity: 1,
              transform: 'scale(1.1)',
            },
          },
          '& .slick-prev': {
            left: { xs: 16, sm: 24, md: 32 },
          },
          '& .slick-next': {
            right: { xs: 16, sm: 24, md: 32 },
          },
        }}
      >
        <Slider {...sliderSettings}>
        {carouselItems.map((item) => (
            <Box
            key={item.id}
            sx={{
              position: 'relative',
                height: '100%',
                width: '100%',
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.85)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
                <Container maxWidth="xl">
            <Box
              sx={{
                      maxWidth: { xs: '100%', md: '60%', lg: '50%' },
                      pl: { xs: 2, sm: 4, md: 6 },
                      pr: { xs: 2, sm: 4 },
                      animation: 'fadeInUp 0.8s ease-out',
                      '@keyframes fadeInUp': {
                        from: {
                          opacity: 0,
                          transform: 'translateY(20px)',
                        },
                        to: {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
              }}
            >
              <Typography
                      variant={isMobile ? 'h3' : 'h1'}
                component="h1"
                gutterBottom
                      sx={{ 
                        fontWeight: 800,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        mb: { xs: 2, sm: 3 },
                        fontSize: { 
                          xs: '2rem',
                          sm: '3rem',
                          md: '4rem',
                          lg: '4.5rem'
                        },
                        color: 'white',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                      }}
              >
                {item.title}
              </Typography>
              <Typography
                variant={isMobile ? 'body1' : 'h5'}
                      sx={{ 
                        mb: { xs: 3, sm: 4, md: 5 },
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        display: { xs: 'none', sm: 'block' },
                        color: 'white',
                        fontSize: { sm: '1.2rem', md: '1.4rem' },
                        maxWidth: '80%',
                        lineHeight: 1.6,
                      }}
              >
                {item.description}
              </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                to={item.buttonLink}
                sx={{
                          px: { xs: 3, sm: 4, md: 6 },
                          py: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                          },
                }}
              >
                {item.buttonText}
              </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        component={Link}
                        to="/products"
                        sx={{
                          px: { xs: 3, sm: 4 },
                          py: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          borderColor: 'white',
                          color: 'white',
                          borderWidth: 2,
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                          display: { xs: 'none', sm: 'inline-flex' },
                        }}
                      >
                        Explore More
              </Button>
            </Box>
                  </Box>
                </Container>
              </Box>
            </Box>
        ))}
        </Slider>
      </Box>

      {/* Categories Section */}
      <Box 
        component="section"
        sx={{ 
          width: '100%',
          bgcolor: 'white',
          py: { xs: 6, md: 10 },
          px: 0, // Remove horizontal padding for full width
          mb: { xs: 0, md: 0 },
          overflow: 'hidden' // Add overflow: hidden to contain children
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: { xs: 5, md: 6 },
          px: { xs: 3, sm: 5, md: 8 } // Add padding to header only
        }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.2rem', sm: '2.7rem', md: '3.2rem' },
              background: 'linear-gradient(90deg, #2a2a72 0%, #009ffd 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            Explore Collections
          </Typography>
          <Button
            component={Link}
            to="/categories"
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
        
        <Box sx={{ 
          position: 'relative',
          // Remove negative margins that cause overflow 
          mx: 0,
          px: 0, // Full width content
          '.slick-list': { 
            overflow: 'hidden',
            pb: 6,
            pt: 3
          },
          '.slick-track': {
            display: 'flex',
            gap: 2
          },
          '.slick-slide': {
            height: 'auto',
            '& > div': {
              height: '100%',
              padding: '0 8px'
            }
          },
          '.slick-arrow': {
            width: { xs: 36, md: 44 }, // Smaller arrows
            height: { xs: 36, md: 44 }, // Smaller arrows
            bgcolor: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            zIndex: 2,
            opacity: 0.7, // Lower opacity
            '&:hover': {
              bgcolor: 'primary.main',
              opacity: 1,
              transform: 'scale(1.05)', // Smaller scale on hover
              '& svg': {
                color: 'white'
              }
            },
            '&:before': {
              display: 'none'
            },
            '&.slick-disabled': {
              opacity: 0,
              pointerEvents: 'none'
            },
            '& svg': {
              fontSize: { xs: 20, md: 26 } // Smaller icons
            }
          },
          '.slick-prev': {
            left: { xs: 10, sm: 15, md: 20 }
          },
          '.slick-next': {
            right: { xs: 10, sm: 15, md: 20 }
          }
        }}>
          <Slider {...categorySliderSettings}>
            {categories.map((category) => (
              <Box key={category.id} sx={{ height: '100%' }}>
                <Card 
                  component={Link}
                  to={`/category/${category.name.toLowerCase()}`}
                  sx={{ 
                    height: '100%',
                    position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                    borderRadius: { xs: 4, md: 6 }, // Increased border-radius
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    transform: 'translateZ(0)',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                      opacity: 0,
                      transition: 'opacity 0.4s ease-in-out'
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      '&::after': {
                        opacity: 1
                      },
                      '& .MuiCardMedia-root': {
                        transform: 'scale(1.1)'
                      },
                      '& .card-overlay': {
                        opacity: 1
                      },
                      '& .category-title': {
                        transform: 'translateY(0)',
                        opacity: 1
                      }
                    }
                  }}
                >
                  {/* Only show Popular chip on select categories - IDs 4, 8, 12, 16 */}
                  {(category.id === 4 || category.id === 8 || category.id === 12 || category.id === 16) && (
                    <Chip
                      label="Popular"
                      color="primary"
                      size="medium"
                      sx={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        zIndex: 2,
                        fontSize: '1rem',
                        py: 1,
                        px: 1.5,
                        fontWeight: 600,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                        background: 'linear-gradient(45deg, #FF3366, #FF6B6B)',
                        border: 'none'
                      }}
                    />
                  )}
                  
                  <Box sx={{ position: 'relative', height: { xs: 280, sm: 320, md: 360 } }}>
                    <CardMedia
                      component="img"
                      height="100%"
                      image={category.image}
                      alt={category.name}
                      sx={{
                        transition: 'transform 0.7s ease',
                        transformOrigin: 'center',
                        objectFit: 'cover',
                        filter: 'brightness(0.95)'
                      }}
                    />
                    <Box 
                      className="card-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
                        opacity: 0.7,
                        transition: 'opacity 0.5s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 3
                      }}
                    />
                    <Typography 
                      className="category-title"
                      variant="h4" 
                      component="h3" 
                      sx={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        color: 'white',
                        fontWeight: 800,
                        p: 3,
                        fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2rem' },
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        transform: 'translateY(8px)',
                        opacity: 0.9,
                        transition: 'all 0.4s ease',
                      }}
                    >
                      {category.name}
                    </Typography>
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
                        aria-label="quick view" 
                        component={Link}
                        to={`/category/${category.name.toLowerCase()}`}
                        sx={{ 
                          bgcolor: 'white', 
                          width: 60,
                          height: 60,
                          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                          '&:hover': { 
                            bgcolor: 'primary.main', 
                            color: 'white',
                            transform: 'scale(1.1)'
                          } 
                        }}
                      >
                        <CategoryIcon sx={{ fontSize: 28 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>

      {/* Admin-Added Products */}
      <Container maxWidth="xl" sx={{ mb: 8 }}>
        <AdminAddedProducts />
      </Container>
      
      {/* Featured Products */}
      <Box 
        component="section"
        sx={{ 
          width: '100%',
          bgcolor: 'background.paper',
          py: { xs: 6, md: 10 },
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
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
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Featured Books
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
            {featuredProducts.slice(0,8).map((product) => (
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
                      image={product.image}
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
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary" 
                      gutterBottom
                      sx={{ fontSize: '1rem' }}
                    >
                      {product.category}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={product.rating} precision={0.5} size="medium" readOnly />
                      <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviews})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {product.discount > 0 ? (
                        <>
                          <Typography 
                            variant="h5" 
                            color="primary.main" 
                            sx={{ fontWeight: 'bold', mr: 2 }}
                          >
                            ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
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
                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                          ₹{product.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        </Box>

      {/* Deals of the Day Section */}
      <Box 
        component="section"
        sx={{ 
          width: '100%',
          bgcolor: 'white',
          py: 8,
          mb: 8,
          overflow: 'hidden' // Ensure overflow is hidden
        }}
      >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
          mb: 6,
          px: { xs: 2, sm: 4, md: 8 } // Add padding to header only
          }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Deals of the Day
          </Typography>
            <Button
              component={Link}
              to="/deals"
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
          
          <Box sx={{ 
            position: 'relative', 
          px: { xs: 1, sm: 2 }, // Small padding on sides
            '.slick-list': { 
            overflow: 'hidden',
            pb: 4
          },
          '.slick-track': {
            display: 'flex',
          },
          '.slick-slide': {
            padding: '0 8px'
          },
          '.slick-arrow': {
            width: { xs: 36, md: 44 },
            height: { xs: 36, md: 44 },
            bgcolor: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            zIndex: 2,
            opacity: 0.7,
            '&:hover': {
              bgcolor: 'primary.main',
              opacity: 1,
              transform: 'scale(1.05)',
              '& svg': {
                color: 'white'
              }
            },
            '&:before': {
              display: 'none'
            },
            '&.slick-disabled': {
              opacity: 0,
              pointerEvents: 'none'
            },
            '& svg': {
              fontSize: { xs: 20, md: 26 }
            }
          },
          '.slick-prev': {
            left: { xs: 10, sm: 20, md: 30 }
          },
          '.slick-next': {
            right: { xs: 10, sm: 20, md: 30 }
            }
          }}>
            <Slider {...dealsSliderSettings}>
              {dealsOfTheDay.map((deal) => (
                <Box key={deal.id} sx={{ px: 1 }}>
                <Card 
                    sx={{ 
                      height: '100%',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 30px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Chip
                      label={`${deal.discount}% OFF`}
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
                    
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={deal.image}
                        alt={deal.name}
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
                          <FavoriteBorderIcon sx={{ fontSize: 24 }} />
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
                          onClick={() => handleAddToCart(deal)}
                        >
                          <ShoppingCartIcon sx={{ fontSize: 24 }} />
                        </IconButton>
                        <IconButton 
                          aria-label="quick view" 
                  component={Link} 
                          to={`/product/${deal.id}`}
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
                    
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="subtitle1" 
                        color="text.secondary" 
                        gutterBottom
                        sx={{ fontSize: '1rem' }}
                      >
                        {deal.category}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/product/${deal.id}`}
                  sx={{ 
                    textDecoration: 'none',
                          color: 'text.primary',
                          fontWeight: 'bold',
                          '&:hover': { color: 'primary.main' },
                          display: 'block',
                          mb: 2,
                        }}
                      >
                        {deal.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating value={deal.rating} precision={0.5} size="medium" readOnly />
                        <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                          ({deal.reviews})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography 
                          variant="h5" 
                          color="primary.main" 
                          sx={{ fontWeight: 'bold', mr: 2 }}
                        >
                          ₹{(deal.price * (1 - deal.discount / 100)).toFixed(2)}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          color="text.secondary" 
                          sx={{ textDecoration: 'line-through' }}
                        >
                          ₹{deal.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'error.main' }}>
                        <AccessTimeIcon />
                        <Typography variant="body2">
                          {countdowns[deal.id]?.hours}h {countdowns[deal.id]?.minutes}m {countdowns[deal.id]?.seconds}s
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Slider>
          </Box>
      </Box>

      {/* New Arrivals Section */}
      <Box 
        component="section"
        sx={{ 
          width: '100%',
          bgcolor: 'white',
          py: 8,
          px: { xs: 2, sm: 4 },
          mb: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 6
          }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              New Arrivals
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
            {newArrivals.map((product) => (
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
                  {product.isNew && (
                    <Chip
                      label="NEW"
                      color="primary"
                      size="medium"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 1,
                        fontSize: '1rem',
                        py: 1,
                        bgcolor: '#00c853',
                        '& .MuiChip-label': {
                          fontWeight: 600
                        }
                      }}
                    />
                  )}
                  
                  <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                      height="300"
                      image={product.image}
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
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary" 
                      gutterBottom
                      sx={{ fontSize: '1rem' }}
                    >
                      {product.category}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={product.rating} precision={0.5} size="medium" readOnly />
                      <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviews})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {product.discount > 0 ? (
                        <>
                          <Typography 
                            variant="h5" 
                            color="primary.main" 
                            sx={{ fontWeight: 'bold', mr: 2 }}
                          >
                            ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
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
                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                          ₹{product.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        </Box>

      {/* Trending Now Section */}
      <Box 
        component="section"
        sx={{ 
          width: '100%',
          bgcolor: 'white',
          py: 8,
          mb: 8,
          overflow: 'hidden' // Ensure overflow is hidden
        }}
      >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
          mb: 6,
          px: { xs: 2, sm: 4, md: 8 } // Add padding to header only
          }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Trending Now
            </Typography>
            <Button
              component={Link}
              to="/trending"
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
          
          <Box sx={{ 
            position: 'relative', 
          px: { xs: 1, sm: 2 }, // Small padding on sides
            '.slick-list': { 
            overflow: 'hidden',
            pb: 4
          },
          '.slick-track': {
            display: 'flex',
          },
          '.slick-slide': {
            padding: '0 8px'
          },
          '.slick-arrow': {
            width: { xs: 36, md: 44 },
            height: { xs: 36, md: 44 },
            bgcolor: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            zIndex: 2,
            opacity: 0.7,
            '&:hover': {
              bgcolor: 'primary.main',
              opacity: 1,
              transform: 'scale(1.05)',
              '& svg': {
                color: 'white'
              }
            },
            '&:before': {
              display: 'none'
            },
            '&.slick-disabled': {
              opacity: 0,
              pointerEvents: 'none'
            },
            '& svg': {
              fontSize: { xs: 20, md: 26 }
            }
          },
          '.slick-prev': {
            left: { xs: 10, sm: 20, md: 30 }
          },
          '.slick-next': {
            right: { xs: 10, sm: 20, md: 30 }
            }
          }}>
            <Slider {...dealsSliderSettings}>
              {(trendingProducts as Product[]).map((product: Product) => (
                <Box key={product.id} sx={{ px: 1 }}>
                  <Card 
                    sx={{ 
                    height: '100%',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 30px rgba(0,0,0,0.1)',
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
                        image={product.image}
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
                  
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary" 
                      gutterBottom
                      sx={{ fontSize: '1rem' }}
                    >
                      {product.category}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={product.rating} precision={0.5} size="medium" readOnly />
                      <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviews})
                  </Typography>
        </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {product.discount > 0 ? (
                        <>
                          <Typography 
                            variant="h5" 
                            color="primary.main" 
                            sx={{ fontWeight: 'bold', mr: 2 }}
                          >
                            ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
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
                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                          ₹{product.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
          </Box>
      </Box>

      {/* Site Info Banner - NEW */}
      <Box
        component="section"
        sx={{
          width: '100%',
          py: 8,
          mt: 6,
          mb: 0,
          background: 'linear-gradient(145deg, #f9f7f2, #f5f2e8)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h2" 
                  component="h2"
                  sx={{ 
                    fontWeight: 800, 
                    mb: 2,
                    fontSize: { xs: '2.2rem', sm: '2.5rem', md: '3rem' },
                    color: '#2c3e50',
                    lineHeight: 1.2
                  }}
                >
                  For every book shared, <br/>
                  <Typography 
                    component="span" 
                    variant="inherit" 
                    sx={{ 
                      color: 'primary.main',
                      borderBottom: '4px solid #FF6B6B',
                      pb: 0.5
                    }}
                  >
                    a story is reborn
                  </Typography>
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 400, 
                    mt: 3, 
                    color: '#5a6a7e',
                    lineHeight: 1.7,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
                  }}
                >
                  Kitabey is India's premier marketplace for books, connecting readers 
                  with millions of titles at affordable prices while promoting sustainability 
                  through our used book collection.
                </Typography>
                
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/about"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    Our Story
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/sustainability"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(63, 81, 181, 0.04)'
                      }
                    }}
                  >
                    Sustainability
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
                  Supported by
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 4,
                  alignItems: 'center',
                  opacity: 0.85
                }}>
                  {/* Placeholder logos for partners */}
                  <Box component="img" src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Partner Logo" sx={{ height: 35 }} />
                  <Box component="img" src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" alt="Partner Logo" sx={{ height: 35 }} />
                  <Box component="img" src="https://cdn-icons-png.flaticon.com/512/5968/5968885.png" alt="Partner Logo" sx={{ height: 35 }} />
                  <Box component="img" src="https://cdn-icons-png.flaticon.com/512/5968/5968865.png" alt="Partner Logo" sx={{ height: 35 }} />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                borderRadius: 4, 
                overflow: 'hidden', 
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                <CardMedia
                  component="img"
                  alt="Kitabey Community"
                  image="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  sx={{ height: 400 }}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  bgcolor: 'rgba(0,0,0,0.7)',
                  p: 3,
                  borderTop: '4px solid #FF6B6B'
                }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                    Join our community of 2M+ readers
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Discover your next favorite book and connect with book lovers across India
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Advisors & Backers Section - NEW */}
      <Box
        component="section"
        sx={{
          width: '100%',
          py: 8,
          bgcolor: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
                mb: 2
              }}
            >
              Our Advisors & Backers
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 400, 
                maxWidth: 800, 
                mx: 'auto',
                color: '#5a6a7e',
                px: 2
              }}
            >
              Guided by industry experts and supported by visionary investors who believe in our mission to make books accessible to all.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {[
              {
                name: 'Dr. Rajesh Sharma',
                role: 'Literary Advisor',
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                description: 'Former professor of Literature at Delhi University with over 25 years of experience in the publishing industry.'
              },
              {
                name: 'Priya Mehta',
                role: 'Tech Investor',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                description: 'Serial entrepreneur and angel investor with a focus on education technology and digital marketplaces.'
              },
              {
                name: 'Vikram Joshi',
                role: 'Strategic Advisor',
                image: 'https://randomuser.me/api/portraits/men/22.jpg',
                description: 'Former CEO of a major publishing house with expertise in scaling operations across South Asia.'
              },
              {
                name: 'Ananya Desai',
                role: 'Sustainability Consultant',
                image: 'https://randomuser.me/api/portraits/women/29.jpg',
                description: 'Environmental scientist specializing in sustainable business practices and circular economy initiatives.'
              }
            ].map((advisor, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    overflow: 'visible',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    position: 'relative'
                  }}>
                    <Avatar
                      src={advisor.image}
                      alt={advisor.name}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        border: '4px solid white',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        mb: 2,
                        mt: -5
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, textAlign: 'center' }}>
                      {advisor.name}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="primary" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      {advisor.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {advisor.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <IconButton size="small" sx={{ color: '#0A66C2' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                        </svg>
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#1DA1F2' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                        </svg>
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={Link}
              to="/about/team"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'rgba(63, 81, 181, 0.04)'
                }
              }}
            >
              Meet our entire team
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer Section - NEW */}
      <Box 
        component="footer"
        sx={{ 
          bgcolor: '#2c3e50',
          color: 'white',
          py: 8,
          px: { xs: 2, sm: 4 },
          mt: 'auto'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Kitabey
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                India's leading online bookstore with over 10 million titles and free delivery on orders above ₹499.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#1DA1F2' } }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </IconButton>
                <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#4267B2' } }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </IconButton>
                <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#E4405F' } }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 1-.923-1.417A3.911 3.911 0 0 1 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </IconButton>
                <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#0A66C2' } }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </IconButton>
              </Box>
              </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Quick Links
              </Typography>
              <List disablePadding>
                {['Home', 'Featured Books', 'New Arrivals', 'Trending', 'Deals', 'Gift Cards'].map((item) => (
                  <ListItem key={item} disablePadding sx={{ mb: 1 }}>
                    <Link 
                      to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: 'rgba(255,255,255,0.8)',
                          transition: 'all 0.2s ease',
                          '&:hover': { 
                            color: 'white',
                            pl: 0.5
                          }
                        }}
                      >
                        {item}
                      </Typography>
                    </Link>
                  </ListItem>
                ))}
              </List>
          </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Customer Service
              </Typography>
              <List disablePadding>
                {['Contact Us', 'Help Center', 'Return Policy', 'Shipping Info', 'Track Order', 'FAQ'].map((item) => (
                  <ListItem key={item} disablePadding sx={{ mb: 1 }}>
                    <Link 
                      to={`/${item.toLowerCase().replace(' ', '-')}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: 'rgba(255,255,255,0.8)',
                          transition: 'all 0.2s ease',
                          '&:hover': { 
                            color: 'white',
                            pl: 0.5
                          }
                        }}
                      >
                        {item}
                      </Typography>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Newsletter
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                Subscribe to receive updates, access to exclusive deals, and more.
              </Typography>
              <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField 
                  variant="outlined" 
                  placeholder="Your email address"
                  fullWidth
                  size="small"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  error={!!subscribeError}
                  helperText={subscribeError}
                  FormHelperTextProps={{ sx: { color: 'error.light' } }}
                  disabled={subscribing || subscribeSuccess}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255,255,255,0.6)',
                      opacity: 1,
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'error.light',
                    },
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={subscribing || subscribeSuccess}
                  sx={{ 
                    py: 1, 
                    textTransform: 'none',
                    background: 'linear-gradient(90deg, #FF3366, #FF6B6B)',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #FF6B6B, #FF3366)',
                      boxShadow: '0 4px 15px rgba(255, 51, 102, 0.3)'
                    }
                  }}
                >
                  {subscribing ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : subscribeSuccess ? (
                    'Subscribed!'
                  ) : (
                    'Subscribe'
                  )}
                </Button>
                {subscribeSuccess && (
                  <Typography variant="body2" sx={{ color: 'success.light', mt: 1 }}>
                    Thank you for subscribing! Check your email for confirmation.
                  </Typography>
                )}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Secure Payments
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {[
                    'https://cdn-icons-png.flaticon.com/128/196/196578.png',
                    'https://cdn-icons-png.flaticon.com/128/196/196565.png',
                    'https://cdn-icons-png.flaticon.com/128/196/196539.png',
                    'https://cdn-icons-png.flaticon.com/128/349/349228.png'
                  ].map((icon, i) => (
                    <Box 
                      key={i}
                      component="img"
                      src={icon}
                      alt="payment method"
                      sx={{ 
                        height: 24,
                        filter: 'brightness(0) invert(1)',
                        opacity: 0.8
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} Kitabey. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['Terms', 'Privacy', 'Cookies', 'Accessibility'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      transition: 'all 0.2s ease',
                      '&:hover': { color: 'white' }
                    }}
                  >
                    {item}
                  </Typography>
                </Link>
              ))}
            </Box>
        </Box>
      </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home; 