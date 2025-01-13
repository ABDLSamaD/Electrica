import React from "react";
import { FaTools, FaClipboardCheck, FaLightbulb } from "react-icons/fa";
import Header from "./Header";

const stages = [
  {
    id: 1,
    title: "Piping",
    description:
      "Installation of pipes to securely route electrical cables, ensuring proper wiring pathways. This stage involves careful planning to ensure that the electrical system is both efficient and safe.",
    icon: <FaTools size={40} className="text-orange-500" />,
  },
  {
    id: 2,
    title: "Concealed Fitting",
    description:
      "Embedding conduits, boxes, and fittings within walls and ceilings for a clean, finished look. This process not only enhances aesthetics but also protects the wiring from damage.",
    icon: <FaClipboardCheck size={40} className="text-orange-500" />,
  },
  {
    id: 3,
    title: "Panel Boards & Switchboards",
    description:
      "Installation of panel boards, lighting systems, and switchboards, bringing the project to life. This stage is crucial for ensuring that the electrical supply is managed safely and effectively.",
    icon: <FaLightbulb size={40} className="text-orange-500" />,
  },
];

const ProjectDetails = () => {
  return (
    <div className="container mx-auto px-6 py-36">
      {/* Page Header */}
      <Header />
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100">
          Project Details - Electrica
        </h1>
        <p className="text-lg text-gray-300">
          Discover the journey of creating efficient, safe, and reliable
          electrical systems.
        </p>
      </div>

      {/* Sticky Sections for Each Stage */}
      <div className="mt-12 space-y-8">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg sticky top-0 transition-transform duration-300 ease-in-out transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              {stage.icon}
              <h2 className="text-2xl font-semibold text-white ml-4">
                {stage.title}
              </h2>
            </div>
            <p className="text-gray-300">{stage.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
