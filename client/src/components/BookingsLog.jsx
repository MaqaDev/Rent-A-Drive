import { useState, useEffect } from "react";
import { Spinner, EmptyState } from "./Spinner.jsx";
import { updateBookingStatus } from "../api/api.js";
import {
  FiCheckCircle,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";
import toast from "react-hot-toast";

const statusStyle = (status) => {
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "confirmed") return "bg-blue-100 text-blue-800";
  if (status === "return_requested") return "bg-purple-100 text-purple-800 border border-purple-200";
  return "bg-yellow-100 text-yellow-800";
};

const statusDot = (status) => {
  if (status === "completed") return "bg-green-600";
  if (status === "confirmed") return "bg-blue-600";
  if (status === "return_requested") return "bg-purple-600 animate-pulse";
  return "bg-yellow-600";
};

const statusLabel = (status) =>
  status === "return_requested" ? "Return Requested" : status;

const MobileBookingCard = ({ booking, onComplete, actionLoading }) => {
  const [expanded, setExpanded] = useState(false);

  const isUserPopulated = booking.user && typeof booking.user === "object";
  const isCarPopulated = booking.car && typeof booking.car === "object";

  const customerName = isUserPopulated ? booking.user.name : "System Client";
  const customerEmail = isUserPopulated ? booking.user.email : `ID: ${booking.user || "N/A"}`;
  const carName = isCarPopulated
    ? `${booking.car.make} ${booking.car.model}`
    : "Vehicle Reference";
  const currentStatus = booking._localStatus || booking.status;

  return (
    <div className='border-b border-gray-100 last:border-0'>
      <button
        onClick={() => setExpanded((p) => !p)}
        className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition'>
        <div className='h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 border shrink-0'>
          <FiUser size={14} />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='font-semibold text-gray-900 text-sm truncate'>{customerName}</p>
          <p className='text-xs text-gray-400 truncate'>{carName}</p>
        </div>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusStyle(currentStatus)}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot(currentStatus)}`} />
          <span className='capitalize'>{statusLabel(currentStatus)}</span>
        </span>
        <FiChevronDown
          size={16}
          className={`text-gray-400 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className='px-4 pb-4 bg-gray-50 space-y-3 text-sm'>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <span className='text-gray-400 text-xs'>Customer</span>
              <p className='font-semibold text-gray-800'>{customerName}</p>
              <p className='text-xs text-gray-400 truncate'>{customerEmail}</p>
            </div>
            <div>
              <span className='text-gray-400 text-xs'>Vehicle</span>
              <p className='font-semibold text-gray-800'>{carName}</p>
              {isCarPopulated && (
                <p className='text-xs text-gray-400 capitalize'>
                  {booking.car.transmission} • {booking.car.fuelType}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div>
              <span className='text-gray-400 text-xs'>Rental Period</span>
              <p className='font-medium text-gray-700 flex items-center gap-1'>
                <FiCalendar size={12} className='text-gray-400' />
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
              <p className='text-xs text-gray-400 ml-4'>
                → {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className='text-gray-400 text-xs'>Payment</span>
              <p className='font-bold text-gray-900 flex items-center'>
                <FiDollarSign size={13} className='text-gray-400' />
                {booking.totalPrice}
              </p>
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium border ${
                  booking.paymentStatus === "paid"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
          </div>

          {currentStatus === "return_requested" && (
            <button
              onClick={() => onComplete(booking._id)}
              disabled={actionLoading === booking._id}
              className='w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50'>
              <FiCheckCircle size={15} />
              {actionLoading === booking._id ? "Processing..." : "Accept Return & Complete"}
            </button>
          )}

          {currentStatus === "completed" && (
            <span className='block text-center text-xs text-gray-400 font-medium bg-gray-100 px-2.5 py-1.5 rounded-md border border-gray-200/50'>
              Archived / Closed
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const BookingsLog = ({
  bookings,
  loading,
  error,
  statusFilter,
  setStatusFilter,
}) => {
  const [actionLoading, setActionLoading] = useState(null);
  const [localStatuses, setLocalStatuses] = useState({});

  useEffect(() => {
    setLocalStatuses({});
  }, [bookings]);

  if (loading) return <Spinner message='Loading rental logs...' />;
  if (error) return <EmptyState message='Failed to retrieve transaction logs.' />;
  if (!bookings || bookings.length === 0)
    return <EmptyState message='No bookings registered yet.' />;

  const handleCompleteBooking = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await updateBookingStatus(bookingId, "completed");
      toast.success("Return accepted! Booking marked as completed.");
      setLocalStatuses((prev) => ({ ...prev, [bookingId]: "completed" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update booking status");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const currentStatus = localStatuses[booking._id] || booking.status;
    if (statusFilter === "all") return true;
    if (statusFilter === "pending")
      return currentStatus === "pending" || currentStatus === "return_requested";
    return currentStatus === statusFilter;
  });

  const enriched = filteredBookings.map((b) => ({
    ...b,
    _localStatus: localStatuses[b._id] || b.status,
  }));

  return (
    <div className='w-full'>
      {/* Filter bar */}
      <div className='p-3 bg-gray-50/50 border-b flex flex-wrap items-center gap-2'>
        <div className='flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
          <FiFilter size={13} className='text-gray-400' />
          <span className='hidden sm:inline'>Filter:</span>
        </div>
        <div className='flex flex-wrap gap-1.5'>
          {["all", "pending", "confirmed", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border capitalize transition-all ${
                statusFilter === tab
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200"
              }`}>
              {tab === "all" ? "All" : tab === "pending" ? "Awaiting" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className='md:hidden'>
        {enriched.length === 0 ? (
          <p className='text-center py-10 text-gray-400 text-sm font-medium'>
            No bookings match the selected filter.
          </p>
        ) : (
          enriched.map((booking) => (
            <MobileBookingCard
              key={booking._id}
              booking={booking}
              onComplete={handleCompleteBooking}
              actionLoading={actionLoading}
            />
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full border-collapse bg-white text-left text-sm text-gray-500'>
          <thead className='bg-gray-50'>
            <tr className='border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-400'>
              <th className='px-6 py-4 font-medium text-gray-900'>Customer</th>
              <th className='px-6 py-4 font-medium text-gray-900'>Car Details</th>
              <th className='px-6 py-4 font-medium text-gray-900'>Rental Period</th>
              <th className='px-6 py-4 font-medium text-gray-900'>Total Payment</th>
              <th className='px-6 py-4 font-medium text-gray-900'>Status</th>
              <th className='px-6 py-4 text-right font-medium text-gray-900'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100 border-t border-gray-100'>
            {enriched.length === 0 ? (
              <tr>
                <td colSpan='6' className='text-center py-12 text-gray-400 font-medium'>
                  No bookings found matching the selected status filter.
                </td>
              </tr>
            ) : (
              enriched.map((booking) => {
                const isUserPopulated = booking.user && typeof booking.user === "object";
                const isCarPopulated = booking.car && typeof booking.car === "object";

                const customerName = isUserPopulated ? booking.user.name : "System Client";
                const customerEmail = isUserPopulated
                  ? booking.user.email
                  : `ID: ${booking.user || "N/A"}`;
                const carIdentifier = isCarPopulated
                  ? `${booking.car.make} ${booking.car.model}`
                  : "Vehicle Reference";
                const carSpecs = isCarPopulated
                  ? `${booking.car.transmission || "N/A"} • ${booking.car.fuelType || "petrol"} • ${booking.car.category || "N/A"}`
                  : "N/A";

                const currentStatus = booking._localStatus;

                return (
                  <tr key={booking._id} className='hover:bg-gray-50/70 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 shadow-sm border shrink-0'>
                          <FiUser size={16} />
                        </div>
                        <div className='truncate max-w-[180px]'>
                          <div className='font-semibold text-gray-900 truncate'>{customerName}</div>
                          <div className='text-xs text-gray-400 truncate'>{customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-gray-950 font-medium truncate max-w-[200px]'>{carIdentifier}</div>
                      <div className='text-xs text-gray-400 capitalize'>{carSpecs}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-1.5 text-gray-700 font-medium'>
                        <FiCalendar className='text-gray-400' size={14} />
                        <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                        <span className='text-gray-300 mx-0.5'>-</span>
                        <span>{new Date(booking.endDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center text-gray-900 font-bold text-base'>
                        <FiDollarSign size={14} className='text-gray-400 mr-0.5' />
                        {booking.totalPrice}
                      </div>
                      <div className='mt-0.5'>
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium border ${
                            booking.paymentStatus === "paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                          {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusStyle(currentStatus)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot(currentStatus)}`} />
                        <span className='capitalize'>{statusLabel(currentStatus)}</span>
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right whitespace-nowrap'>
                      <div className='flex justify-end'>
                        {currentStatus === "return_requested" && (
                          <button
                            onClick={() => handleCompleteBooking(booking._id)}
                            disabled={actionLoading === booking._id}
                            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition disabled:opacity-50'>
                            <FiCheckCircle size={13} />
                            {actionLoading === booking._id ? "..." : "Accept Return"}
                          </button>
                        )}
                        {currentStatus === "completed" && (
                          <span className='text-xs text-gray-400 font-medium select-none bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200/50'>
                            Archived / Closed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
