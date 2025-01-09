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
        className="absolute top-4 right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600"
        title="Chat"
        onClick={() => setChatVisible((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faComments} size="lg" />
      </button>

      {/* Chat Window */}
      {chatVisible && (
        <div className="absolute top-16 right-4 w-96 bg-gray-900 rounded-lg shadow-lg">
          <div className="p-4 bg-orange-500 rounded-t-lg text-white">
            <h3 className="text-lg font-bold">Chat with Admin</h3>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg shadow ${
                  msg.sender === "Admin"
                    ? "bg-gray-700 text-white text-left"
                    : "bg-orange-500 text-white text-right"
                }`}
              >
                <p>{msg.message}</p>
                <p className="text-xs text-gray-900 mt-2">{msg.sentAt}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessageToAdmin}
              className="bg-orange-500 text-white px-4 py-2 rounded mt-2 hover:bg-orange-600 w-full"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesSendingRecieving;
