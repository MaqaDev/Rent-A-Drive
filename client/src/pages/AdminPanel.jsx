import { useAuth } from "../hooks/useAuth.js";
import { useFetch } from "../hooks/useFetch.js";
import { getAllBookings } from "../api/api.js";
import { Spinner, EmptyState } from "../components/Spinner.jsx";
import { formatDate } from "../utils/formatDate.js";
import { formatPrice } from "../utils/priceCalc.js";
import { FiDollarSign } from "react-icons/fi";

export const AdminPanel = () => {
  const { user } = useAuth();
  const {
    data: bookings,
    loading,
    error,
  } = useFetch(() => getAllBookings(), []);

  if (!user || user.role !== "admin") {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Not authorized
      </div>
    );
  }

  const totalRevenue =
    bookings?.reduce(
      (sum, b) => sum + (b.paymentStatus === "paid" ? b.totalPrice : 0),
      0,
    ) || 0;
  const totalBookings = bookings?.length || 0;
  const confirmedBookings =
    bookings?.filter((b) => b.status === "confirmed").length || 0;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        <h1 className='text-4xl font-bold text-primary mb-8'>
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Total Revenue</p>
                <p className='text-3xl font-bold text-green-600'>
                  {formatPrice(totalRevenue)}
                </p>
              </div>
              <FiDollarSign className='text-4xl text-green-400 opacity-20' />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Total Bookings</p>
                <p className='text-3xl font-bold text-blue-600'>
                  {totalBookings}
                </p>
              </div>
              <FiDollarSign className='text-4xl text-blue-400 opacity-20' />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Active Bookings</p>
                <p className='text-3xl font-bold text-yellow-600'>
                  {confirmedBookings}
                </p>
              </div>
              <FiDollarSign className='text-4xl text-yellow-400 opacity-20' />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='p-6 border-b'>
            <h2 className='text-2xl font-bold text-primary'>All Bookings</h2>
          </div>

          {loading ? (
            <Spinner message='Loading bookings...' />
          ) : error ? (
            <div className='p-6 text-red-600'>Error: {error}</div>
          ) : bookings && bookings.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='px-6 py-3 text-left text-sm font-semibold'>
                      Car
                    </th>
                    <th className='px-6 py-3 text-left text-sm font-semibold'>
                      User
                    </th>
                    <th className='px-6 py-3 text-left text-sm font-semibold'>
                      Dates
                    </th>
                    <th className='px-6 py-3 text-left text-sm font-semibold'>
                      Total
                    </th>
                    <th className='px-6 py-3 text-left text-sm font-semibold'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-sm font-semibold'>
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className='border-t hover:bg-gray-50'>
                      <td className='px-6 py-4'>
                        {booking.car.make} {booking.car.model}
                      </td>
                      <td className='px-6 py-4'>{booking.user.name}</td>
                      <td className='px-6 py-4 text-sm'>
                        {formatDate(booking.startDate)} →{" "}
                        {formatDate(booking.endDate)}
                      </td>
                      <td className='px-6 py-4 font-semibold'>
                        {formatPrice(booking.totalPrice)}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            booking.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}>
                          {booking.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message='No bookings found' />
          )}
        </div>
      </div>
    </div>
  );
};
