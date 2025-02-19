import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import LoaderAll from "../OtherComponents/LoaderAll";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2"; // Example library for charts
// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardHome = () => {
  const navigate = useNavigate();

  const { user, projects } = useOutletContext();
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(false);

  useEffect(() => {
    // Reset states initially
    setError(null);
    setPage(false);

    if (!user) {
      setData(null);
      setError("User data fetching soon...");
      return;
    }

    if (!projects || projects.length === 0) {
      setPage(false);
    } else {
      setPage(true);
    }

    // Timer to simulate data loading
    const timer = setTimeout(() => {
      try {
        setData(user); // Load user data
      } catch (err) {
        setError("Failed to load user data.");
      } finally {
        setLoader(false); // Stop loader
      }
    }, 1900); // Reduced delay for better UX

    // Cleanup timer on unmount or dependencies change
    return () => clearTimeout(timer);
  }, [user, projects]); // Only runs when `user` or `projects` change

  const projectCompletionData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Project Progress",
        data: [20, 40, 60, 80, 100],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const userProjects =
    projects?.filter((project) => project.user === user._id) || [];
  const projectCount = userProjects.length;

  return (
    <div className="relative top-10 p-6 text-gray-200 min-h-screen">
      {loader ? (
        <div className="min-h-screen grid place-content-center">
          <LoaderAll />
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm text-center">{error}</div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-blue-600">
            Welcome, {data?.name || "User"}!
          </h1>
          <p className="text-sm text-gray-200 mt-1">
            Here’s an overview of your dashboard:
          </p>

          {/* User Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-md shadow-md">
              <h1 className="text-2xl font-semibold text-blue-500">
                Your Statistics
              </h1>
              <ul className="mt-3 text-gray-300 text-base">
                <li>
                  <strong>Active Projects:</strong>
                  {projectCount}
                </li>
                <li>
                  <strong>Tasks Completed:</strong> 45
                </li>
                <li>
                  <strong>Collaborators:</strong> 12
                </li>
                <li>
                  <strong>Average Progress:</strong> 78%
                </li>
              </ul>
            </div>

            {/* Graph Section */}
            <div className="bg-gray-800 p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold text-blue-500">
                Project Progress
              </h2>
              <Line
                data={projectCompletionData}
                options={{ responsive: true }}
              />
            </div>
          </div>

          {/* Navigation Section */}
          <div className="mt-6">
            {page ? (
              <div className="flex gap-4 items-center">
                <p className="text-gray-200">
                  Check the current status of your project:
                </p>
                <button
                  className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => navigate("checkstatus")}
                >
                  Check Status
                </button>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <p className="text-gray-400">Start a new project:</p>
                <button
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
                  onClick={() => navigate("/db-au-user/project")}
                >
                  Create Project
                </button>
              </div>
            )}
          </div>

          {/* Electrica Details Section */}
          <div className="mt-10 bg-gray-800/20 backdrop-blur-md p-6 rounded-md shadow-md mb-10">
            <h2 className="text-xl font-semibold text-blue-600">
              About Electrica
            </h2>
            <p className="mt-3 text-gray-200">
              Electrica is your comprehensive solution for managing and
              monitoring projects efficiently. From initiation to completion,
              Electrica ensures every step of your project is streamlined for
              success.
            </p>
            <ul className="list-disc pl-5 mt-4 text-gray-200">
              <li>Real-time project tracking and updates</li>
              <li>Seamless collaboration with team members</li>
              <li>Comprehensive analytics and insights</li>
              <li>Customizable workflows to suit your needs</li>
            </ul>
            <p className="mt-4 text-gray-200">
              Discover the power of Electrica by starting your first project
              today!
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
