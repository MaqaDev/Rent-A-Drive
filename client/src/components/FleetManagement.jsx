import { useState, useEffect, useRef } from "react";
import { FiEdit2, FiTrash2, FiChevronDown, FiCheck } from "react-icons/fi";
import { Spinner, EmptyState } from "./Spinner.jsx";
import { formatPrice } from "../utils/priceCalc.js";

const AvailabilityDropdown = ({ car, onToggleAvailable }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (value) => {
    setOpen(false);
    if (value !== car.available) onToggleAvailable({ ...car, available: value });
  };

  return (
    <div ref={ref} className='relative inline-block'>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition hover:opacity-80 cursor-pointer ${car.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {car.available ? "Available" : "Unavailable"}
        <FiChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className='absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[130px] overflow-hidden'>
          <button
            onClick={() => handleSelect(true)}
            className='w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 transition'>
            Available
            {car.available && <FiCheck size={12} />}
          </button>
          <button
            onClick={() => handleSelect(false)}
            className='w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition'>
            Unavailable
            {!car.available && <FiCheck size={12} />}
          </button>
        </div>
      )}
    </div>
  );
};

const MobileCarCard = ({ car, onEdit, onDelete, onToggleAvailable }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='border-b border-gray-100 last:border-0'>
      <button
        onClick={() => setExpanded((p) => !p)}
        className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition'>
        <img
          src={car.image || "https://via.placeholder.com/150"}
          alt={car.make}
          className='w-12 h-8 object-cover rounded border bg-gray-100 shrink-0'
        />
        <div className='flex-1 min-w-0'>
          <p className='font-semibold text-primary text-sm truncate'>
            {car.make} {car.model}
          </p>
          <p className='text-xs text-gray-400 capitalize truncate'>
            {car.transmission} • {car.fuelType}
          </p>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${car.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {car.available ? "Available" : "Unavailable"}
        </span>
        <FiChevronDown
          size={16}
          className={`text-gray-400 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className='px-4 pb-4 bg-gray-50 space-y-3'>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div>
              <span className='text-gray-400 text-xs'>Year</span>
              <p className='font-semibold text-gray-700'>{car.year}</p>
            </div>
            <div>
              <span className='text-gray-400 text-xs'>Rate / Day</span>
              <p className='font-bold text-secondary'>{formatPrice(car.pricePerDay)}</p>
            </div>
          </div>

          <div className='flex items-center gap-2 pt-1'>
            <span className='text-xs text-gray-500 font-medium'>Availability:</span>
            <AvailabilityDropdown car={car} onToggleAvailable={onToggleAvailable} />
          </div>

          <div className='flex gap-2 pt-1'>
            <button
              onClick={() => onEdit(car)}
              className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition'>
              <FiEdit2 size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete(car._id)}
              className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition'>
              <FiTrash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const FleetManagement = ({ cars, loading, onEdit, onDelete, onToggleAvailable }) => {
  if (loading) return <Spinner message='Loading vehicle directory...' />;
  if (!cars || cars.length === 0)
    return <EmptyState message='No vehicles deployed in fleet yet' />;

  return (
    <div>
      {/* Mobile cards */}
      <div className='md:hidden divide-y divide-gray-100'>
        {cars.map((car) => (
          <MobileCarCard
            key={car._id}
            car={car}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleAvailable={onToggleAvailable}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider border-b'>
              <th className='px-6 py-4'>Thumbnail</th>
              <th className='px-6 py-4'>Vehicle Specs</th>
              <th className='px-6 py-4'>Year</th>
              <th className='px-6 py-4'>Rate / Day</th>
              <th className='px-6 py-4'>Availability</th>
              <th className='px-6 py-4 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100 text-sm text-gray-600'>
            {cars.map((car) => (
              <tr key={car._id} className='hover:bg-gray-50 transition'>
                <td className='px-6 py-4'>
                  <img
                    src={car.image || "https://via.placeholder.com/150"}
                    alt={car.make}
                    className='w-16 h-10 object-cover rounded border bg-gray-100'
                  />
                </td>
                <td className='px-6 py-4 font-semibold text-primary text-base'>
                  {car.make} {car.model}
                  <span className='block text-xs font-normal text-gray-500 capitalize'>
                    {car.transmission} • {car.fuelType}
                  </span>
                </td>
                <td className='px-6 py-4'>{car.year}</td>
                <td className='px-6 py-4 font-bold text-secondary'>
                  {formatPrice(car.pricePerDay)}
                </td>
                <td className='px-6 py-4'>
                  <AvailabilityDropdown car={car} onToggleAvailable={onToggleAvailable} />
                </td>
                <td className='px-6 py-4 flex gap-4 justify-center items-center pt-6'>
                  <button
                    onClick={() => onEdit(car)}
                    className='text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition'>
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(car._id)}
                    className='text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition'>
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
