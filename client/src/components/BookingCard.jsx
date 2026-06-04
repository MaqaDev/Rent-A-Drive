import { formatDate, formatDateTime } from "../utils/formatDate.js";
import { formatPrice } from "../utils/priceCalc.js";

export const BookingCard = ({ booking, onCancel, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 mb-4'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-xl font-bold text-primary'>
            {booking.car.make} {booking.car.model}
          </h3>
          <p className='text-sm text-gray-600'>
            Booking #{booking._id.slice(-8)}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-4 mb-4'>
        <div>
          <p className='text-xs text-gray-500 uppercase'>Check-in</p>
          <p className='text-lg font-semibold'>
            {formatDate(booking.startDate)}
          </p>
        </div>
        <div>
          <p className='text-xs text-gray-500 uppercase'>Check-out</p>
          <p className='text-lg font-semibold'>{formatDate(booking.endDate)}</p>
        </div>
      </div>

      <div className='flex justify-between items-center py-4 border-t border-b'>
        <div>
          <p className='text-xs text-gray-500 uppercase'>Total Days</p>
          <p className='text-lg font-semibold'>{booking.totalDays} days</p>
        </div>
        <div>
          <p className='text-xs text-gray-500 uppercase'>Total Price</p>
          <p className='text-lg font-bold text-secondary'>
            {formatPrice(booking.totalPrice)}
          </p>
        </div>
      </div>

      <div className='mt-4'>
        <p className='text-xs text-gray-500 uppercase mb-2'>Payment Status</p>
        <div
          className={`px-3 py-1 rounded text-sm font-semibold ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
          {booking.paymentStatus.toUpperCase()}
        </div>
      </div>

      <div className='mt-4 flex gap-2'>
        {booking.status !== "cancelled" && booking.status !== "completed" && (
          <button
            onClick={() => onCancel?.(booking._id)}
            className='flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold'>
            Cancel Booking
          </button>
        )}
        {booking.status === "pending" && booking.paymentStatus === "unpaid" && (
          <button className='flex-1 bg-secondary text-primary py-2 rounded-lg hover:bg-accent transition text-sm font-semibold'>
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
};
