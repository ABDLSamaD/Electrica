import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import LoaderAll from "../../OtherComponents/LoaderAll";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Alert from "../../OtherComponents/Alert";
import MessagesSendingRecieving from "./MessagesSendingRecieving";

const StageManagement = () => {
  const navigate = useNavigate();
  const { projects, fetchProject } = useOutletContext();
  const localhost = "http://localhost:5120";
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
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

      setProject(selectedProject);
      setMessages(selectedProject.clientMessages);
      setActiveStage(selectedProject.stages?.[0]?._id || null);
      setError("");
      setLoading(false);
    };

    setTimeout(() => fetchData(), 2200);
  }, [projects, projectId]);

  const handleApproveMaterial = async (stageName, materialId) => {
    try {
      const response = await axios.post(
        `${localhost}/api/auth/approve-material`,
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
    }
  };

  const handleMessageToAdmin = async () => {
    try {
      const response = await axios.post(
        `${localhost}/api/auth/messageAdmin`,
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
        className="text-white hover:scale-110 transition mb-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600"
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

      <div className="container mx-auto max-w-5xl bg-gray-900 p-8 rounded-3xl shadow-lg shadow-cyan-800 relative">
        <MessagesSendingRecieving
          messages={messages}
          setMessage={setMessage}
          message={message}
          sendMessageToAdmin={handleMessageToAdmin}
        />

        {/* Project Stages */}
        <h1 className="text-3xl font-bold mb-8 text-center">Project Stages</h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {project.stages.map((stage) => (
            <button
              key={stage._id}
              onClick={() => setActiveStage(stage._id)}
              disabled={stage.status === "notStarted"}
              className={`p-4 rounded-xl shadow-md transition ${
                activeStage === stage._id
                  ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white"
                  : stage.status === "notStarted"
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:from-gray-700 hover:to-gray-600"
              }`}
            >
              {stage.name}
            </button>
          ))}
        </div>

        {/* Active Stage Details */}
        {project.stages.map((stage) =>
          activeStage === stage._id ? (
            <div
              key={stage._id}
              className="p-8 bg-gray-900 rounded-3xl shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">
                {stage.name}
              </h2>
              <p className="mb-4 text-center">
                <strong>Main Material:</strong> {stage.mainMaterial || "N/A"}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Status */}
                <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-inner">
                  <h3 className="text-xl font-semibold mb-2">Status</h3>
                  <p className="flex items-center space-x-2">
                    {stage?.isCompleted ? (
                      <>
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-green-400">Completed</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-yellow-500" />
                        <span className="text-yellow-400">Not Complete</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Client Confirmation */}
                <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-inner">
                  <h3 className="text-xl font-semibold mb-2">
                    Client Confirmation
                  </h3>
                  <p className="flex items-center space-x-2">
                    {stage?.clientConfirmation?.isConfirmed ? (
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

              {/* Materials */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Materials</h3>
                {stage.materials.map((material) => (
                  <div
                    key={material._id}
                    className="flex justify-between items-center py-3 px-4 bg-gray-800 rounded-lg shadow-md mb-2"
                  >
                    <span className="text-gray-200">
                      {material.name} - Quantity: {material.quantity}
                      {material.isApproved ? (
                        <span className="text-green-500 ml-2"> (Approved)</span>
                      ) : (
                        <span className="text-red-500 ml-2"> (Pending)</span>
                      )}
                    </span>
                    {!material.isApproved && (
                      <button
                        onClick={() =>
                          handleApproveMaterial(stage.name, material._id)
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Daily Updates */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Daily Updates</h3>
                {stage.updates.map((data, index) => (
                  <div
                    key={index}
                    className="my-4 p-6 bg-gray-800 rounded-xl shadow-inner"
                  >
                    <h4 className="text-orange-500 text-lg">
                      Date: {data.date}
                    </h4>

                    {/* Materials Used */}
                    <p className="mt-4 font-semibold">Materials Used</p>
                    {data.materialsUsed.length > 0 ? (
                      <ul className="list-disc pl-5 mt-2">
                        {data.materialsUsed.map((mat, i) => (
                          <li key={i} className="mb-2">
                            <span className="text-gray-200">
                              Name: {mat.name} | Quantity:{" "}
                              <b>{mat.quantity || "n/a"}</b>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">
                        No materials data for this date.
                      </p>
                    )}

                    {/* Workers */}
                    <p className="mt-4 font-semibold">Workers</p>
                    {data.workers.length > 0 ? (
                      <ul className="list-disc pl-5 mt-2">
                        {data.workers.map((worker, i) => (
                          <li key={i} className="mb-2">
                            <span className="text-gray-200">
                              Name: {worker.name} | Daily Wage:{" "}
                              {worker.dailyWage}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">
                        No workers data for this date.
                      </p>
                    )}
                  </div>
                ))}
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
