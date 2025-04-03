import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart,
  BarChart,
  Activity,
  Users,
  CheckCircle,
  Zap,
  Plus,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Bell,
  Star,
  Award,
} from "lucide-react";
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
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LoaderAll() {
  return (
    <div className="flex items-center justify-center space-x-3">
      <motion.div
        className="w-4 h-4 bg-blue-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0,
        }}
      />
      <motion.div
        className="w-4 h-4 bg-purple-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-4 h-4 bg-indigo-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.4,
        }}
      />
    </div>
  );
}

const DashboardHome = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [ifUser, setIfUser] = useState(null);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(false);

  const { user, projects } = useOutletContext();

  useEffect(() => {
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

    const timer = setTimeout(() => {
      try {
        setData(user);
        const checkUser = projects.filter(
          (project) => project.user === user._id
        );
        setIfUser(checkUser);
      } catch (err) {
        setError("Failed to load user data.");
      } finally {
        setLoader(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [user, projects]);

  const projectCompletionData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Project Progress",
        data: [30, 45, 60, 70, 85, 92],
        fill: true,
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        borderColor: "rgba(147, 51, 234, 1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(147, 51, 234, 0.2)",
        borderWidth: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(147, 51, 234, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
        },
      },
    },
  };

  const stats = [
    {
      icon: BarChart,
      label: "Active Projects",
      value: ifUser?.length,
      color: "blue",
    },
    {
      icon: CheckCircle,
      label: "Tasks Completed",
      value: "0",
      color: "green",
    },
    { icon: Users, label: "Team Members", value: "0", color: "purple" },
    { icon: Activity, label: "Progress Rate", value: "0%", color: "pink" },
  ];

  const recentActivities = [
    {
      icon: CheckCircle,
      text: "Project Alpha milestone completed",
      time: "2h ago",
      color: "green",
    },
    {
      icon: Users,
      text: "New team member joined",
      time: "4h ago",
      color: "blue",
    },
    {
      icon: Star,
      text: "Received client feedback",
      time: "6h ago",
      color: "yellow",
    },
    {
      icon: Target,
      text: "Sprint planning completed",
      time: "8h ago",
      color: "purple",
    },
  ];

  const upcomingDeadlines = [
    { project: "Project Beta", deadline: "March 15", progress: 0 },
    { project: "Marketing Campaign", deadline: "March 20", progress: 0 },
    { project: "UI Redesign", deadline: "March 25", progress: 0 },
  ];

  if (loader) {
    return (
      <div className="min-h-screen grid place-content-center bg-[radial-gradient(circle_at_center,#1a1a2e_0%,#0f0f1a_100%)]">
        <LoaderAll />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-content-center bg-[radial-gradient(circle_at_center,#1a1a2e_0%,#0f0f1a_100%)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm text-center bg-red-500/10 px-6 py-3 rounded-xl backdrop-blur-lg border border-red-500/20"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-gray-100 relative top-12 mb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex sm:items-center items-start sm:gap-0 gap-3 justify-between sm:flex-row flex-col mb-12"
        >
          <div>
            <div className="flex items-start sm:items-center sm:flex-row flex-col gap-4 mb-3">
              <h1 className="text-5xl font-bold gradient-text flex items-center gap-3">
                Welcome {data?.name}!{" "}
              </h1>
              <Sparkles className="text-yellow-400" size={32} />
              <span className="px-4 py-1 bg-purple-500/30 text-purple-300 rounded-full text-sm font-medium mr-0 sm:mr-5">
                {user.role}
              </span>
            </div>
            <p className="text-gray-400 mt-3 text-lg">
              Your project dashboard is looking great today.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              navigate(page ? "checkstatus" : "/db-au-user/project")
            }
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            {page ? (
              <>
                Check Status
                <ArrowRight size={20} />
              </>
            ) : (
              <>
                New Project
                <Plus size={20} />
              </>
            )}
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card hover-card rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 bg-${stat.color}-500/10 rounded-xl`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold mt-1 gradient-text">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass-card rounded-xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold gradient-text">
                Project Progress
              </h2>
              <LineChart className="text-purple-500" size={24} />
            </div>
            <div className="h-[300px]">
              <Line data={projectCompletionData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <Bell className="text-yellow-500" size={24} />
              <h2 className="text-2xl font-bold gradient-text">
                Recent Activity
              </h2>
            </div>
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <activity.icon
                    className={`text-${activity.color}-500 mt-1`}
                    size={18}
                  />
                  <div>
                    <p className="text-gray-300">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="text-blue-500" size={24} />
              <h2 className="text-2xl font-bold gradient-text">
                Upcoming Deadlines
              </h2>
            </div>
            <div className="space-y-6">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-300 font-medium">
                      {deadline.project}
                    </p>
                    <p className="text-gray-400 text-sm">{deadline.deadline}</p>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${deadline.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <Award className="text-purple-500" size={24} />
              <h2 className="text-2xl font-bold gradient-text">
                Team Performance
              </h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-500/10 rounded-xl p-4">
                  <TrendingUp className="text-purple-500 mb-2" size={20} />
                  <p className="text-gray-400 text-sm">Productivity</p>
                  <p className="text-2xl font-bold gradient-text">92%</p>
                </div>
                <div className="bg-blue-500/10 rounded-xl p-4">
                  <Clock className="text-blue-500 mb-2" size={20} />
                  <p className="text-gray-400 text-sm">On-time Delivery</p>
                  <p className="text-2xl font-bold gradient-text">88%</p>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Top Performers
                </h3>
                <div className="space-y-3">
                  {["Sarah Chen", "Mike Roberts", "Emma Davis"].map(
                    (name, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-gray-300">{name}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-8 mb-8"
        >
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold gradient-text flex items-center gap-3">
              About Electrica
              <Sparkles className="text-yellow-400" size={24} />
            </h2>
            <p className="mt-4 text-gray-300 leading-relaxed text-lg">
              Electrica revolutionizes project management with cutting-edge
              tools and real-time analytics. Our platform seamlessly integrates
              with your workflow, providing powerful insights and efficient
              collaboration features to drive your projects forward.
            </p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Real-time tracking",
                "Team collaboration",
                "Smart analytics",
                "Custom workflows",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="font-medium text-white">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
