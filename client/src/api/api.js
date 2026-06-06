import apiClient from "./client.js";

// Auth APIs
export const register = (data) => apiClient.post("/auth/register", data);
export const login = (data) => apiClient.post("/auth/login", data);
export const getMe = () => apiClient.get("/auth/me");

// Car APIs
export const getAllCars = (filters = {}) =>
  apiClient.get("/cars", { params: filters });
export const getCarById = (id) => apiClient.get(`/cars/${id}`);
export const createCar = (data) => apiClient.post("/cars", data);
export const updateCar = (id, data) => apiClient.put(`/cars/${id}`, data);
export const deleteCar = (id) => apiClient.delete(`/cars/${id}`);

// Booking APIs
export const createBooking = (data) => apiClient.post("/bookings", data);
export const getUserBookings = () => apiClient.get("/bookings/my");
export const getAllBookings = () => apiClient.get("/bookings");
export const requestBookingReturn = (id) =>
  apiClient.put(`/bookings/${id}/request-return`);
export const updateBookingStatus = (id, status) =>
  apiClient.put(`/bookings/${id}/status`, { status });
export const cancelBooking = (id) => apiClient.delete(`/bookings/${id}`);

// Payment APIs
export const createPaymentIntent = (bookingId) =>
  apiClient.post("/payments/create-payment-intent", { bookingId });
export const confirmPayment = (bookingId, paymentIntentId) =>
  apiClient.post("/payments/confirm", { bookingId, paymentIntentId });
