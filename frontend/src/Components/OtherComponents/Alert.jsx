import React, { useEffect, useState } from 'react';

const Alert = ({ type = 'info', message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const typeClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  return (
    <div
      className={`fixed top-4 z-50 left-1/2 transform -translate-x-1/2 p-2 w-full h-auto rounded-md border ${typeClasses[type]} shadow-md max-w-md`}
      role="alert"
    >
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default Alert;