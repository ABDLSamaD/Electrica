import React from "react";
import { FaClipboardCheck } from "react-icons/fa";

const ProjectSubmissionCard = () => {
  return (
    <div className="bg-white/20 rounded-lg shadow-md p-6 text-gray-300">
      <div className="flex items-center mb-4">
        <FaClipboardCheck className="text-purple-500 text-3xl mr-2" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Project Submission
        </h2>
      </div>
      <p>
        Once you submit your project, it will be reviewed and approved by an
        admin. The stages will then be unlocked for you to begin your work.
      </p>
      <div className="mt-4 bg-gray-800/75 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Submission Checklist:</h3>
        <ul className="list-disc list-inside">
          <li>Complete all required fields</li>
          <li>Attach necessary diagrams or plans</li>
          <li>Provide accurate time estimates</li>
          <li>Include any special requirements or notes</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectSubmissionCard;
