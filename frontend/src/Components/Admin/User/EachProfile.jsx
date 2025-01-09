import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaProjectDiagram,
} from "react-icons/fa";

const EachProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, projects } = useOutletContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details"); // Manage active tab

  useEffect(() => {
    if (users && users.length > 0) {
      const matchedUser = users.find((u) => u._id === userId);
      setUser(matchedUser || null);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [users, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl text-gray-400">User not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        className="mb-4 text-gray-500 hover:text-gray-200 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Go Back
      </button>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <img
          src={user.profileImg || "/placeholder.jpg"}
          alt={user.name}
          className="w-32 h-32 rounded-full border-4 border-white mb-4"
        />
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <p className="text-gray-200">{user.email}</p>
        <p className="text-sm text-gray-300">{user.role}</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="bg-gray-800 text-center p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-white">
            {projects.length || 0}
          </h2>
          <p className="text-gray-400">Projects</p>
        </div>
        <div className="bg-gray-800 text-center p-4 rounded-lg">
          <h2
            className={`text-2xl font-bold ${
              user.isVerified ? "text-green-400" : "text-red-400"
            }`}
          >
            {user.isVerified ? "Verified" : "Not Verified"}
          </h2>
          <p className="text-gray-400">Verification Status</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg grid place-content-center">
          <p className="text-gray-400">{user._id}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6 border-b border-gray-700">
        <button
          className={`py-2 px-6 font-bold ${
            activeTab === "details"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={`py-2 px-6 font-bold ${
            activeTab === "projects"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="bg-gray-800 p-6 rounded-lg text-white space-y-4">
          <h2 className="text-xl font-bold">User Information</h2>
          <p>
            <strong className="text-orange-500">Name:</strong> {user.name}
          </p>
          <p>
            <strong className="text-orange-500">Email:</strong> {user.email}
          </p>
          <p>
            <strong className="text-orange-500">Role:</strong>{" "}
            {user.role || "user"}
          </p>
          <p>
            <strong className="text-orange-500">Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {activeTab === "projects" && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">User Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {project.projectName}
                  </h3>
                  <p className="text-gray-400">{project.description}</p>
                  <Link
                    to={`/db_au_admn/userprofile/${user._id}/projectreview/${project._id}`}
                    className="block mt-4 text-blue-400 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No projects added yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EachProfile;
