import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import NotifyClient from "./NotifyClient";
import { Link } from "react-router-dom";

const DropdownMenu = ({
  projectId,
  localhost,
  stageName,
  users,
  onCompleteStage,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Toggle dropdown visibility
  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCompleteStage = () => {
    // Call the onCompleteStage callback passed as a prop
    if (onCompleteStage) {
      onCompleteStage(projectId, stageName); // Make sure you handle stage completion logic in parent component
    }
    setIsDropdownOpen(false); // Close the dropdown after clicking the button
  };

  return (
    <div className="relative">
      {/* Three Dots Icon */}
      <button
        className="icons cursor-pointer text-xl text-white flex justify-center items-center h-12 w-12 rounded-full hover:bg-red-500/80 transition-all focus:outline-none"
        onClick={handleToggleDropdown}
        title="Options"
        aria-expanded={isDropdownOpen}
        aria-label="Dropdown Menu"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 right-0 w-64 bg-gray-900 text-white rounded-lg shadow-lg z-50 transition-transform transform origin-top-right scale-100"
        >
          <ul className="flex flex-col space-y-3 p-4">
            {/* Notify Client */}
            <li>
              <NotifyClient
                projectId={projectId}
                localhost={localhost}
                stageName={stageName}
              />
            </li>

            {/* Complete Stage Button */}
            <li>
              <button
                onClick={handleCompleteStage}
                className="block text-sm bg-green-600 hover:bg-green-700 text-white rounded-md py-2 px-3 text-center transition-all"
              >
                Complete Stage
              </button>
            </li>

            {/* Add Material */}
            <li>
              <Link
                className="block text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-md py-2 px-3 text-center transition-all"
                to={`/db_au_admn/projectusers/stageone/${projectId}/addmaterial/${stageName}`}
              >
                Add Material
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
