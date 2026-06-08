import { FiX } from "react-icons/fi";

export const CarFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  selectedCar,
}) => {
  if (!isOpen) return null;

  const handleNumberKeyDown = (e) => {
    if (["-", "+", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleNumberWheel = (e) => {
    e.target.blur();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm flex flex-col justify-end sm:justify-center sm:items-center sm:p-4'>
      <div className='bg-white rounded-t-2xl sm:rounded-xl shadow-2xl sm:max-w-lg w-full flex flex-col max-h-[90%] sm:max-h-[90vh] border border-gray-100'>
        <div className='flex justify-between items-center px-5 py-4 sm:p-6 border-b bg-gray-50 shrink-0 rounded-t-2xl sm:rounded-t-xl'>
          <h3 className='text-lg sm:text-xl font-bold text-primary'>
            {selectedCar
              ? `Edit: ${selectedCar.make} ${selectedCar.model}`
              : "Register New Fleet Vehicle"}
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition'>
            <FiX size={24} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className='px-5 py-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0'>
          {/* Make & Model */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                Brand (Make)
              </label>
              <input
                type='text'
                required
                value={formData.make}
                onChange={(e) =>
                  setFormData({ ...formData, make: e.target.value })
                }
                className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm'
                placeholder='e.g. BMW'
              />
            </div>
            <div>
              <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                Model Variant
              </label>
              <input
                type='text'
                required
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm'
                placeholder='e.g. M4'
              />
            </div>
          </div>

          {/* Year & Price */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                Production Year
              </label>
              <input
                type='number'
                required
                min='1900'
                max='2027'
                onKeyDown={handleNumberKeyDown}
                onWheel={handleNumberWheel}
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                placeholder='e.g. 2023'
              />
            </div>
            <div>
              <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                Daily Rate ($)
              </label>
              <input
                type='number'
                required
                min='1'
                onKeyDown={handleNumberKeyDown}
                onWheel={handleNumberWheel}
                value={formData.pricePerDay}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerDay: e.target.value })
                }
                className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                placeholder='e.g. 120'
              />
            </div>
          </div>

          {/* Category & Seats */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white text-sm'>
                <option value=''>Select category</option>
                <option value='sedan'>Sedan</option>
                <option value='suv'>SUV</option>
                <option value='luxury'>Luxury</option>
                <option value='economy'>Economy</option>
              </select>
            </div>
            <div>
              <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                Seats
              </label>
              <input
                type='number'
                required
                min='1'
                max='9'
                onKeyDown={handleNumberKeyDown}
                onWheel={handleNumberWheel}
                value={formData.seats}
                onChange={(e) =>
                  setFormData({ ...formData, seats: e.target.value })
                }
                className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                placeholder='e.g. 5'
              />
            </div>
          </div>

          {/* Transmission & Fuel Type */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                Gearbox
              </label>
              <select
                value={formData.transmission}
                onChange={(e) =>
                  setFormData({ ...formData, transmission: e.target.value })
                }
                className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white text-sm'>
                <option value='auto'>Automatic</option>
                <option value='manual'>Manual</option>
              </select>
            </div>
            <div>
              <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                Energy Source
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) =>
                  setFormData({ ...formData, fuelType: e.target.value })
                }
                className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white text-sm'>
                <option value='petrol'>Petrol</option>
                <option value='diesel'>Diesel</option>
                <option value='electric'>Electric</option>
                <option value='hybrid'>Hybrid</option>
              </select>
            </div>
          </div>

          {/* Mileage & Engine Size */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                Mileage (km)
              </label>
              <input
                type='number'
                required
                min='0'
                onKeyDown={handleNumberKeyDown}
                onWheel={handleNumberWheel}
                value={formData.mileage}
                onChange={(e) =>
                  setFormData({ ...formData, mileage: e.target.value })
                }
                className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                placeholder='e.g. 15000'
              />
            </div>
            <div>
              <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
                Engine Size
              </label>
              <input
                type='text'
                required
                value={formData.engineSize}
                onChange={(e) =>
                  setFormData({ ...formData, engineSize: e.target.value })
                }
                className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm'
                placeholder='e.g. 2.0L'
              />
            </div>
          </div>

          {/* Fuel Consumption */}
          <div>
            <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
              Fuel Consumption
            </label>
            <input
              type='text'
              required
              value={formData.fuelConsumption}
              onChange={(e) =>
                setFormData({ ...formData, fuelConsumption: e.target.value })
              }
              className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm'
              placeholder='e.g. 8L/100km'
            />
          </div>

          {/* Image URL */}
          <div>
            <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>
              Direct Image URL
            </label>
            <input
              type='text'
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className='w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm'
              placeholder='https://images.unsplash.com/...'
            />
          </div>

          {/* Available checkbox */}
          <div className='flex items-center gap-2 pt-2'>
            <input
              type='checkbox'
              id='available'
              checked={formData.available}
              onChange={(e) =>
                setFormData({ ...formData, available: e.target.checked })
              }
              className='w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary cursor-pointer'
            />
            <label
              htmlFor='available'
              className='text-sm font-semibold text-gray-700 select-none cursor-pointer'>
              Available for client booking immediately
            </label>
          </div>

          {/* Buttons */}
          <div className='flex gap-3 justify-end pt-4 border-t'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 text-sm transition'>
              Dismiss
            </button>
            <button
              type='submit'
              className='px-5 py-2.5 rounded-lg bg-secondary text-primary font-bold text-sm transition shadow-md hover:bg-accent'>
              {selectedCar ? "Update Specs" : "Deploy Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
