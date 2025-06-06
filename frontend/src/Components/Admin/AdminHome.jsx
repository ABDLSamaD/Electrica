import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const AdminHome = () => {
  const { admin, users, projects } = useOutletContext();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);

  useEffect(() => {
    if (users && users.length > 0) {
      setTotalUsers(users.length);

      const active = projects.filter((p) => p.status === "active").length;
      setTotalProjects(projects.length);
      setActiveProjects(active);

      setRecentProjects(
        projects
          .filter(
            (p) => new Date(p.createdAt) > Date.now() - 7 * 24 * 60 * 60 * 1000
          )
          .slice(0, 5)
      );

      // Prepare user activity data
      const activityData = users.map((user) => ({
        name: user.name,
        logins: user.loginAttempt ? user.loginAttempt.length : 0,
      }));
      setUserActivityData(activityData);

      // Prepare project status data
      const statusData = [
        { name: "Active", value: active },
        {
          name: "Completed",
          value: projects.filter((p) => p.status === "completed").length,
        },
        {
          name: "Pending",
          value: projects.filter((p) => p.status === "pending").length,
        },
      ];
      setProjectStatusData(statusData);
    }
  }, [users, projects]);

  const COLORS = ["#4caf50", "#2196f3", "#f44336"];

  return (
    <div className="px-4 sm:px-6 py-8 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>
      <p className="text-base sm:text-lg text-gray-300 mb-6">
        Hello{" "}
        <span className="text-cyan-400 font-semibold text-xl mx-2 tracking-wider">
          {admin.username}
        </span>
        Welcome back! Here's a detailed overview of your platform.
      </p>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="p-4 sm:p-6 rounded-xl shadow-lg bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl sm:text-3xl font-bold mt-2">{totalUsers}</p>
        </div>
        <div className="p-4 sm:p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-600 to-teal-500 text-white">
          <h2 className="text-lg font-semibold">Total Projects</h2>
          <p className="text-2xl sm:text-3xl font-bold mt-2">{totalProjects}</p>
        </div>
        <div className="p-4 sm:p-6 rounded-xl shadow-lg bg-gradient-to-br from-pink-600 to-red-500 text-white">
          <h2 className="text-lg font-semibold">Active Projects</h2>
          <p className="text-2xl sm:text-3xl font-bold mt-2">
            {activeProjects}
          </p>
        </div>
      </div>

      {/* Complex Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - User Activity */}
        <div className="bg-white/10 p-4 sm:p-6 rounded-lg shadow-lg backdrop-blur-md">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">
            User Login Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivityData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="logins"
                stroke="#4caf50"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Project Status */}
        <div className="bg-white/10 p-4 sm:p-6 rounded-lg shadow-lg backdrop-blur-md">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">
            Project Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {projectStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Project Creation */}
        <div className="bg-white/10 p-4 sm:p-6 rounded-lg shadow-lg backdrop-blur-md col-span-1 lg:col-span-2">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">
            Recent Project Creation
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recentProjects}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalCost" fill="#f44336" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
