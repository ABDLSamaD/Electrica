import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const MessagesSendingRecieving = ({
  messages,
  message,
  setMessage,
  sendMessageToAdmin,
}) => {
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <div>
      {/* Floating Chat Icon */}
      <button
        className="fixed bottom-4 right-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50"
        title="Chat"
        onClick={() => setChatVisible((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faComments} size="lg" />
      </button>

      {/* Chat Window */}
      {chatVisible && (
        <div className="fixed bottom-12 right-4 w-80 md:w-96 bg-gray-900 rounded-xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white flex justify-between items-center">
            <h3 className="text-lg font-semibold">Chat with Admin</h3>
            <button
              className="text-white hover:scale-125 transition-all duration-300"
              onClick={() => setChatVisible(false)}
            >
              &times;
            </button>
          </div>

          {/* Messages Area */}
          <div className="p-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center">No messages yet.</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded-lg shadow-md ${
                    msg.sender === "Admin"
                      ? "bg-gray-700 text-gray-200 text-left"
                      : "bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-right"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs mt-2 opacity-75">
                    {new Date(msg.sentAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows="3"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessageToAdmin}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold py-2 rounded-lg mt-2 hover:scale-105 transition-all duration-300"
              disabled={!message.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Mobile Compatibility Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MessagesSendingRecieving;
