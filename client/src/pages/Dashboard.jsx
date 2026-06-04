import { useAuth } from "../hooks/useAuth.js";
import { useFetch } from "../hooks/useFetch.js";
import { getUserBookings, cancelBooking } from "../api/api.js";
import { Spinner, EmptyState } from "../components/Spinner.jsx";
import { BookingCard } from "../components/BookingCard.jsx";
import { FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import { useState } from "react";

export const Dashboard = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    data: bookings,
    loading,
    error,
  } = useFetch(() => getUserBookings(), [refreshKey]);

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(bookingId);
        toast.success("Booking cancelled successfully");
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to cancel booking",
        );
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-primary mb-2'>My Dashboard</h1>
          <p className='text-gray-600'>Welcome back, {user?.name}!</p>
        </div>

        {/* Stats */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Total Bookings</p>
                <p className='text-3xl font-bold text-primary'>
                  {bookings?.length || 0}
                </p>
              </div>
              <FiCalendar className='text-4xl text-secondary opacity-20' />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Active Bookings</p>
                <p className='text-3xl font-bold text-blue-600'>
                  {bookings?.filter((b) => b.status === "confirmed").length ||
                    0}
                </p>
              </div>
              <FiCalendar className='text-4xl text-blue-400 opacity-20' />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Completed</p>
                <p className='text-3xl font-bold text-green-600'>
                  {bookings?.filter((b) => b.status === "completed").length ||
                    0}
                </p>
              </div>
              <FiCalendar className='text-4xl text-green-400 opacity-20' />
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <h2 className='text-2xl font-bold text-primary mb-6'>
            Your Bookings
          </h2>

          {loading ? (
            <Spinner message='Loading your bookings...' />
          ) : error ? (
            <div className='bg-red-100 text-red-800 p-4 rounded-lg'>
              <p>Error loading bookings: {error}</p>
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className='space-y-4'>
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              message="You haven't made any bookings yet"
              icon={FiCalendar}
            />
          )}
        </div>
      </div>
    </div>
  );
};
