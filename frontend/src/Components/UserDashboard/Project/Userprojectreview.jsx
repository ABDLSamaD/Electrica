import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiThumbsUp,
} from "react-icons/fi";
import LoaderAll from "../../OtherComponents/LoaderAll";
import Alert from "../../OtherComponents/Alert";
import MessagesSendingRecieving from "./MessagesSendingRecieving";
import ClientConfirmation from "./ClientConfirmation";
import ProjectStageButton from "./ProjectStageButton";
import MaterialApproves from "./MaterialApproves";
import WorkerDailyDetails from "./WorkerDailyDetails";
import { EllipsisVertical } from "lucide-react";

const StageManagement = () => {
  const navigate = useNavigate();
  const { projects, fetchProject, electricaURL } = useOutletContext();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingapprovematerial, setLoadingApproveMaterial] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(null);
  const [activeStage, setActiveStage] = useState(null);
  const [messageUser, setMessageUser] = useState([]);
  const [messageAdmin, setMessageAdmin] = useState([]);

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
      setMessageUser(selectedProject.clientMessages);
      setMessageAdmin(selectedProject.adminMessages);
      setActiveStage(selectedProject.stages?.[0]?._id || null);
      setError("");
      setLoading(false);
    };

    setTimeout(() => fetchData(), 1800);
  }, [projects, projectId]);

  const handleApproveMaterial = async (stageName, materialId) => {
    setLoadingApproveMaterial((prev) => ({ ...prev, [materialId]: true })); // Set loading for specific material

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
      setLoadingApproveMaterial((prev) => ({ ...prev, [materialId]: false })); // Set loading for specific material
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
        fetchProject();
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
      <div className="flex items-center justify-center min-h-screen">
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
    <div className="relative top-12 mb-8 text-white md:p-6 p-0 min-h-screen">
      {/* Back Button */}
      <button
        className="mb-4 p-3 flex items-center justify-center"
        title="Go back"
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        <>
          <Link to={-1} className="text-gray-200 ml-2">
            checkProject
          </Link>{" "}
          /<span className="text-gray-600">project</span>
        </>
      </button>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={setAlert(null)}
        />
      )}

      <div className="md:container mx-auto w-full md:p-8 p-4 relative">
        <MessagesSendingRecieving
          messageUser={messageUser}
          setMessage={setMessage}
          message={message}
          messageAdmin={messageAdmin}
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

        {/* stage button */}
        <ProjectStageButton
          project={project}
          activeStage={activeStage}
          setActiveStage={setActiveStage}
        />

        {/* Active Stage Details */}
        {project.stages.map((stage) =>
          activeStage === stage._id ? (
            <div
              key={stage._id}
              className="bg-gray-900/10 rounded-3xl shadow-lg md:p-6 p-4"
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
                    {/*  */}
                    {project.billRequired && (
                      <span className="text-green-500 text-xl font-bold">
                        Check your project bill was added by admin and review
                      </span>
                    )}
                  </p>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-4 sm:p-5 md:p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl flex-shrink-0">
                        {stage?.isCompleted ? (
                          <FiCheckCircle className="w-7 sm:w-8 h-7 sm:h-8 text-green-400" />
                        ) : (
                          <FiClock className="w-7 sm:w-8 h-7 sm:h-8 text-amber-400" />
                        )}
                      </div>
                      <div className="w-full">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-1">
                          Project Status
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
                              stage?.isCompleted
                                ? "bg-green-500/20 text-green-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {stage?.isCompleted ? "Completed" : "In Progress"}
                          </span>
                          {!stage?.isCompleted && (
                            <span className="text-xs sm:text-sm text-gray-400">
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
                    className="p-4 sm:p-5 md:p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl flex-shrink-0">
                        {stage.clientConfirmation.isConfirmed ? (
                          <FiThumbsUp className="w-7 sm:w-8 h-7 sm:h-8 text-green-400" />
                        ) : (
                          <FiAlertTriangle className="w-7 sm:w-8 h-7 sm:h-8 text-amber-400" />
                        )}
                      </div>
                      <div className="w-full">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-1">
                          Client Confirmation
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
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
                            <span className="text-xs sm:text-sm text-gray-400">
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
              <MaterialApproves
                stage={stage}
                handleApproveMaterial={handleApproveMaterial}
                loadingapprovematerial={loadingapprovematerial}
              />

              {/* Daily Updates */}
              <div className="mt-6 mb-6">
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Daily Updates
                </h3>
                <WorkerDailyDetails stage={stage} />
              </div>

              {/* admin notify for stage */}
              <div className="notify">
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
