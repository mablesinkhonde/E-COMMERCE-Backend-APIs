# ShopHub - E-Commerce Platform

A complete full-stack e-commerce application built with Next.js, React, MongoDB, and JWT authentication. Includes product catalog, shopping cart, user authentication, and order management.

## Overview

This is a production-ready e-commerce platform following a 4-week implementation curriculum:

- **Week 1**: Products API & Catalog UI
- **Week 2**: User Authentication with JWT
- **Week 3**: Shopping Cart System
- **Week 4**: Orders & Checkout

## Tech Stack

### Backend
- **Node.js & Express** - API server (via Next.js Route Handlers)
- **MongoDB** - Database for products, users, orders, and carts
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS
- **ShadCN/UI** - Component library
- **Lucide Icons** - Icon library

## Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB instance (local or cloud like MongoDB Atlas)

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shophub?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=7d

# Node Environment
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Seed Sample Products (Optional)

To populate the database with sample products:

```bash
node scripts/seed-products.js
```

This will create 12 sample products across different categories.

### 4. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Visit http://localhost:3000 to see the application.

## API Endpoints

### Products
- `GET /api/products` - Get all products with optional filtering
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[itemId]` - Update item quantity
- `DELETE /api/cart/[itemId]` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status
- `DELETE /api/orders/[id]` - Cancel order

## Project Structure

```
app/
├── api/                    # API route handlers
│   ├── auth/              # Authentication endpoints
│   ├── products/          # Product endpoints
│   ├── cart/              # Shopping cart endpoints
│   └── orders/            # Order endpoints
├── products/              # Product pages
├── cart/                  # Shopping cart page
├── checkout/              # Checkout page
├── orders/                # Orders pages
├── account/               # User account page
├── login/                 # Login page
├── signup/                # Sign up page
├── layout.tsx             # Root layout
├── page.tsx               # Home/products page
└── globals.css            # Global styles

components/
├── Header.tsx             # Navigation header

lib/
├── mongodb.ts             # MongoDB connection
├── jwt.ts                 # JWT utilities
└── models/                # Mongoose models
    ├── User.ts
    ├── Product.ts
    ├── Cart.ts
    └── Order.ts

scripts/
└── seed-products.js       # Sample data seeding
```

## Features

### User Features
- Browse products by category
- View product details
- Add/remove items from cart
- Update cart quantities
- Checkout with shipping address
- User authentication (signup/login)
- View order history
- View order details
- Manage account profile

### Admin/System Features
- Product CRUD operations
- User authentication with JWT
- Order tracking
- Cart management
- Secure password storage with bcrypt

## Key Implementation Details

### Authentication Flow
1. User signs up with email and password
2. Password is hashed with bcryptjs (10 salt rounds)
3. JWT token is generated and stored in httpOnly cookie
4. Token is used to authenticate protected routes
5. Logout clears the token cookie

### Cart System
- Each user has one cart
- Cart items include quantity and price snapshots
- Total price is calculated automatically
- Items can be added, updated, or removed

### Order System
- Orders are created from cart items
- Cart is cleared after successful checkout
- Order status can be tracked (pending, processing, shipped, delivered, cancelled)
- Payment status is tracked separately

## Security Considerations

- Passwords are hashed with bcryptjs
- JWT tokens are stored in httpOnly cookies
- Database operations use parameterized queries (via Mongoose)
- Route handlers validate authentication before processing
- CORS headers are configured appropriately

## Performance Features

- Server-side rendering for SEO
- Image optimization via Next.js
- Efficient database queries with Mongoose
- Reusable components to reduce bundle size
- CSS-in-JS with Tailwind for optimal styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Ensure database user has proper permissions
- Check network access is enabled (for MongoDB Atlas)

### Authentication Not Working
- Verify `JWT_SECRET` is set
- Check cookies are enabled in browser
- Clear browser cache and cookies

### Products Not Appearing
- Run seed script: `node scripts/seed-products.js`
- Verify MongoDB connection is working

## Future Enhancements

- Email verification for signup
- Password reset functionality
- Product reviews and ratings
- Wishlist feature
- Payment gateway integration (Stripe)
- Admin dashboard
- Inventory management
- Email notifications
- Search and advanced filtering
- Product recommendations

## License

MIT License - feel free to use this for learning or as a starting point for your own project.

## Support

For issues or questions, please create an issue in the repository or contact the development team.
