# PRD Test - Frontend (UI/UX + Responsive Focus)

## Product
Second-hand Marketplace Frontend (`Next.js App Router + React`)

## Why this FE PRD is different from BE
This document prioritizes front-end quality dimensions that do not exist in backend testing:
- Layout integrity and visual hierarchy.
- Responsive behavior across breakpoints/devices.
- UX feedback (loading/empty/error/success) and interaction quality.
- Accessibility and cross-browser compatibility.
- Client routing, guard behavior, and UI-state consistency.

Backend API contract and deep domain rules are covered in `backend/PRD_Test.md`.

---

## 1) Scope and goals

### In scope
- Route-level behavior and navigation guards.
- Core buyer, seller, and admin experiences.
- Full UI rendering and interaction quality.
- Responsive and mobile usability.
- Accessibility baseline and keyboard-only navigation.
- API integration behavior and client-side error handling.

### Out of scope
- Internal API implementation details.
- Pixel-perfect design QA for every visual token.

### Success criteria
- Critical journeys run end-to-end with no dead-end UI state.
- Responsive layout has no blocking breakage on supported breakpoints.
- No critical accessibility blocker on auth, checkout, order, and admin key views.

---

## 2) Device, browser, and viewport matrix

### Desktop
- 1440x900
- 1920x1080

### Tablet
- 820x1180 (iPad portrait)
- 1024x768 (landscape)

### Mobile
- 390x844 (iPhone 12/13/14)
- 360x800 (Android baseline)

### Browsers
- Chrome (latest)
- Edge (latest)
- Firefox (latest)
- Safari (if available in QA stack)

### FE pass criteria per viewport
- No overlapping CTAs or clipped forms.
- Sticky/fixed elements do not block core actions.
- Main journeys can finish without zoom hacks/horizontal scrolling.

---

## 3) Route inventory and UI expectations

