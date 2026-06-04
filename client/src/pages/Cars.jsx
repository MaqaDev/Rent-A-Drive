import { useState } from "react";
import { CarCard } from "../components/CarCard.jsx";
import { Spinner, EmptyState } from "../components/Spinner.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { getAllCars } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import toast from "react-hot-toast";

export const Cars = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const filters = {
    ...(category && { category }),
    ...(priceMin && { priceMin }),
    ...(priceMax && { priceMax }),
  };

  const {
    data: cars,
    loading,
    error,
  } = useFetch(() => getAllCars(filters), [category, priceMin, priceMax]);

  const handleBook = (carId) => {
    if (!isAuthenticated) {
      toast.error("Please login to book a car");
      navigate("/login");
      return;
    }
    navigate(`/checkout/${carId}`);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        <h1 className='text-4xl font-bold text-primary mb-8'>Available Cars</h1>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
          <h2 className='text-xl font-semibold text-primary mb-4'>Filters</h2>
          <div className='grid md:grid-cols-4 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'>
                <option value=''>All Categories</option>
                <option value='sedan'>Sedan</option>
                <option value='suv'>SUV</option>
                <option value='luxury'>Luxury</option>
                <option value='economy'>Economy</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Min Price/Day
              </label>
              <input
                type='number'
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder='$0'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Max Price/Day
              </label>
              <input
                type='number'
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder='$999'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'
              />
            </div>

            <div className='flex items-end'>
              <button
                onClick={() => {
                  setCategory("");
                  setPriceMin("");
                  setPriceMax("");
                }}
                className='w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition'>
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <Spinner message='Loading cars...' />
        ) : error ? (
          <div className='bg-red-100 text-red-800 p-4 rounded-lg'>
            <p>Error loading cars: {error}</p>
          </div>
        ) : cars && cars.length > 0 ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {cars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                onBook={handleBook}
              />
            ))}
          </div>
        ) : (
          <EmptyState message='No cars found matching your filters' />
        )}
      </div>
    </div>
  );
};
