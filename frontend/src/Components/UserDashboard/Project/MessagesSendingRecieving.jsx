import React, { useState } from "react";
import { motion } from "framer-motion";
import Miniloader from "../../OtherComponents/Miniloader";
import { FiMessageCircle, FiMessageSquare, FiSend, FiX } from "react-icons/fi";
import Chat from "./Chat";

const MessagesSendingRecieving = ({
  messageUser,
  message,
  setMessage,
  messageAdmin,
  sendMessageToAdmin,
  messageLoader,
}) => {
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <div>
      {/* Floating Chat Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-white/10 backdrop-blur-lg border border-white/20 text-white p-5 rounded-full shadow-2xl hover:shadow-cyan-500/20 z-[999] transition-all duration-300"
        title="Chat"
        onClick={() => setChatVisible((prev) => !prev)}
      >
        <FiMessageCircle className="w-7 h-7 text-cyan-400" />
      </motion.button>

      {/* Chat Window */}
      {chatVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 right-6 w-[95vw] max-w-96 md:w-96 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-[999]"
          style={{ maxHeight: "80vh" }}
        >
          {/* Header */}
          <div className="p-4 bg-white/10 border-b border-white/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FiMessageSquare className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-semibold text-gray-100">Live Chat</h3>
            </div>
            <button
              className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
              onClick={() => setChatVisible(false)}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <Chat messageUser={messageUser} messageAdmin={messageAdmin} />

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 pr-12 bg-white/5 backdrop-blur-sm text-gray-100 rounded-lg border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 resize-none transition-all"
                rows="2"
                placeholder="Type your message..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessageToAdmin}
                disabled={messageLoader}
                className="absolute bottom-3 right-3 p-2 bg-cyan-500/80 backdrop-blur rounded-lg hover:bg-cyan-400 transition-colors"
              >
                {!messageLoader ? (
                  <FiSend className="w-5 h-5 text-white" />
                ) : (
                  <Miniloader />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MessagesSendingRecieving;
