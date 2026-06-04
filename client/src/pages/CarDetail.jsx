import { useParams } from "react-router-dom";
import { useState } from "react";
import { useFetch } from "../hooks/useFetch.js";
import { getCarById, createBooking } from "../api/api.js";
import { Spinner, EmptyState } from "../components/Spinner.jsx";
import { formatPrice } from "../utils/priceCalc.js";
import { formatDate } from "../utils/formatDate.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: car, loading, error } = useFetch(() => getCarById(id), [id]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [booking, setBooking] = useState(false);

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both dates");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setBooking(true);
      const response = await createBooking({
        carId: id,
        startDate,
        endDate,
      });

      if (response.data.success) {
        toast.success("Booking created! Proceeding to payment...");
        navigate(`/checkout/${response.data.data._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Spinner message='Loading car details...' />;
  if (error) return <EmptyState message={`Error: ${error}`} />;
  if (!car) return <EmptyState message='Car not found' />;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-5xl mx-auto px-4'>
        <button
          onClick={() => navigate("/cars")}
          className='text-secondary hover:text-accent mb-6 font-semibold'>
          ← Back to Cars
        </button>

        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          {/* Image Gallery */}
          <div className='grid md:grid-cols-2 gap-6 p-6'>
            <div>
              <div className='bg-gray-300 rounded-lg h-96 flex items-center justify-center overflow-hidden'>
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0].url}
                    alt={`${car.make} ${car.model}`}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <p className='text-gray-400'>No image available</p>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <h1 className='text-4xl font-bold text-primary mb-2'>
                {car.make} {car.model}
              </h1>
              <p className='text-gray-600 mb-4'>{car.description}</p>

              <div className='space-y-3 mb-6'>
                <div className='flex justify-between'>
                  <span className='font-semibold'>Year:</span>
                  <span>{car.year}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-semibold'>Category:</span>
                  <span className='capitalize bg-blue-100 text-blue-800 px-3 py-1 rounded'>
                    {car.category}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-semibold'>Transmission:</span>
                  <span className='capitalize'>{car.transmission}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-semibold'>Seats:</span>
                  <span>{car.seats}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-semibold'>Location:</span>
                  <span>{car.location}</span>
                </div>
              </div>

              {/* Booking Form */}
              <div className='bg-gray-100 p-6 rounded-lg'>
                <h2 className='text-2xl font-bold text-primary mb-4'>
                  Book This Car
                </h2>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>
                      Check-in Date
                    </label>
                    <input
                      type='date'
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold mb-2'>
                      Check-out Date
                    </label>
                    <input
                      type='date'
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    />
                  </div>

                  <div className='border-t pt-4'>
                    <div className='flex justify-between mb-3'>
                      <span className='font-semibold'>Price per Day:</span>
                      <span className='text-lg font-bold text-secondary'>
                        {formatPrice(car.pricePerDay)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={booking}
                    className='w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-accent transition disabled:opacity-50'>
                    {booking ? "Processing..." : "Continue to Booking"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className='border-t p-6'>
              <h3 className='text-xl font-bold text-primary mb-4'>Features</h3>
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {car.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className='bg-blue-50 border-l-4 border-secondary p-3 rounded'>
                    <p className='text-gray-700'>✓ {feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
