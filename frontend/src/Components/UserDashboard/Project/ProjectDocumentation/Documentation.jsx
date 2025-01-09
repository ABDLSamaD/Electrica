import React from "react";
import PointRateCard from "./PointRateCard";
import ProjectStagesCard from "./ProjectStagesCard";
import ProjectSubmissionCard from "./ProjectSubmissionCard";

const Documentation = () => {
  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-950 mb-8 text-center">
          Electrician Project Documentation
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PointRateCard />
          <ProjectStagesCard />
          <ProjectSubmissionCard />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            How to Add a Project
          </h2>
          <p className="text-gray-200 mb-4">
            To add a new project, click on the "Add Project" button below and
            fill out the necessary details. Once submitted, your project will go
            into review.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Add Project
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <img
            src="/placeholder.svg?height=200&width=300"
            alt="Electrician working on a circuit board"
            className="rounded-lg shadow-md"
          />
          <img
            src="/placeholder.svg?height=200&width=300"
            alt="Electrical wiring in a building"
            className="rounded-lg shadow-md"
          />
          <img
            src="/placeholder.svg?height=200&width=300"
            alt="Electrician installing a light fixture"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Documentation;
