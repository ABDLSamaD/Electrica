import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import { FaArrowLeft } from "react-icons/fa";
import StageDetails from "./StageDetails";
import LoaderAll from "../../OtherComponents/LoaderAll";
import DropdownMenu from "./DropDownMenu";
import MaterialAndWorker from "./MaterialAndWorker";

const Stepone = () => {
  const navigate = useNavigate();
  const { users, localhost, fetchUsers, projects, fetchProject } =
    useOutletContext();
  const { projectId } = useParams();
  // states start

  const [project, setProject] = useState(null); // Set initial state as null
  const [loading, setLoading] = useState(true); // Set to true initially
  const [stageName, setStageName] = useState("");

  const [updates, setUpdates] = useState([
    {
      details: "",
      materialsUsed: [],
      workers: [],
      images: [],
      date: "",
    },
  ]);
  const [alert, setAlert] = useState(null);
  const [stageShow, setStageShow] = useState(false); // for timing of an component shows
  const [isMaterialApproved, setIsMaterialApproved] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);

  // states end

  useEffect(() => {
    // fetch user details with projectId and user
    const fetchDetails = () => {
      if (projects && projects.length > 0) {
        // const allProjects = users.flatMap((user) => user.project || []);
        const matchedProject = projects.find((proj) => proj._id === projectId);

        if (matchedProject) {
          setProject(matchedProject);
          setLoading(false);
          const currentStage = matchedProject.stages.find(
            (stage) => !stage.isCompleted
          );

          if (currentStage) {
            setStageName(currentStage.name);
            setUpdates([
              {
                details: "",
                materialsUsed: currentStage.materials.map((mat) => ({
                  name: mat.name,
                  quantity: 0,
                })),
                workers: [],
                images: [],
                date: "",
              },
            ]);

            const allMaterialsApproved = matchedProject.stages.every((stage) =>
              stage.materials.every((mat) => mat.isApproved)
            );
            setIsMaterialApproved(allMaterialsApproved);
          }
        }
      }
    };

    setTimeout(fetchDetails, 1100);

    // /for display stage details with timing
    setTimeout(() => setStageShow(true), 6000);
  }, [users, projects, projectId]);

  // Loading and error handling
  if (loading) {
    return (
      <div className="grid place-content-center min-h-screen">
        <LoaderAll />
      </div>
    );
  }

  // for submit form daily basis
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!updates[0]?.materialsUsed) {
      setAlert({
        type: "error",
        message: "Please provide work details.",
      });
      return; // Stop execution
    }
    if (!canSubmit) {
      console.log(
        "One or more materials are finished, please check available quantities."
      );
      setAlert(
        "error",
        "One or more materials are finished, please check available quantities."
      );
      return;
    }
    const hasInvalidMaterial = updates[0]?.materialsUsed.some(
      (mat) => !mat.name || mat.quantity <= 0
    );
    if (hasInvalidMaterial) {
      setAlert({
        type: "error",
        message: "All materials must have a valid name and quantity.",
      });
      return;
    }
    const isValid = updates[0]?.materialsUsed.every((material, index) => {
      if (
        !material.name ||
        typeof material.quantity !== "number" ||
        material.quantity <= 0
      ) {
        return false;
      }
      return true;
    });

    if (isValid) {
      setCanSubmit(true);
      setAlert(null); // Clear any existing alert
    } else {
      setCanSubmit(false);
      setAlert({
        type: "error",
        message: "All materials must have a valid name and quantity.",
      });
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${localhost}/api/adminauth/projectdaily-update`,
        {
          projectId,
          stageName,
          updates,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setAlert({ type: response.data.type, message: response.data.message });
        setUpdates([
          {
            details: "",
            materialsUsed: updates[0].materialsUsed.map((mat) => ({
              name: mat.name,
              quantity: 0,
            })),
            workers: [],
            images: [],
            date: "",
          },
        ]);
        fetchProject();
      } else {
        setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (error) {
      setAlert({
        type: error.response?.data?.type,
        message: error.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // complete stage handler
  const handleCompleteStage = async (projectId, stageName) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${localhost}/api/adminauth/complete-stage`,
        { projectId, stageName },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setAlert({ type: response.data.type, message: response.data.message });
        setTimeout(() => {
          fetchUsers();
        }, 786);
      } else {
        setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (error) {
      setAlert({
        type: error.response?.data?.type,
        message: error.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Check material validity against project stage
  const handleWorkerChange = (index, field, value) => {
    const newWorkers = [...updates[0].workers];
    newWorkers[index] = { ...newWorkers[index], [field]: value };
    setUpdates([{ ...updates[0], workers: newWorkers }]);
  };

  const handleAddWorker = () => {
    setUpdates([
      {
        ...updates[0],
        workers: [...updates[0].workers, { name: "", dailyWage: 0 }],
      },
    ]);
  };

  const handleRemoveWorker = (index) => {
    const newWorkers = updates[0].workers.filter(
      (_, workerIndex) => workerIndex !== index
    );
    setUpdates([{ ...updates[0], workers: newWorkers }]);
  };
  // for handle code end

  if (!project) {
    return (
      <div className="text-2xl flex gap-2 text-orange-2 flex-col items-center justify-center">
        <span className="text-white">Project Not Found</span>
        <span className="text-cyan-800 underline">
          <Link to={-1}>Previous</Link>
        </span>
      </div>
    );
  }
  if (project.status !== "approved") {
    return (
      <div className="text-2xl flex gap-2 text-orange-2 flex-col items-center justify-center">
        <span className="text-white">Project No tApproved Yet</span>
        <span className="text-cyan-800 underline">
          <Link to={-1}>Previous</Link>
        </span>
      </div>
    );
  }
  if (!project.startStage) {
    return (
      <div className="text-2xl flex gap-2 text-orange-2 flex-col items-center justify-center">
        <span className="text-white">Project Not Started</span>
        <span className="text-cyan-800 underline">
          <Link to={-1}>Previous</Link>
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 py-2 lg:py-12 px-2">
      {/* Back Button */}
      <button
        className="mb-4 text-gray-500 hover:text-gray-200 flex items-center md:flex-row md:ml-0 ml-6 flex-col gap-2"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Go Back
      </button>
      {/* alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      {/* three dots content */}
      <div className="absolute top-4 right-4 z-50">
        <DropdownMenu
          projectId={projectId}
          localhost={localhost}
          stageName={stageName}
          users={users}
          onCompleteStage={handleCompleteStage}
        />
      </div>

      {/* material and worker form */}
      <MaterialAndWorker
        updates={updates}
        setUpdates={setUpdates}
        stageName={stageName}
        project={project}
        isMaterialApproved={isMaterialApproved}
        handleWorkerChange={handleWorkerChange}
        handleAddWorker={handleAddWorker}
        handleRemoveWorker={handleRemoveWorker}
        handleSubmit={handleSubmit}
      />

      {/* Stage Details */}
      {stageShow && (
        <div className="mt-10 bg-gray-900 rounded-lg p-4">
          <StageDetails
            localhost={localhost}
            projectId={projectId}
            stageName={stageName}
          />
        </div>
      )}
    </div>
  );
};

export default Stepone;
