import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useFetch } from "../hooks/useFetch.js";
import { getAllCars } from "../api/api.js";
import { Spinner } from "../components/Spinner.jsx";
import {
  FiArrowRight,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: cars, loading } = useFetch(() => getAllCars({ limit: 6 }), []);

  const featuredCars = cars?.slice(0, 3) || [];

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-primary to-gray-900 text-white py-20 px-4'>
        <div className='max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center'>
          <div>
            <h1 className='text-5xl md:text-6xl font-bold mb-6'>
              Drive Your Dream Car Today
            </h1>
            <p className='text-xl text-gray-300 mb-8'>
              Affordable, reliable car rentals for every occasion. Book in
              minutes, drive with confidence.
            </p>
            <button
              onClick={() => navigate("/cars")}
              className='bg-secondary text-primary font-bold px-8 py-4 rounded-lg hover:bg-accent transition text-lg flex items-center gap-2'>
              Browse Cars <FiArrowRight />
            </button>
          </div>
          <div className='text-center'>
            <div className='text-8xl'>🚗</div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className='py-16 px-4 bg-gray-50'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl font-bold text-primary mb-12 text-center'>
            Featured Cars
          </h2>

          {loading ? (
            <Spinner message='Loading featured cars...' />
          ) : (
            <div className='grid md:grid-cols-3 gap-8'>
              {featuredCars.map((car) => (
                <div
                  key={car._id}
                  className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition'>
                  <div className='h-48 bg-gray-300 flex items-center justify-center'>
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[0].url}
                        alt={`${car.make} ${car.model}`}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='text-gray-400'>No image</div>
                    )}
                  </div>
                  <div className='p-6'>
                    <h3 className='text-xl font-bold text-primary mb-2'>
                      {car.make} {car.model}
                    </h3>
                    <p className='text-gray-600 mb-4'>${car.pricePerDay}/day</p>
                    <button
                      onClick={() => navigate(`/cars/${car._id}`)}
                      className='w-full bg-secondary text-primary font-semibold py-2 rounded-lg hover:bg-accent transition'>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className='py-16 px-4'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl font-bold text-primary mb-12 text-center'>
            How It Works
          </h2>
          <div className='grid md:grid-cols-4 gap-8'>
            {[
              {
                icon: FiCheckCircle,
                title: "Browse",
                desc: "Explore our fleet of vehicles",
              },
              {
                icon: FiTrendingUp,
                title: "Select Dates",
                desc: "Choose your rental period",
              },
              {
                icon: FiUsers,
                title: "Book & Pay",
                desc: "Secure payment processing",
              },
              {
                icon: FiArrowRight,
                title: "Enjoy",
                desc: "Drive and enjoy your trip",
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className='text-center'>
                  <div className='bg-secondary text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                    <Icon size={32} />
                  </div>
                  <h3 className='text-xl font-bold text-primary mb-2'>
                    {step.title}
                  </h3>
                  <p className='text-gray-600'>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-primary text-white py-16 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl font-bold mb-4'>Ready to Get Started?</h2>
          <p className='text-xl text-gray-300 mb-8'>
            {isAuthenticated
              ? "Browse our full fleet and find your perfect car."
              : "Create an account to start booking your next adventure."}
          </p>
          <button
            onClick={() => navigate(isAuthenticated ? "/cars" : "/register")}
            className='bg-secondary text-primary font-bold px-8 py-4 rounded-lg hover:bg-accent transition text-lg'>
            {isAuthenticated ? "Browse Cars" : "Sign Up Now"}
          </button>
        </div>
      </section>
    </div>
  );
};
