import React from "react";
import {
  Clipboard,
  PenTool as Tool,
  Users,
  Trash2,
  Plus,
  FileEdit,
} from "lucide-react";

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
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            {project.projectName}
          </h1>
          <div className="inline-block px-6 py-2 bg-blue-500/20 backdrop-blur-md rounded-full">
            <span className="text-blue-300 font-medium">Current Stage: </span>
            <span className="text-white font-semibold">{stageName}</span>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Work Details Section */}
            <div className="space-y-4">
              <label className="flex items-center text-white text-lg font-medium gap-2">
                <Clipboard className="w-5 h-5 text-blue-400" />
                Work Details
              </label>
              <textarea
                value={updates[0].details}
                onChange={(e) =>
                  setUpdates([{ ...updates[0], details: e.target.value }])
                }
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-gray-400 resize-none transition-all duration-200"
                placeholder="Describe the work completed, materials used, and progress made..."
                rows={4}
              />
            </div>

            {/* Materials Section */}
            <div className="space-y-6">
              <h2 className="flex items-center text-xl text-white font-semibold gap-2">
                <Tool className="w-5 h-5 text-blue-400" />
                Materials Used
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.currentMaterials.map((material, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-xl backdrop-blur-md p-5 border transition-all duration-300 ${
                      material.finished
                        ? "bg-green-500/10 border-green-500/30"
                        : material.quantity <= 0
                        ? "bg-red-500/10 border-red-500/30"
                        : "bg-white/5 border-white/20"
                    }`}
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {material.name}
                        </h3>
                        <p className="text-sm text-gray-300">
                          Available:{" "}
                          <span className="text-white font-medium">
                            {material.quantity}
                          </span>
                        </p>
                      </div>

                      {!material.finished && (
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Quantity to Use
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={
                              updates[0].materialsUsed[index]?.quantity || 0
                            }
                            onChange={(e) =>
                              handleMaterialChange(index, e.target.value)
                            }
                            disabled={material.quantity <= 0}
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workers Section */}
            <div className="space-y-6">
              <h2 className="flex items-center text-xl text-white font-semibold gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Workers Assigned
              </h2>
              <div className="space-y-4">
                {updates[0].workers.map((worker, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 items-center bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/20"
                  >
                    <input
                      type="text"
                      placeholder="Worker Name"
                      value={worker.name}
                      onChange={(e) =>
                        handleWorkerChange(index, "name", e.target.value)
                      }
                      className="flex-1 p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                    />
                    <input
                      type="number"
                      placeholder="Daily Wage"
                      value={worker.dailyWage}
                      onChange={(e) =>
                        handleWorkerChange(index, "dailyWage", e.target.value)
                      }
                      className="flex-1 p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveWorker(index)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddWorker}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add Worker
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-lg shadow-lg shadow-blue-500/25"
            >
              <FileEdit className="w-5 h-5" />
              Review & Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MaterialForm;
