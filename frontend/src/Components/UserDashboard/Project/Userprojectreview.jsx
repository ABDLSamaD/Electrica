import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import {
  faArrowLeft,
  faCheckCircle,
  faPlayCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  FiAlertTriangle,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiThumbsUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import LoaderAll from "../../OtherComponents/LoaderAll";
import Alert from "../../OtherComponents/Alert";
import MessagesSendingRecieving from "./MessagesSendingRecieving";
import ClientConfirmation from "./ClientConfirmation";

const StageManagement = () => {
  const navigate = useNavigate();
  const { projects, fetchProject, electricaURL } = useOutletContext();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(null);
  const [activeStage, setActiveStage] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      if (!Array.isArray(projects)) {
        setError("Invalid project data. Please refresh the page.");
        setLoading(false);
        return;
      }

      const selectedProject = projects.find(
        (project) => project._id === projectId
      );

      if (!selectedProject) {
        setError("Project not found.");
        return;
      }
      const allStageCompleted = selectedProject.stages.every(
        (stage) => stage.isCompleted
      );
      if (allStageCompleted) {
        setIsCompleted(true);
      }

      setProject(selectedProject);
      setMessages(selectedProject.clientMessages);
      setActiveStage(selectedProject.stages?.[0]?._id || null);
      setError("");
      setLoading(false);
    };

    setTimeout(() => fetchData(), 1800);
  }, [projects, projectId]);

  const handleApproveMaterial = async (stageName, materialId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/approve-material`,
        { stageName, projectId, materialId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccessMessage("Material approved successfully!");
        setProject((prev) => ({
          ...prev,
          stages: prev.stages.map((stage) =>
            stage.name === stageName
              ? {
                  ...stage,
                  materials: stage.materials.map((material) =>
                    material._id === materialId
                      ? { ...material, isApproved: true }
                      : material
                  ),
                }
              : stage
          ),
        }));
        fetchProject();
      }
    } catch (err) {
      setError("Failed to approve material. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageToAdmin = async () => {
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/messageAdmin`,
        { projectId, message },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setAlert({ type: response.data.type, message: response.data.message });
        setMessage("");
        fetchProject();
      } else {
        setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message,
      });
    }
  };

  const handleClientConfirm = async (
    stageName,
    emergencyMessage,
    clientConfirmed
  ) => {
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/client-confirmation`,
        {
          projectId,
          stageName,
          clientConfirmed,
          emergencyMessage,
          startDate: Date.now(),
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setAlert({ type: response.data.type, message: response.data.message });
        // Refresh data or handle UI updates
      } else {
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
      }
    } catch (error) {
      setAlert({
        type: error.response?.data?.type,
        message: error.response?.data?.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <LoaderAll />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center text-2xl bg-gray-800 min-h-screen flex items-center justify-center">
        {error}
      </p>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white md:p-6 p-4 min-h-screen">
      {/* Back Button */}
      <button
        className="text-white hover:scale-110 transition mb-4 p-3 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
        title="Go back"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={setAlert(null)}
        />
      )}

      <div className="md:container mx-auto max-w-5xl bg-gray-900 md:p-8 p-4 rounded-3xl shadow-lg shadow-cyan-800 relative">
        <MessagesSendingRecieving
          messages={messages}
          setMessage={setMessage}
          message={message}
          sendMessageToAdmin={handleMessageToAdmin}
        />
        {isCompleted && (
          <div
            className="iscompleted w-2 h-2 bg-green-500 rounded-full absolute top-2 left-2"
            title="project complete"
          ></div>
        )}

        {/* Project Stages */}
        <h1 className="text-3xl font-bold mb-8 text-center">Project Stages</h1>

        <div className="flex flex-wrap justify-center gap-5 mb-8 px-4">
          {project.stages.map((stage) => {
            const isActive = activeStage === stage._id;
            const isDisabled = stage.status === "notStarted";
            const canStart = stage?.canStart;
            const isCompleted = stage.isCompleted;
            const isInteractive = !isDisabled && !isActive;

            return (
              <button
                key={stage._id}
                onClick={() => setActiveStage(stage._id)}
                disabled={isDisabled}
                className={`
          relative overflow-hidden isolate
          flex flex-col items-center 
          px-8 py-6 rounded-2xl 
          transition-all duration-500
          shadow-[0_8px_32px_rgba(0,0,0,0.15)]
          ${
            isDisabled
              ? "opacity-50 grayscale cursor-not-allowed"
              : "hover:shadow-[0_12px_48px_rgba(0,0,0,0.25)]"
          }
          ${
            isActive
              ? "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 scale-105"
              : "bg-gray-900"
          }
          ${isInteractive && "hover:scale-[1.02]"}
        `}
              >
                {/* Animated background */}
                {!isDisabled && (
                  <div className="absolute inset-0 opacity-20 mix-blend-soft-light bg-[radial-gradient(circle_at_center,#fff,transparent)] group-hover:animate-pulse" />
                )}

                {/* Stage name with modern typography */}
                <span
                  className={`
          mb-3 font-semibold text-sm uppercase tracking-wider
          transition-colors duration-300
          ${isActive ? "text-white drop-shadow-md" : "text-gray-400"}
          ${isDisabled && "line-through"}
        `}
                >
                  {stage.name}
                </span>

                {/* Glowing status icon */}
                <div
                  className={`
          relative text-4xl transition-all duration-300
          ${isActive ? "scale-110" : "scale-100"}
          ${isInteractive && "group-hover:scale-105"}
        `}
                >
                  {canStart ? (
                    isCompleted ? (
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-400 animate-[bounce_1s_ease-in-out_infinite]"
                        />
                        <div className="absolute inset-0 rounded-full shadow-glow-green" />
                      </div>
                    ) : (
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faPlayCircle}
                          className={`${
                            isActive ? "text-white" : "text-purple-400"
                          }`}
                        />
                        {isActive && (
                          <div className="absolute inset-0 rounded-full animate-glow-pulse" />
                        )}
                      </div>
                    )
                  ) : (
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-400 animate-[vibrate_0.3s_ease-in-out_infinite]"
                    />
                  )}
                </div>

                {/* Progress line connector */}
                {!isDisabled && (
                  <div className="absolute -right-6 h-[2px] w-12 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                )}

                {/* Hover shine effect */}
                {!isDisabled && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -inset-12 rotate-12 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Details */}
        {project.stages.map((stage) =>
          activeStage === stage._id ? (
            <div
              key={stage._id}
              className="bg-gray-900 rounded-3xl shadow-lg md:p-6 p-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Stage Header */}
                <div className="text-center mb-8">
                  <motion.h2
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="md:text-3xl text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                  >
                    {stage.name}
                  </motion.h2>
                  <p className="mt-2 text-lg text-gray-300">
                    Main Material:{" "}
                    <span className="font-medium text-cyan-300">
                      {stage.mainMaterial || "N/A"}
                    </span>
                  </p>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-4 md:p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl">
                        {stage?.isCompleted ? (
                          <FiCheckCircle className="w-8 h-8 text-green-400" />
                        ) : (
                          <FiClock className="w-8 h-8 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-1">
                          Project Status
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              stage?.isCompleted
                                ? "bg-green-500/20 text-green-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {stage?.isCompleted ? "Completed" : "In Progress"}
                          </span>
                          {!stage?.isCompleted && (
                            <span className="text-xs text-gray-400">
                              Est. completion: {stage.estimatedCompletion}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Client Confirmation Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl">
                        {stage.clientConfirmation.isConfirmed ? (
                          <FiThumbsUp className="w-8 h-8 text-green-400" />
                        ) : (
                          <FiAlertTriangle className="w-8 h-8 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-1">
                          Client Confirmation
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              stage.clientConfirmation.isConfirmed
                                ? "bg-green-500/20 text-green-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {stage.clientConfirmation.isConfirmed
                              ? "Confirmed"
                              : "Pending Approval"}
                          </span>
                          {stage.clientConfirmation.isConfirmed && (
                            <span className="text-xs text-gray-400">
                              Confirmed on:{" "}
                              {new Date(
                                stage.clientConfirmation.date
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Materials approve */}
              <div className="mt-6">
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
                  Materials
                </h3>

                <div className="grid gap-2 mt-4">
                  {stage.materials.map((material, index) => (
                    <motion.div
                      key={material._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group relative p-3 md:p-4 bg-white/5 backdrop-blur-lg rounded-xl shadow-lg
                 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        {/* Material Info */}
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/10 rounded-lg">
                            {material.isApproved ? (
                              <FiCheckCircle className="w-6 h-6 text-green-400" />
                            ) : (
                              <FiPackage className="w-6 h-6 text-amber-400" />
                            )}
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-gray-100">
                              {material.name}
                            </h4>
                            <p className="text-gray-400 mt-1">
                              Quantity: {material.quantity}
                            </p>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              material.isApproved
                                ? "bg-green-500/20 text-green-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {material.isApproved ? "Approved" : "Pending"}
                          </span>

                          {!material.isApproved && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleApproveMaterial(stage.name, material._id)
                              }
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg
                         hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2"
                            >
                              <FiCheck className="w-4 h-4" />
                              Approve
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div
                        className="absolute inset-0 rounded-xl pointer-events-none
                      group-hover:bg-gradient-to-r from-cyan-500/10 to-blue-500/10
                      transition-opacity opacity-0 group-hover:opacity-100"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Daily Updates */}
              <div className="mt-6 mb-6">
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Daily Updates
                </h3>
                <div className="grid gap-4 mt-4">
                  {stage.updates.map((data, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group relative p-4 md:p-6 bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl
                 border border-white/10 hover:border-white/20 transition-all"
                    >
                      {/* Date Header */}
                      <div className="flex items-center mb-4">
                        <div className="h-6 w-1 md:h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-3" />
                        <h4 className="text-xl font-semibold text-blue-400">
                          {new Date(data.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </h4>
                      </div>

                      {/* Materials Section */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <FiPackage className="w-5 h-5 text-purple-400" />
                          <h5 className="font-medium text-lg text-gray-200">
                            Materials Used
                          </h5>
                        </div>

                        {data.materialsUsed.length > 0 ? (
                          <div className="grid gap-2">
                            {data.materialsUsed.map((mat, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-3 bg-white/5 rounded-lg
                           hover:bg-white/10 transition-colors"
                              >
                                <span className="text-gray-100 font-medium">
                                  {mat.name}
                                </span>
                                <span className="text-blue-300 font-semibold">
                                  {mat.quantity || "N/A"} units
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-white/5 rounded-lg flex items-center gap-3">
                            <FiAlertCircle className="w-5 h-5 text-yellow-500" />
                            <span className="text-gray-400">
                              No materials recorded
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Workers Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FiUsers className="w-5 h-5 text-green-400" />
                          <h5 className="font-medium text-lg text-gray-200">
                            Workers
                          </h5>
                        </div>

                        {data.workers.length > 0 ? (
                          <div className="grid gap-3">
                            {data.workers.map((worker, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-3 bg-white/5 rounded-lg
                           hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <FiUser className="w-4 h-4 text-blue-400" />
                                  </div>
                                  <span className="text-gray-100">
                                    {worker.name}
                                  </span>
                                </div>
                                <span className="text-green-300 font-semibold">
                                  ₹{worker.dailyWage}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-white/5 rounded-lg flex items-center gap-3">
                            <FiAlertCircle className="w-5 h-5 text-yellow-500" />
                            <span className="text-gray-400">
                              No workers recorded
                            </span>
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
                  ))}
                </div>
              </div>

              {/* admin notify for stage */}
              <div className="notify bg-gray-800 rounded-xl">
                <ClientConfirmation
                  stage={stage}
                  onClientConfirm={handleClientConfirm}
                />
              </div>
            </div>
          ) : null
        )}

        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default StageManagement;
