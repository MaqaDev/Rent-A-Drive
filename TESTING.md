# Testing Guide - Rent-A-Drive

## Test Environment Setup

### Backend Testing (Jest)

#### Install Jest
```bash
cd server
npm install --save-dev jest supertest
npm install --save-dev @babel/preset-env babel-jest
```

#### Jest Configuration (jest.config.js)
```javascript
export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
```

#### Update package.json scripts
```json
"test": "jest --detectOpenHandles",
"test:coverage": "jest --coverage",
"test:watch": "jest --watch"
```

### Frontend Testing (Vitest)

#### Install Vitest
```bash
cd client
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

#### Vitest Configuration (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  }
})
```

#### Update package.json scripts
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"
```

## Test Cases

### Backend Tests

#### Authentication Tests
```javascript
// __tests__/auth.test.js
describe('Authentication', () => {
  test('Register user with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  test('Login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@rentadrive.com',
        password: 'Admin1234!',
      });
    
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  test('Login fails with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@rentadrive.com',
        password: 'WrongPassword!',
      });
    
    expect(res.status).toBe(401);
  });

  test('Get current user (protected)', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@rentadrive.com',
        password: 'User1234!',
      });
    
    const token = loginRes.body.data.token;
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('user@rentadrive.com');
  });
});
```

#### Car Management Tests
```javascript
// __tests__/cars.test.js
describe('Car Management', () => {
  test('Get all cars', async () => {
    const res = await request(app)
      .get('/api/cars');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('Filter cars by category', async () => {
    const res = await request(app)
      .get('/api/cars?category=sedan');
    
    expect(res.status).toBe(200);
    expect(res.body.data.every(car => car.category === 'sedan')).toBe(true);
  });

  test('Admin can create car', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@rentadrive.com',
        password: 'Admin1234!',
      });
    
    const token = loginRes.body.data.token;
    const res = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${token}`)
      .send({
        make: 'Honda',
        model: 'Accord',
        year: 2023,
        category: 'sedan',
        transmission: 'auto',
        seats: 5,
        pricePerDay: 60,
        features: ['AC', 'Power Windows'],
        description: 'Comfortable sedan',
        location: 'Downtown',
      });
    
    expect(res.status).toBe(201);
  });

  test('Non-admin cannot create car', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@rentadrive.com',
        password: 'User1234!',
      });
    
    const token = loginRes.body.data.token;
    const res = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${token}`)
      .send({
        make: 'Honda',
        model: 'Accord',
        year: 2023,
        category: 'sedan',
        transmission: 'auto',
        seats: 5,
        pricePerDay: 60,
      });
    
    expect(res.status).toBe(403);
  });
});
```

#### Booking Tests
```javascript
// __tests__/bookings.test.js
describe('Bookings', () => {
  test('Create booking with valid data', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@rentadrive.com',
        password: 'User1234!',
      });
    
    const token = loginRes.body.data.token;
    const carsRes = await request(app).get('/api/cars');
    const carId = carsRes.body.data[0]._id;
    
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        carId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2*24*60*60*1000).toISOString(),
      });
    
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
  });

  test('Get user bookings', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@rentadrive.com',
        password: 'User1234!',
      });
    
    const token = loginRes.body.data.token;
    const res = await request(app)
      .get('/api/bookings/my')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Admin can update booking status', async () => {
    const adminToken = await getAdminToken();
    const bookingId = await getFirstBookingId();
    
    const res = await request(app)
      .put(`/api/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });
    
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('confirmed');
  });

  test('User can cancel own booking', async () => {
    const userToken = await getUserToken();
    const bookingId = await getUserBookingId(userToken);
    
    const res = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
  });
});
```

### Frontend Tests

#### Component Tests
```javascript
// src/__tests__/CarCard.test.jsx
import { render, screen } from '@testing-library/react';
import CarCard from '../components/CarCard';

describe('CarCard', () => {
  const mockCar = {
    _id: '1',
    make: 'Honda',
    model: 'Accord',
    year: 2023,
    pricePerDay: 60,
    images: ['car.jpg'],
    rating: 4.5,
    numReviews: 10,
  };

  test('renders car details', () => {
    render(<CarCard car={mockCar} />);
    
    expect(screen.getByText(/Honda/)).toBeInTheDocument();
    expect(screen.getByText(/Accord/)).toBeInTheDocument();
    expect(screen.getByText(/\$60/)).toBeInTheDocument();
  });

  test('shows rating and reviews', () => {
    render(<CarCard car={mockCar} />);
    
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    expect(screen.getByText(/10 reviews/)).toBeInTheDocument();
  });

  test('has Book Now button', () => {
    render(<CarCard car={mockCar} />);
    
    expect(screen.getByRole('button', { name: /Book Now/i })).toBeInTheDocument();
  });
});
```

#### Form Tests
```javascript
// src/__tests__/Login.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';

describe('Login Page', () => {
  test('displays login form', () => {
    render(<Login />);
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows validation error for empty email', async () => {
    render(<Login />);
    
    const submitBtn = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitBtn);
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid email', async () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    
    const submitBtn = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitBtn);
    
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

## Running Tests

### Backend
```bash
cd server
npm test                # Run all tests
npm run test:coverage   # With coverage report
npm run test:watch     # Watch mode
```

### Frontend
```bash
cd client
npm test                # Run all tests
npm run test:ui        # Interactive UI
npm run test:coverage  # With coverage report
```

## Coverage Goals

- **Backend**: Minimum 70% line coverage
- **Frontend**: Minimum 60% line coverage

## CI/CD Integration

Add to GitHub Actions (.github/workflows/test.yml):

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Backend tests
        run: cd server && npm test
      
      - name: Frontend tests
        run: cd client && npm test
```

## Test Data

### Admin Account
- Email: `admin@rentadrive.com`
- Password: `Admin1234!`
- Role: admin

### Regular User Account
- Email: `user@rentadrive.com`
- Password: `User1234!`
- Role: user

### Test Cars
- 12 diverse cars pre-seeded in database
- Categories: sedan, suv, luxury, economy
- Price range: $40-150 per day

---

**Last Updated:** June 4, 2026
**Status:** Testing Framework Ready
