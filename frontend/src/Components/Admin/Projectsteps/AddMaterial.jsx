import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import LoaderAll from "../../OtherComponents/LoaderAll";
import axios from "axios";
import { ArrowLeft, Trash2, Plus, Loader2, AlertCircle } from "lucide-react";

const AddMaterial = () => {
  const navigate = useNavigate();
  const { projects, fetchProject, electricaURL } = useOutletContext();
  const { projectId, stageName } = useParams();

  // states start
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(null);
  const [newMaterials, setNewMaterials] = useState([
    {
      name: "",
      quantity: 1,
      isApproved: false,
      status: "waiting",
      addedAt: new Date(),
    },
  ]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // states end

  const showMessage = () => {
    setMessage("Success!"); // Set success message
    setError(""); // Clear error
    // Clear after 4 seconds
    setTimeout(() => setMessage(""), 4000);
  };
  const showError = () => {
    setMessage(""); // Clear success message
    setError("An error occurred!"); // Set error message
    // Clear after 4 seconds
    setTimeout(() => setError(""), 4000);
  };

  // Loader animation for submitting and fetching data
  const materialAnimation = useSpring({
    opacity: isLoading ? 0.5 : 1,
    transform: isLoading ? "scale(0.95)" : "scale(1)",
    config: { tension: 120, friction: 14 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (projects && projects.length > 0) {
          const allProjects = projects.flatMap((prj) => prj || []);
          const matchedProject = allProjects.find(
            (proj) => proj._id === projectId
          );
          setProject(matchedProject);

          if (matchedProject) {
            const currentStage = matchedProject.stages.find(
              (stage) => stage.name === stageName
            );
            setStage(currentStage);
          }
        }
      } catch (err) {
        setError("An error occurred while fetching the project data.");
      } finally {
        // Add a delay of 3 seconds for showing loader
        setTimeout(() => setLoading(false), 2000);
      }
    };

    fetchData();
  }, [projectId, projects, stageName]);

  const handleMaterialChange = (index, e) => {
    const { name, value } = e.target;

    // Ensure quantity is a valid number and fallback to 0 if not
    const newValue = name === "quantity" ? parseInt(value, 10) : value;
    setNewMaterials((prevMaterials) => {
      const updatedMaterials = [...prevMaterials];
      updatedMaterials[index] = {
        ...updatedMaterials[index],
        [name]: newValue,
      };
      return updatedMaterials;
    });
  };

  const addMaterialFields = () => {
    setNewMaterials([
      ...newMaterials,
      {
        name: "",
        quantity: 1,
        isApproved: false,
        status: "waiting",
        addedAt: new Date(),
      },
    ]);
  };

  // remove materials
  const removeMaterialFields = (index) => {
    const updatedMaterials = newMaterials.filter((_, i) => i !== index);
    setNewMaterials(updatedMaterials);
  };
  const handleRemoveMaterial = async (materialName) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${electricaURL}/api/adminauth/remove-material`,
        {
          materialName,
          projectId,
          stageName,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage(response.data.message);
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
        showMessage();
        // Remove the material from the UI
        setStage((prevState) => ({
          ...prevState,
          materials: prevState.materials.filter(
            (material) => material.name !== materialName
          ),
        }));
        fetchProject(); // Fetch the updated data
      } else {
        setError(response.data.message);
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
      }
    } catch (err) {
      setError("An error occurred while removing the material.");
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message,
      });
      setLoading(false);
    } finally {
      setTimeout(() => setIsLoading(false), 3000); // Delay the loader for 3 seconds
    }
  };

  // submit function
  const handleSubmit = async () => {
    try {
      if (
        newMaterials.some((material) => !material.name || !material.quantity)
      ) {
        setError(
          "Please provide valid names and quantities for all materials."
        );
        return;
      }
      // Check if any existing materials in stage are approved
      const isAnyMaterialApproved = stage.materials.some(
        (material) => material.isApproved
      );
      if (isAnyMaterialApproved) {
        setError(
          "Materials have already been approved. Further additions are not allowed."
        );
        return;
      }

      const response = await axios.post(
        `${electricaURL}/api/adminauth/add-material`,
        { materials: newMaterials, projectId, stageName },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage(response.data.message);
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
        setError(null);
        setNewMaterials([
          {
            name: "",
            quantity: 1,
            isApproved: false,
            status: "waiting",
            addedAt: new Date(),
          },
        ]);
        fetchProject(); // Fetch the updated data
      } else {
        setError(response.data.message);
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
        showError();
      }
    } catch (err) {
      setError("An error occurred while adding the materials.");
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 3000); // Delay the loader for 3 seconds
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderAll />
      </div>
    );
  }

  if (!project || !stage) return <h1>Project or Stage not found.</h1>;

  // Disable the "Add More Materials" button if materials are approved
  const isAnyMaterialApproved = stage.materials.some(
    (material) => material.isApproved
  );

  return (
    <div className="bg-black/5 shadow-md rounded-md backdrop-blur text-gray-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <button
            className="p-2 text-white hover:text-blue-400 transition-colors duration-200 flex gap-2 items-center select-none"
            title="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
            <div className="text-md">
              <span
                className="text-gray-200 hover:text-blue-600 cursor-pointer select-none"
                onClick={() => navigate("/db_au_admn/projectusers")}
              >
                Projectusers
              </span>
              <span className="text-gray-200 select-none"> / </span>
              <span
                className="text-gray-200 hover:text-blue-500 cursor-pointer select-none"
                onClick={() => navigate(-1)}
              >
                Add details
              </span>
              <span className="text-gray-200 select-none"> / </span>
              <span className="text-gray-500 select-none">Add materials</span>
            </div>
          </button>

          {alert && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                alert.type === "error"
                  ? "bg-red-500/20 text-red-200"
                  : "bg-green-500/20 text-green-200"
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>{alert.message}</span>
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
            {project.projectName}
          </h1>
          <div className="inline-block px-6 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full">
            <span className="text-blue-300 font-medium">
              Adding Materials to Stage:{" "}
            </span>
            <span className="text-white font-semibold">{stageName}</span>
          </div>
        </div>

        {/* Existing Materials */}
        <div className="mb-12">
          <h3 className="text-xl font-medium mb-6 text-gray-200 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-blue-500/50 rounded-full"></span>
            Existing Materials
          </h3>
          <div className="grid gap-4">
            {stage.materials.length > 0 ? (
              stage.materials.map((material, index) => (
                <animated.div
                  key={index}
                  style={materialAnimation}
                  className="flex justify-between items-center p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">
                        {material.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        Quantity: {material.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        material.isApproved
                          ? "bg-green-500/20 text-green-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {material.isApproved ? "Approved" : "Pending"}
                    </span>
                    {!material.isApproved && (
                      <button
                        onClick={() => handleRemoveMaterial(material.name)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </animated.div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                No materials added yet
              </p>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-300">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {/* Add New Materials */}
        <div className="mb-12">
          <h3 className="text-xl font-medium mb-6 text-gray-200 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-blue-500/50 rounded-full"></span>
            Add New Materials
          </h3>
          <div className="space-y-4">
            {newMaterials.map((material, index) => (
              <div
                key={index}
                className="p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={material.name}
                    onChange={(e) => handleMaterialChange(index, e)}
                    placeholder="Material Name"
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-gray-400"
                  />
                  <input
                    type="number"
                    name="quantity"
                    value={material.quantity}
                    onChange={(e) => handleMaterialChange(index, e)}
                    placeholder="Quantity"
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => removeMaterialFields(index)}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                  <span className="text-sm text-gray-400">
                    Added: {material.addedAt.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addMaterialFields}
            disabled={isAnyMaterialApproved}
            className="mt-6 w-full p-4 flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Add More Materials
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Submit Materials"
          )}
        </button>

        {/* Pending Materials */}
        <div className="mt-12">
          <h3 className="text-xl font-medium mb-6 text-gray-200 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-blue-500/50 rounded-full"></span>
            Pending Approvals
          </h3>
          <div className="space-y-4">
            {stage.materials
              .filter((material) => material.status === "waiting")
              .map((material, index) => (
                <div
                  key={index}
                  className="p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      {material.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      Quantity: {material.quantity}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                    Awaiting Approval
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMaterial;
