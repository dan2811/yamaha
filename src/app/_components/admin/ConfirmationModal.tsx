import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        <p className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to delete this item?</p>
        <div className="flex justify-end space-x-3">
        <button onClick={onConfirm} disabled={isLoading} className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
              isLoading ? 'bg-purple-300' : 'bg-purple-500 hover:bg-purple-600'
            }`}>
          {isLoading ? 'Deleting...' : 'Yes'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;