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

  const { user, userProject } = useOutletContext();
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(false);

  useEffect(() => {
    setPage(false);
    if (!userProject || userProject.length === 0) {
      setPage(false);
    } else {
      setPage(true);
    }
    if (!user) {
      setLoader(false);
      setData(null);
      setPage(false);
      setError("User data fetching soon...");
      return;
    }

    setLoader(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        setData(user);
        setLoader(false);
      } catch (err) {
        setError("Failed to load user data.");
        setLoader(false);
      }
    }, 2000); // Reduced delay for better UX

    return () => clearTimeout(timer);
  }, [user, userProject]);

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

  return (
    <div className="relative top-10 p-6 text-gray-200 bg-gray-900 min-h-screen">
      {loader ? (
        <LoaderAll />
      ) : error ? (
        <div className="text-red-500 text-sm text-center">{error}</div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-teal-400">
            Welcome, {data?.name || "User"}!
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Here’s an overview of your dashboard:
          </p>

          {/* User Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-800 p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold text-teal-300">
                Your Statistics
              </h2>
              <ul className="mt-3 text-gray-400">
                <li>
                  <strong>Active Projects:</strong>{" "}
                  {userProject ? userProject.length : 0}
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
              <h2 className="text-lg font-semibold text-teal-300">
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
                <p className="text-gray-400">
                  Check the current status of your project:
                </p>
                <button
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
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
          <div className="mt-10 bg-gray-800 p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-teal-400">
              About Electrica
            </h2>
            <p className="mt-3 text-gray-400">
              Electrica is your comprehensive solution for managing and
              monitoring projects efficiently. From initiation to completion,
              Electrica ensures every step of your project is streamlined for
              success.
            </p>
            <ul className="list-disc pl-5 mt-4 text-gray-400">
              <li>Real-time project tracking and updates</li>
              <li>Seamless collaboration with team members</li>
              <li>Comprehensive analytics and insights</li>
              <li>Customizable workflows to suit your needs</li>
            </ul>
            <p className="mt-4 text-gray-400">
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
