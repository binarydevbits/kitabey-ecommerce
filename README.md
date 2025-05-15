# Kitabey E-Commerce Website

A modern e-commerce website built with React, TypeScript, and Material UI.

## Features

- Responsive design that works on desktop, tablet, and mobile devices
- Product browsing with filtering and sorting options
- Product details with images, specifications, and reviews
- Shopping cart functionality
- User authentication (login/signup)
- Clean and modern UI with Material Design

## Pages

1. **Home** - Landing page with featured products and categories
2. **Product List** - Browse products with filtering and sorting options
3. **Product Detail** - View detailed product information, specifications, and reviews
4. **Cart** - Review items in cart and proceed to checkout
5. **Login/Signup** - User authentication screens

## Tech Stack

- **React** - Frontend library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Material UI** - UI components
- **Axios** - API requests (for future backend integration)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/kitabey-ecommerce.git
cd kitabey-ecommerce
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
kitabey-ecommerce/
├── public/
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── index.ts
│   │   └── product/
│   ├── context/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   └── index.ts
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
└── package.json
```

## Future Enhancements

- Backend integration with Node.js/Express
- User profile management
- Order history
- Wishlist functionality
- Payment gateway integration
- Admin dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material UI for the beautiful components
- React team for the amazing library
- TypeScript team for type safety

## Deployment on Vercel

This project is configured for easy deployment on Vercel.

1. Push your code to a GitHub repository
2. Visit [Vercel](https://vercel.com) and sign up/login with your GitHub account
3. Click "New Project" and import your GitHub repository
4. Vercel will automatically detect the project settings
5. Click "Deploy" and wait for the build to complete

The project includes a `vercel.json` configuration file that handles both the React frontend and Express backend.
