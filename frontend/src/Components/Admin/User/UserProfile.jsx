import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import LoaderAll from "../../OtherComponents/LoaderAll";
import { FaArrowLeft } from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const { users, projects } = useOutletContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Reduced timeout for better UX
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoaderAll />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <h1 className="text-white text-3xl text-center">No users found</h1>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 bg-gray-900 min-h-screen">
      {/* Back Button */}
      <button
        className="mb-4 text-gray-500 hover:text-gray-200 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Go Back
      </button>
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-300">
        User Profiles
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Link
            to={`/db_au_admn/userprofile/${user._id}`}
            key={user._id}
            className="block"
            title={`${user.name}'s profile`}
          >
            <div className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6">
              {/* User Image */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16">
                  <img
                    src={user.profileImg || "/placeholder-profile.png"}
                    alt={`${user.name}'s avatar`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-purple-300 truncate">
                    {user.name}
                  </h2>
                  <p className="text-gray-400 text-sm">{user.role || "user"}</p>
                </div>
              </div>

              {/* User Info */}
              <div className="text-gray-300 space-y-2">
                <p>
                  <span className="font-medium">Email: </span>
                  {user.email}
                </p>
                <p>
                  <span className="font-medium">Phone: </span>
                  {user.phone || "N/A"}
                </p>
                <p>
                  <span className="font-medium">City: </span>
                  {user.city || "N/A"}
                </p>
              </div>

              {/* Project Info */}
              {projects && projects.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-purple-300">
                    Projects:
                  </h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-400">
                    {Array.isArray(projects) && projects.length > 0 ? (
                      projects.slice(0, 3).map((project, index) => (
                        <li key={index}>
                          <span className="text-purple-300 font-medium">
                            {project.name}
                          </span>
                          {`: ${project.description?.slice(0, 50) || ""}...`}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">
                        No projects available
                      </li>
                    )}
                    {Array.isArray(projects) && projects.length > 3 && (
                      <li className="text-gray-500">+ more...</li>
                    )}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-4">
                  No projects listed.
                </p>
              )}

              {/* Action Button */}
              <div className="mt-6 text-right">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all">
                  View Profile
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
