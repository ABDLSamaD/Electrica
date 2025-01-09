import React from "react";
import { FaTools } from "react-icons/fa";

const ProjectStagesCard = () => {
  return (
    <div className="bg-white/25 rounded-lg shadow-md p-6 text-gray-300">
      <div className="flex items-center mb-4">
        <FaTools className="text-green-500 text-3xl mr-2" />
        <h2 className="text-2xl font-semibold text-gray-950">Project Stages</h2>
      </div>
      <ul className="space-y-2">
        <li>
          <strong className="text-blue-900">Stage-1:</strong> Electric Roof
          Pimping
        </li>
        <li>
          <strong className="text-blue-900">Stage-2:</strong> Electric Insert
          Pimpes Concealed Fitting
        </li>
        <li>
          <strong className="text-blue-900">Stage-3:</strong> Electric
          Troubleshooting, Wiring, Installation Switch Boards, Panel Boards,
          etc.
        </li>
      </ul>
    </div>
  );
};

export default ProjectStagesCard;
