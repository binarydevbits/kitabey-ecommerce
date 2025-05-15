import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: 1,
    name: "The Psychology of Money",
    author: "Morgan Housel",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Personal Finance",
    price: 499,
    discount: 15,
    rating: 4.8,
    reviews: 1245,
    sales: 8500,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Timeless lessons on wealth, greed, and happiness. A must-read for anyone interested in understanding the complex relationship between money and human behavior.",
    dateAdded: "2023-01-15",
    stock: 150,
    isNew: true,
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: 2,
    name: "Atomic Habits",
    author: "James Clear",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Self-Help",
    price: 699,
    discount: 0,
    rating: 4.9,
    reviews: 2890,
    sales: 12000,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. Transform your life with tiny changes that produce remarkable results.",
    dateAdded: "2023-02-01",
    stock: 200,
    isNew: false,
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: 3,
    name: "The Silent Patient",
    author: "Alex Michaelides",
    authorImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Thriller",
    price: 399,
    discount: 20,
    rating: 4.7,
    reviews: 2150,
    sales: 7500,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "A woman's act of violence against her husband - and the criminal psychotherapist who is determined to get her to talk and unravel the mystery of why she shot her husband.",
    dateAdded: "2023-03-10",
    stock: 100,
    isNew: true,
    isBestSeller: false,
    isFeatured: true
  },
  {
    id: 4,
    name: "The Midnight Library",
    author: "Matt Haig",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Fiction",
    price: 549,
    discount: 10,
    rating: 4.6,
    reviews: 1850,
    sales: 6800,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    dateAdded: "2023-04-05",
    stock: 120,
    isNew: false,
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: 5,
    name: "The Alchemist",
    author: "Paulo Coelho",
    authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Fiction",
    price: 299,
    discount: 25,
    rating: 4.5,
    reviews: 3250,
    sales: 15000,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "A shepherd boy's journey to Egypt in search of treasure becomes a journey of self-discovery. A timeless story about following your dreams.",
    dateAdded: "2023-05-15",
    stock: 180,
    isNew: false,
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: 6,
    name: "The Power of Habit",
    author: "Charles Duhigg",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Self-Help",
    price: 449,
    discount: 0,
    rating: 4.7,
    reviews: 2100,
    sales: 9200,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Why We Do What We Do in Life and Business. A fascinating exploration of the science of habit formation and how we can transform our lives.",
    dateAdded: "2023-06-01",
    stock: 140,
    isNew: true,
    isBestSeller: false,
    isFeatured: true
  },
  {
    id: 7,
    name: "The Four Winds",
    author: "Kristin Hannah",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Historical Fiction",
    price: 599,
    discount: 15,
    rating: 4.8,
    reviews: 1650,
    sales: 5800,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "A sweeping story of love, sacrifice, and survival during the Great Depression. A powerful tale of one woman's journey through hardship and hope.",
    dateAdded: "2023-07-10",
    stock: 90,
    isNew: true,
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: 8,
    name: "The Code Breaker",
    author: "Walter Isaacson",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Biography",
    price: 799,
    discount: 0,
    rating: 4.6,
    reviews: 950,
    sales: 4200,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Jennifer Doudna, Gene Editing, and the Future of the Human Race. A fascinating biography of the Nobel Prize-winning scientist who pioneered CRISPR gene editing.",
    dateAdded: "2023-08-05",
    stock: 110,
    isNew: true,
    isBestSeller: false,
    isFeatured: true
  },
  {
    id: 9,
    name: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Historical Fiction",
    price: 449,
    discount: 30,
    rating: 4.9,
    reviews: 2800,
    sales: 9500,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.",
    dateAdded: "2023-09-01",
    stock: 85,
    isNew: true,
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: 10,
    name: "Project Hail Mary",
    author: "Andy Weir",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Science Fiction",
    price: 599,
    discount: 20,
    rating: 4.8,
    reviews: 2100,
    sales: 7800,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "A lone astronaut must save humanity from a catastrophic extinction event. A thrilling space adventure from the author of The Martian.",
    dateAdded: "2023-10-15",
    stock: 120,
    isNew: true,
    isBestSeller: true,
    isFeatured: true
  }
];

