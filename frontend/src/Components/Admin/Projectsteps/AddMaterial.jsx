import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import LoaderAll from "../../OtherComponents/LoaderAll";
import axios from "axios";
import Alert from "../../OtherComponents/Alert";
import { useSpring, animated } from "react-spring";

const AddMaterial = () => {
  const navigate = useNavigate();
  const { localhost, projects, fetchProject } = useOutletContext();
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
        setTimeout(() => setLoading(false), 3000);
      }
    };

    fetchData();
  }, [projectId, projects, stageName]);

  const handleMaterialChange = (index, e) => {
    const { name, value } = e.target;

    // Ensure quantity is a valid number and fallback to 0 if not
    const newValue =
      name === "quantity" ? (value ? parseFloat(value) : 0) : value;
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
        `${localhost}/api/adminauth/remove-material`,
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
        `${localhost}/api/adminauth/add-material`,
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
    <div className="p-8 max-w-3xl mx-auto bg-gray-800 text-gray-300 rounded-lg">
      <button
        className="p-2 mb-4 text-white hover:text-gray-200"
        title="go back"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="1x" />
      </button>
      {/* alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <h1 className="md:text-3xl text-2xl font-semibold mb-6 text-center text-blue-400">
        Project: {project.projectName}
      </h1>
      <h2 className="md:text-2xl text-xl font-semibold text-center text-blue-500">
        Add Material to Stage: {stageName}
      </h2>

      <div className="md:mt-6 mt-10 mb-4">
        <h3 className="text-xl font-medium mb-2">Existing Materials:</h3>
        <ul className="space-y-2">
          {stage.materials.length > 0 ? (
            stage.materials.map((material, index) => (
              <animated.li
                key={index}
                style={materialAnimation}
                className="flex justify-between items-center gap-2 mt-2"
              >
                <span className="text-sm text-cyan-50">{material.name}</span>
                <span
                  className={
                    material.isApproved ? "text-green-500" : "text-yellow-500"
                  }
                >
                  {material.isApproved ? "Approved" : "Waiting"}
                </span>
                {!material.isApproved && (
                  <button
                    className="text-red-500"
                    onClick={() => handleRemoveMaterial(material.name)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </animated.li>
            ))
          ) : (
            <p>No materials added yet.</p>
          )}
        </ul>
      </div>

      {/* Display messages */}
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Add New Materials */}
      <div className="mt-10 md:mt-6">
        <h2 className="text-xl font-medium mb-4">Add New Materials:</h2>
        {newMaterials.map((material, index) => (
          <div key={index} className="mb-6 space-y-6">
            <input
              type="text"
              name="name"
              value={material.name}
              onChange={(e) => handleMaterialChange(index, e)}
              placeholder="Material Name"
              className="w-full md:p-4 p-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="quantity"
              value={material.quantity}
              onChange={(e) => handleMaterialChange(index, e)}
              placeholder="Quantity"
              className="w-full md:p-4 p-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => removeMaterialFields(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove <FontAwesomeIcon icon={faTrash} />
              </button>
              <span className="text-xs text-gray-500">
                Added on: {material.addedAt.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addMaterialFields}
          disabled={isAnyMaterialApproved}
          className="bg-blue-600 text-white px-3 py-3 rounded-lg w-auto hover:bg-blue-700 mt-4 md:px-6 md:w-full"
        >
          Add More Materials
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white md:px-8 px-6 py-3 rounded-lg hover:bg-green-700 mt-8 md:w-full w-auto"
      >
        {isLoading ? <LoaderAll /> : "Submit"}
      </button>

      {/* Display Pending Materials (Waiting) */}
      <div className="mt-6">
        <h3 className="text-xl font-medium mb-4">
          Materials Pending Approval:
        </h3>
        {stage.materials
          .filter((material) => material.status === "waiting")
          .map((material, index) => (
            <div key={index} className="mb-4 flex justify-between items-center">
              <span>
                {material.name} (Quantity: {material.quantity})
              </span>
              <div className="text-yellow-500">Waiting for client approval</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddMaterial;
