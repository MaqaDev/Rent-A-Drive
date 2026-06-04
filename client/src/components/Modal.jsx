export const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto'>
        <div className='sticky top-0 bg-primary text-white p-4 flex justify-between items-center'>
          <h2 className='text-xl font-bold'>{title}</h2>
          <button
            onClick={onClose}
            className='text-2xl hover:text-gray-200 transition'>
            ×
          </button>
        </div>
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
};
