import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import LoaderAll from "../../../OtherComponents/LoaderAll";
import { motion } from "framer-motion";
import Alert from "../../../OtherComponents/Alert";

const CreatingBill = () => {
  const { projects } = useOutletContext();
  const { projectId } = useParams();

  // State management
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [isStageComplete, setIsStageComplete] = useState(false);
  const [contractorBill, setContractorBill] = useState("");
  const [contractorMessage, setContractorMessage] = useState("");
  const [discountRequest, setDiscountRequest] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchDetails = () => {
      const matchedProject = projects.find((prj) => prj._id === projectId);
      if (matchedProject) {
        const allStagesCompleted = matchedProject.stages.every(
          (stage) => stage.isCompleted
        );
        if (allStagesCompleted) {
          setIsStageComplete(true);
        }
        setProject(matchedProject);
      }
      setLoading(false);
    };
    setTimeout(() => {
      fetchDetails();
    }, 1800);
  }, [projects, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contractorBill || isNaN(contractorBill) || contractorBill <= 0) {
      setAlert({
        type: "warning",
        message: "Please enter a valid contractor bill amount.",
      });
    }

    const billData = {
      projectId,
      contractorBill: Number(contractorBill),
      contractorMessage,
      discountRequest,
    };

    console.log("Submitting Bill Data:", billData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderAll />
      </div>
    );
  }

  if (!isStageComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white/10 backdrop-blur-md">
        <h1 className="text-gray-200">Stage not completed yet</h1>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative top-12 max-w-2xl mx-auto p-6 bg-white/10 backdrop-blur-lg shadow-lg rounded-xl"
    >
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <h2 className="text-3xl font-bold text-center text-white">
        Create Contractor Bill
      </h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-white">Total Bill Amount (Rs):</label>
          <input
            type="number"
            className="w-full p-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter amount"
            value={contractorBill}
            onChange={(e) => setContractorBill(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-white">Contractor Message:</label>
          <textarea
            className="w-full p-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Write a message..."
            value={contractorMessage}
            onChange={(e) => setContractorMessage(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="discount"
            className="w-5 h-5 text-blue-500"
            checked={discountRequest}
            onChange={() => setDiscountRequest(!discountRequest)}
          />
          <label htmlFor="discount" className="text-white">
            Apply 8% Discount
          </label>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Submit Bill
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreatingBill;