// Categories data
export const categories = [
  {
    id: 1,
    name: 'Fiction',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 150,
    path: '/category/fiction'
  },
  {
    id: 2,
    name: 'Non-Fiction',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 200,
    path: '/category/non-fiction'
  },
  {
    id: 3,
    name: 'Self-Help',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 100,
    path: '/category/self-help'
  },
  {
    id: 4,
    name: 'Chemistry',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 85,
    path: '/category/chemistry'
  },
  {
    id: 5,
    name: 'Computer Science & IT',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 120,
    path: '/category/computer-science-it'
  },
  {
    id: 6,
    name: 'Mathematics & Statistics',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 95,
    path: '/category/mathematics-statistics'
  },
  {
    id: 7,
    name: 'Bio Science & Agriculture',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 75,
    path: '/category/bio-science-agriculture'
  },
  {
    id: 8,
    name: 'Fine Arts',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 60,
    path: '/category/fine-arts'
  },
  {
    id: 9,
    name: 'Foreign Languages',
    image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 70,
    path: '/category/foreign-languages'
  },
  {
    id: 10,
    name: 'Nutrition & Diet',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 55,
    path: '/category/nutrition-diet'
  },
  {
    id: 11,
    name: 'Sociology & Anthropology',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 65,
    path: '/category/sociology-anthropology'
  },
  {
    id: 12,
    name: 'Business Management',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 110,
    path: '/category/business-management'
  },
  {
    id: 13,
    name: 'English Literature',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 130,
    path: '/category/english-literature'
  },
  {
    id: 14,
    name: 'Economics',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 90,
    path: '/category/economics'
  },
  {
    id: 15,
    name: 'History',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 95,
    path: '/category/history'
  },
  {
    id: 16,
    name: 'Political Science',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 80,
    path: '/category/political-science'
  },
  {
    id: 17,
    name: 'Law & Criminology',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 85,
    path: '/category/law-criminology'
  },
  {
    id: 18,
    name: 'Engineering',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 105,
    path: '/category/engineering'
  },
  {
    id: 19,
    name: 'Physics & Astronomy',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    count: 70,
    path: '/category/physics-astronomy'
  }
];

// Filter featured products
export const featuredProducts = products.filter(product => product.isFeatured);

// Filter trending products (based on sales)
export const trendingProducts = [...products]
  .sort((a, b) => b.sales - a.sales)
  .slice(0, 8);

// Filter new arrivals
export const newArrivals: Product[] = [
  {
    id: 101,
    name: "Orange",
    author: "abhishek",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Travel",
    price: 909,
    discount: 0,
    rating: 0,
    reviews: 0,
    sales: 0,
    image: "data:image/jpeg;base64,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",
    description: "Fresh and juicy orange from the finest orchards.",
    dateAdded: "2023-11-25",
    stock: 50,
    isNew: true,
    isBestSeller: false,
    isFeatured: false
  },
  ...products
    .filter(product => product.isNew)
    .sort((a, b) => {
      const dateA = a.dateAdded || a.createdAt || '1970-01-01';
      const dateB = b.dateAdded || b.createdAt || '1970-01-01';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 7)
];

// Filter best sellers
export const bestSellers = products.filter(product => product.isBestSeller);

// Filter deals (products with discounts)
export const deals = products.filter(product => product.discount > 0);

// Deals of the day with countdown
export const dealsOfTheDay = products
  .filter(product => product.discount > 0)
  .slice(0, 5)
  .map(product => ({
    ...product,
    countdown: {
      hours: Math.floor(Math.random() * 24),
      minutes: Math.floor(Math.random() * 60),
      seconds: Math.floor(Math.random() * 60)
    }
  })); 