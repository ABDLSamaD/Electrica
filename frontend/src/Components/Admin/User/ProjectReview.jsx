import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
// import Alert from "../../OtherComponents/Alert";
import LoaderAll from "../../OtherComponents/LoaderAll";
import {
  Calendar,
  CheckCircle,
  Clock,
  Info,
  User,
  AlertCircle,
  XCircle,
} from "lucide-react";

function Alert({ type, message, onClose }) {
  const alertStyles = {
    success: "bg-green-500/20 border-green-400/30 text-green-100",
    error: "bg-red-500/20 border-red-400/30 text-red-100",
    warning: "bg-yellow-500/20 border-yellow-400/30 text-yellow-100",
    info: "bg-blue-500/20 border-blue-400/30 text-blue-100",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 p-4 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-top-2 duration-300 ${alertStyles[type]}`}
    >
      <div className="flex items-center space-x-3">
        {icons[type]}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white/70 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

const ProjectReview = () => {
  const { users, projects, fetchProject, electricaURL } = useOutletContext(); // Users and fetchUsers from context
  const { projectId, userId } = useParams(); // Retrieve projectId and userId from route params

  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusReason, setStatusReason] = useState(""); // Track reason for status update
  const [alert, setAlert] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("submitted");

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
    if (!statusReason.trim()) {
      setAlert({
        type: "warning",
        message: "Please provide a reason for the status change",
        onClose: () => setAlert(null),
      });
      return;
    }
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
        setAlert({
          type: response.data.type,
          message: response.data.message,
          onClose: () => setAlert(null),
        });
        fetchProject(); // Refresh users/projects
        setSelectedStatus("");
        setStatusReason("");
      } else {
        setAlert({
          type: "error",
          message: response.data.message,
          onClose: () => setAlert(null),
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "An error occurred",
        onClose: () => setAlert(null),
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-blue-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
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
    <div className="min-h-screen p-6 flex items-center justify-center">
      {/* Add these floating elements before the main card */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-10 right-10 w-2 h-2 bg-white/15 rounded-full animate-pulse delay-700"></div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="relative w-full max-w-5xl">
        {/* Enhanced glassmorphism card */}
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/[0.18] p-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02] rounded-3xl"></div>
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl mb-6 shadow-lg">
                <Info className="w-10 h-10 text-white/80" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
                Project Review
              </h1>
              <p className="text-white/60 text-lg">
                Review and update project status with detailed feedback
              </p>
              <div className="w-32 h-0.5 bg-white/20 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Project Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white/90 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-400" />
                  Project Details
                </h2>

                <div className="space-y-4">
                  <div className="group p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.15] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="p-3 bg-white/10 backdrop-blur-xl rounded-xl shadow-inner">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/50 mb-1 font-medium tracking-wide uppercase">
                          Reviewer
                        </p>
                        <p className="text-xl font-semibold text-white">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.15] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="p-3 bg-white/10 backdrop-blur-xl rounded-xl shadow-inner">
                        <Info className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/50 mb-1 font-medium tracking-wide uppercase">
                          Project Name
                        </p>
                        <p className="text-xl font-semibold text-white">
                          {project.projectName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.15] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="p-3 bg-white/10 backdrop-blur-xl rounded-xl shadow-inner">
                        <Calendar className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/50 mb-1 font-medium tracking-wide uppercase">
                          Created Date
                        </p>
                        <p className="text-xl font-semibold text-white">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.15] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="p-3 bg-white/10 backdrop-blur-xl rounded-xl shadow-inner">
                        {getStatusIcon(project.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/50 mb-1 font-medium tracking-wide uppercase">
                          Current Status
                        </p>
                        <p
                          className={`text-xl font-semibold capitalize ${getStatusColor(
                            project.status
                          )} text-white`}
                        >
                          {project.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-white/10 backdrop-blur-xl rounded-xl">
                    <Clock className="w-6 h-6 text-white/80" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Update Status
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="statusReason"
                      className="block text-sm font-medium text-white/80"
                    >
                      Reason for Status Change
                    </label>
                    <textarea
                      id="statusReason"
                      rows={4}
                      className="w-full p-5 bg-white/[0.03] backdrop-blur-xl text-white rounded-2xl border border-white/[0.15] focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 placeholder-white/30 transition-all duration-300 resize-none hover:bg-white/[0.05] shadow-inner"
                      placeholder="Please provide a detailed reason for the status change..."
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="status-update"
                      className="block text-sm font-medium text-white/80"
                    >
                      New Status
                    </label>
                    <select
                      id="status-update"
                      className="w-full p-5 bg-white/[0.03] backdrop-blur-xl text-white rounded-2xl border border-white/[0.15] focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300 hover:bg-white/[0.05] shadow-inner"
                      value={selectedStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option value="submitted" className="bg-slate-800">
                        Submitted
                      </option>
                      <option value="approved" className="bg-slate-800">
                        Approved
                      </option>
                      <option value="rejected" className="bg-slate-800">
                        Rejected
                      </option>
                      <option value="pending" className="bg-slate-800">
                        Pending
                      </option>
                    </select>
                  </div>

                  <button
                    className="w-full bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white py-5 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.3)] hover:scale-[1.02] font-semibold text-lg border border-white/20 hover:border-white/30 relative overflow-hidden group"
                    onClick={submitStatusUpdate}
                    disabled={updating}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      {updating ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Update Status"
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReview;
