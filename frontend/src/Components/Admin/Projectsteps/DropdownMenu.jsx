import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Notifycient from "./Notifycient";
import { FaBell } from "react-icons/fa";

const DropDownMenu = ({
  projectId,
  electricaURL,
  stageName,
  onCompleteStage,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false); // Modal state
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
  }, [isDropdownOpen]);

  // Toggle dropdown visibility
  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCompleteStage = () => {
    if (onCompleteStage) {
      onCompleteStage(projectId, stageName); // Handle stage completion in parent component
    }
    setIsDropdownOpen(false); // Close dropdown
  };

  const handleOpenNotifyModal = () => {
    setIsNotifyModalOpen(true);
    setIsDropdownOpen(false); // Close dropdown when opening the modal
  };

  const handleCloseNotifyModal = () => {
    setIsNotifyModalOpen(false);
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
              <button
                onClick={handleOpenNotifyModal}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 px-3 text-center transition-all flex items-center gap-2"
              >
                <FaBell /> Notify Client
              </button>
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

      {/* Notify Client Modal */}
      {isNotifyModalOpen && (
        <Notifycient
          onClose={handleCloseNotifyModal}
          projectId={projectId}
          baackendURL={electricaURL}
          stageName={stageName}
        />
      )}
    </div>
  );
};

export default DropDownMenu;
