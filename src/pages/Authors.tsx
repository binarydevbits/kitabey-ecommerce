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
  TextField,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  FavoriteBorder,
  ShoppingCart,
  Visibility,
  Search as SearchIcon
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { products } from '../data/products';

interface Author {
  name: string;
  image: string;
  bio: string;
  books: number;
  rating: number;
  followers: number;
  genres: string[];
}

const Authors: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  const [page, setPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const productsPerPage = 12;

  // Get unique authors and their information
  const authors: Author[] = React.useMemo(() => {
    const authorMap = new Map<string, Author>();
    
    products.forEach(product => {
      if (!authorMap.has(product.author)) {
        authorMap.set(product.author, {
          name: product.author,
          image: product.authorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.author)}`,
          bio: `Award-winning author of ${product.category} books`,
          books: 0,
          rating: 0,
          followers: Math.floor(Math.random() * 10000) + 1000,
          genres: []
        });
      }
      
      const author = authorMap.get(product.author)!;
      author.books++;
      author.rating = (author.rating + product.rating) / 2;
      if (!author.genres.includes(product.category)) {
        author.genres.push(product.category);
      }
    });

    return Array.from(authorMap.values());
  }, [products]);

  // Filter authors based on search query
  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredAuthors.length / productsPerPage);
  const paginatedAuthors = filteredAuthors.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Get author's books
  const getAuthorBooks = (authorName: string) => {
    return products.filter(product => product.author === authorName);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Our Authors
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover talented authors and their amazing works
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search authors or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {paginatedAuthors.map((author) => (
            <Grid item xs={12} md={6} key={author.name}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: isMobile ? '100%' : 200,
                    height: isMobile ? 200 : 'auto',
                    objectFit: 'cover'
                  }}
                  image={author.image}
                  alt={author.name}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {author.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {author.bio}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {author.genres.map(genre => (
                        <Chip
                          key={genre}
                          label={genre}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box>
                        <Typography variant="h6">{author.books}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Books
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6">
                          {author.followers.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Followers
                        </Typography>
                      </Box>
                      <Box>
                        <Rating value={author.rating} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          Rating
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        // Navigate to author's books
                        const authorBooks = getAuthorBooks(author.name);
                        // You can implement navigation or show a modal with the books
                      }}
                    >
                      View Books
                    </Button>
                  </CardContent>
                </Box>
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

        {filteredAuthors.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No authors found matching your search
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Authors; 