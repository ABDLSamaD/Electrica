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
import { Calendar, Clock, Info, User } from "lucide-react";

const ProjectReview = () => {
  const navigate = useNavigate();
  const { users, projects, fetchProject, electricaURL } = useOutletContext(); // Users and fetchUsers from context
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
        setTimeout(() => setLoading(false), 1200);
      }
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
        `${electricaURL}/api/adminauth/project-status`,
        {
          projectId: project._id,
          status: selectedStatus,
          reason: statusReason,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setAlert({ type: response.data.type, message: response.data.message });
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
    <div className="flex items-center justify-center p-6 min-h-screen bg-gray-900 text-gray-200">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
          Project Review
        </h1>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <User className="text-blue-400" />
            <span className="text-lg font-semibold">{user.name}</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Info className="text-green-400" />
            <span className="text-lg font-semibold">{project.projectName}</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Calendar className="text-yellow-400" />
            <span>
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Clock className="text-purple-400" />
            <span>Status: {project.status}</span>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="statusReason"
              className="block text-sm font-medium text-white"
            >
              Reason for Status Change
            </label>
            <input
              id="statusReason"
              type="text"
              className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
              placeholder="Enter reason"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="status-update"
              className="block text-sm font-medium text-white"
            >
              Update Status
            </label>
            <select
              id="status-update"
              className="w-full p-3 bg-gray-900/60 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-blue-500/50"
            onClick={submitStatusUpdate}
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
