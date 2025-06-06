import { FiInbox } from "react-icons/fi";
import { FaUser, FaUserFriends, FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";

const Chat = ({ messageUser, messageAdmin }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* User Messages Area */}
      <div className="p-4 h-[50vh] md:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {messageUser.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FiInbox className="w-12 h-12 mb-3" />
            <p>No messages yet</p>
          </div>
        ) : (
          messageUser.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.sender === "Admin" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-4 p-3 rounded-lg flex items-start gap-2 max-w-[100%] ${
                msg.sender === "Admin"
                  ? "bg-gray-700/50 backdrop-blur ml-auto"
                  : "bg-gradient-to-r from-cyan-500/40 to-blue-600/40"
              }`}
            >
              {msg.sender === "Admin" ? (
                <FaUserShield className="text-cyan-300 w-5 h-5" />
              ) : (
                <FaUser className="text-blue-400 w-5 h-5" />
              )}
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-medium text-cyan-300">
                    {msg.sender}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-gray-100">{msg.message}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
      {/* Admin Messages Area */}
      <div className="p-4 h-[50vh] md:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {messageAdmin.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FiInbox className="w-12 h-12 mb-3" />
            <p>No messages yet</p>
          </div>
        ) : (
          messageAdmin.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.sender === "Admin" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-4 p-3 rounded-lg flex items-start gap-2 max-w-[100%] ${
                msg.sender === "Admin"
                  ? "bg-gray-700/50 backdrop-blur ml-auto"
                  : "bg-gradient-to-r from-cyan-500/40 to-blue-600/40"
              }`}
            >
              {msg.sender === "Admin" ? (
                <FaUserFriends className="text-cyan-300 w-5 h-5" />
              ) : (
                <FaUser className="text-blue-400 w-5 h-5" />
              )}
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-medium text-cyan-300">
                    {msg.sender}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-gray-100">{msg.message}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chat;
