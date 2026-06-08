import { useState } from "react";
import { CarCard } from "../components/CarCard.jsx";
import { Spinner, EmptyState } from "../components/Spinner.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { getAllCars } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import toast from "react-hot-toast";

export const Cars = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Filter and search context states
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Orchestrating query payload for API evaluation
  const filters = {
    ...(searchTerm && { search: searchTerm }),
    ...(category && { category }),
    ...(priceMin && { priceMin }),
    ...(priceMax && { priceMax }),
  };

  const {
    data: cars,
    loading,
    error,
  } = useFetch(
    () => getAllCars(filters),
    [searchTerm, category, priceMin, priceMax],
  );

  const handleBook = (carId) => {
    if (!isAuthenticated) {
      toast.error("Please login to book a car");
      navigate("/login");
      return;
    }

    navigate(`/cars/${carId}`);
  };

  // Extract matrix safely avoiding potential undefined node issues
  const carList = cars?.data?.data || cars?.data || cars || [];

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        <h1 className='text-4xl font-bold text-primary mb-8'>Available Cars</h1>

        {/* Filters Matrix Wrapper */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
          <h2 className='text-xl font-semibold text-primary mb-4'>Filters</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end'>
            {/* Reusable Search Component Context Integration */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Search Car
              </label>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder='Brand or model...'
                className='w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary h-[42px] bg-white'>
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
                min='0'
                value={priceMin}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0) setPriceMin(e.target.value);
                }}
                placeholder='Min Price'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary h-[42px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Max Price/Day
              </label>
              <input
                type='number'
                min='0'
                value={priceMax}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0) setPriceMax(e.target.value);
                }}
                placeholder='Max Price'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary h-[42px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              />
            </div>

            <div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategory("");
                  setPriceMin("");
                  setPriceMax("");
                }}
                className='w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition h-[42px] font-medium'>
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Cars Layout Distribution */}
        {loading ? (
          <Spinner message='Loading cars...' />
        ) : error ? (
          <div className='bg-red-100 text-red-800 p-4 rounded-lg'>
            <p>Error loading cars: {error}</p>
          </div>
        ) : carList.length > 0 ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {carList.map((car) => (
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
