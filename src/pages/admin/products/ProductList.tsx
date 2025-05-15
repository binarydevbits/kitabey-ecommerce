import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  Grid,
  Chip,
  Menu,
  MenuItem,
  TablePagination,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import { productService, adminAuthService } from '../../../services/adminService';

// Product interface to define the structure of product data
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  createdAt: string;
  rating: number;
  status: 'active' | 'inactive' | 'draft';
  author?: string;
}

// Form data interface for the product form
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  status: 'active' | 'inactive' | 'draft';
  author?: string;
}

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Initial form state for adding/editing products
  const initialFormState: ProductFormData = {
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    stock: 0,
    featured: true,
    status: 'active',
    author: ''
  };
  
  const [productForm, setProductForm] = useState<ProductFormData>(initialFormState);
  
  // Categories available for products
  const categories = [
    'Fiction',
    'Non-Fiction',
    'Literature',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Thriller',
    'Romance',
    'Biography',
    'History',
    'Children',
    'Self-Help',
    'Business',
    'Technology',
    'Comics',
    'Poetry',
    'Religion',
    'Travel',
    'Academic'
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (!adminAuthService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    fetchProducts();
  }, [navigate]);
  
  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts();
      if (response.success) {
        setProducts(response.products || []);
        setFilteredProducts(response.products || []);
      } else {
        showSnackbar(response.message || 'Failed to fetch products', 'error');
        // Set empty arrays in case of error
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar('An error occurred while fetching products', 'error');
      // Set empty arrays in case of error
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.id.toString().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(product => product.status === statusFilter);
    }
    
    setFilteredProducts(filtered);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
    setPage(0); // Reset to first page when filtering
  };
  
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0); // Reset to first page when filtering
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, productId: number) => {
    setAnchorEl(event.currentTarget);
    setCurrentProductId(productId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentProductId(null);
  };

  const openProductActionDialog = (action: 'edit' | 'delete', product: Product) => {
    setSelectedProduct(product);
    
    if (action === 'edit') {
      // Initialize the form with product details
      setProductForm({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category,
        image: product.image || '',
        stock: product.stock,
        featured: product.featured || false,
        status: product.status || 'active',
        author: product.author || ''
      });
      setOpenEditDialog(true);
    } else if (action === 'delete') {
      setOpenDeleteDialog(true);
    }
    
    handleMenuClose();
  };
  
  const handleAddDialogOpen = () => {
    setProductForm(initialFormState);
    setOpenAddDialog(true);
  };
  
  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };
  
  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedProduct(null);
  };
  
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct(null);
  };
  
  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setProductForm({
        ...productForm,
        [name]: target.checked
      });
    } else {
      setProductForm({
        ...productForm,
        [name]: type === 'number' ? Number(value) : value
      });
    }
  };
  
  const handleSelectChange = (event: SelectChangeEvent, fieldName: string) => {
    setProductForm({
      ...productForm,
      [fieldName]: event.target.value
    });
  };
  
  const handleAddProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.createProduct(productForm);
      
      if (response.success) {
        showSnackbar('Product added successfully', 'success');
        fetchProducts();
        handleAddDialogClose();
      } else {
        showSnackbar(response.message || 'Failed to add product', 'error');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showSnackbar('An error occurred while adding the product', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      setLoading(true);
      const response = await productService.updateProduct(selectedProduct.id, productForm);
      
      if (response.success) {
        showSnackbar('Product updated successfully', 'success');
        fetchProducts();
        handleEditDialogClose();
      } else {
        showSnackbar(response.message || 'Failed to update product', 'error');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showSnackbar('An error occurred while updating the product', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      setLoading(true);
      const response = await productService.deleteProduct(selectedProduct.id);
      
      if (response.success) {
        showSnackbar('Product deleted successfully', 'success');
        fetchProducts();
        handleDeleteDialogClose();
      } else {
        showSnackbar(response.message || 'Failed to delete product', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showSnackbar('An error occurred while deleting the product', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleFeatured = async (productId: number, featured: boolean) => {
    try {
      setLoading(true);
      const response = await productService.toggleFeatured(productId, !featured);
      
      if (response.success) {
        showSnackbar(`Product ${featured ? 'removed from' : 'marked as'} featured`, 'success');
        fetchProducts();
      } else {
        showSnackbar(response.message || 'Failed to update product', 'error');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showSnackbar('An error occurred while updating the product', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeader title="Product Management" />
        
        <Paper sx={{ width: '100%', mb: 2, mt: 3 }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Typography
              sx={{ flex: '1 1 100%', mb: 2 }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Products
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  id="category-filter"
                  value={categoryFilter}
                  label="Category"
                  onChange={handleCategoryFilterChange}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddDialogOpen}
              >
                Add Product
              </Button>
            </Box>
          </Toolbar>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size="medium"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">ID</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Featured</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(filteredProducts || [])
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((product) => (
                        <TableRow
                          hover
                          key={product.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell padding="checkbox">{product.id}</TableCell>
                          <TableCell>
                            {product.image ? (
                              <Box
                                component="img"
                                src={product.image}
                                alt={product.name}
                                sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: 'grey.200',
                                  borderRadius: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography variant="caption" color="textSecondary">
                                  No image
                                </Typography>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <Chip 
                              label={product.category} 
                              size="small" 
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </TableCell>
                          <TableCell align="right">₹{(product.price || 0).toLocaleString()}</TableCell>
                          <TableCell align="right">{product.stock}</TableCell>
                          <TableCell>
                            <Chip
                              label={product.status}
                              size="small"
                              color={
                                product.status === 'active'
                                  ? 'success'
                                  : product.status === 'inactive'
                                  ? 'error'
                                  : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color={product.featured ? 'primary' : 'default'}
                              onClick={() => handleToggleFeatured(product.id, product.featured)}
                            >
                              {product.featured ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              aria-label="more"
                              onClick={(event) => handleMenuOpen(event, product.id)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    {filteredProducts.length === 0 && (
                      <TableRow style={{ height: 53 }}>
                        <TableCell colSpan={9} align="center">
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={(filteredProducts || []).length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
      </Box>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => {
            const product = products.find(p => p.id === currentProductId);
            if (product) openProductActionDialog('edit', product);
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => {
            const product = products.find(p => p.id === currentProductId);
            if (product) openProductActionDialog('delete', product);
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      {/* Add Product Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Product Name"
                name="name"
                value={productForm.name}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
                error={!productForm.name}
                helperText={!productForm.name ? "Name is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={productForm.price}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Stock Quantity"
                name="stock"
                type="number"
                value={productForm.stock}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required error={!productForm.category}>
                <InputLabel id="product-category-label">Category</InputLabel>
                <Select
                  labelId="product-category-label"
                  id="product-category"
                  name="category"
                  value={productForm.category}
                  label="Category"
                  onChange={(e) => handleSelectChange(e, 'category')}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {!productForm.category && <FormHelperText>Category is required</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="product-status-label">Status</InputLabel>
                <Select
                  labelId="product-status-label"
                  id="product-status"
                  name="status"
                  value={productForm.status}
                  label="Status"
                  onChange={(e) => handleSelectChange(e, 'status')}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={productForm.image}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={productForm.author}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
                placeholder="Enter author name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={productForm.description}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={productForm.featured}
                    onChange={handleProductFormChange}
                    name="featured"
                  />
                }
                label="Featured Product"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button 
            onClick={handleAddProduct} 
            variant="contained" 
            color="primary"
            disabled={loading || !productForm.name || !productForm.category}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Product Name"
                name="name"
                value={productForm.name}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
                error={!productForm.name}
                helperText={!productForm.name ? "Name is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={productForm.price}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Stock Quantity"
                name="stock"
                type="number"
                value={productForm.stock}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required error={!productForm.category}>
                <InputLabel id="edit-product-category-label">Category</InputLabel>
                <Select
                  labelId="edit-product-category-label"
                  id="edit-product-category"
                  name="category"
                  value={productForm.category}
                  label="Category"
                  onChange={(e) => handleSelectChange(e, 'category')}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {!productForm.category && <FormHelperText>Category is required</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="edit-product-status-label">Status</InputLabel>
                <Select
                  labelId="edit-product-status-label"
                  id="edit-product-status"
                  name="status"
                  value={productForm.status}
                  label="Status"
                  onChange={(e) => handleSelectChange(e, 'status')}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={productForm.image}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={productForm.author}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
                placeholder="Enter author name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={productForm.description}
                onChange={handleProductFormChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={productForm.featured}
                    onChange={handleProductFormChange}
                    name="featured"
                  />
                }
                label="Featured Product"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button 
            onClick={handleEditProduct} 
            variant="contained" 
            color="primary"
            disabled={loading || !productForm.name || !productForm.category}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Product Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>{selectedProduct?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button 
            onClick={handleDeleteProduct} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductList; 