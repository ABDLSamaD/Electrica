import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import LoaderAll from "../../OtherComponents/LoaderAll";

const ProjectReview = () => {
  const navigate = useNavigate();
  const { localhost, users, projects, fetchProject } = useOutletContext(); // Users and fetchUsers from context
  const { projectId, userId } = useParams(); // Retrieve projectId and userId from route params

  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(""); // Track status changes
  const [statusReason, setStatusReason] = useState(""); // Track reason for status update
  const [alert, setAlert] = useState(null);

  // Fetch project and user data
  useEffect(() => {
    const fetchData = () => {
      if (users && users.length > 0) {
        const matchedUser = users.find((u) => u._id === userId);
        const matchedProject = projects.find((p) => p._id === projectId);

        setUser(matchedUser || null);
        setProject(matchedProject || null);
        setSelectedStatus(matchedProject?.status || "submitted");
      }
      setLoading(false);
    };

    fetchData();
  }, [users, projects, projectId, userId]);

  // Handle status change locally
  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
  };

  // Submit status update to the backend
  const submitStatusUpdate = async () => {
    if (!project) return;
    setUpdating(true);
    try {
      const response = await axios.post(
        `${localhost}/api/adminauth/project-status`,
        {
          projectId: project._id,
          status: selectedStatus,
          reason: statusReason,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setAlert({ type: "success", message: response.data.message });
        fetchProject(); // Refresh users/projects
        setSelectedStatus("");
        setStatusReason("");
      } else {
        setAlert({ type: "error", message: response.data.message });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderAll />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center text-xl text-orange-800">
        Project not found.{" "}
        <Link className="underline text-blue-600" to={-1}>
          Go back
        </Link>
      </div>
    );
  }

  if (!user) {
    return <h1 className="text-center mt-20 text-2xl">User not found</h1>;
  }

  if (project.status === "approved") {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <h1 className="text-center text-2xl text-green-600">
          Project has been approved and started soon.
        </h1>
        <Link
          to="/db_au_admn/projectusers"
          className="mt-2 bg-green-700 text-white p-2 transition-all rounded hover:bg-green-800 hover:scale-105"
        >
          Go to project
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6 min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden text-gray-400">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Project Review</h1>
          <h2 className="text-xl mb-2">
            User: <span className="text-gray-200">{user.name}</span>
          </h2>
          <h2 className="text-xl mb-2">
            Project:
            <span className="text-gray-200">{project.projectName}</span>
          </h2>
          <p className="mb-4">
            <strong>Created At:</strong>
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
          <p className="mb-4">
            <strong>Status:</strong> {project.status}
          </p>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <div className="mb-4">
            <label
              htmlFor="statusReason"
              className="block text-gray-400 text-sm mb-2"
            >
              Reason for Status Change:
            </label>
            <input
              type="text"
              id="statusReason"
              placeholder="Enter reason"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              className="w-full bg-gray-700 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="status-update"
              className="block text-gray-400 text-sm mb-2"
            >
              Update Status:
            </label>
            <select
              id="status-update"
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <button
            onClick={submitStatusUpdate}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectReview;
