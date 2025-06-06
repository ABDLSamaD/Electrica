import React, { useState } from "react";
import axios from "axios";

const DeleteAccount = ({ userId, name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [alert, setAlert] = useState(null);

  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/delete-account`,
        {
          userId,
          prompt,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setAlert({ type: "success", message: response.data.message });
        // Redirect or perform any post-delete action here
        setTimeout(() => {
          window.location.href = "/"; // Example redirect
        }, 2000);
      } else {
        setAlert({ type: "error", message: response.data.message });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-300">Delete Account</h3>
          <p className="text-sm text-gray-400">
            Permanently remove your account and all data
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-red-600/50 hover:bg-red-700/40 text-red-100 rounded-lg transition-colors"
        >
          Delete Account
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div
          className={`p-3 rounded-lg text-center ${
            alert.type === "success"
              ? "bg-green-600 text-green-100"
              : "bg-red-600 text-red-100"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed bottom-20 left-0 right-0 flex items-center justify-center bg-black/5  backdrop-blur-sm z-50">
          <div className="bg-gray-400 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
            <h4 className="text-lg font-bold text-gray-900">
              Confirm Account Deletion
            </h4>
            <p className="text-gray-950 text-sm">
              To confirm, type <strong>Delete my account {name}</strong> in the
              box below.
            </p>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder={`Delete my account ${name}`}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-800 text-gray-200 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={prompt !== `Delete my account ${name}`}
                className={`px-4 py-2 rounded-lg text-white ${
                  prompt === `Delete my account ${name}`
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-700 cursor-not-allowed"
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
