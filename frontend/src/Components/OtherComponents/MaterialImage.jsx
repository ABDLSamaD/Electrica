import React, { useState } from "react";
import LazyLoad from "react-lazyload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const MaterialImage = ({ material }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleImage = () => setIsOpen(!isOpen);

  return (
    <div className="material-item relative">
      {/* Image Container */}
      <div
        className="material-container relative cursor-pointer"
        onClick={toggleImage}
        style={{
          width: "100%",
          height: "auto",
          position: "relative",
          margin: "1rem 0",
        }}
      >
        {/* Image */}
        <LazyLoad height={200} offset={100}>
          <img
            src={material.imageUrl}
            alt={material.name}
            className="material-image rounded-lg"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </LazyLoad>

        {/* Top Overlay Description with Icon */}
        <div className="absolute top-0 left-0 right-0 bg-gray-800 bg-opacity-60 p-2 rounded-t-lg flex justify-between items-center">
          <span className="text-white font-semibold text-sm">
            {material.name}
          </span>
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-white cursor-pointer"
            onClick={toggleImage}
            title="Click for full image"
          />
        </div>
      </div>

      {/* Modal/Full Image View */}
      {isOpen && (
        <div
          className="modal-overlay absolute inset-0 bg-gray-800 bg-opacity-80 flex justify-center items-center z-50"
          onClick={toggleImage}
        >
          <div className="modal-content bg-white p-4 rounded-lg shadow-lg">
            <img
              src={material.imageUrl}
              alt={material.name}
              className="w-full max-w-3xl h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialImage;
