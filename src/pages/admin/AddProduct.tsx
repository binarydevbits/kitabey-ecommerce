import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert
} from '@mui/material';
import { addNewProduct } from '../../utils/productUtils';
import { Product } from '../../types/product';
import { categories } from '../../data/products';

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    author: '',
    category: '',
    price: 0,
    discount: 0,
    description: '',
    image: '',
    rating: 0,
    reviews: 0,
    sales: 0,
    stock: 0,
    isNew: true,
    isBestSeller: false,
    isFeatured: false
  });
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'discount' || name === 'stock' ? Number(value) : value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add the new product
      const result = await addNewProduct(product as Product);
      
      if (result.success) {
        // Show success message
        setSuccessMessage(`Product "${product.name}" has been added successfully!`);
        
        // Reset form
        setProduct({
          name: '',
          author: '',
          category: '',
          price: 0,
          discount: 0,
          description: '',
          image: '',
          rating: 0,
          reviews: 0,
          sales: 0,
          stock: 0,
          isNew: true,
          isBestSeller: false,
          isFeatured: false
        });
      } else {
        // Show error message
        setSuccessMessage(result.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setSuccessMessage('Failed to add product. Please try again.');
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={product.author}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={product.category}
                  onChange={handleSelectChange}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={product.price}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount (%)"
                name="discount"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                value={product.discount}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={product.stock}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={product.image}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={product.description}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProduct; 