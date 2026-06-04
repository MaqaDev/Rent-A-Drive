import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { getCarById } from "../api/api.js";
import { createPaymentIntent, confirmPayment } from "../api/api.js";
import toast from "react-hot-toast";
import { Spinner } from "../components/Spinner.jsx";
import {
  formatPrice,
  calculateDays,
  calculateTotal,
} from "../utils/priceCalc.js";
import { formatDate } from "../utils/formatDate.js";

export const Checkout = ({ bookingData }) => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { data: car, loading } = useFetch(() => getCarById(carId), [carId]);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleMockPayment = async () => {
    try {
      setProcessing(true);

      // For demo purposes, simulate payment
      toast.loading("Processing payment...");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success
      const mockIntentId = `pi_mock_${Date.now()}`;
      await confirmPayment(bookingData?._id || carId, mockIntentId);

      toast.dismiss();
      toast.success("Payment successful! 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Spinner message='Loading checkout...' />;
  if (!car) return <div className='text-center py-12'>Car not found</div>;

  const totalDays = bookingData?.totalDays || 3;
  const totalPrice = bookingData?.totalPrice || car.pricePerDay * totalDays;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <h1 className='text-4xl font-bold text-primary mb-8'>Checkout</h1>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Booking Summary */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-primary mb-6'>
              Booking Summary
            </h2>

            <div className='flex gap-4 mb-6'>
              {car.images && car.images.length > 0 && (
                <img
                  src={car.images[0].url}
                  alt={`${car.make} ${car.model}`}
                  className='w-24 h-24 object-cover rounded-lg'
                />
              )}
              <div>
                <h3 className='text-xl font-bold text-primary'>
                  {car.make} {car.model}
                </h3>
                <p className='text-gray-600'>{car.year}</p>
              </div>
            </div>

            <div className='space-y-3 border-t pt-4'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Price per Day:</span>
                <span className='font-semibold'>
                  {formatPrice(car.pricePerDay)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Number of Days:</span>
                <span className='font-semibold'>{totalDays}</span>
              </div>
              <div className='flex justify-between border-t pt-3 mt-3'>
                <span className='font-bold text-lg'>Total:</span>
                <span className='font-bold text-2xl text-secondary'>
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-primary mb-6'>
              Payment Details
            </h2>

            <div className='space-y-4 mb-6'>
              <div className='border-2 border-secondary rounded-lg p-4 cursor-pointer'>
                <label className='flex items-center gap-3'>
                  <input
                    type='radio'
                    value='card'
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className='font-semibold'>Credit/Debit Card</span>
                </label>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className='space-y-4 mb-6'>
                <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
                  <p className='text-sm text-blue-800'>
                    <strong>Demo Mode:</strong> This is a demo payment. Your
                    payment information is not processed.
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2'>
                    Card Number
                  </label>
                  <input
                    type='text'
                    placeholder='4242 4242 4242 4242'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'
                    disabled
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>
                      Expiry
                    </label>
                    <input
                      type='text'
                      placeholder='MM/YY'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'
                      disabled
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>
                      CVC
                    </label>
                    <input
                      type='text'
                      placeholder='123'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleMockPayment}
              disabled={processing}
              className='w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-accent transition disabled:opacity-50'>
              {processing ? "Processing..." : `Pay ${formatPrice(totalPrice)}`}
            </button>

            <p className='text-xs text-gray-500 text-center mt-4'>
              By continuing, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
