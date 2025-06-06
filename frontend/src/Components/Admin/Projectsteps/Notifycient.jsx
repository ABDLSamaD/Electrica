import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const NotifyClientModal = ({ onClose, projectId, baackendURL, stageName }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSendNotification = async () => {
    if (!message.trim()) {
      setAlert({ type: "error", message: "Message cannot be empty." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${baackendURL}/api/adminauth/notify-client`,
        { projectId, stageName, message },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setAlert({ type: "success", message: "message was sent success" });
        setMessage(""); // Clear the message field
      } else {
        setIsLoading(false);
        setAlert({ type: "error", message: response.data.message });
      }
    } catch (error) {
      setIsLoading(false);
      setAlert({
        type: "error",
        message:
          error.response?.data?.message || "Failed to send notification.",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 bg-black/50">
      <div className="bg-gray-800 top-52 p-6 rounded-lg shadow-lg text-gray-200 w-96 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl hover:text-red-500"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Notify Client for Stage Completion
        </h2>

        {/* Alert Section */}
        {alert && (
          <div
            className={`p-3 mb-4 rounded ${
              alert.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Input Section */}
        <textarea
          rows="4"
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Write a message to notify the client..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Buttons */}
        <button
          onClick={handleSendNotification}
          disabled={isLoading}
          className={`w-full py-2 rounded font-semibold ${
            isLoading
              ? "bg-blue-500 text-gray-800"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          } flex items-center justify-center gap-2`}
        >
          {isLoading ? (
            <span>Sending...</span>
          ) : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} /> Send Notification
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotifyClientModal;
