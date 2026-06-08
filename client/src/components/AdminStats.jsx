import { FiTrendingUp, FiShoppingBag, FiCalendar } from "react-icons/fi";
import { formatPrice } from "../utils/priceCalc.js";

export const AdminStats = ({
  totalRevenue,
  totalBookings,
  confirmedBookings,
}) => {
  return (
    <div className='grid md:grid-cols-3 gap-6 mb-8'>
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between'>
        <div>
          <p className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-1'>
            Total Revenue
          </p>
          <p className='text-3xl font-bold text-green-600'>
            {formatPrice(totalRevenue)}
          </p>
        </div>
        <div className='p-3 bg-green-50 rounded-lg text-green-500'>
          <FiTrendingUp className='text-2xl' />
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between'>
        <div>
          <p className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-1'>
            Total Bookings
          </p>
          <p className='text-3xl font-bold text-blue-600'>{totalBookings}</p>
        </div>
        <div className='p-3 bg-blue-50 rounded-lg text-blue-500'>
          <FiShoppingBag className='text-2xl' />
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between'>
        <div>
          <p className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-1'>
            Active Orders
          </p>
          <p className='text-3xl font-bold text-yellow-600'>
            {confirmedBookings}
          </p>
        </div>
        <div className='p-3 bg-yellow-50 rounded-lg text-yellow-500'>
          <FiCalendar className='text-2xl' />
        </div>
      </div>
    </div>
  );
};
