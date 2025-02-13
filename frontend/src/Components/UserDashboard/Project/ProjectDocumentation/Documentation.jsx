import React from "react";
import {
  PointRateCard,
  ProjectSubmissionCard,
  ProjectStagesCard,
} from "./PointRateCard";
import electricalwiring from "../../../../assets/electricalwiringandcircuitborad.png";
import electricalwiringbuilding from "../../../../assets/electricalwiringandbuilding.png";
import { Link } from "react-router-dom";

const Documentation = () => {
  return (
    <div className="min-h-screen p-2 relative top-8 mb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-400 mb-8 text-center">
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
          <Link
            to="/db-au-user/project/prjfrom"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Add Project
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <img
            src={electricalwiring}
            alt="Electrician working on a circuit board"
            className="rounded-lg shadow-md w-96 h-96"
          />
          <img
            src={electricalwiringbuilding}
            alt="Electrical wiring in a building"
            className="rounded-lg shadow-md w-96 h-96"
          />
          <img
            src="https://i.pinimg.com/736x/01/ae/62/01ae624049422e0b5fc440d6757a497a.jpg"
            alt="Electrician installing a light fixture"
            className="rounded-lg shadow-md w-96 h-96"
          />
        </div>
      </div>
    </div>
  );
};

export default Documentation;
