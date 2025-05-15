import axios from 'axios';
import { Product } from '../types/product';

const API_URL = 'http://localhost:5001/api';

export const productService = {
  getAllProducts: async (): Promise<{ success: boolean; products: Product[]; message?: string }> => {
    try {
      const response = await axios.get(`${API_URL}/admin/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, products: [], message: 'Failed to fetch products' };
    }
  },
  
  getFeaturedProducts: async (): Promise<{ success: boolean; products: Product[]; message?: string }> => {
    try {
      // Use the public route that doesn't require authentication
      const response = await axios.get(`${API_URL}/admin/public/featured-products`);
      
      // Add console logs to help debug the featured products
      if (response.data.success) {
        console.log('All products:', response.data.products.length);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return { success: false, products: [], message: 'Failed to fetch featured products' };
    }
  },
  
  getProductById: async (id: number): Promise<{ success: boolean; product: Product | null; message?: string }> => {
    try {
      const response = await axios.get(`${API_URL}/admin/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      return { success: false, product: null, message: 'Failed to fetch product' };
    }
  }
}; 