import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiMessageCircle,
  FiCalendar,
  FiLayers,
  FiEdit3,
  FiClipboard,
  FiCheckCircle,
  FiXCircle,
  FiX,
} from "react-icons/fi";

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
    <motion.div
      className="max-w-full mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {stage.notify && (
        <motion.div
          className="p-4 sm:p-5 md:p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex flex-col items-center text-center mb-4">
            <FiAlertCircle className="w-6 sm:w-8 h-6 sm:h-8 text-amber-400 mb-2" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Admin Notification
            </h1>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-lg">
              <FiMessageCircle className="w-5 h-5 text-blue-400" />
              <span className="text-gray-200 text-sm sm:text-base">
                {stage.notify.message}
              </span>
            </div>

            <div className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-lg">
              <FiCalendar className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 text-xs sm:text-sm">
                {new Date(stage.notify.sentAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-lg">
              <FiLayers className="w-5 h-5 text-green-400" />
              <span className="text-gray-200 flex flex-wrap">
                {stage.notify.stageDetails.stageName}
                <span
                  className={`ml-2 px-2 py-1 text-xs sm:text-sm text-center rounded-full ${
                    stage.notify.stageDetails.isCompleted
                      ? "bg-green-500/20 text-green-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {stage.notify.stageDetails.isCompleted
                    ? "Completed"
                    : "In Progress"}
                </span>
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenModal}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-xl
             hover:from-blue-400 hover:to-cyan-500 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FiEdit3 className="w-4 sm:w-5 h-4 sm:h-5" />
            Respond to Notification
          </motion.button>
        </motion.div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-lg z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white/10 border border-white/20 rounded-2xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md shadow-2xl relative"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiClipboard className="w-7 sm:w-8 h-7 sm:h-8 text-cyan-400" />
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Confirm Stage Approval
              </h2>
            </div>

            <textarea
              className="w-full p-2 sm:p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20
               focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 placeholder-gray-400
               transition-all text-sm sm:text-base"
              placeholder="Enter your message (optional)"
              value={confirmationMessage}
              onChange={(e) => setConfirmationMessage(e.target.value)}
              rows="3"
            />

            <div className="flex justify-end gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600
                 hover:from-green-400 hover:to-emerald-500 flex items-center gap-2 text-xs sm:text-sm"
                onClick={handleConfirm}
              >
                <FiCheckCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                Approve
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600
                 hover:from-red-400 hover:to-rose-500 flex items-center gap-2 text-xs sm:text-sm"
                onClick={handleReject}
              >
                <FiXCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                Reject
              </motion.button>
            </div>

            <button
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-200 transition-colors"
              onClick={handleCloseModal}
            >
              <FiX className="w-6 h-6" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClientConfirmation;
