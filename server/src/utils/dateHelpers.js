export const calculateTotalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? 1 : diffDays;
};

export const calculateTotalPrice = (pricePerDay, totalDays) => {
  return pricePerDay * totalDays;
};

export const isDateRangeAvailable = (car, startDate, endDate) => {
  // Placeholder for availability checking
  // This would check against existing bookings
  return car.available;
};

export const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};
