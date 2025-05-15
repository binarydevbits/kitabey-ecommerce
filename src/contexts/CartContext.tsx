import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '../types/product';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getCartCount: () => number;
  cartItems: CartItem[];
  getCartTotal: () => number;
  placeOrder: (orderData: OrderData) => Promise<{ success: boolean; message: string }>;
}

interface OrderData {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      const price = item.discount > 0
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const price = item.discount > 0
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  }, [items]);

  const placeOrder = async (orderData: OrderData): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Starting order placement...');
      
      // Validate order data
      if (!orderData.customerName || !orderData.customerEmail || !orderData.shippingAddress) {
        console.error('Missing required order data', {
          name: Boolean(orderData.customerName),
          email: Boolean(orderData.customerEmail),
          address: Boolean(orderData.shippingAddress)
        });
        return { success: false, message: 'Please fill in all required fields.' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(orderData.customerEmail)) {
        console.error('Invalid email format:', orderData.customerEmail);
        return { success: false, message: 'Please enter a valid email address.' };
      }

      // Generate a unique order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated order ID:', orderId);

      // Prepare order data for email
      const emailData = {
        orderId,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail.trim().toLowerCase(), // sanitize email
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price
        })),
        totalAmount: getTotalPrice(),
        shippingAddress: orderData.shippingAddress
      };

      console.log('Sending order data to server:', emailData);
      console.log('Customer email:', emailData.customerEmail);

      // Send order confirmation email - use full URL to ensure correct endpoint
      const response = await axios.post(`${API_URL}/email/orders`, emailData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 seconds timeout
      });
      
      console.log('Server response:', response.data);

      if (response.data.success) {
        // Clear the cart after successful order
        setItems([]);
        return { 
          success: true, 
          message: `Order placed successfully! Check ${emailData.customerEmail} for your confirmation email.` 
        };
      } else {
        console.error('Server returned error:', response.data);
        return { 
          success: false, 
          message: response.data.message || 'Failed to place order. Please try again.' 
        };
      }
    } catch (error) {
      console.error('Error placing order:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
        if (error.code === 'ECONNABORTED') {
          return { success: false, message: 'Request timed out. Please try again.' };
        }
        if (!error.response) {
          return { success: false, message: 'Could not connect to the server. Please check your internet connection.' };
        }
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to connect to server. Please try again.' 
        };
      }
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getCartCount,
        cartItems: items,
        getCartTotal,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 