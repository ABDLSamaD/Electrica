import React, { useMemo, useState, useEffect } from "react";
import { FiAlertCircle, FiPackage, FiUser, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFileImage, FaImage } from "react-icons/fa";

const WorkerDailyDetails = React.memo(({ stage }) => {
  const [visibleUpdates, setVisibleUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoize processed updates to prevent unnecessary re-renders
  const updates = useMemo(() => stage?.updates || [], [stage]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setVisibleUpdates(updates.slice(0, 5)); // Load first 5 updates initially
      setLoading(false);
    }, 1000); // Simulate data fetching delay

    return () => clearTimeout(timer);
  }, [updates]);

  const loadMoreUpdates = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setVisibleUpdates((prev) => [
        ...prev,
        ...updates.slice(prev.length, prev.length + 5),
      ]); // Load next 5 updates
      setLoading(false);
    }, 1000); // Simulate data fetching delay

    return () => clearTimeout(timer);
  };

  return (
    <div className="grid gap-6 mt-6">
      {visibleUpdates.length > 0 ? (
        visibleUpdates.map((data, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 hover:border-white/20 transition-all hover:shadow-xl"
          >
            {/* Date Header */}
            <div className="flex items-center mb-6">
              <div className="h-8 w-1.5 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4" />
              <h4 className="text-2xl font-bold text-blue-400">
                {new Date(data.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </h4>
            </div>

            {/* Materials Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FiPackage className="w-6 h-6 text-purple-400" />
                <h5 className="font-semibold text-xl text-gray-100">
                  Materials Used
                </h5>
              </div>

              {data.materialsUsed?.length > 0 ? (
                <div className="grid gap-3">
                  {data.materialsUsed.map((mat, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <span className="text-gray-100 font-medium">
                        {mat.name}
                      </span>
                      <span className="text-blue-300 font-semibold">
                        {mat.quantity || "N/A"} Qty
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white/10 rounded-xl flex items-center gap-3">
                  <FiAlertCircle className="w-6 h-6 text-yellow-400" />
                  <span className="text-gray-300">No materials recorded</span>
                </div>
              )}
            </div>

            {/* Workers Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FiUsers className="w-6 h-6 text-green-400" />
                <h5 className="font-semibold text-xl text-gray-100">Workers</h5>
              </div>

              {data.workers?.length > 0 ? (
                <div className="grid gap-4">
                  {data.workers.map((worker, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-gray-100">{worker.name}</span>
                      </div>
                      <span className="text-green-300 font-semibold">
                        Rs-{worker.dailyWage}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white/10 rounded-xl flex items-center gap-3">
                  <FiAlertCircle className="w-6 h-6 text-yellow-400" />
                  <span className="text-gray-300">No workers recorded</span>
                </div>
              )}
            </div>

            {/* Image Section */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <FaImage className="w-6 h-6 text-green-400" />
                <h5 className="font-semibold text-xl text-gray-100">Image</h5>
              </div>

              {data.image?.length > 0 ? (
                <div className="grid gap-4">
                  {data.image.map((img, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <FaImage className="w-5 h-5 text-blue-400" />
                        </div>
                        <img
                          className="w-16 h-16 rounded-lg object-cover"
                          src={img}
                          alt="image does'nt exist request for image"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white/10 rounded-xl flex items-center gap-3">
                  <FaFileImage className="w-6 h-6 text-yellow-400" />
                  <span className="text-gray-300">No image added</span>
                </div>
              )}
            </div>

            {/* Hover Glow Effect */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none
                  group-hover:bg-gradient-to-r from-blue-500/10 to-purple-500/10
                  transition-opacity opacity-0 group-hover:opacity-100"
            />
          </motion.div>
        ))
      ) : (
        <div className="p-8 text-center bg-white/10 rounded-2xl">
          <FiAlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-gray-300 text-xl">
            No details were added, or work has not started.
          </p>
        </div>
      )}

      {loading && (
        <div className="p-8 text-center bg-white/10 rounded-2xl">
          <p className="text-gray-300 text-xl">Loading...</p>
        </div>
      )}

      {visibleUpdates.length < updates.length && (
        <button
          onClick={loadMoreUpdates}
          className="p-4 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-colors font-semibold"
        >
          Load More
        </button>
      )}
    </div>
  );
});

export default WorkerDailyDetails;
