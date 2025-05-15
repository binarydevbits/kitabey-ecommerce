import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  useTheme,
  useMediaQuery,
  Button,
  IconButton,
  Tooltip,
  Fade,
  Paper,
  alpha,
  Stack,
  Container,
  Divider
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowForward as ArrowForwardIcon,
  Book as BookIcon,
  Search as SearchIcon,
  NavigateNext as NavigateNextIcon,
  Category as CategoryIcon,
  LocalLibrary as LocalLibraryIcon
} from '@mui/icons-material';
import { categories } from '../data/products';

const Categories: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Animation effect on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(item => {
      observer.observe(item);
    });

    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach(item => {
        observer.unobserve(item);
      });
    };
  }, []);

  const handleBrowseAllBooks = () => {
    navigate('/products');
  };

  return (
    <Box sx={{ 
      width: '100%', 
      overflow: 'hidden',
      bgcolor: '#f9f9fb'
    }}>
      {/* Hero Section - Full Width */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: { xs: '60vh', sm: '70vh', md: '75vh' },
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1
          }
        }}
      >
        <CardMedia
          component="img"
          image="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Categories Hero"
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            transform: 'scale(1.1)',
            transition: 'transform 10s ease',
            animation: 'slowZoom 20s infinite alternate',
            '@keyframes slowZoom': {
              from: { transform: 'scale(1.1)' },
              to: { transform: 'scale(1.2)' }
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            color: 'white',
            textAlign: 'center',
            px: { xs: 3, md: 4 }
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              fontWeight: 800,
              mb: 3,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 0.8s ease-out',
              '@keyframes fadeInUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              }
            }}
          >
            Explore Collections
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: '800px',
              mb: 5,
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              lineHeight: 1.6,
              fontWeight: 400,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 1s ease-out 0.2s both',
              '@keyframes fadeInUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              }
            }}
          >
            Discover our extensive collection of books across various subjects and genres. From academic textbooks to leisure reading, find the perfect book for your interests.
          </Typography>
          <Paper
            sx={{
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              maxWidth: '600px',
              width: '90%',
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              animation: 'fadeInUp 1s ease-out 0.4s both',
              '@keyframes fadeInUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              }
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1.5, fontSize: 24 }} />
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Search categories...
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Categories Title Section */}
      <Box sx={{ 
        width: '100%',
        py: { xs: 8, md: 10 },
        px: { xs: 3, sm: 5 },
        textAlign: 'center'
      }}>
        <Container maxWidth="xl">
          <Box className="animate-on-scroll" sx={{ 
            opacity: 0,
            transition: 'all 0.8s ease',
            '&.animate-in': {
              opacity: 1,
              transform: 'translateY(0)'
            },
            transform: 'translateY(30px)'
          }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                mb: 3,
                color: 'text.primary',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 100,
                  height: 5,
                  borderRadius: 5,
                  bgcolor: 'primary.main'
                }
              }}
            >
              All Book Collections
            </Typography>
            <Typography 
              variant="h6" 
              component="p" 
              sx={{ 
                maxWidth: 800,
                mx: 'auto',
                mb: 8,
                color: 'text.secondary',
                lineHeight: 1.7,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
              }}
            >
              Browse through our comprehensive collections of books curated for every field of study and interest. Each collection is carefully organized to help you find exactly what you're looking for.
            </Typography>
          </Box>

          {/* Category Stats */}
          <Box 
            className="animate-on-scroll"
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 3, md: 8 },
              mb: 10,
              opacity: 0,
              transition: 'all 0.8s ease 0.2s',
              '&.animate-in': {
                opacity: 1,
                transform: 'translateY(0)'
              },
              transform: 'translateY(30px)'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                color="primary.main" 
                sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                {categories.length}+
              </Typography>
              <Typography variant="body1" color="text.secondary">Collections</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, mx: 2 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                color="primary.main" 
                sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                10,000+
              </Typography>
              <Typography variant="body1" color="text.secondary">Books</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, mx: 2 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                color="primary.main" 
                sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                500+
              </Typography>
              <Typography variant="body1" color="text.secondary">Authors</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Categories Grid - Full Width */}
      <Box 
        sx={{ 
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          bgcolor: 'background.paper',
          py: { xs: 10, md: 15 },
          px: { xs: 3, sm: 5, md: 8 }
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid 
                item 
                key={category.id} 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3}
                className="animate-on-scroll"
                sx={{
                  opacity: 0,
                  transition: `all 0.8s ease ${0.1 * (index % 4)}s`,
                  '&.animate-in': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  },
                  transform: 'translateY(30px)'
                }}
              >
                <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card 
                    component={Link}
                    to={category.path}
                    sx={{ 
                      height: '100%',
                      textDecoration: 'none',
                      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-16px) scale(1.03)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                        '& .MuiCardMedia-root': {
                          transform: 'scale(1.1)'
                        },
                        '& .category-overlay': {
                          opacity: 1,
                          transform: 'translateY(0)'
                        },
                        '& .category-icon': {
                          transform: 'translateY(0) scale(1)',
                          opacity: 1
                        }
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', height: { xs: 220, sm: 240, md: 280 } }}>
                      <CardMedia
                        component="img"
                        height="100%"
                        image={category.image}
                        alt={category.name}
                        sx={{
                          transition: 'transform 0.7s ease',
                          filter: 'brightness(0.9)',
                          objectPosition: 'center'
                        }}
                      />
                      <Box
                        className="category-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)',
                          display: 'flex',
                          alignItems: 'flex-end',
                          p: 4,
                          opacity: 0.8,
                          transform: 'translateY(10px)',
                          transition: 'all 0.4s ease'
                        }}
                      >
                        <Box>
                          <Typography 
                            variant="h5" 
                            component="h3" 
                            sx={{ 
                              color: 'white',
                              fontWeight: 'bold',
                              mb: 1,
                              fontSize: { xs: '1.4rem', md: '1.6rem' },
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                          >
                            {category.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                            <BookIcon sx={{ mr: 1, fontSize: 20 }} />
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                              }}
                            >
                              {category.count} Books
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <IconButton 
                        className="category-icon"
                        sx={{
                          position: 'absolute',
                          top: 20,
                          right: 20,
                          bgcolor: 'primary.main',
                          color: 'white',
                          width: 48,
                          height: 48,
                          transform: 'translateY(-20px) scale(0.8)',
                          opacity: 0,
                          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                            transform: 'translateY(0) scale(1.1) !important'
                          }
                        }}
                      >
                        <CategoryIcon />
                      </IconButton>
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      <Stack 
                        direction="row" 
                        alignItems="center" 
                        justifyContent="space-between"
                        sx={{
                          color: 'primary.main',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.dark',
                            transform: 'translateX(5px)'
                          }
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                          Explore Collection
                        </Typography>
                        <NavigateNextIcon />
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {/* Bottom CTA Section */}
          <Box
            className="animate-on-scroll"
            sx={{
              mt: { xs: 10, md: 15 },
              p: { xs: 6, md: 8 },
              borderRadius: 6,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              textAlign: 'center',
              width: '100%',
              boxShadow: '0 15px 50px rgba(0,0,0,0.05)',
              backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)',
              opacity: 0,
              transition: 'all 0.8s ease',
              '&.animate-in': {
                opacity: 1,
                transform: 'translateY(0)'
              },
              transform: 'translateY(30px)'
            }}
          >
            <LocalLibraryIcon sx={{ fontSize: 60, color: 'primary.main', mb: 3, opacity: 0.8 }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Can't Find What You're Looking For?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                mb: 5,
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.7
              }}
            >
              Browse through our complete catalog or use our advanced search to find the perfect book for your needs. Our extensive collection includes books for every subject, interest, and reading level.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleBrowseAllBooks}
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: { xs: 6, md: 8 },
                py: { xs: 2, md: 2.5 },
                borderRadius: 3,
                textTransform: 'none',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 600,
                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                  transition: 'all 0.6s ease'
                },
                '&:hover': {
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                  background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  '&::after': {
                    left: '100%'
                  }
                }
              }}
            >
              Browse All Books
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Categories; 