import { useState, useEffect } from "react";
import { getAllCars, createCar, updateCar, deleteCar } from "../../api/api.js";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiRefreshCw } from "react-icons/fi";

export const CarsAdmin = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null); // Edit edəndə dolacaq, add edəndə null qalacaq

  // Form State
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    pricePerDay: "",
    transmission: "automatic",
    fuelType: "petrol",
    image: "",
    available: true,
  });

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await getAllCars();
      // API-dən gələn datanın strukturuna uyğun olaraq (res.data və ya res.data.data) tənzimləyin
      setCars(res.data?.data || res.data || []);
    } catch (error) {
      toast.error("Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleOpenModal = (car = null) => {
    if (car) {
      setSelectedCar(car);
      setFormData({
        make: car.make || "",
        model: car.model || "",
        year: car.year || "",
        pricePerDay: car.pricePerDay || "",
        transmission: car.transmission || "automatic",
        fuelType: car.fuelType || "petrol",
        image: car.image || "",
        available: car.available !== undefined ? car.available : true,
      });
    } else {
      setSelectedCar(null);
      setFormData({
        make: "",
        model: "",
        year: "",
        pricePerDay: "",
        transmission: "automatic",
        fuelType: "petrol",
        image: "",
        available: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleAvailable = async (car) => {
    try {
      await updateCar(car._id, { available: !car.available });
      toast.success(
        `${car.make} ${car.model} marked as ${!car.available ? "Available" : "Unavailable"}`
      );
      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await deleteCar(carId);
        toast.success("Car removed successfully");
        fetchCars();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete car");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCar) {
        // Update Car Info
        await updateCar(selectedCar._id, formData);
        toast.success("Car updated successfully");
      } else {
        // Add New Car
        await createCar(formData);
        toast.success("New car added successfully");
      }
      setIsModalOpen(false);
      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-primary'>
            Car Fleet Management
          </h1>
          <p className='text-sm text-gray-600'>
            Add, remove, or update vehicles in your fleet
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className='flex items-center gap-2 bg-secondary text-primary font-bold px-4 py-2.5 rounded-lg hover:bg-accent transition shadow-sm'>
          <FiPlus className='text-lg' /> Add New Car
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center py-12'>
          <FiRefreshCw className='animate-spin text-4xl text-secondary' />
        </div>
      ) : (
        <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-100 text-gray-700 text-sm font-semibold uppercase border-b'>
                <th className='p-4'>Image</th>
                <th className='p-4'>Car Details</th>
                <th className='p-4'>Year</th>
                <th className='p-4'>Price / Day</th>
                <th className='p-4'>Status</th>
                <th className='p-4 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 text-gray-600 text-sm'>
              {cars.map((car) => (
                <tr
                  key={car._id}
                  className='hover:bg-gray-50 transition'>
                  <td className='p-4'>
                    <img
                      src={car.image || "https://via.placeholder.com/150"}
                      alt={car.make}
                      className='w-16 h-10 object-cover rounded border'
                    />
                  </td>
                  <td className='p-4 font-semibold text-primary text-base'>
                    {car.make} {car.model}
                    <span className='block text-xs font-normal text-gray-500 capitalize'>
                      {car.transmission} • {car.fuelType}
                    </span>
                  </td>
                  <td className='p-4'>{car.year}</td>
                  <td className='p-4 font-bold text-secondary'>
                    ${car.pricePerDay}
                  </td>
                  <td className='p-4'>
                    <button
                      onClick={() => handleToggleAvailable(car)}
                      title='Click to toggle availability'
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition hover:opacity-75 cursor-pointer ${car.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {car.available ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className='p-4 flex gap-3 justify-center items-center h-full pt-6'>
                    <button
                      onClick={() => handleOpenModal(car)}
                      className='text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded transition'
                      title='Edit Car'>
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(car._id)}
                      className='text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded transition'
                      title='Delete Car'>
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-fadeIn'>
            <div className='flex justify-between items-center p-6 border-b bg-gray-50'>
              <h3 className='text-xl font-bold text-primary'>
                {selectedCar ? "Update Car Details" : "Add New Vehicle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-500 hover:text-gray-700'>
                <FiX size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className='p-6 space-y-4 max-h-[75vh] overflow-y-auto'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                    Make (Brand)
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.make}
                    onChange={(e) =>
                      setFormData({ ...formData, make: e.target.value })
                    }
                    className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none'
                    placeholder='e.g. Mercedes-Benz'
                  />
                </div>
                <div>
                  <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                    Model
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none'
                    placeholder='e.g. C200'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                    Year
                  </label>
                  <input
                    type='number'
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none'
                    placeholder='e.g. 2022'
                  />
                </div>
                <div>
                  <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                    Price Per Day ($)
                  </label>
                  <input
                    type='number'
                    required
                    value={formData.pricePerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerDay: e.target.value })
                    }
                    className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none'
                    placeholder='e.g. 75'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                    Transmission
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) =>
                      setFormData({ ...formData, transmission: e.target.value })
                    }
                    className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white'>
                    <option value='automatic'>Automatic</option>
                    <option value='manual'>Manual</option>
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                    Fuel Type
                  </label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) =>
                      setFormData({ ...formData, fuelType: e.target.value })
                    }
                    className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white'>
                    <option value='petrol'>Petrol</option>
                    <option value='diesel'>Diesel</option>
                    <option value='electric'>Electric</option>
                    <option value='hybrid'>Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                  Image URL
                </label>
                <input
                  type='text'
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none'
                  placeholder='https://example.com/car-image.jpg'
                />
              </div>

              <div className='flex items-center gap-2 pt-2'>
                <input
                  type='checkbox'
                  id='available'
                  checked={formData.available}
                  onChange={(e) =>
                    setFormData({ ...formData, available: e.target.checked })
                  }
                  className='w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary'
                />
                <label
                  htmlFor='available'
                  className='text-sm font-semibold text-gray-700 select-none cursor-pointer'>
                  Available for rent immediately
                </label>
              </div>

              <div className='flex gap-3 justify-end pt-4 border-t'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 text-sm transition'>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-5 py-2.5 rounded-lg bg-secondary text-primary font-bold text-sm transition shadow-md hover:bg-accent'>
                  {selectedCar ? "Save Changes" : "Create Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
