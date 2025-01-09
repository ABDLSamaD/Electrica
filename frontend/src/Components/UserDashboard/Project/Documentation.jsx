import React from "react";

const Documentation = () => {
  return (
    <div className="relative flex flex-col flex-wrap text-gray-200">
      <h2 className="text-3xl font-semibold mb-4">
        Electrician Project Documentation
      </h2>
      <p className="text-lg mb-6">
        Welcome to the Electrician Project Management System. Below are the key
        details:
      </p>

      <h3 className="text-xl font-semibold mb-1">Point Rates:</h3>
      <p className="text-base font-thin">
        The current point rate for electricians is
        <strong className="text-cyan-500 ml-1">350 points</strong>. This is the
        standard rate that will be applied to your projects.
      </p>

      <h3 className="text-xl font-semibold mb-2 mt-6">Project Stages</h3>
      <ul className="text-base space-y-2 font-thin">
        <li>
          <strong className="text-cyan-500">Stage-1 :</strong> Electric Roof
          Pimping
        </li>
        <li>
          <strong className="text-cyan-500">Stage-2 :</strong> Electric Insert
          Pimpes Concealed Fitting
        </li>
        <li>
          <strong className="text-cyan-500">Stage-3 :</strong> Electric
          Troubleshooting, Wiring, Installation Switch Boards, Panel Boards,
          etc.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-2 mt-6">Project Submission</h3>
      <p className="text-base font-thin">
        Once you submit your project, it will be reviewed and approved by an
        admin. The stages will then be unlocked for you to begin your work.
      </p>

      <h3 className="text-xl font-semibold mb-2 mt-6">How to Add a Project</h3>
      <p className="font-thin text-base mb-4">
        To add a new project, click on the "Add Project" button below and fill
        out the necessary details. Once submitted, your project will go into
        review.
      </p>
    </div>
  );
};

export default Documentation;
