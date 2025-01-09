import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import LoaderAll from "../../OtherComponents/LoaderAll";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const StageManagement = () => {
  const navigate = useNavigate();
  const { userProject, fetchUser } = useOutletContext();
  const localhost = "http://localhost:5120";
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [activeStage, setActiveStage] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      if (!Array.isArray(userProject)) {
        setError("Invalid project data. Please refresh the page.");
        setLoading(false);
        return;
      }
      if (!userProject || userProject.length === 0) {
        setError("No projects found. Please add a project.");
        setLoading(false);
        return;
      }

      const selectedProject = userProject.find(
        (project) => project._id === projectId
      );

      if (!selectedProject) {
        setError("Project not found.");
        setLoading(false);
        return;
      }

      setProject(selectedProject);
      setActiveStage(selectedProject.stages?.[0]?._id || null);
      setError("");
      setLoading(false);
    };

    setTimeout(() => fetchData(), 2000);
  }, [userProject, projectId]);

  const handleApproveMaterial = async (stageId, materialId) => {
    try {
      const response = await axios.post(
        `${localhost}/api/auth/approve-material`,
        { stageId, projectId, materialId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccessMessage("Material approved successfully!");
        setProject((prev) => ({
          ...prev,
          stages: prev.stages.map((stage) =>
            stage._id === stageId
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
        fetchUser();
      }
    } catch (err) {
      setError("Failed to approve material. Please try again.");
    }
  };

  const sendMessageToAdmin = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        `${localhost}/api/auth/messageAdmin`,
        { projectId, message },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccessMessage("Message sent to admin successfully.");
        setMessages((prev) => [
          ...prev,
          {
            sender: "You",
            content: message,
            timestamp: new Date().toLocaleString(),
          },
        ]);
        setIsModalOpen(false);
        setMessage("");
        fetchUser();
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
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
    <div className="bg-gray-800 text-white md:p-4 p-0 min-h-screen">
      {/* Back Button */}
      <button
        className="text-white hover:scale-110 transition mb-4"
        title="Go back"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>

      {/* Project Tabs */}
      <div className="md:container block mx-auto max-w-5xl bg-gray-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Project Stages</h1>

        <div className="flex space-x-4 mb-6">
          {project.stages.map((stage) => (
            <button
              key={stage._id}
              onClick={() => setActiveStage(stage._id)}
              disabled={stage.status === "notStarted"}
              className={`p-4 rounded-lg shadow-md transition ${
                activeStage === stage._id
                  ? "bg-orange-500 text-white shadow-orange-500/50"
                  : stage.status === "notStarted"
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {stage.name}
            </button>
          ))}
        </div>

        {project.stages.map((stage) =>
          activeStage === stage._id ? (
            <div
              key={stage._id}
              className="p-6 bg-gray-900 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-4">{stage.name}</h2>
              <p>
                <strong>Main Material:</strong> {stage.mainMaterial || "N/A"}
              </p>
              {/* check status of is completed stage or not */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-inner mt-2">
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                  Status
                </h3>
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
              {/* check status of client confirmation is or not */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-inner mt-4">
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
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

              {/* Materials */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Materials</h3>
                {stage.materials.map((material) => (
                  <div
                    key={material._id}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-gray-200">
                      {material.name} - and qunatity: {material.quantity}
                      {material.isApproved ? (
                        <span className="text-green-500 ml-2"> (Approved)</span>
                      ) : (
                        <span className="text-red-500 ml-2"> (Pending)</span>
                      )}
                    </span>
                    {!material.isApproved && (
                      <button
                        onClick={() =>
                          handleApproveMaterial(stage._id, material._id)
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Workers */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">
                  Daily updates information
                </h3>
                {stage.updates.map((data, updateIndex) => (
                  <div
                    key={updateIndex}
                    className="my-4 p-4 bg-gray-800 rounded-lg"
                  >
                    <h4 className="text-orange-500 text-lg">
                      Date: {data.date}
                    </h4>
                    <p className="mt-4">Materials used details</p>
                    {data.materialsUsed.length > 0 ? (
                      <ul className="list-disc pl-5 mt-2">
                        {data.materialsUsed.map((mat, matIndex) => (
                          <li key={matIndex} className="mb-2">
                            <span className="text-gray-200">
                              Name: {mat.name} | Qunatity:
                              <b> {mat.quantity || " n/a"}</b>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">
                        No Materials data for this date.
                      </p>
                    )}
                    <h4 className="text-orange-500 text-lg mt-3">
                      Date: {data.date}
                    </h4>
                    <p className="mt-4">Materials used details</p>
                    {data.workers.length > 0 ? (
                      <ul className="list-disc pl-5 mt-2">
                        {data.workers.map((worker, workerIndex) => (
                          <li key={workerIndex} className="mb-2">
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

              {/* Messages */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Messages</h3>
                <div className="space-y-2">
                  {messages.map((msg, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg">
                      <p>
                        <strong>{msg.sender}:</strong> {msg.content}
                      </p>
                      <p className="text-gray-500 text-sm">{msg.timestamp}</p>
                    </div>
                  ))}
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full mt-4 p-2 bg-gray-800 rounded-lg text-white"
                  placeholder="Write a message to admin..."
                />
                <button
                  onClick={sendMessageToAdmin}
                  className="bg-orange-500 text-white px-4 py-2 rounded mt-2 hover:bg-orange-600"
                >
                  Send Message
                </button>
              </div>
            </div>
          ) : null
        )}
      </div>

      {successMessage && (
        <p className="text-green-500 text-center mt-4">{successMessage}</p>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default StageManagement;
