import {
  faCheckCircle,
  faPlayCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ProjectStageButton = ({ project, activeStage, setActiveStage }) => {
  return (
    <div className="flex flex-wrap justify-center gap-5 mb-8 px-4">
      {project.stages.map((stage) => {
        const isActive = activeStage === stage._id;
        const isDisabled = stage.status === "notStarted";
        const canStart = stage?.canStart;
        const isCompleted = stage.isCompleted;
        const isInteractive = !isDisabled && !isActive;

        return (
          <button
            key={stage._id}
            onClick={() => setActiveStage(stage._id)}
            disabled={isDisabled}
            className={`
          relative overflow-hidden isolate
          flex flex-col items-center 
          px-8 py-6 rounded-2xl 
          transition-all duration-500
          shadow-[0_8px_32px_rgba(0,0,0,0.15)]
          ${
            isDisabled
              ? "opacity-50 grayscale cursor-not-allowed"
              : "hover:shadow-[0_12px_48px_rgba(0,0,0,0.25)]"
          }
          ${
            isActive
              ? "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 scale-105"
              : "bg-gray-900"
          }
          ${isInteractive && "hover:scale-[1.02]"}
        `}
          >
            {/* Animated background */}
            {!isDisabled && (
              <div className="absolute inset-0 opacity-20 mix-blend-soft-light bg-[radial-gradient(circle_at_center,#fff,transparent)] group-hover:animate-pulse" />
            )}

            {/* Stage name with modern typography */}
            <span
              className={`
          mb-3 font-semibold text-sm uppercase tracking-wider
          transition-colors duration-300
          ${isActive ? "text-white drop-shadow-md" : "text-gray-400"}
          ${isDisabled && "line-through"}
        `}
            >
              {stage.name}
            </span>

            {/* Glowing status icon */}
            <div
              className={`
          relative text-4xl transition-all duration-300
          ${isActive ? "scale-110" : "scale-100"}
          ${isInteractive && "group-hover:scale-105"}
        `}
            >
              {canStart ? (
                isCompleted ? (
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-400 animate-[bounce_1s_ease-in-out_infinite]"
                    />
                    <div className="absolute inset-0 rounded-full shadow-glow-green" />
                  </div>
                ) : (
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faPlayCircle}
                      className={`${
                        isActive ? "text-white" : "text-purple-400"
                      }`}
                    />
                    {isActive && (
                      <div className="absolute inset-0 rounded-full animate-glow-pulse" />
                    )}
                  </div>
                )
              ) : (
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="text-red-400 animate-[vibrate_0.3s_ease-in-out_infinite]"
                />
              )}
            </div>

            {/* Progress line connector */}
            {!isDisabled && (
              <div className="absolute -right-6 h-[2px] w-12 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            )}

            {/* Hover shine effect */}
            {!isDisabled && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-12 rotate-12 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProjectStageButton;
