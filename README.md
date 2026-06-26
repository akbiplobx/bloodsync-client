# 🩸 BloodSync — Blood Donation Platform

## Purpose

BloodSync is a full-stack web application designed to connect blood donors with people in need. It streamlines the entire blood donation process — from donor registration and blood request creation to volunteer coordination and admin oversight — all within a single, role-based platform.

## 🔗 Live URL

**[https://bloodsync-client.vercel.app](https://bloodsync-client.vercel.app)**

## 📁 Repositories

- **Client Side:** [https://github.com/akbiplobx/bloodsync-client](https://github.com/akbiplobx/bloodsync-client)
- **Server Side:** [https://github.com/akbiplobx/bloodsync-server](https://github.com/akbiplobx/bloodsync-server)

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Email/password-based registration and login
- JWT-based route protection for private APIs
- Role-based access control: **Admin**, **Donor**, and **Volunteer**

### 👤 User Roles
- **Admin** — Full access: manage users, blood requests, funding, and content
- **Donor** — Register, create and manage own blood donation requests
- **Volunteer** — View and update donation request statuses

### 🏠 Public Pages
- **Home Page** — Banner with donor join & search CTAs, featured section, contact form, footer
- **Blood Donation Requests** — View all pending requests (public)
- **Search Donors** — Filter donors by blood group, district, and upazila
- **Funding Page** — View all donations made to the organization

### 📊 Dashboard (Private)
- **Profile Page** — View and edit personal info (name, avatar, blood group, district, upazila)
- **Donor Dashboard** — Recent donation requests, create new requests, manage all own requests
- **Admin Dashboard** — User management (block/unblock, role assignment), all donation requests, statistics cards
- **Volunteer Dashboard** — View all requests, update donation statuses

### 🩸 Donation Request Features
- Create, edit, delete blood donation requests
- Status flow: `pending → inprogress → done / canceled`
- Filter by status (pending, inprogress, done, canceled)
- Pagination on request tables

### 💳 Funding (Stripe Integration)
- Users can donate money to the organization via Stripe
- Funding history shown in tabular format with donor name, amount, and date

### 📍 Bangladesh Geo Data
- Cascading district → upazila selectors using real Bangladesh geocode data
- Covers all districts and upazilas

---

## 📦 NPM Packages Used

### Client Side
| Package | Purpose |
|---|---|
| `next` | React framework (App Router) |
| `react` / `react-dom` | UI library |
| `better-auth` | Authentication (client-side) |
| `@heroui/react` | UI component library (v3) |
| `@stripe/react-stripe-js` | Stripe payment UI |
| `@stripe/stripe-js` | Stripe.js loader |
| `framer-motion` | Animations |
| `react-hot-toast` | Toast notifications |
| `react-icons` | Icon library |
| `sweetalert2` | Confirmation modals |
| `tailwindcss` | Utility-first CSS |

### Server Side
| Package | Purpose |
|---|---|
| `express` | Node.js web framework |
| `mongodb` / `mongoose` | Database connection and ODM |
| `better-auth` | Authentication (server-side) |
| `jsonwebtoken` | JWT token generation & verification |
| `stripe` | Stripe payment processing |
| `cors` | Cross-origin request handling |
| `dotenv` | Environment variable management |
| `multer` | File upload handling |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, HeroUI v3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** better-auth + JWT
- **Payment:** Stripe
- **Image Hosting:** ImgBB API
- **Deployment:** Vercel (client), Vercel / Render (server)

---

## 🚀 Getting Started (Local Development)

### Client
```bash
git clone https://github.com/akbiplobx/bloodsync-client
cd bloodsync-client
npm install
npm run dev
```

Create a `.env.local` file and add your environment variables:
```
NEXT_PUBLIC_API_URL=your_server_url
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Server
```bash
git clone https://github.com/akbiplobx/bloodsync-server
cd bloodsync-server
npm install
npm run dev
```

Create a `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## 👨‍💻 Author

**A K Biplob**  
[GitHub](https://github.com/akbiplobx)