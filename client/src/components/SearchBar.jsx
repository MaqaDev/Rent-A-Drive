import { FiSearch } from "react-icons/fi";

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div
      className={`relative shadow-sm rounded-xl overflow-hidden border bg-white focus-within:ring-2 focus-within:ring-secondary transition-all ${className}`}>
      <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none'>
        <FiSearch size={18} />
      </span>
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full pl-11 pr-4 py-2.5 text-sm outline-none border-none text-gray-700 placeholder-gray-400'
      />
    </div>
  );
};
