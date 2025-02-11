import React from "react";
import { FiCheck, FiCheckCircle, FiPackage } from "react-icons/fi";
import { motion } from "framer-motion";
import Miniloader from "../../OtherComponents/Miniloader";

const MaterialApproves = ({
  stage,
  handleApproveMaterial,
  loadingapprovematerial,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
        Materials
      </h3>

      <div className="grid gap-3 mt-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {stage.materials.map((material, index) => (
          <motion.div
            key={material._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative p-3 sm:p-4 md:p-5 bg-white/5 backdrop-blur-lg rounded-xl shadow-lg
       border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Material Info */}
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  {material.isApproved ? (
                    <FiCheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <FiPackage className="w-6 h-6 text-amber-400" />
                  )}
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-100">
                    {material.name}
                  </h4>
                  <p className="text-gray-400 text-sm sm:text-base mt-1">
                    Quantity: {material.quantity}
                  </p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center gap-4 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    material.isApproved
                      ? "bg-green-500/20 text-green-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {material.isApproved ? "Approved" : "Pending"}
                </span>

                {!material.isApproved && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleApproveMaterial(stage.name, material._id)
                    }
                    disabled={loadingapprovematerial[material._id]}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg
                 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <FiCheck className="w-4 h-4" />
                    {loadingapprovematerial[material._id] ? (
                      <Miniloader />
                    ) : (
                      "Approve"
                    )}
                  </motion.button>
                )}
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none
          group-hover:bg-gradient-to-r from-cyan-500/10 to-blue-500/10
          transition-opacity opacity-0 group-hover:opacity-100"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MaterialApproves;
