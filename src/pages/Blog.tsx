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
  IconButton,
  Pagination,
  Stack,
  TextField,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  FavoriteBorder,
  Share,
  BookmarkBorder,
  Search as SearchIcon,
  AccessTime,
  Person
} from '@mui/icons-material';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorImage: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Art of Reading: How to Develop a Reading Habit",
    excerpt: "Discover practical tips and strategies to cultivate a lifelong reading habit that will enrich your life and expand your knowledge.",
    content: "Reading is one of the most enriching activities we can engage in...",
    image: "https://source.unsplash.com/random/800x600/?reading",
    author: "Sarah Johnson",
    authorImage: "https://source.unsplash.com/random/100x100/?portrait",
    date: "2024-03-15",
    readTime: "5 min read",
    category: "Reading Tips",
    tags: ["Reading", "Habits", "Self-Improvement"],
    likes: 245,
    comments: 32
  },
  {
    id: 2,
    title: "Must-Read Books of 2024: A Comprehensive Guide",
    excerpt: "Explore our curated list of the most anticipated and critically acclaimed books releasing in 2024 across various genres.",
    content: "As we dive into 2024, the literary world is buzzing with excitement...",
    image: "https://source.unsplash.com/random/800x600/?books",
    author: "Michael Chen",
    authorImage: "https://source.unsplash.com/random/100x100/?man",
    date: "2024-03-14",
    readTime: "8 min read",
    category: "Book Reviews",
    tags: ["New Releases", "Book Recommendations", "2024"],
    likes: 189,
    comments: 28
  },
  {
    id: 3,
    title: "The Impact of Digital Reading on Traditional Books",
    excerpt: "An analysis of how digital reading platforms are changing the way we consume literature while preserving the essence of traditional books.",
    content: "The digital revolution has transformed many aspects of our lives...",
    image: "https://source.unsplash.com/random/800x600/?ebook",
    author: "Emma Davis",
    authorImage: "https://source.unsplash.com/random/100x100/?woman",
    date: "2024-03-13",
    readTime: "6 min read",
    category: "Technology",
    tags: ["Digital Reading", "E-books", "Technology"],
    likes: 156,
    comments: 24
  },
  // Add more blog posts as needed
];

const Blog: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const postsPerPage = 6;

  // Get unique categories
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  // Filter posts based on search query and category
  const filteredPosts = blogPosts.filter(post =>
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (!selectedCategory || post.category === selectedCategory)
  );

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Blog
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover articles about books, reading, and literary culture
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Box>

        <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="All"
            onClick={() => setSelectedCategory(null)}
            color={selectedCategory === null ? 'primary' : 'default'}
            variant={selectedCategory === null ? 'filled' : 'outlined'}
          />
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
            />
          ))}
        </Box>

        <Grid container spacing={3}>
          {paginatedPosts.map((post) => (
            <Grid item xs={12} md={6} key={post.id}>
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
                <CardMedia
                  component="img"
                  height="240"
                  image={post.image}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={post.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        {post.readTime}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h5" component="h2" gutterBottom>
                    {post.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {post.excerpt}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                      src={post.authorImage}
                      alt={post.author}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {post.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(post.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <FavoriteBorder />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {post.likes}
                        </Typography>
                      </IconButton>
                      <IconButton size="small">
                        <Share />
                      </IconButton>
                      <IconButton size="small">
                        <BookmarkBorder />
                      </IconButton>
                    </Box>
                    <Button variant="outlined" size="small">
                      Read More
                    </Button>
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

        {filteredPosts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No articles found matching your search
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Blog; 