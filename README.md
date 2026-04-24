# EcoMarket - Frontend (C2C Second-Hand Marketplace) ♻️

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **EcoMarket** is a high-performance, end-to-end Consumer-to-Consumer (C2C) marketplace platform designed for trading second-hand goods. This repository contains the **Frontend** source code.

Live Demo: https://www.ecomarket.io.vn *(Note: Update or remove this link if the site is currently offline)*

## ✨ Key Features

- **End-to-End Marketplace Flow:** Comprehensive UI/UX covering product listing, shopping cart, checkout, and complete order lifecycle management.
- **Wallet & Refund State Machine:** Intuitive wallet interfaces and strict UI state management for refund processes (Delivered -> Refund Requested -> Refunded) to protect wallet consistency.
- **Real-time Notifications:** Integrated Socket.IO client for instant updates on orders, risks, and revenue monitoring via an admin dashboard.
- **Shipping Integration:** Integrated with GHN (Giao Hàng Nhanh) API and webhooks for real-time shipping tracking and dynamic status updates.
- **Optimized Performance:** Fast load times utilizing Next.js, Redis/Upstash caching strategies, and Cloudinary for on-the-fly image optimization.
- **Responsive Design:** Pixel-perfect, mobile-first UI built with Tailwind CSS.

## 🛠️ Tech Stack

- **Framework:** Next.js, ReactJS
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query) / Context API
- **API Communication:** Axios, RESTful APIs
- **Real-time:** Socket.IO Client
- **Deployment & CI/CD:** Vercel

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or later recommended) and your preferred package manager (`npm`, `yarn`, or `pnpm`) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/hoangson03112/FE-Second-Hand-Market-NextJS.git](https://github.com/hoangson03112/FE-Second-Hand-Market-NextJS.git)
Navigate to the project directory:

Bash
cd FE-Second-Hand-Market-NextJS
Install dependencies:

Bash
npm install
# or yarn install / pnpm install
Set up Environment Variables:
Create a .env.local file in the root directory and configure the required variables. Example:

Đoạn mã
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GHN_API_KEY=your_ghn_api_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
Run the development server:

Bash
npm run dev
# or yarn dev / pnpm dev
Open http://localhost:3000 with your browser to see the application in action.

📂 Project Structure
Plaintext
├── public/             # Static assets (images, icons)
├── src/
│   ├── app/            # Next.js App Router (Pages, Layouts)
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API integration (Axios instances, endpoints)
│   ├── types/          # TypeScript interfaces and types
│   └── utils/          # Helper functions and constants
├── .env.example        # Example environment variables
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md
👨‍💻 Author
Vũ Hoàng Sơn

Role: Fullstack Developer

Email: hoagsonn3@gmail.com

GitHub: @hoangson03112
