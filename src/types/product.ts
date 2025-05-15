export interface Product {
  id: number;
  name: string;
  author: string;
  authorImage?: string;
  category: string;
  price: number;
  discount: number;
  rating: number;
  reviews: number;
  sales: number;
  image: string;
  description: string;
  dateAdded?: string;
  createdAt?: string;
  stock: number;
  status?: 'active' | 'inactive' | 'draft';
  sku?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  featured?: boolean;
  variant?: string;
} 