import { FiImage } from "react-icons/fi";
import { formatPrice } from "../utils/priceCalc.js";

export const CarCard = ({ car, onBook }) => {
  const handleBook = () => {
    onBook?.(car._id);
  };

  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105'>
      <div className='h-48 bg-gray-300 relative flex items-center justify-center overflow-hidden'>
        {car.images && car.images.length > 0 ? (
          <img
            src={car.images[0].url}
            alt={`${car.make} ${car.model}`}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='flex flex-col items-center justify-center text-gray-400'>
            <FiImage size={40} />
            <p className='mt-2'>No Image</p>
          </div>
        )}
      </div>

      <div className='p-4'>
        <h3 className='text-xl font-bold text-primary mb-2'>
          {car.make} {car.model}
        </h3>
        <div className='flex justify-between text-sm text-gray-600 mb-3'>
          <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded'>
            {car.year}
          </span>
          <span className='bg-green-100 text-green-800 px-2 py-1 rounded'>
            {car.category}
          </span>
        </div>

        <div className='grid grid-cols-3 gap-2 text-center text-sm mb-4'>
          <div className='bg-gray-100 py-2 rounded'>
            <p className='font-semibold'>{car.seats}</p>
            <p className='text-xs text-gray-600'>Seats</p>
          </div>
          <div className='bg-gray-100 py-2 rounded'>
            <p className='font-semibold'>{car.transmission}</p>
            <p className='text-xs text-gray-600'>Trans</p>
          </div>
          <div className='bg-gray-100 py-2 rounded'>
            <p className='font-semibold'>{car.rating}⭐</p>
            <p className='text-xs text-gray-600'>Rating</p>
          </div>
        </div>

        <div className='border-t pt-3 mb-4'>
          <p className='text-2xl font-bold text-secondary'>
            {formatPrice(car.pricePerDay)}
            <span className='text-sm text-gray-600'>/day</span>
          </p>
        </div>

        <button
          onClick={handleBook}
          className='w-full bg-secondary text-primary font-semibold py-2 rounded-lg hover:bg-accent transition'>
          Book Now
        </button>
      </div>
    </div>
  );
};
