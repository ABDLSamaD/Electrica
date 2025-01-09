import React from "react";
import { FaBolt } from "react-icons/fa";

const PointRateCard = () => {
  return (
    <div className="bg-white/20 rounded-lg shadow-md p-6 text-gray-300">
      <div className="flex items-center mb-4">
        <FaBolt className="text-yellow-500 text-3xl mr-2" />
        <h2 className="text-2xl font-semibold text-gray-950">Point Rates</h2>
      </div>
      <p className="mb-4">
        The current point rate for electricians is
        <strong className="text-blue-500">350 points</strong>. This is the
        standard rate that will be applied to your projects.
      </p>
      <h3 className="text-lg font-semibold mb-2">Additional Rates:</h3>
      <ul className="list-disc list-inside text-gray-200">
        <li>Complex wiring: +50 points</li>
        <li>High-voltage systems: +100 points</li>
        <li>Emergency repairs: +75 points</li>
      </ul>
    </div>
  );
};

export default PointRateCard;