### 3.1 Public routes
- `/`: hero, category navigation, featured sections, fallback cards.
- `/products`: filters, pagination, sorting, product grid/list.
- `/products/[id]/[slug]`: media gallery, seller panel, CTA stack.
- `/categories/[slug]`, `/categories/[slug]/sub/[subId]`: category headers + product listing.
- `/search`: keyword results and no-result behavior.
- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/verify-google-email`.

### 3.2 Auth-required routes
- `/cart`, `/checkout`, `/checkout/success`, `/payment`
- `/orders`, `/orders/[id]`, `/my/orders`, `/my/orders/[id]`
- `/profile`, `/notifications`
- `/become-seller`, `/become-seller/success`

### 3.3 Seller routes
- `/sell`, `/my/listings`, `/seller`, `/seller/orders`, `/seller/payouts`

### 3.4 Admin routes
- `/admin`, `/admin/categories`, `/admin/moderation`, `/admin/notifications`
- `/admin/orders`, `/admin/payouts`, `/admin/products`, `/admin/refunds`
- `/admin/reports`, `/admin/sellers`, `/admin/users`, `/admin/audit-logs`

---

## 4) Layout and responsive requirements (FE-only critical)

### Global shell
- Header/logo/search/account actions render correctly at all breakpoints.
- Mobile menu and category navigation are reachable and closable.
- Footer remains readable and does not overlap content.

### Product list/detail
- Grid column count adapts by viewport without card distortion.
- Price/title/image maintain readable hierarchy.
- Product detail media and info stack should collapse correctly on mobile.

### Forms (auth, checkout, seller onboarding)
- Inputs never overflow container.
- Error messages stay near fields and do not push submit button off-screen.
- Keyboard on mobile does not hide active input/action button.

### Admin tables
- Desktop: full table with actionable controls visible.
- Mobile/tablet: fallback behavior (scroll container/card list) remains usable.
- Row actions stay reachable without layout break.

### Blocking defects (auto-fail)
- Cannot click primary CTA due to overlap.
- Form submit button inaccessible on supported viewport.
- Content clipped with no scroll path.

---

## 5) Accessibility requirements (FE-only)

### Keyboard
- Tab order is logical for auth, cart, checkout, and admin key pages.
- Enter/Space triggers primary button controls where expected.
- Focus indicator is visible on interactive elements.

### Semantics and assistive behavior
- Inputs have labels/placeholders that map clearly to purpose.
- Buttons/links have understandable accessible names.
- Error feedback should be perceivable (not color-only).

### Contrast and readability
- Text remains readable in normal UI states.
- Disabled/error/success states are distinguishable.

---

## 6) UI state matrix (must validate)

### Loading states
- Skeleton/spinner for home sections, catalog, order detail, admin tables.
- No frozen screen without visible progress indicator.

### Empty states
- No products, no orders, no notifications, no payouts, empty admin records.
- Empty state provides clear next action (navigate/retry/filter reset).

### Error states
- Network timeout/offline.
- 401 unauthenticated (redirect/login prompt).
- 403 forbidden (role message + safe fallback).
- 404 route/content not found.
- 429 throttled auth or actions.
- 500 server error with retry-safe UX.

### Success states
- Successful auth actions.
- Successful create/update/delete operations with clear confirmation.
- Payment/checkout success screen correctness.

---

## 7) Core FE journeys (deep E2E)

### Journey A: Discovery
1. Open `/` and navigate to `/products`.
2. Filter by category/sub-category.
3. Open product detail.
4. Validate responsive layout on mobile + desktop.

### Journey B: Auth UX
1. Register and verify messaging.
2. Login success path.
3. Login invalid credentials path.
4. Forgot/reset password happy path + error path.

### Journey C: Guard behavior
1. Guest tries `/cart`, `/orders`, `/admin`, `/sell`.
2. Verify redirect/gate UX is deterministic.
3. Wrong role behavior shows clear permission response.

### Journey D: Buyer checkout
1. Add to cart, update quantity.
2. Checkout form fill + validation.
3. Submit payment flow.
4. Reach success page + order detail visibility.

### Journey E: Post-purchase UX
1. Open order details and timeline/tracking.
2. Cancel/confirm-received eligibility presentation.
3. Refund request UI and evidence upload interactions.

### Journey F: Seller UX
1. Complete seller onboarding form UX.
2. Create/edit listing.
3. Seller orders processing UI.
4. Payout/wallet page readability and action affordance.

### Journey G: Admin UX
1. Dashboard and metrics visibility.
2. Product moderation controls.
3. User/seller/order/refund management.
4. Notifications and audit logs UX consistency.

### Journey H: Realtime UX
1. Chat open from context.
2. Send text/media.
3. Notification badge/dropdown updates.
4. Mark-read UX sync.

---

## 8) FE integration contract expectations

### API coupling
- UI handles null/partial payloads safely.
- UI does not crash when optional backend fields are missing.
- UI uses retry/fallback where appropriate.

### Client state
- Optimistic updates do not desync permanently.
- After mutation, lists/details refresh or invalidate correctly.

### Auth/session
- Expired session flows to re-auth gracefully.
- Token issues do not leave app in broken semi-auth state.

---

## 9) Validation requirements

### Auth forms
- Email format and required fields.
- Password rules and helpful inline messages.

### Listing/seller forms
- Required fields, numeric validation, file constraints.
- Prevent submit when invalid; preserve user input on recoverable error.

### Checkout/payment forms
- Required shipping/contact fields.
- Prevent duplicate submit and race clicks.

---

## 10) FE security and privacy assertions

- Protected data never appears for unauthorized user.
- Role-specific controls hidden/disabled when not allowed.
- Token tampering/expiry immediately downgrades session safely.

---

## 11) Test data requirements

- Seed users: buyer, seller, admin, blocked user.
- Products: mixed stock/status/categories.
- Orders: pending/paid/shipped/delivered/cancelled/refund variants.
- Notifications: unread/read mixed.

---

## 12) Regression priorities

### P0
- Auth screens and route guards.
- Product discovery and product detail.
- Cart -> checkout -> success -> order detail.
- Seller listing create/edit.
- Admin moderation core pages.
- Mobile layout of auth/checkout/product detail.

### P1
- Refund UX.
- Realtime notification/chat UX.
- Profile and settings.
- Seller payouts and wallet.

### P2
- Non-critical visual polish, long-tail empty states.

---

## 13) Release exit criteria (FE)

- P0 pass rate 100% on staging.
- No blocker in responsive/mobile usage for P0 journeys.
- No critical a11y blocker in auth/checkout/admin core views.
- No known permission-guard bypass in UI flows.

# PRD Test - Frontend

## Product
Second-hand Marketplace Frontend (`Next.js App Router + React`)

## Document purpose
This PRD is optimized for deep end-to-end testing. It defines journeys, UI contracts, role-based behavior, edge cases, and backend integration expectations so TestSprite can validate the full product surface.

---

## 1) Scope and goals

### In scope
- Route-level behavior and navigation guards.
- Core buyer, seller, and admin experiences.
- API integration behavior and client-side error handling.
- Checkout, order lifecycle visibility, refund UX, and notification/chat flows.
- Form validation, empty/loading/error states, and permission boundaries.

### Out of scope
- Internal backend implementation correctness (covered by backend PRD).
- Pixel-perfect visual QA for all breakpoints.

### Success criteria
- All critical user journeys are executable without dead ends.
- Guarded routes enforce authentication/role rules consistently.
- UI gives deterministic feedback for success, error, and blocked states.

---

## 2) System context

### Tech stack
- Next.js 15 App Router
- React 19
- TypeScript
- Query/state via React Query + Zustand (project usage)
- API consumption via backend `/eco-market/*`

### Runtime assumptions
- Frontend base URL: `http://localhost:3000`
- Backend base URL points to running API server
- Test environment includes seeded users/products/orders

---

## 3) Personas and permissions

### Guest
- Can browse product catalogs, category pages, search, product detail, blogs/content pages.
- Cannot access cart/checkout/orders/profile/seller/admin protected pages.

### Buyer
- Can manage cart, checkout, orders, profile, notifications, and reviews.
- Can request refunds and upload required evidence where applicable.

### Seller
- Buyer capabilities plus listing creation, listing management, seller orders, payouts/wallet.

### Admin
- Access admin dashboard and all admin feature pages (products/users/sellers/orders/refunds/reports/notifications/audit).

---

## 4) Route inventory and expected behavior

### 4.1 Public routes
- `/` Home: featured + curated listing sections, category navigation.
- `/products` Catalog listing with filters/sort.
- `/products/[id]/[slug]` Product detail with seller and action buttons.
- `/categories/[slug]` Category listing page.
- `/categories/[slug]/sub/[subId]` Sub-category listing page.
- `/search` Search results page.
- `/login` Login page.
- `/register` Register page.
- `/verify-email` Email verify page.
- `/verify-google-email` Google email verify page.
- `/forgot-password` Forgot password page.
- `/reset-password` Reset password page.

### 4.2 Auth-required routes
- `/cart`
- `/checkout`
- `/checkout/success`
- `/payment`
- `/orders`
- `/orders/[id]`
- `/my/orders`
- `/my/orders/[id]`
- `/profile`
- `/notifications`
- `/become-seller`
- `/become-seller/success`

### 4.3 Seller routes
- `/sell`
- `/my/listings`
- `/seller`
- `/seller/orders`
- `/seller/payouts`

### 4.4 Admin routes
- `/admin`
- `/admin/categories`
- `/admin/moderation`
- `/admin/notifications`
- `/admin/orders`
- `/admin/payouts`
- `/admin/products`
- `/admin/refunds`
- `/admin/reports`
- `/admin/sellers`
- `/admin/users`
- `/admin/audit-logs`

---

## 5) Core business journeys (deep E2E)

### Journey A: Guest discovery to product detail
1. Open `/`.
2. Navigate to `/products` from home.
3. Apply category/sub-category filters.
4. Open `/products/[id]/[slug]`.
5. Validate product details, seller block, and actionable CTAs.

### Journey B: Register, verify, login
1. Open `/register`, submit valid payload.
2. Validate success/verification messaging.
3. Complete `/verify-email` flow.
4. Login at `/login`.
5. Confirm authenticated header/account menus appear.

### Journey C: Protected route guard behavior
1. Open `/cart`, `/orders`, `/admin`, `/sell` as guest.
2. Assert redirect to login or explicit permission gate.
3. After login with wrong role, assert forbidden behavior is shown cleanly.

### Journey D: Buyer checkout flow
1. Login as buyer.
2. Add item from product detail to cart.
3. Update quantity in cart.
4. Proceed checkout, select address/payment details.
5. Complete payment step and verify `/checkout/success`.
6. Confirm new order visible in `/orders`.

### Journey E: Post-order actions
1. Open order detail `/orders/[id]`.
2. Validate timeline/tracking sections.
3. Attempt cancel (eligible and ineligible order variants).
4. Attempt confirm received (eligible and ineligible variants).
5. Request refund and verify result states.

### Journey F: Seller onboarding and operations
1. Login user, open `/become-seller`.
2. Submit seller onboarding (identity/bank/address terms).
3. Verify status and access to seller routes after approval.
4. Create listing from `/sell`.
5. Edit listing from `/my/listings`.
6. Process seller orders at `/seller/orders`.
7. Validate payouts/wallet at `/seller/payouts`.

### Journey G: Admin governance
1. Login as admin and open `/admin`.
2. Validate dashboard metrics.
3. Moderate product in `/admin/products`.
4. Manage users/sellers in `/admin/users` and `/admin/sellers`.
5. Review orders/refunds/reports.
6. Validate admin notifications and audit logs.

### Journey H: Realtime and communication
1. Open chat UI flow from product/order context.
2. Send/receive text and media messages.
3. Validate notifications dropdown/list updates.
4. Mark notifications read and verify UI count sync.

---

## 6) API integration contract expectations

### Auth
- Login/register/forgot/reset should surface clear success/error states.
- Token expiration should trigger re-auth flow without silent failure.

### Product and catalog
- Listing and detail endpoints must handle:
  - empty results
  - unavailable/rejected product
  - partial missing media fields

### Cart/checkout/orders
- Cart API failures must show actionable retry message.
- Checkout submit must prevent double-submit.
- Order detail must degrade gracefully if tracking data is delayed.

### Seller/admin actions
- Forbidden actions should show role-aware message, not generic crash.
- Mutations should refresh affected lists/detail views immediately.

---

## 7) UI state matrix (must validate)

### Loading states
- Skeleton/spinner appears for:
  - home featured sections
  - product lists
  - order detail
  - admin tables

### Empty states
- No products
- No orders
- No notifications
- No seller payouts
- No admin records in table pages

### Error states
- Network failure (offline / timeout)
- 401 unauthenticated
- 403 forbidden
- 404 not found
- 429 throttled actions (auth forms)
- 500 backend internal error

### Success states
- Auth success messages
- Listing/order/refund mutations success toasts
- Profile update success
- Password reset success

---

## 8) Validation rules (front-end form and UX)

### Authentication forms
- Email format valid.
- Password required and complexity policy respected.
- Friendly validation before API submit.

### Listing/seller forms
- Required fields blocked on submit when missing.
- Numeric ranges validated (price, quantity).
- File type and size constraints for uploads.

### Checkout/payment
- Required shipping/contact fields.
- Prevent submit when cart is empty.
- Prevent duplicate payment attempts.

---

## 9) Security and access assertions

- Guest cannot access protected routes directly.
- Token tampering leads to logout/redirect.
- Role-specific UI elements are hidden/disabled for unauthorized roles.
- Sensitive data is never displayed to wrong user (order/bank info/chat history).

---

## 10) Test data requirements

- Users:
  - `buyer_active`
  - `seller_active`
  - `admin_active`
  - `blocked_user`
- Products:
  - in-stock + out-of-stock
  - approved + pending/rejected variants
  - multiple categories/sub-categories
- Orders:
  - pending, paid, shipped, delivered, cancelled, refund-related
- Notifications:
  - unread and read entries

---

## 11) Regression priorities

### P0
- Login/register/recovery
- Route guards
- Product discovery -> cart -> checkout -> order detail
- Seller listing management
- Admin product moderation

### P1
- Refund UX
- Notification + chat
- Profile and account settings
- Seller payouts and wallet

### P2
- Minor UX polish regressions, long-tail empty states, non-critical copy/content checks

---

## 12) Release exit criteria

- P0 pass rate 100% on staging.
- No blocker in auth/checkout/order/admin moderation flows.
- No known permission bypass.
- All key error states render actionable user feedback.

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
