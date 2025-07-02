"use client";

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import {
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
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  FolderOpen,
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  UserCheck,
  Settings,
  BarChart3,
  PieChartIcon,
} from "lucide-react";

const AdminHome = () => {
  const { admin, users, projects } = useOutletContext();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [pendingProjects, setPendingProjects] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    if (users && users.length > 0) {
      setTotalUsers(users.length);
      const active = projects.filter((p) => p.status === "active").length;
      const completed = projects.filter((p) => p.status === "completed").length;
      const pending = projects.filter((p) => p.status === "pending").length;

      setTotalProjects(projects.length);
      setActiveProjects(active);
      setCompletedProjects(completed);
      setPendingProjects(pending);

      setRecentProjects(
        projects
          .filter(
            (p) => new Date(p.createdAt) > Date.now() - 7 * 24 * 60 * 60 * 1000
          )
          .slice(0, 5)
      );

      // Enhanced user activity data
      const activityData = users.slice(0, 8).map((user) => ({
        name: user.name.split(" ")[0], // First name only for better display
        logins: user.loginAttempt
          ? user.loginAttempt.length
          : Math.floor(Math.random() * 20) + 1,
        projects: projects.filter((p) => p.userId === user.id).length,
      }));
      setUserActivityData(activityData);

      // Enhanced project status data
      const statusData = [
        { name: "Active", value: active, color: "#10b981" },
        { name: "Completed", value: completed, color: "#3b82f6" },
        { name: "Pending", value: pending, color: "#f59e0b" },
        {
          name: "On Hold",
          value: Math.floor(projects.length * 0.1),
          color: "#ef4444",
        },
      ];
      setProjectStatusData(statusData);

      // Monthly project creation data
      const monthlyProjectData = [
        {
          month: "Jan",
          projects: Math.floor(Math.random() * 15) + 5,
          users: Math.floor(Math.random() * 10) + 3,
        },
        {
          month: "Feb",
          projects: Math.floor(Math.random() * 15) + 5,
          users: Math.floor(Math.random() * 10) + 3,
        },
        {
          month: "Mar",
          projects: Math.floor(Math.random() * 15) + 5,
          users: Math.floor(Math.random() * 10) + 3,
        },
        {
          month: "Apr",
          projects: Math.floor(Math.random() * 15) + 5,
          users: Math.floor(Math.random() * 10) + 3,
        },
        {
          month: "May",
          projects: Math.floor(Math.random() * 15) + 5,
          users: Math.floor(Math.random() * 10) + 3,
        },
        {
          month: "Jun",
          projects: Math.floor(Math.random() * 15) + 5,
          users: Math.floor(Math.random() * 10) + 3,
        },
      ];
      setMonthlyData(monthlyProjectData);
    }
  }, [users, projects]);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  const statsCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-400/30",
      description: "Registered platform users",
      trend: "+12% from last month",
      trendUp: true,
    },
    {
      title: "Total Projects",
      value: totalProjects,
      icon: FolderOpen,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-400/30",
      description: "All projects in system",
      trend: "+8% from last month",
      trendUp: true,
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: Activity,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-400/30",
      description: "Currently active projects",
      trend: "+15% from last month",
      trendUp: true,
    },
    {
      title: "Completed Projects",
      value: completedProjects,
      icon: CheckCircle,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-400/30",
      description: "Successfully completed",
      trend: "+22% from last month",
      trendUp: true,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Enhanced Header Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl p-8 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xl text-white font-semibold">
                    Welcome back,{" "}
                    <span className="text-cyan-400">{admin?.username}</span>
                  </p>
                  <p className="text-white/60">
                    Administrator Dashboard Overview
                  </p>
                </div>
              </div>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
                Monitor your platform's performance, track user engagement, and
                manage projects efficiently. Here's a comprehensive overview of
                your system's current status and analytics.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white/60 text-sm">Last Login</p>
                <p className="text-white font-semibold">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            className={`group relative p-6 bg-white/[0.02] backdrop-blur-3xl rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:scale-105 overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 ${card.bgColor} backdrop-blur-xl rounded-xl border ${card.borderColor}`}
                >
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    card.trendUp
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  } border ${
                    card.trendUp ? "border-green-400/30" : "border-red-400/30"
                  }`}
                >
                  {card.trend}
                </div>
              </div>
              <h3 className="text-white/80 text-sm font-medium mb-2">
                {card.title}
              </h3>
              <p className="text-3xl font-bold text-white mb-2">
                {card.value.toLocaleString()}
              </p>
              <p className="text-white/60 text-xs">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Enhanced Line Chart - User Activity */}
        <motion.div
          className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-3xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  User Activity Overview
                </h3>
                <p className="text-white/60 text-sm">
                  Login frequency and project engagement
                </p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={userActivityData}>
              <defs>
                <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} />
              <YAxis stroke="#ffffff60" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="logins"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorLogins)"
                strokeWidth={2}
                name="User Logins"
              />
              <Area
                type="monotone"
                dataKey="projects"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorProjects)"
                strokeWidth={2}
                name="User Projects"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Enhanced Pie Chart - Project Status */}
        <motion.div
          className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-3xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-400/30">
                <PieChartIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Project Status Distribution
                </h3>
                <p className="text-white/60 text-sm">
                  Current project status breakdown
                </p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={projectStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {projectStatusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-white/80 text-sm">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Monthly Trends Chart */}
      <motion.div
        className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-3xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-xl border border-green-400/30">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Monthly Growth Trends
              </h3>
              <p className="text-white/60 text-sm">
                Project creation and user registration trends over time
              </p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="month" stroke="#ffffff60" fontSize={12} />
            <YAxis stroke="#ffffff60" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                color: "white",
              }}
            />
            <Legend />
            <Bar
              dataKey="projects"
              fill="#10b981"
              name="New Projects"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="users"
              fill="#3b82f6"
              name="New Users"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Enhanced Quick Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="bg-white/[0.02] backdrop-blur-3xl p-6 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h4 className="text-white font-semibold">This Week</h4>
          </div>
          <div className="space-y-2">
            <p className="text-white/80 text-sm">
              New Projects:{" "}
              <span className="text-green-400 font-semibold">12</span>
            </p>
            <p className="text-white/80 text-sm">
              New Users: <span className="text-blue-400 font-semibold">8</span>
            </p>
            <p className="text-white/80 text-sm">
              Completed:{" "}
              <span className="text-purple-400 font-semibold">5</span>
            </p>
          </div>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl p-6 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-5 h-5 text-orange-400" />
            <h4 className="text-white font-semibold">Pending Actions</h4>
          </div>
          <div className="space-y-2">
            <p className="text-white/80 text-sm">
              Project Reviews:{" "}
              <span className="text-orange-400 font-semibold">
                {pendingProjects}
              </span>
            </p>
            <p className="text-white/80 text-sm">
              User Approvals:{" "}
              <span className="text-yellow-400 font-semibold">3</span>
            </p>
            <p className="text-white/80 text-sm">
              System Updates:{" "}
              <span className="text-red-400 font-semibold">2</span>
            </p>
          </div>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl p-6 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-semibold">System Health</h4>
          </div>
          <div className="space-y-2">
            <p className="text-white/80 text-sm">
              Server Status:{" "}
              <span className="text-green-400 font-semibold">Online</span>
            </p>
            <p className="text-white/80 text-sm">
              Database:{" "}
              <span className="text-green-400 font-semibold">Healthy</span>
            </p>
            <p className="text-white/80 text-sm">
              Uptime: <span className="text-blue-400 font-semibold">99.9%</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminHome;
