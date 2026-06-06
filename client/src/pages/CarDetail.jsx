import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch.js";
import { getCarById } from "../api/api.js";
import { Spinner, EmptyState } from "../components/Spinner.jsx";
import { formatPrice } from "../utils/priceCalc.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker-custom.css";
import toast from "react-hot-toast";

export const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: car, loading, error } = useFetch(() => getCarById(id), [id]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    if (car?.bookings && Array.isArray(car.bookings)) {
      const dates = car.bookings.map((b) => ({
        start: new Date(b.startDate),
        end: new Date(b.endDate),
      }));
      setBookedDates(dates);
    }
  }, [car]);

  const getMaxEndDate = () => {
    if (!startDate) return null;

    const nextBookings = bookedDates
      .filter((range) => range.start > startDate)
      .sort((a, b) => a.start - b.start);

    if (nextBookings.length > 0) {
      const maxDate = new Date(nextBookings[0].start);
      maxDate.setDate(maxDate.getDate() - 1);
      return maxDate;
    }
    return null;
  };

  const handleBooking = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both dates");
      return;
    }

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    navigate(`/checkout/${id}`, {
      state: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        car,
      },
    });
  };

  if (loading) return <Spinner message='Loading car details...' />;
  if (error) return <EmptyState message={`Error: ${error}`} />;
  if (!loading && !car) return <EmptyState message='Car not found' />;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-5xl mx-auto px-4'>
        <button
          onClick={() => navigate("/cars")}
          className='text-secondary hover:text-accent mb-6 font-semibold'>
          ← Back to Cars
        </button>
        <div className='grid md:grid-cols-2 gap-6 p-6'>
          <div>
            <div className='bg-gray-300 rounded-lg h-96 flex items-center justify-center overflow-hidden mb-6'>
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

            {car.features && car.features.length > 0 && (
              <div className='bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm'>
                <h3 className='text-2xl font-bold text-primary mb-4'>
                  Features
                </h3>
                <div className='grid grid-cols-2 gap-3'>
                  {car.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className='bg-blue-50 border-l-4 border-secondary p-3.5 rounded-lg flex items-center transition hover:bg-blue-100/50'>
                      <span className='text-secondary text-lg font-bold mr-2.5'>
                        ✓
                      </span>
                      <p className='text-base text-gray-800 font-semibold capitalize'>
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
                <span className='font-semibold'>Mileage:</span>
                <span>
                  {car.mileage ? `${car.mileage.toLocaleString()} km` : "N/A"}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-semibold'>Engine Size:</span>
                <span>{car.engineSize || "N/A"}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-semibold'>Fuel Consumption:</span>
                <span>{car.fuelConsumption || "N/A"}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-semibold'>Location:</span>
                <span>{car.location}</span>
              </div>
            </div>

            <div className='bg-gray-100 p-6 rounded-lg'>
              <h2 className='text-2xl font-bold text-primary mb-4'>
                Book This Car
              </h2>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-semibold mb-2'>
                    Check-in Date
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      setEndDate(null);
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    excludeDateIntervals={bookedDates}
                    placeholderText='Select start date'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary bg-white'
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2'>
                    Check-out Date
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    maxDate={getMaxEndDate()}
                    excludeDateIntervals={bookedDates}
                    placeholderText='Select end date'
                    disabled={!startDate}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary bg-white disabled:bg-gray-200'
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
                  className='w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-accent transition'>
                  Continue to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
