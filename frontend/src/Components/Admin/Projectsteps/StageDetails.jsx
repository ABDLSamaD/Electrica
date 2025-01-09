import React, { useState, useEffect } from "react";
import axios from "axios";
import LoaderAll from "../../OtherComponents/LoaderAll";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaTools,
  FaUsers,
  FaImages,
  FaChevronDown,
} from "react-icons/fa";

function StageDetails({ localhost, projectId, stageName }) {
  const [stageData, setStageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data function
    const fetchStageData = async () => {
      setError(null); // Reset error state
      try {
        const response = await axios.post(
          `${localhost}/api/adminauth/getstage`,
          { projectId, stageName },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setStageData(response.data);
        }
      } catch (err) {
        console.error("Error fetching stage data:", err.message);
        setError("Failed to fetch stage data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce fetching to avoid redundant API calls
    const timeoutId = setTimeout(() => fetchStageData(), 6000);
    return () => clearTimeout(timeoutId); // Cleanup timeout
  }, [projectId, stageName, localhost]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stage-container max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="p-6 space-y-6">
          <h2 className="text-3xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
            {stageName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Status
              </h3>
              <p className="flex items-center space-x-2">
                {stageData?.isCompleted ? (
                  <>
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-green-400">Completed</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-yellow-500" />
                    <span className="text-yellow-400">In Progress</span>
                  </>
                )}
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Client Confirmation
              </h3>
              <p className="flex items-center space-x-2">
                {stageData?.clientConfirmation?.isConfirmed ? (
                  <>
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-green-400">Confirmed</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-red-500" />
                    <span className="text-red-400">Not Confirmed</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {stageData?.clientConfirmation?.emergencyMessage && (
            <div className="bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded-lg">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-yellow-500 mr-2" />
                <p className="text-yellow-200 font-semibold">
                  Emergency Message:
                </p>
              </div>
              <p className="text-yellow-100 mt-2">
                {stageData?.clientConfirmation?.emergencyMessage ||
                  "Emergeny not available"}
              </p>
            </div>
          )}

          <h3 className="text-2xl font-bold text-white mt-8 mb-4">Updates</h3>
          <AnimatePresence>
            {Array.isArray(stageData?.updates) &&
            stageData.updates.length > 0 ? (
              stageData.updates.map((update, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="mb-6"
                >
                  <details className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <summary className="cursor-pointer p-4 flex justify-between items-center bg-gray-700 hover:bg-gray-600 transition-colors duration-300">
                      <span className="text-lg font-semibold text-white">
                        Update: {new Date(update.date).toLocaleDateString()}
                      </span>
                      <FaChevronDown className="text-gray-400 transform transition-transform duration-300" />
                    </summary>
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-400 flex items-center mb-2">
                          <FaTools className="mr-2" /> Materials Used
                        </h4>
                        {/* materialUsed array */}
                        <ul className="list-disc pl-5 space-y-1">
                          {Array.isArray(update?.materialsUsed) &&
                          update.materialsUsed.length > 0 ? (
                            update.materialsUsed.map((material, i) => (
                              <li key={i} className="text-gray-300">
                                {material.name || "Unnamed Material"} | Quantity
                                -{material.quantity || "N/A"}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-400 italic">
                              No materials used
                            </li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-400 flex items-center mb-2">
                          <FaUsers className="mr-2" /> Workers Involved
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {Array.isArray(update.workers) &&
                          update.workers.length > 0 ? (
                            update.workers.map((worker, i) => (
                              <li key={i} className="text-gray-300">
                                {worker.name} - daily wage = {worker.dailyWage}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-400 italic">
                              No workers involved
                            </li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-purple-400 flex items-center mb-2">
                          <FaImages className="mr-2" /> Images
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Array.isArray(update.images) &&
                          update.images.length > 0 ? (
                            update.images.map((img, i) => (
                              <a
                                key={i}
                                href={img}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <img
                                  src={img}
                                  alt={`Update ${i + 1}`}
                                  className="w-full h-32 object-cover rounded-lg hover:opacity-75 transition-opacity duration-300"
                                />
                              </a>
                            ))
                          ) : (
                            <p className="text-gray-400 italic">
                              No images available
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                          Details
                        </h4>
                        <p className="text-gray-300">
                          {update.details || "No details provided"}
                        </p>
                      </div>
                    </div>
                  </details>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-gray-400 italic"
              >
                No updates available for this stage.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default StageDetails;
