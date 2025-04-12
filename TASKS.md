# E-commerce Store MVP Tasks

## 1. Setup and Project Structure
- [ ] Initialize project repository
- [ ] Set up basic project structure (backend/frontend)
- [ ] Configure package dependencies
- [ ] Set up development environment

## 2. Data Models
- [ ] Design Product model (id, name, price, description, etc.)
- [ ] Design Cart model
- [ ] Design Order model
- [ ] Design Discount Code model
- [ ] Implement in-memory data store

## 3. Prisma Integration
- [ ] Install Prisma dependencies (prisma, @prisma/client)
- [ ] Initialize Prisma in the project
- [ ] Configure database connection
- [ ] Create Prisma schema with models for Product, Cart, Order, and Discount
- [ ] Generate Prisma client
- [ ] Create database migration
- [ ] Set up Prisma service layer for database operations

## 4. API Development - Core Features
- [ ] Create API endpoint for fetching products
- [ ] Implement add-to-cart API
- [ ] Implement remove-from-cart API
- [ ] Implement update cart quantity API
- [ ] Create checkout API
- [ ] Implement order creation functionality

## 5. Discount System
- [ ] Implement logic to track order count
- [ ] Create discount code generation for every nth order
- [ ] Implement discount code validation
- [ ] Add discount application to checkout process

## 6. Admin APIs
- [ ] Implement admin API for generating discount codes
- [ ] Create admin API for order statistics (items purchased, total amount, discounts)

## 7. UI Development (Stretch Goal)
- [ ] Create product listing page
- [ ] Implement shopping cart view
- [ ] Build checkout flow
- [ ] Add discount code input field
- [ ] Create admin dashboard for statistics

## 8. Testing
- [ ] Write unit tests for core APIs
- [ ] Test discount generation and validation
- [ ] Test checkout process with and without discounts
- [ ] Test admin endpoints

## 9. Documentation
- [ ] Write API documentation
- [ ] Create comprehensive README
- [ ] Add code comments for clarity
- [ ] Document setup instructions
