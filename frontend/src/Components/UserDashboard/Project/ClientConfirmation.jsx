import React, { useState } from "react";

const ClientConfirmation = ({ stage, onClientConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setConfirmationMessage("");
  };

  const handleConfirm = () => {
    onClientConfirm(stage.name, confirmationMessage, true);
    handleCloseModal();
  };

  const handleReject = () => {
    onClientConfirm(
      stage.notify.stageDetails.stageName,
      confirmationMessage,
      false
    );
    handleCloseModal();
  };

  return (
    <div className="notify p-4 bg-gray-800 rounded-xl shadow-md">
      {stage.notify && (
        <div className="message">
          <h1 className="text-xl text-gray-200 text-center mb-4">
            Admin Notification
          </h1>
          <p>
            <strong>Message:</strong>{" "}
            <span className="text-gray-300">{stage.notify.message}</span>
          </p>
          <p>
            <strong>Date:</strong>{" "}
            <span className="text-gray-300">
              {new Date(stage.notify.sentAt).toLocaleDateString()}{" "}
              {new Date(stage.notify.sentAt).toLocaleTimeString()}
            </span>
          </p>
          <p className="mt-4">
            <strong>Stage:</strong> {stage.notify.stageDetails.stageName} -{" "}
            {stage.notify.stageDetails.isCompleted ? (
              <span className="text-green-500">Completed</span>
            ) : (
              <span className="text-red-500">Not Completed</span>
            )}
          </p>
          <button
            type="button"
            onClick={handleOpenModal}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
          >
            Respond to Notification
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Stage Approval</h2>
            <textarea
              className="w-full p-2 border bg-white/20 border-gray-300 rounded-md mb-4"
              placeholder="Enter your message (optional)"
              value={confirmationMessage}
              onChange={(e) => setConfirmationMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                onClick={handleConfirm}
              >
                Approve
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleReject}
              >
                Reject
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientConfirmation;
