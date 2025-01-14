import React from "react";
import {
  FaEdit,
  FaPlus,
  FaTrashAlt,
  FaTools,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";

const MaterialForm = ({
  updates,
  setUpdates,
  stageName,
  project,
  handleWorkerChange,
  handleAddWorker,
  handleRemoveWorker,
  handleSubmit,
}) => {
  // Handle material change (quantity used)
  const handleMaterialChange = (index, value) => {
    setUpdates((prevUpdates) => {
      const updatedMaterialsUsed = [...prevUpdates[0].materialsUsed];

      // Update the specific field of the material
      updatedMaterialsUsed[index] = {
        ...updatedMaterialsUsed[index],
        quantity: Math.max(0, parseInt(value, 10)),
      };

      return [{ ...prevUpdates[0], materialsUsed: updatedMaterialsUsed }];
    });
  };

  // Disable the input if the material is out of stock
  const isMaterialDisabled = (quantity) => {
    return quantity <= 0;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 p-2 lg:p-5">
      <div className="lg:max-w-4xl max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-2xl lg:p-8 p-4 backdrop-filter backdrop-blur-lg bg-opacity-30 border border-gray-700">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-100 mb-2 text-center">
          {project.projectName}
        </h1>
        <h2 className="text-base md:text-2xl font-semibold text-blue-400 mb-8 text-center">
          Current Stage: {stageName}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* detail input */}
          <div className="space-y-4">
            <label className="block text-gray-100 text-base lg:text-lg font-semibold mb-2">
              <FaClipboardList className="inline-block mr-2" />
              Work Details:
            </label>
            <textarea
              value={updates[0].details}
              placeholder="Describe the work completed, materials used, and progress made..."
              onChange={(e) =>
                setUpdates([{ ...updates[0], details: e.target.value }])
              }
              className="w-full p-1 lg:p-3 lg:text-lg text-sm rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 resize-vertical"
              required
              rows={4}
            />
          </div>

          {/* Materials Section */}
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center">
              <FaTools className="mr-2" />
              Materials Used
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project?.currentMaterials?.map((mat, index) => (
                <div
                  key={index}
                  className={`lg:p-4 p-2 rounded-lg shadow-md border transition-all duration-300 ${
                    mat.finished
                      ? "bg-green-700 border-green-500"
                      : mat.quantity <= 0
                      ? "bg-red-700 border-red-500"
                      : "bg-gray-700 border-gray-600"
                  }`}
                >
                  <h3 className="lg:text-lg text-base font-semibold text-gray-100">
                    {mat?.name || "Material Name"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Available:{" "}
                    <span className="text-base text-gray-200">
                      {mat.quantity || 0}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        mat.finished
                          ? "text-green-300"
                          : mat.quantity <= 0
                          ? "text-red-300"
                          : "text-blue-300"
                      }`}
                    >
                      {mat.finished
                        ? "Finished"
                        : mat.quantity <= 0
                        ? "Out of Stock"
                        : "In Progress"}
                    </span>
                  </p>
                  {!mat.finished && (
                    <div className="mt-4">
                      <label
                        htmlFor={`use-qty-${index}`}
                        className="block lg:text-sm text-xs text-gray-300 mb-2"
                      >
                        Use Quantity:
                      </label>
                      <input
                        id={`use-qty-${index}`}
                        type="number"
                        min="0"
                        value={updates[0]?.materialsUsed[index]?.quantity || 0}
                        onChange={(e) =>
                          handleMaterialChange(index, e.target.value)
                        }
                        className="md:p-2 p-1 w-full rounded bg-gray-600 border border-gray-500 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* workers */}
          <div className="space-y-4">
            <h2 className="md:text-2xl text-lg font-bold text-white flex items-center">
              <FaUsers className="mr-2" />
              Workers Assigned
            </h2>
            {updates[0].workers.map((worker, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 items-center bg-gray-700 md:p-4 p-2 rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Worker Name"
                  value={worker.name}
                  onChange={(e) =>
                    handleWorkerChange(index, "name", e.target.value)
                  }
                  className="flex-grow md:p-3 p-2 rounded-lg bg-gray-600 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
                />
                <input
                  type="number"
                  placeholder="Daily Wage"
                  value={worker.dailyWage}
                  onChange={(e) =>
                    handleWorkerChange(index, "dailyWage", e.target.value)
                  }
                  className="flex-grow md:p-3 p-2 rounded-lg bg-gray-600 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveWorker(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  aria-label="Remove worker"
                >
                  <FaTrashAlt size={24} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddWorker}
              className="flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors duration-300 text-lg"
            >
              <FaPlus />
              Add Worker
            </button>
          </div>

          <button
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex justify-center items-center gap-2 shadow-lg text-lg font-semibold"
            type="submit"
          >
            <FaEdit />
            <span>Review & Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MaterialForm;
