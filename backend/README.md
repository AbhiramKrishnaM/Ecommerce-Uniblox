# E-commerce Backend API

A Node.js/Express backend API with PostgreSQL database using Prisma ORM.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_db_name?schema=public"
PORT=5000
ORIGIN="http://localhost:3000"
```

3. Initialize database:
```bash
npx prisma migrate dev
npx prisma db seed
```

### Products

#### Get All Products
```http
GET /api/products
```

### Cart Operations

#### Create Cart
```http
POST /api/carts
```
Request Body:
```json
{
  "userId": "optional_user_id"  // Optional, can be null for guest carts
}
```

#### Add Item to Cart
```http
POST /api/carts/:cartId/items
```
Request Body:
```json
{
  "productId": "product_uuid",
  "quantity": 1
}
```
Response:
```json
{
  "id": "uuid",
  "cartId": "cart_uuid",
  "productId": "product_uuid",
  "quantity": 1,
  "createdAt": "2024-03-20T10:00:00Z",
  "updatedAt": "2024-03-20T10:00:00Z",
  "product": {
    "id": "product_uuid",
    "name": "Product Name",
    "price": "29.99"
    // ... other product details
  }
}
```

#### Update Cart Item Quantity
```http
PATCH /api/carts/:cartId/items/:productId
```
Request Body:
```json
{
  "quantity": 2
}
```

#### Checkout Cart
```http
POST /api/carts/:cartId/checkout
```
Headers:
```http
Authorization: Bearer your_jwt_token
```
Request Body:
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "billingAddress": {  // Optional, if same as shipping
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "contactEmail": "user@example.com",
  "contactPhone": "+1234567890",
  "discountCode": "WELCOME10"  // Optional
}
```
Response:
```json
{
  "message": "Checkout successful",
  "order": {
    "id": "order_uuid",
    "userId": "user_uuid",
    "totalAmount": 150.00,
    "status": "PENDING",
    "items": [
      {
        "productId": "product_uuid",
        "quantity": 2,
        "unitPrice": 29.99
      }
    ],
    "shippingAddress": { ... },
    "billingAddress": { ... },
    "contactEmail": "user@example.com",
    "contactPhone": "+1234567890",
    "createdAt": "2024-03-20T10:00:00Z"
  }
}
```

### Authentication

#### Register New User
```http
POST /api/auth/register
```
Request Body:
```json
{
  "username": "newuser",
  "password": "password123"
}
```
Response:
```json
{
  "data": {
    "id": "user_uuid",
    "username": "newuser",
    "role": "USER"
  },
  "message": "User registered successfully",
  "code": 201
}
```

#### Login
```http
POST /api/auth/login
```
Request Body:
```json
{
  "username": "newuser",
  "password": "password123"
}
```
Response:
```json
{
  "data": {
    "user": {
      "id": "user_uuid",
      "username": "newuser",
      "role": "USER"
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful",
  "code": 200
}
```

#### Logout
```http
POST /api/auth/logout
```
Headers:
```http
Authorization: Bearer your_jwt_token
```
Response:
```json
{
  "data": null,
  "message": "Logged out successfully",
  "code": 200
}
```

#### Get User Profile
```http
GET /api/auth/profile
```
Headers:
```http
Authorization: Bearer your_jwt_token
```
Response:
```json
{
  "data": {
    "id": "user_uuid",
    "username": "newuser",
    "role": "USER",
    "createdAt": "2024-03-20T10:00:00Z"
  },
  "message": "Profile retrieved successfully",
  "code": 200
}
```

### Orders

#### Create Order (Checkout)
```http
POST /api/orders
```
Request Body:
```json
{
  "cartId": "cart_uuid",
  "userId": "optional_user_id",  // Optional
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "billingAddress": {  // Optional, if same as shipping
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "contactEmail": "user@example.com",
  "contactPhone": "+1234567890",
  "discountCode": "WELCOME10"  // Optional
}
```

### Admin Operations

#### Generate Discount Code
```http
POST /api/admin/discount-codes
```
Request Body:
```json
{
  "code": "SUMMER20",
  "discountType": "PERCENTAGE",  // "PERCENTAGE" or "FIXED_AMOUNT"
  "discountValue": 20.00,        // 20% if PERCENTAGE, $20 if FIXED_AMOUNT
  "minPurchase": 100.00,        // Optional: minimum purchase amount
  "maxUses": 100,               // Optional: maximum number of uses
  "startDate": "2024-06-01T00:00:00Z",  // Optional: defaults to now
  "endDate": "2024-08-31T23:59:59Z",    // Optional
  "isActive": true              // Optional: defaults to true
}
```
Response:
```json
{
  "id": "uuid",
  "code": "SUMMER20",
  "discountType": "PERCENTAGE",
  "discountValue": 20.00,
  "minPurchase": 100.00,
  "maxUses": 100,
  "currentUses": 0,
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-08-31T23:59:59Z",
  "isActive": true,
  "createdAt": "2024-03-20T10:00:00Z",
  "updatedAt": "2024-03-20T10:00:00Z"
}
```

### Example Test Flow with Complete Data

1. Create a cart:
```bash
curl -X POST http://localhost:5000/api/carts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123"
  }'
```

2. Add items to cart:
```bash
curl -X POST http://localhost:5000/api/carts/{cartId}/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product123",
    "quantity": 2
  }'
```

3. Complete checkout:
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": "cart123",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "contactEmail": "user@example.com",
    "contactPhone": "+1234567890",
    "discountCode": "WELCOME10"
  }'
```

4. Create custom discount code:
```bash
curl -X POST http://localhost:5000/api/admin/discount-codes \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SPECIAL25",
    "discountType": "PERCENTAGE",
    "discountValue": 25.00,
    "minPurchase": 150.00,
    "maxUses": 50,
    "endDate": "2024-12-31T23:59:59Z"
  }'


## Testing

### Prerequisites
- PostgreSQL running locally
- Node.js installed
- Postman or similar API testing tool

### Test Data
The database is seeded with:
- 30 products across different categories
- Default discount code: "WELCOME10" (10% off)


### Example Test Scenarios

1. **Add Multiple Products**
   - Create a new cart
   - Add 2-3 different products
   - Verify cart total calculation

2. **Discount Application**
   - Add products worth > $100
   - Apply WELCOME10 discount
   - Verify 10% discount is applied correctly

3. **Stock Management**
   - Create order for specific quantity
   - Verify stock is updated after order
   - Try ordering more than available stock

4. **Invalid Scenarios**
   - Try checking out empty cart
   - Try invalid discount code
   - Try invalid product ID

## Error Handling

The API returns standardized error responses:

```json
{
  "data": null,
  "message": "Error message here",
  "code": 400 // or appropriate status code
}
```

Common status codes:
- 200: Success
- 201: Created (for new resources)
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing/invalid authentication)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Server Error

Example error responses:
```json
{
  "data": null,
  "message": "Cart not found",
  "code": 404
}
```
```json
{
  "data": null,
  "message": "Authentication required",
  "code": 401
}

