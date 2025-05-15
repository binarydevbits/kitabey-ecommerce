import axios from 'axios';

// API Base URL
const API_URL = 'http://localhost:5001/api/admin';

// Helper function to set user ID in headers for admin authorization
const getAuthHeaders = () => {
  const adminUser = localStorage.getItem('adminUser');
  if (!adminUser) return {};
  
  try {
    const user = JSON.parse(adminUser);
    return {
      'user-id': user.id
    };
  } catch (error) {
    console.error('Error parsing admin user data:', error);
    return {};
  }
};

// Authentication Service
export const adminAuthService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.success) {
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Authentication failed' };
    }
  },
  
  logout: () => {
    localStorage.removeItem('adminUser');
    return { success: true };
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('adminUser');
  },
  
  getUser: () => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) return null;
    
    try {
      return JSON.parse(adminUser);
    } catch (error) {
      console.error('Error parsing admin user data:', error);
      return null;
    }
  }
};

// Dashboard Service
export const dashboardService = {
  getStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch dashboard statistics' };
    }
  }
};

// Product Service
export const productService = {
  getProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch products', products: [] };
    }
  },
  
  getProduct: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch product', product: null };
    }
  },
  
  createProduct: async (productData: any) => {
    try {
      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to create product', product: null };
    }
  },
  
  updateProduct: async (id: number, productData: any) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to update product', product: null };
    }
  },
  
  deleteProduct: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to delete product', product: null };
    }
  },
  
  toggleFeatured: async (id: number, featured: boolean) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, { featured }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to update product', product: null };
    }
  }
};

// Order Service
export const orderService = {
  getOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch orders', orders: [] };
    }
  },
  
  getOrder: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch order', order: null };
    }
  },
  
  updateOrderStatus: async (id: string, statusData: any) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${id}/status`, statusData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to update order status', order: null };
    }
  }
};

// User Service
export const userService = {
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch users', users: [] };
    }
  },
  
  getUser: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to fetch user', user: null };
    }
  },
  
  createUser: async (userData: any) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to create user', user: null };
    }
  },
  
  updateUser: async (id: number, userData: any) => {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, userData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to update user', user: null };
    }
  },
  
  deleteUser: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { success: false, message: 'Failed to delete user', user: null };
    }
  }
}; 