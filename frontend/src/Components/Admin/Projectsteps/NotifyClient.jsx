import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Alert from "../../OtherComponents/Alert";
import LoaderAll from "../../OtherComponents/LoaderAll";

function NotifyClient({ localhost, projectId, stageName }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");

  const handleNotifyClient = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${localhost}/api/adminauth/notify-client`,
        { projectId, stageName },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
      } else {
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message);
      setType(error.response?.data?.type);
      setAlert(error.response?.data?.type, error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <LoaderAll />
      </div>
    );
  }

  if (alert) {
    return (
      <Alert type={type} message={message} onClose={() => setAlert(null)} />
    );
  }

  return (
    <div className="content-full flex flex-col justify-start mt-10 space-y-4">
      <p className="text-xs font-semibold">Notify Client</p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-max"
      >
        <button
          className={`px-6 py-3 text-white font-semibold rounded-lg shadow ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleNotifyClient}
          disabled={loading}
        >
          {loading ? "Notifying..." : "Notify Client"}
        </button>
      </motion.div>
    </div>
  );
}

export default NotifyClient;
