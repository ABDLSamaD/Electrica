import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  ChevronLeft,
  Mail,
  Briefcase,
  Calendar,
  Shield,
  User,
  MapPin,
} from "lucide-react";
import LoaderAll from "../../OtherComponents/LoaderAll";

const EachProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, projects } = useOutletContext();
  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details"); // Manage active tab

  useEffect(() => {
    // Simulate loading time (1.8 seconds)

    if (users && users.length > 0) {
      const matchedUser = users.find((u) => u._id === userId);
      setUser(matchedUser || null);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      const userProjectsList = projects.filter((p) => p.user === userId);
      setUserProjects(userProjectsList);
      return () => clearTimeout(timer); // Clear timer on component unmount
    }
  }, [users, userId, projects]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderAll />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            User Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The requested user profile does not exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-white">Back</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-48 bg-gradient-to-r from-cyan-900 to-indigo-900 rounded-2xl"></div>
          <div className="absolute -bottom-16 left-8">
            <img
              src={user.profileImg}
              alt={user.name}
              className="w-32 h-32 rounded-xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-20 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {user.name}
          </h1>
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            {user.role}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userProjects.length}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </p>
                <p className="text-2xl font-bold text-green-500">
                  {user.isVerified ? "Verified" : "Pending"}
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Member Since
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 mb-8 shadow-md">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "details"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "projects"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Projects
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Full Name
                  </p>
                  <p className="text-gray-900 dark:text-white">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <Mail className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {user.city || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6">
            {userProjects.length > 0 ? (
              userProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {project.projectName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {project.projectDescription}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Project Start:
                        {project.startStage === true ? (
                          <b className="ml-1 text-blue-600">True</b>
                        ) : (
                          <b className="ml-1 text-red-600">False</b>
                        )}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Project Complete:
                        {project.completeProject === true ? (
                          <b className="ml-1 text-blue-600">True</b>
                        ) : (
                          <b className="ml-1 text-red-600">False</b>
                        )}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-200 dark:text-gray-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-white">
                      Started {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    to={`/db_au_admn/projectusers/stageone/${project._id}`}
                    className="text-blue-600 dark:text-blue-400 bg-blue-500/20 py-1 px-6 rounded-lg backdrop-blur-xl font-medium hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    View Project
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400">
                No projects added yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EachProfile;
