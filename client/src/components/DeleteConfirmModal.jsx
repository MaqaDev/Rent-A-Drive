import { FiAlertTriangle } from "react-icons/fi";

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm'>
      <div className='bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100 animate-fadeIn'>
        <div className='flex items-center gap-3 text-red-500 mb-4'>
          <FiAlertTriangle className='text-3xl shrink-0' />
          <h3 className='text-xl font-bold text-gray-900'>
            Decommission Vehicle
          </h3>
        </div>
        <p className='text-gray-600 mb-6 leading-relaxed'>
          Are you sure you want to permanently remove this vehicle from the
          active fleet registry? This action cannot be undone.
        </p>
        <div className='flex gap-3 justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 text-sm transition'>
            No, Keep It
          </button>
          <button
            onClick={onConfirm}
            className='px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition shadow-md shadow-red-100'>
            Yes, Delete Car
          </button>
        </div>
      </div>
    </div>
  );
};
