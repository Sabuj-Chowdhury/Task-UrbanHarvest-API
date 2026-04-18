# Task-UrbanHarvest-API

This is a Node.js Express backend API built with Prisma ORM and PostgreSQL.

## Table of Contents

- [How to Run the Project](#how-to-run-the-project)
- [Environment Variables](#environment-variables)
- [Global Response Format](#global-response-format)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-auth)
  - [User](#user-user)
  - [Admin](#admin-admin)
  - [Vendor](#vendor-vendor)
  - [Produce](#produce-produce)
  - [Orders](#orders-order)
  - [Rental & Bookings](#rental--bookings-booking)
  - [Plants](#plants-plants)
  - [Community Posts](#community-posts-posts)

---

## How to Run the Project

Follow these steps to set up and run the application locally:

1. **Clone the repository** (if you haven't already).
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory and copy the contents from `.env.example`. (See [Environment Variables](#environment-variables) below).
4. **Database Setup:**
   Ensure you have a PostgreSQL database running and updated in your `.env`. Then apply Prisma migrations and generate the client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:8000` (or your configured port).
6. **Build for Production:**
   ```bash
   npm run build
   ```

---

## Environment Variables

Create a `.env` file in the root directory based on the provided `.env.example`. Here is the required structure:

```env
NODE_ENV=development
PORT=8000

# Database Connection
# Use this for local development:
DATABASE_URL="postgresql://username:password@localhost:5432/db_name?schema=public"

# Admin Credentials (for seeding or default admin access)
ADMIN_EMAIL=admin@harvestapi.com
ADMIN_PASSWORD=123456

# Security Config
BCRYPT_SALT_ROUNDS=10

# JWT Configuration
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_EXPIRES=30d
```

---

## Global Response Format

All successful API responses follow this standard format:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Action successful",
  "data": { ... } // Or an array of objects
}
```

Most endpoints require authentication. You must include the JWT token in the `Authorization` header as a Bearer token.
```
Authorization: Bearer <your_access_token>
```

---

## API Endpoints

**Base URL:** `/api/v1`

### Authentication (`/auth`)

#### 1. Register User
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```

#### 2. Login User
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response Data:** Returns `accessToken`, `refreshToken`, and user object. Also sets cookies.

---

### User (`/user`)

#### 1. Get My Profile
- **Method:** `GET`
- **Endpoint:** `/user/me`
- **Access:** Any Authenticated User

---

### Admin (`/admin`)
*(All endpoints below require `ADMIN` role)*

- **GET `/admin/all-user`:** Get all users.
- **GET `/admin/vedonrs-application`:** Get all vendor applications/profiles.
- **GET `/admin/orders`:** Get all orders.
- **GET `/admin/produce`:** Get all produce.
- **GET `/admin/rental-spaces`:** Get all rental spaces.
- **PATCH `/admin/vendors/verify/:vendorId`:** Verify a vendor's certification.

---

### Vendor (`/vendor`)

#### 1. Apply as Vendor
- **Method:** `POST`
- **Endpoint:** `/vendor/apply`
- **Access:** Customer
- **Request Body:**
  ```json
  {
    "farmName": "Green Valley Farms",
    "farmLocation": "123 Farm Road, NY"
  }
  ```

#### 2. Add Certification
- **Method:** `POST`
- **Endpoint:** `/vendor/certifications`
- **Access:** Customer, Vendor
- **Request Body:**
  ```json
  {
    "certifyingAgency": "USDA Organic",
    "certificationDate": "2023-10-15T00:00:00.000Z"
  }
  ```

#### 3. Create Rental Space
- **Method:** `POST`
- **Endpoint:** `/vendor/rental-spaces`
- **Access:** Vendor
- **Request Body:**
  ```json
  {
    "location": "Plot 42, Green Valley",
    "size": "500 sq ft",
    "price": 150.00,
    "availability": true
  }
  ```

#### 4. Manage Rental Spaces
- **GET `/vendor/rental-spaces/my`:** Get vendor's own rental spaces. (Vendor)
- **PATCH `/vendor/rental-spaces/:id`:** Update a rental space. (Vendor)
- **DELETE `/vendor/rental-spaces/:id`:** Delete a rental space. (Vendor)

---

### Produce (`/produce`)

#### 1. Create Produce
- **Method:** `POST`
- **Endpoint:** `/produce`
- **Access:** Vendor
- **Request Body:**
  ```json
  {
    "name": "Organic Tomatoes",
    "description": "Freshly picked organic tomatoes.",
    "price": 5.99,
    "category": "Vegetables",
    "availableQuantity": 100
  }
  ```

#### 2. Get Produce
- **GET `/produce`:** Get all produce. (Public)
- **GET `/produce/:id`:** Get single produce details. (Public)
- **GET `/produce/my`:** Get vendor's own produce. (Vendor)

#### 3. Manage Produce
- **PATCH `/produce/:id`:** Update produce details. (Vendor)
- **DELETE `/produce/:id`:** Delete produce. (Vendor)

---

### Orders (`/order`)

#### 1. Create Order
- **Method:** `POST`
- **Endpoint:** `/order`
- **Access:** Customer
- **Request Body:**
  ```json
  {
    "quantity": 5,
    "produceId": "uuid-of-the-produce"
  }
  ```

#### 2. Get Orders
- **GET `/order/my`:** Get customer's orders. (Customer)
- **GET `/order/vendor`:** Get orders for vendor's produce. (Vendor)

#### 3. Update Order Status
- **Method:** `PATCH`
- **Endpoint:** `/order/:id`
- **Access:** Vendor
- *(Status updates typically managed by controller logic)*

---

### Rental & Bookings (`/booking`)

#### 1. Create Booking
- **Method:** `POST`
- **Endpoint:** `/booking/:id` (ID of the Rental Space)
- **Access:** Customer
- **Request Body:**
  ```json
  {
    "duration": 6 
  }
  ```
  *(Duration is in months, min 1, max 120)*

#### 2. Get Bookings
- **GET `/booking`:** Get all rental spaces (from booking module). (Public)
- **GET `/booking/my`:** Get customer's bookings. (Customer)
- **GET `/booking/vendor`:** Get bookings for vendor's spaces. (Vendor)

#### 3. Update Booking Status
- **Method:** `PATCH`
- **Endpoint:** `/booking/:id`
- **Access:** Vendor
- **Request Body:**
  ```json
  {
    "status": "COMPLETED" 
  }
  ```
  *(Allowed values: "COMPLETED", "CANCELLED")*

---

### Plants (`/plants`)

#### 1. Create Plant Entry
- **Method:** `POST`
- **Endpoint:** `/plants`
- **Access:** Customer
- **Request Body:**
  ```json
  {
    "name": "Basil",
    "growthStage": "Seedling",
    "healthStatus": "Good"
  }
  ```

#### 2. Manage Plants
- **GET `/plants`:** Get all plants. (Customer)
- **GET `/plants/:id`:** Get single plant. (Customer)
- **PATCH `/plants/:id`:** Update a plant entry. (Customer)

---

### Community Posts (`/posts`)

#### 1. Create Post
- **Method:** `POST`
- **Endpoint:** `/posts`
- **Access:** Admin, Vendor, Customer
- **Request Body:**
  ```json
  {
    "postContent": "This is a great day for harvesting!"
  }
  ```

#### 2. Manage Posts
- **GET `/posts`:** Get all community posts. (Public)
- **PATCH `/posts/:id`:** Update a community post. (Admin, Vendor, Customer)
- **DELETE `/posts/:id`:** Delete a community post. (Admin, Vendor, Customer)
