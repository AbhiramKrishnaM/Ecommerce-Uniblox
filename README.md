# E-commerce Store

A full-stack e-commerce application with cart management, checkout functionality, and a discount coupon system.

## Overview

This application allows users to:
- Browse products
- Add items to cart
- Apply discount codes
- Checkout and place orders

Every nth order generates a discount code for 10% off that can be applied to future orders.

## Tech Stack

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (or your preferred database)

### Frontend
- React.js
- CSS/SCSS
- Context API for state management

## Project Structure

/
├── backend/ # Backend server code
│ ├── controller/ # API controllers
│ ├── routes/ # Express routes
│ ├── prisma/ # Prisma schema and migrations
│ ├── lib/ # Utility functions
│ └── server.js # Entry point
│
├── frontend/ # Frontend React application
│ ├── public/ # Static files
│ └── src/ # React source code
│ ├── components/ # Reusable UI components
│ ├── contexts/ # Context API for state management
│ ├── pages/ # Page components
│ └── services/ # API service calls
│
└── README.md # Project documentation

## Features

- **Product Management**: View and browse products
- **Cart Operations**: Add, remove, and update items in cart
- **Checkout Process**: Complete orders with shipping information
- **Discount System**: Apply discount codes at checkout
- **Admin Dashboard**: View sales statistics and manage discount codes

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Prisma and the database:
   ```
   npm install prisma @prisma/client
   npx prisma init
   ```

4. Configure your database connection in `.env`

5. Create and apply migrations:
   ```
   npx prisma migrate dev --name init
   ```

6. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### Product APIs
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

### Cart APIs
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `GET /api/cart` - Get cart contents

### Order APIs
- `POST /api/checkout` - Process checkout and create order
- `GET /api/orders` - Get user orders history

### Discount APIs
- `POST /api/discount/validate` - Validate discount code
- `GET /api/discount` - Get available discount codes (for user)

### Admin APIs
- `POST /api/admin/discount/generate` - Generate discount code
- `GET /api/admin/stats` - Get purchase statistics

## Prisma Models

The database schema includes the following models:
- Product: Represents items available for purchase
- User: Customer information
- Cart: Shopping cart for users
- CartItem: Individual items in a cart
- Order: Completed purchases
- OrderItem: Individual items in an order
- DiscountCode: Generated discount codes

## Testing

Run tests with:

```
npm test
```




