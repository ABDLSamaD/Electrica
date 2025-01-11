import React, { useState } from "react";

const ClientConfirmation = ({ onConfirm, finished }) => {
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleConfirm = () => {
    // Trigger the confirmation action (e.g., API call)
    onConfirm();
    setInterval(() => {
      setConfirmationMessage("Thank you! Your confirmation has been received.");
    }, 2000);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Client Confirmation</h2>
      <p className="mb-6">
        Please confirm that the project stage is complete and all requirements
        have been met to your satisfaction. Click the button below to confirm.
      </p>
      <button
        onClick={handleConfirm}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Confirm Completion
      </button>
      {confirmationMessage && (
        <div className="mt-4 bg-green-200 text-green-800 p-3 rounded">
          {confirmationMessage}
        </div>
      )}
    </div>
  );
};

export default ClientConfirmation;
