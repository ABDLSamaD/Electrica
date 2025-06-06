import React from "react";
import {
  FaBolt,
  FaTools,
  FaClipboardCheck,
  FaCheckCircle,
  FaList,
  FaClock,
  FaFileAlt,
} from "react-icons/fa";

// PointRateCard Component
const PointRateCard = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <FaBolt className="text-blue-400 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-blue-400 ml-4">Point Rates</h2>
      </div>
      <p className="text-gray-200 mb-6">
        The current point rate for electricians is{" "}
        <strong className="text-blue-300">350 points</strong>. This is the
        standard rate that will be applied to your projects.
      </p>
      <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
        <FaList className="text-purple-400 mr-2" /> Additional Rates:
      </h3>
      <ul className="list-disc list-inside text-gray-300 space-y-2">
        <li>
          Complex wiring: <span className="text-green-400">+50 points</span>
        </li>
        <li>
          High-voltage systems:{" "}
          <span className="text-green-400">+100 points</span>
        </li>
        <li>
          Emergency repairs: <span className="text-green-400">+75 points</span>
        </li>
      </ul>
    </div>
  );
};

// ProjectStagesCard Component
const ProjectStagesCard = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-green-500/10 rounded-lg">
          <FaTools className="text-green-400 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-green-400 ml-4">
          Project Stages
        </h2>
      </div>
      <ul className="space-y-4 text-gray-200">
        <li className="flex items-start">
          <FaCheckCircle className="text-blue-400 mt-1 mr-3" />
          <div>
            <strong className="text-blue-300">Stage-1:</strong> Electric Roof
            Pimping
          </div>
        </li>
        <li className="flex items-start">
          <FaCheckCircle className="text-blue-400 mt-1 mr-3" />
          <div>
            <strong className="text-blue-300">Stage-2:</strong> Electric Insert
            Pimpes Concealed Fitting
          </div>
        </li>
        <li className="flex items-start">
          <FaCheckCircle className="text-blue-400 mt-1 mr-3" />
          <div>
            <strong className="text-blue-300">Stage-3:</strong> Electric
            Troubleshooting, Wiring, Installation Switch Boards, Panel Boards,
            etc.
          </div>
        </li>
      </ul>
    </div>
  );
};

// ProjectSubmissionCard Component
const ProjectSubmissionCard = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-purple-500/10 rounded-lg">
          <FaClipboardCheck className="text-purple-400 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-purple-400 ml-4">
          Project Submission
        </h2>
      </div>
      <p className="text-gray-200 mb-6">
        Once you submit your project, it will be reviewed and approved by an
        admin. The stages will then be unlocked for you to begin your work.
      </p>
      <div className="bg-gray-800/20 p-5 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
          <FaFileAlt className="text-yellow-400 mr-2" /> Submission Checklist:
        </h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Complete all required fields</li>
          <li>Attach necessary diagrams or plans</li>
          <li>Provide accurate time estimates</li>
          <li>Include any special requirements or notes</li>
        </ul>
      </div>
    </div>
  );
};

export { PointRateCard, ProjectStagesCard, ProjectSubmissionCard };
