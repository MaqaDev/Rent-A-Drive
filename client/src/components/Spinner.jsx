export const Spinner = ({ message = "Loading..." }) => {
  return (
    <div className='flex flex-col items-center justify-center py-12'>
      <div className='animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-secondary mb-4'></div>
      <p className='text-gray-600 font-semibold'>{message}</p>
    </div>
  );
};

export const EmptyState = ({ message = "No data found", icon: Icon }) => {
  return (
    <div className='flex flex-col items-center justify-center py-16'>
      {Icon && (
        <Icon
          size={48}
          className='text-gray-400 mb-4'
        />
      )}
      <p className='text-gray-500 text-lg'>{message}</p>
    </div>
  );
};
