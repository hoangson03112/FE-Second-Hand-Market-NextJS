# Product Specification Document (PRD)

## Product: Second-hand Marketplace Frontend (Next.js)

---

## 1. Overview

This is the frontend application for a second-hand marketplace built with Next.js. Users can browse products, search, login, and create listings.

---

## 2. Tech Stack

* Framework: Next.js (React)
* Styling: Tailwind CSS (optional)
* API: Express backend
* Auth: JWT stored in localStorage or cookies

---

## 3. Pages

### 3.1 Home Page (/)

* Display list of products
* Each product shows:

  * Title
  * Price
  * Short description
* Click product → go to detail page

---

### 3.2 Product Detail Page (/products/[id])

* Display:

  * Title
  * Price
  * Description
  * Seller info
* Button: "Contact Seller"

---

### 3.3 Login Page (/login)

* Input:

  * Email
  * Password
* Button: Login
* On success:

  * Save JWT
  * Redirect to homepage

---

### 3.4 Register Page (/register)

* Input:

  * Email
  * Password
* Button: Register

---

### 3.5 Create Product Page (/create)

* Requires login
* Input:

  * Title
  * Price
  * Description
  * Category
* Submit → call API

---

### 3.6 Search

* Search input on header
* Typing keyword → call API `/api/products/search?q=...`
* Show results dynamically

---

## 4. User Flows

### 4.1 Browse Products

* User visits homepage
* Products are fetched from API
* Products are displayed in list/grid

---

### 4.2 Login Flow

* User enters credentials
* Calls API `/api/auth/login`
* Receives JWT
* Stores token
* Redirects to homepage

---

### 4.3 Create Product Flow

* User must be logged in
* Fill form
* Submit → POST `/api/products`
* Redirect to homepage

---

### 4.4 View Product Detail

* Click product
* Navigate to `/products/:id`
* Fetch product data

---

## 5. API Integration

* GET /api/products
* GET /api/products/:id
* POST /api/auth/login
* POST /api/auth/register
* POST /api/products

---

## 6. Expected Behavior

* UI updates based on API responses
* Loading state while fetching
* Error message if API fails
* Redirect if unauthorized

---

## 7. Validation

* Email must be valid
* Password required
* Product fields cannot be empty
* Price must be a number

---

## 8. Edge Cases

* API returns empty list
* API error (500)
* Unauthorized access
* Invalid product ID
* Network failure

---

## 9. Notes

* Token stored in localStorage or cookies
* All API calls use JSON
* Responsive design supported

---
