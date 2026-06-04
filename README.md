# Rent-A-Drive 🚗

A full-stack MERN (MongoDB, Express, React, Node.js) car rental web application with a modern UI, user authentication, car listing, bookings, and payment integration.

## Features

- **User Authentication**: JWT-based login/register with role-based access control (admin/user)
- **Car Management**: Browse, filter, and search cars by category, price, and availability
- **Booking System**: Book cars with date selection, availability checking, and cancellation
- **Payment Processing**: Stripe integration for secure payments
- **Admin Panel**: CRUD operations for cars, booking management, and statistics
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Image Uploads**: Cloudinary integration for car images
- **Real-time Feedback**: Toast notifications and loading states

## Tech Stack

### Backend

- **Express.js** - RESTful API framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Stripe** - Payment processing
- **Helmet & CORS** - Security

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account (optional, for image uploads)
- Stripe account (optional, for payment testing)

### Installation

1. **Clone and navigate**

   ```bash
   cd rent-a-drive
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**
   - See `.env` files in `server/` and `client/` directories
   - Update with your MongoDB URI, API keys, etc.

### Running Locally

**Terminal 1 - Backend**

```bash
cd server
npm run dev
```

Server runs on http://localhost:5000

**Terminal 2 - Frontend**

```bash
cd client
npm run dev
```

Client runs on http://localhost:3000

### Seed Database

Populate the database with sample cars and users:

```bash
cd server
npm run seed
```

**Test Credentials:**

- Admin: `admin@rentadrive.com` / `Admin1234!`
- User: `user@rentadrive.com` / `User1234!`

## API Endpoints

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Cars

- `GET /api/cars` - List all cars (with filters)
- `GET /api/cars/:id` - Get car details
- `POST /api/cars` - Create car (admin only)
- `PUT /api/cars/:id` - Update car (admin only)
- `DELETE /api/cars/:id` - Delete car (admin only)

### Bookings

- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my` - Get user's bookings (protected)
- `GET /api/bookings` - Get all bookings (admin only)
- `PUT /api/bookings/:id/status` - Update booking status (admin only)
- `DELETE /api/bookings/:id` - Cancel booking

### Payments

- `POST /api/payments/create-payment-intent` - Create Stripe intent
- `POST /api/payments/webhook` - Stripe webhook handler

## Testing

Run tests:

```bash
# Backend
cd server && npm test

# Frontend
cd client && npm test
```

## Deployment

### Build for Production

```bash
# Build client
cd client && npm run build

# Backend runs as-is; serves built client files
```

### Deploy to Vercel

```bash
vercel --prod
```

Ensure all environment variables are configured in Vercel dashboard.

## Project Structure

```
rent-a-drive/
├── server/
│   ├── src/
│   │   ├── config/         (db, cloudinary config)
│   │   ├── controllers/    (auth, cars, bookings, payments)
│   │   ├── middleware/     (auth, error handling, upload)
│   │   ├── models/         (User, Car, Booking)
│   │   ├── routes/         (API routes)
│   │   └── utils/          (helpers, seed script)
│   └── server.js
├── client/
│   ├── src/
│   │   ├── api/            (axios instance, API calls)
│   │   ├── components/     (reusable UI components)
│   │   ├── context/        (React context for auth)
│   │   ├── hooks/          (custom hooks)
│   │   ├── pages/          (page components)
│   │   ├── utils/          (helper functions)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
└── .gitignore
```

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.
