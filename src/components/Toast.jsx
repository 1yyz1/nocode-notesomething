import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <AlertCircle className="h-5 w-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg border ${bgColors[type]} shadow-lg max-w-sm`}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="ml-3 text-sm font-medium text-gray-800">
        {message}
      </div>
      <button 
        onClick={onClose}
        className="ml-auto text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
