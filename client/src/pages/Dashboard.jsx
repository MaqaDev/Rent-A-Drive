import { useAuth } from "../hooks/useAuth.js";
import { useFetch } from "../hooks/useFetch.js";
import {
  getUserBookings,
  cancelBooking,
  requestBookingReturn,
} from "../api/api.js";
import { Spinner, EmptyState } from "../components/Spinner.jsx";
import { BookingCard } from "../components/BookingCard.jsx";
import {
  FiCalendar,
  FiAlertTriangle,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  // Filters and Sorting States
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const {
    data: bookings,
    loading,
    error,
  } = useFetch(() => getUserBookings(), [refreshKey]);

  const openCancelModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelBooking(selectedBookingId);
      toast.success("Booking cancelled successfully");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setIsModalOpen(false);
      setSelectedBookingId(null);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      if (newStatus === "return_requested") {
        await requestBookingReturn(bookingId);
        toast.success("Booking return requested! Awaiting admin completion.");
      }
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update booking status",
      );
    }
  };

  const handlePayNow = (booking) => {
    const safeStartDate = booking.startDate?.includes("T")
      ? booking.startDate.split("T")[0]
      : booking.startDate;

    const safeEndDate = booking.endDate?.includes("T")
      ? booking.endDate.split("T")[0]
      : booking.endDate;

    navigate(`/checkout/${booking._id}`, {
      state: {
        startDate: safeStartDate,
        endDate: safeEndDate,
        car: booking.car,
        bookingId: booking._id,
        stateTotalDays: booking.totalDays,
        stateTotalPrice: booking.totalPrice,
      },
    });
  };

  // Base validation to exclude clean-cancelled data if necessary
  const validBookings = bookings
    ? bookings.filter(
        (b) => !(b.status === "cancelled" && b.paymentStatus !== "paid"),
      )
    : [];

  // Grouped Filter Logic
  const filteredBookings = validBookings.filter((b) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "unpaid_pending") {
      return b.paymentStatus === "unpaid" || b.status === "pending";
    }
    if (statusFilter === "active_progress") {
      return b.status === "confirmed" || b.status === "return_requested";
    }
    if (statusFilter === "completed") {
      return b.status === "completed";
    }
    return true;
  });

  // Date Sorting Logic (Newest vs Oldest)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.startDate);
    const dateB = new Date(b.createdAt || b.startDate);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className='min-h-screen bg-gray-50 py-8 relative'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='mb-8 flex justify-between items-end'>
          <div>
            <h1 className='text-4xl font-bold text-primary mb-2'>
              My Dashboard
            </h1>
            <p className='text-gray-600'>Welcome back, {user?.name}!</p>
          </div>

          {/* Centralized Date Sort Trigger */}
          <button
            onClick={() =>
              setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
            }
            className='flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 text-xs font-semibold text-primary hover:text-secondary transition shrink-0'>
            {sortOrder === "newest" ? (
              <>
                <FiArrowDown size={13} className='text-secondary' />
                <span className='hidden sm:inline'>Newest First</span>
                <span className='sm:hidden'>Newest</span>
              </>
            ) : (
              <>
                <FiArrowUp size={13} className='text-secondary' />
                <span className='hidden sm:inline'>Oldest First</span>
                <span className='sm:hidden'>Oldest</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Main Unified Filter Cards */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          {/* Card 1: Unpaid & Pending */}
          <div
            onClick={() => setStatusFilter("unpaid_pending")}
            className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition transform hover:scale-[1.02] border-2 ${statusFilter === "unpaid_pending" ? "border-yellow-500" : "border-transparent"}`}>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-semibold'>
                  Unpaid & Pending
                </p>
                <p className='text-3xl font-bold text-yellow-600'>
                  {
                    validBookings.filter(
                      (b) =>
                        b.paymentStatus === "unpaid" || b.status === "pending",
                    ).length
                  }
                </p>
              </div>
              <FiCalendar className='text-4xl text-yellow-400 opacity-40' />
            </div>
          </div>

          {/* Card 2: Active & In Progress */}
          <div
            onClick={() => setStatusFilter("active_progress")}
            className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition transform hover:scale-[1.02] border-2 ${statusFilter === "active_progress" ? "border-blue-500" : "border-transparent"}`}>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-semibold'>
                  Active / In Progress
                </p>
                <p className='text-3xl font-bold text-blue-600'>
                  {
                    validBookings.filter(
                      (b) =>
                        b.status === "confirmed" ||
                        b.status === "return_requested",
                    ).length
                  }
                </p>
              </div>
              <FiCalendar className='text-4xl text-blue-400 opacity-40' />
            </div>
          </div>

          {/* Card 3: Completed */}
          <div
            onClick={() => setStatusFilter("completed")}
            className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition transform hover:scale-[1.02] border-2 ${statusFilter === "completed" ? "border-green-500" : "border-transparent"}`}>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-semibold'>Completed</p>
                <p className='text-3xl font-bold text-green-600'>
                  {validBookings.filter((b) => b.status === "completed").length}
                </p>
              </div>
              <FiCalendar className='text-4xl text-green-400 opacity-40' />
            </div>
          </div>
        </div>

        {/* Booking List Container */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
            <h2 className='text-2xl font-bold text-primary capitalize'>
              {statusFilter === "all"
                ? "All Bookings"
                : statusFilter === "unpaid_pending"
                  ? "Unpaid & Pending Bookings"
                  : statusFilter === "active_progress"
                    ? "Active & In Progress Bookings"
                    : "Completed Bookings"}
            </h2>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className='text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded-lg transition'>
                Clear Filter
              </button>
            )}
          </div>

          {loading ? (
            <Spinner message='Loading your bookings...' />
          ) : error ? (
            <div className='bg-red-100 text-red-800 p-4 rounded-lg'>
              <p>Error loading bookings: {error}</p>
            </div>
          ) : sortedBookings.length > 0 ? (
            <div className='space-y-4'>
              {sortedBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={openCancelModal}
                  onStatusChange={handleStatusChange}
                  onPayNow={handlePayNow}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              message='No bookings match the selected criteria'
              icon={FiCalendar}
            />
          )}
        </div>
      </div>

      {/* CUSTOM CANCEL CONFIRMATION MODAL */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn'>
          <div className='bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100 transform scale-100 transition-all'>
            <div className='flex items-center gap-3 text-red-500 mb-4'>
              <FiAlertTriangle className='text-3xl shrink-0' />
              <h3 className='text-xl font-bold text-gray-900'>
                Cancel Booking
              </h3>
            </div>
            <p className='text-gray-600 mb-6 leading-relaxed'>
              Are you sure you want to cancel this booking? This action cannot
              be undone and the booking will be removed if unpaid.
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 text-sm transition'>
                No, Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                className='px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition shadow-md shadow-red-100'>
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
