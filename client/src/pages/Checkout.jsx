import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { getCarById, createBooking, confirmPayment } from "../api/api.js";
import toast from "react-hot-toast";
import { Spinner } from "../components/Spinner.jsx";
import { formatPrice } from "../utils/priceCalc.js";

export const Checkout = () => {
  // URL-dən gələn ID-ni alırıq (Bu route-dan asılı olaraq carId və ya bookingId ola bilər)
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Dashboard-dan və ya CarDetail-dən gələn dataları qəbul edirik
  const {
    startDate,
    endDate,
    car: stateCar,
    bookingId: stateBookingId,
    stateTotalDays,
    stateTotalPrice,
  } = location.state || {};

  // Əgər state-dən bookingId gəlibsə onu istifadə et, yoxdursa URL-dəki id-ni yoxla
  const bookingId =
    stateBookingId ||
    (location.pathname.includes("checkout") && !stateCar ? id : null);

  // Maşın ID-sini təyin edirik: Əgər stateCar obyektdirsə onun _id-si, stringdirsə özü, yoxdursa URL id-si
  const carId = stateCar?._id || (typeof stateCar === "string" ? stateCar : id);

  // Əgər elimizdə tam maşın obyekti yoxdursa və ya yalnız ID-si varsa, API-dən çəkirik
  const shouldFetchCar = !stateCar || typeof stateCar === "string";
  const { data: fetchedCar, loading } = useFetch(
    () => (shouldFetchCar && carId ? getCarById(carId) : Promise.resolve(null)),
    [carId, shouldFetchCar],
  );

  // Maşın məlumatını yekun olaraq təyin edirik
  const car = shouldFetchCar ? fetchedCar : stateCar;

  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [totalDays, setTotalDays] = useState(Number(stateTotalDays) || 1);
  const [totalPrice, setTotalPrice] = useState(Number(stateTotalPrice) || 0);
  const [pricePerDay, setPricePerDay] = useState(0); // <-- Qiymət qırılmasının qarşısını alan yeni state

  // Gün və Qiymət Hesablamasının Sinxronizasiyası
  useEffect(() => {
    // 1. Əgər dashboard-dan hazır qiymət və gün gəlibsə, birbaşa istifadə et
    if (stateTotalDays !== undefined && stateTotalPrice !== undefined) {
      const days = Number(stateTotalDays) || 1;
      const total = Number(stateTotalPrice) || 0;
      setTotalDays(days);
      setTotalPrice(total);

      // Günlük qiyməti maşından götür, yoxdursa ümumi qiyməti günə bölərək bərpa et
      if (car?.pricePerDay) {
        setPricePerDay(Number(car.pricePerDay));
      } else if (total > 0 && days > 0) {
        setPricePerDay(total / days);
      }
      return;
    }

    // 2. Əgər sıfırdan rezervasiya edilirsə və tarixlər + maşın qiyməti varsa
    if (startDate && endDate && car?.pricePerDay) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end - start);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        const price = Number(car.pricePerDay) || 0;

        setTotalDays(days);
        setPricePerDay(price);
        setTotalPrice(price * days);
        return;
      }
    }

    // 3. Fallback: Hər ehtimala qarşı car datası gəldikdə qiyməti yeniləsin
    if (car?.pricePerDay) {
      const price = Number(car.pricePerDay);
      setPricePerDay(price);
      if (!stateTotalPrice) {
        setTotalPrice(price * totalDays);
      }
    }
  }, [startDate, endDate, car, stateTotalDays, stateTotalPrice, totalDays]);

  const handleProcessBooking = async (actionType) => {
    try {
      setProcessing(true);
      const mockIntentId = `pi_mock_${Date.now()}`;

      // Ssenari A: Əgər Dashboard-dan gəlmişiksə (Artıq hazır bookingId var)
      if (bookingId) {
        toast.loading("Processing payment for your booking...");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await confirmPayment(bookingId, mockIntentId);

        toast.dismiss();
        toast.success("Payment successful! 🎉");
        navigate("/dashboard", { replace: true });
        return;
      }

      // Ssenari B: Sıfırdan rezervasiya edilir (CarDetail-dən gəlir)
      if (!carId || typeof carId !== "string") {
        toast.error("Car details are missing. Please try again.");
        return;
      }

      if (!startDate || !endDate) {
        toast.error("Missing booking dates. Please select dates again.");
        return;
      }

      if (actionType === "now") {
        toast.loading("Processing payment...");
      } else {
        toast.loading("Saving your booking...");
      }

      const bookingResponse = await createBooking({
        carId,
        startDate,
        endDate,
      });

      const responseData = bookingResponse?.data;
      if (!responseData || responseData.success === false) {
        throw new Error(responseData?.message || "Booking creation failed");
      }

      const createdBooking = responseData?.data || responseData;

      if (actionType === "later") {
        toast.dismiss();
        toast.success("Booking saved! You can pay later in your dashboard.");
        navigate("/dashboard", { replace: true });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));
      await confirmPayment(
        createdBooking._id || createdBooking.id,
        mockIntentId,
      );

      toast.dismiss();
      toast.success("Payment successful! 🎉");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || error.message || "Process failed",
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Spinner message='Loading checkout...' />;
  if (!car)
    return (
      <div className='text-center py-12 text-gray-600'>
        Car data could not be loaded.
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <button
          onClick={() => navigate(bookingId ? "/dashboard" : `/cars/${carId}`)}
          className='text-secondary hover:text-accent mb-6 font-semibold flex items-center gap-2 transition'>
          ← {bookingId ? "Back to Dashboard" : "Back to Car Details"}
        </button>

        <h1 className='text-4xl font-bold text-primary mb-8'>Checkout</h1>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Booking Summary */}
          <div className='bg-white rounded-lg shadow-lg p-6 h-fit'>
            <h2 className='text-2xl font-bold text-primary mb-6'>
              Booking Summary
            </h2>

            <div className='flex gap-4 mb-6'>
              {car.images && car.images.length > 0 && (
                <img
                  src={car.images[0].url || car.images[0]}
                  alt={`${car.make || "Car"} ${car.model || ""}`}
                  className='w-24 h-24 object-cover rounded-lg shadow-sm'
                />
              )}
              <div>
                <h3 className='text-xl font-bold text-primary'>
                  {car.make} {car.model}
                </h3>
                <p className='text-gray-600'>{car.year}</p>
                {startDate && endDate && (
                  <p className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2 inline-block font-medium'>
                    {startDate} — {endDate}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-3 border-t pt-4'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Price per Day:</span>
                <span className='font-semibold'>
                  {/* Birbaşa state-dən oxuyuruq, beləliklə 0 görünmə xətası tamamilə həll olur */}
                  {formatPrice(pricePerDay)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Number of Days:</span>
                <span className='font-semibold text-primary'>
                  {totalDays} days
                </span>
              </div>
              <div className='flex justify-between border-t pt-3 mt-3'>
                <span className='font-bold text-lg text-primary'>Total:</span>
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
              <div className='border-2 border-secondary rounded-lg p-4 cursor-pointer bg-amber-50/30'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='radio'
                    value='card'
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='text-secondary focus:ring-secondary'
                  />
                  <span className='font-semibold text-primary'>
                    Credit/Debit Card
                  </span>
                </label>
              </div>
            </div>

            <div className='space-y-4 mb-6'>
              <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
                <p className='text-sm text-blue-800'>
                  <strong>Demo Mode:</strong> This is a demo payment. Your
                  payment information is secure and not processed live.
                </p>
              </div>

              <div>
                <label className='block text-sm font-semibold mb-2 text-gray-700'>
                  Card Number
                </label>
                <input
                  type='text'
                  placeholder='4242 4242 4242 4242'
                  className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed'
                  disabled
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    Expiry
                  </label>
                  <input
                    type='text'
                    placeholder='MM/YY'
                    className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed'
                    disabled
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    CVC
                  </label>
                  <input
                    type='text'
                    placeholder='123'
                    className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed'
                    disabled
                  />
                </div>
              </div>
            </div>

            <div
              className={`grid ${bookingId ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
              {!bookingId && (
                <button
                  type='button'
                  onClick={() => handleProcessBooking("later")}
                  disabled={processing}
                  className='w-full bg-gray-500 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition disabled:opacity-50 text-sm md:text-base shadow-sm'>
                  Save & Pay Later
                </button>
              )}
              <button
                type='button'
                onClick={() => handleProcessBooking("now")}
                disabled={processing}
                className='w-full bg-secondary text-primary py-3 rounded-lg hover:bg-accent transition disabled:opacity-50 text-sm md:text-base shadow-md font-semibold'>
                {processing
                  ? "Processing..."
                  : `Pay ${formatPrice(totalPrice)}`}
              </button>
            </div>

            <p className='text-xs text-gray-500 text-center mt-4'>
              By continuing, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
