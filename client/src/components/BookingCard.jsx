// import { formatDate } from "../utils/formatDate.js";
// import { formatPrice } from "../utils/priceCalc.js";

// export const BookingCard = ({
//   booking,
//   onCancel,
//   onStatusChange,
//   onPayNow,
// }) => {
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-green-100 text-green-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       case "completed":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const isPaid = booking?.paymentStatus === "paid";
//   const currentStatus = booking?.status || "pending";

//   // Əgər booking datası hələ gəlməyibsə boş qaytar, çöküşün qarşısını al
//   if (!booking) return null;

//   return (
//     <div className='bg-white rounded-lg shadow-lg p-6 mb-4 border border-gray-100'>
//       <div className='flex justify-between items-start mb-4'>
//         <div>
//           <h3 className='text-xl font-bold text-primary'>
//             {/* Optional chaining (?.) ilə maşın adını təhlükəsiz şəkildə yazdırırıq */}
//             {booking.car?.make || "Car"} {booking.car?.model || "Details"}
//           </h3>
//           <p className='text-sm text-gray-600'>
//             Booking #{booking._id?.slice(-8) || "------"}
//           </p>
//         </div>
//         <div
//           className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(currentStatus)}`}>
//           {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
//         </div>
//       </div>

//       <div className='grid md:grid-cols-2 gap-4 mb-4'>
//         <div>
//           <p className='text-xs text-gray-500 uppercase'>Check-in</p>
//           <p className='text-lg font-semibold'>
//             {formatDate(booking.startDate)}
//           </p>
//         </div>
//         <div>
//           <p className='text-xs text-gray-500 uppercase'>Check-out</p>
//           <p className='text-lg font-semibold'>{formatDate(booking.endDate)}</p>
//         </div>
//       </div>

//       <div className='flex justify-between items-center py-4 border-t border-b'>
//         <div>
//           <p className='text-xs text-gray-500 uppercase'>Total Days</p>
//           <p className='text-lg font-semibold'>{booking.totalDays || 0} days</p>
//         </div>
//         <div>
//           <p className='text-xs text-gray-500 uppercase'>Total Price</p>
//           <p className='text-lg font-bold text-secondary'>
//             {formatPrice(booking.totalPrice || 0)}
//           </p>
//         </div>
//       </div>

//       <div className='mt-4'>
//         <p className='text-xs text-gray-500 uppercase mb-2'>Payment Status</p>
//         <div
//           className={`px-3 py-1 rounded text-sm font-semibold inline-block ${isPaid ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
//           {(booking.paymentStatus || "unpaid").toUpperCase()}
//         </div>
//       </div>

//       <div className='mt-4 flex gap-2'>
//         {currentStatus !== "cancelled" && currentStatus !== "completed" && (
//           <>
//             {!isPaid ? (
//               <button
//                 onClick={() => onCancel?.(booking._id)}
//                 className='flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold'>
//                 Cancel Booking
//               </button>
//             ) : (
//               <button
//                 onClick={() => onStatusChange?.(booking._id, "completed")}
//                 className='flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold'>
//                 Complete Booking
//               </button>
//             )}
//           </>
//         )}

//         {/* Ödəniş edilməyibsə və status ləğv/tamam pəncərəsində deyilsə "Pay Now" düyməsini göstər */}
//         {currentStatus !== "cancelled" &&
//           currentStatus !== "completed" &&
//           !isPaid && (
//             <button
//               onClick={() => onPayNow?.(booking)}
//               className='flex-1 bg-secondary text-primary py-2 rounded-lg hover:bg-accent transition text-sm font-semibold shadow-sm'>
//               Pay Now
//             </button>
//           )}
//       </div>
//     </div>
//   );
// };

import { formatDate } from "../utils/formatDate.js";
import { formatPrice } from "../utils/priceCalc.js";

export const BookingCard = ({
  booking,
  onCancel,
  onStatusChange,
  onPayNow,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "return_requested":
        return "bg-orange-100 text-orange-800"; // Warm color for waiting state
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isPaid = booking?.paymentStatus === "paid";
  const currentStatus = booking?.status || "pending";

  // Prevent crash if booking data is not available yet
  if (!booking) return null;

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 mb-4 border border-gray-100'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-xl font-bold text-primary'>
            {/* Safely display car details using optional chaining */}
            {booking.car?.make || "Car"} {booking.car?.model || "Details"}
          </h3>
          <p className='text-sm text-gray-600'>
            Booking #{booking._id?.slice(-8) || "------"}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(currentStatus)}`}>
          {/* Display user-friendly label for return_requested status */}
          {currentStatus === "return_requested"
            ? "Awaiting Completion"
            : currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
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
          <p className='text-lg font-semibold'>{booking.totalDays || 0} days</p>
        </div>
        <div>
          <p className='text-xs text-gray-500 uppercase'>Total Price</p>
          <p className='text-lg font-bold text-secondary'>
            {formatPrice(booking.totalPrice || 0)}
          </p>
        </div>
      </div>

      <div className='mt-4'>
        <p className='text-xs text-gray-500 uppercase mb-2'>Payment Status</p>
        <div
          className={`px-3 py-1 rounded text-sm font-semibold inline-block ${isPaid ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
          {(booking.paymentStatus || "unpaid").toUpperCase()}
        </div>
      </div>

      <div className='mt-4 flex gap-2'>
        {/* Actions for active, non-cancelled, non-completed, and non-requested bookings */}
        {currentStatus !== "cancelled" &&
          currentStatus !== "completed" &&
          currentStatus !== "return_requested" && (
            <>
              {!isPaid ? (
                <button
                  onClick={() => onCancel?.(booking._id)}
                  className='flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold'>
                  Cancel Booking
                </button>
              ) : (
                <button
                  onClick={() =>
                    onStatusChange?.(booking._id, "return_requested")
                  }
                  className='flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold'>
                  Complete Booking
                </button>
              )}
            </>
          )}

        {/* Display pending block when waiting for admin approval */}
        {currentStatus === "return_requested" && (
          <div className='flex-1 text-center bg-orange-50 text-orange-700 py-3 rounded-lg text-sm font-semibold border border-dashed border-orange-300 animate-pulse'>
            Awaiting Admin Completion...
          </div>
        )}

        {/* Show Pay Now button if the booking is unpaid and in pending status */}
        {currentStatus === "pending" && !isPaid && (
          <button
            onClick={() => onPayNow?.(booking)}
            className='flex-1 bg-secondary text-primary py-2 rounded-lg hover:bg-accent transition text-sm font-semibold shadow-sm'>
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
};
