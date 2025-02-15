import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import LoaderAll from "../../../OtherComponents/LoaderAll";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "../../../OtherComponents/Alert";
import { ClipboardList, Percent, Wallet, Zap } from "lucide-react";
import axios from "axios";
import Miniloader from "../../../OtherComponents/Miniloader";

const CreatingBill = () => {
  const { projects, fetchProject, electricaURL } = useOutletContext();
  const { projectId } = useParams();

  // State management
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [isStageComplete, setIsStageComplete] = useState(false);
  const [contractorDetails, setContractorDetails] = useState([]);
  const [contractorMessage, setContractorMessage] = useState("");
  const [discountRequest, setDiscountRequest] = useState(false);
  const [alert, setAlert] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    const fetchDetails = () => {
      const matchedProject = projects.find((prj) => prj._id === projectId);
      if (matchedProject) {
        const allStagesCompleted = matchedProject.stages.every(
          (stage) => stage.isCompleted
        );
        setIsStageComplete(allStagesCompleted);
        setProject(matchedProject);
        setContractorDetails([
          { type: "Main labourcost", feet: 0 },
          { type: "AC Point", quantity: 0 },
          { type: "Current Point", quantity: 0 },
          { type: "Panel Board", option: "Single-Phase" },
          { type: "Lightning", feet: 0 },
          { type: "Fan Installation", quantity: 0 },
          { type: "Earthing", cost: 0 },
        ]);
        setLoading(false);
      }
    };
    setTimeout(fetchDetails, 1800);
  }, [projects, projectId]);

  // Calculate total amount dynamically
  useEffect(() => {
    let totalCost = 0;
    contractorDetails.forEach((item) => {
      if (item.type === "Main labourcost") totalCost += item.feet * 100;
      if (item.type === "AC Point") totalCost += item.quantity * 2000;
      if (item.type === "Current Point") totalCost += item.quantity * 350;
      if (item.type === "Panel Board")
        totalCost += item.option === "Three-Phase" ? 9000 : 4000;
      if (item.type === "Lightning") totalCost += item.feet * 10;
      if (item.type === "Fan Installation") totalCost += item.quantity * 400;
      if (item.type === "Earthing") totalCost += item.cost;
    });

    let final = discountRequest ? totalCost * 0.92 : totalCost;
    setTotalAmount(totalCost);
    setFinalAmount(final);
  }, [contractorDetails, discountRequest]);

  const handleChange = (index, field, value) => {
    const updatedDetails = [...contractorDetails];
    updatedDetails[index][field] = field === "option" ? value : Number(value);
    setContractorDetails(updatedDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    if (totalAmount <= 0) {
      setFormLoading(false);
      setAlert({ type: "warning", message: "Please enter a valid amount!" });
      return;
    }

    const billData = {
      projectId,
      contractorDetails,
      contractorMessage,
      discountRequest,
    };
    try {
      const response = await axios.post(
        `${electricaURL}/api/adminauth/add-contractorbill`,
        billData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setFormLoading(false);
        setContractorDetails([]);
        setContractorMessage("");
        setDiscountRequest(false);
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
        fetchProject();
      } else {
        setFormLoading(false);
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
      }
    } catch (error) {
      setFormLoading(false);
      setAlert({
        type: error.response?.data?.type,
        message: error.response?.data?.message,
      });
    }
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
        <h1 className="text-gray-200">All stages must be completed first.</h1>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative top-4 max-w-4xl mx-auto p-6 lg:p-8"
    >
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-4 right-4 z-50"
          >
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-container bg-gradient-to-br from-gray-900/80 to-indigo-900/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 lg:p-10">
        <header className="mb-8 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent"
          >
            Contractor Bill
          </motion.h2>
          <p className="text-indigo-200 mt-2">
            For {project?.clientName} • {project?.projectName}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractorDetails.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 p-4 rounded-xl border border-white/10 hover:border-indigo-400/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3 text-indigo-300">
                  <Zap className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">{item.type}</h3>
                </div>

                {item.type === "Panel Board" ? (
                  <select
                    className="modern-input bg-blue-900"
                    value={item.option}
                    onChange={(e) =>
                      handleChange(index, "option", e.target.value)
                    }
                  >
                    <option value="Single-Phase">Single-Phase (Rs4000)</option>
                    <option value="Three-Phase">Three-Phase (Rs9000)</option>
                  </select>
                ) : (
                  <input
                    type="number"
                    className="modern-input"
                    placeholder={`Enter ${
                      item.type.includes("Point") ? "quantity" : "feet"
                    }`}
                    value={item.quantity || item.feet || item.cost}
                    onChange={(e) =>
                      handleChange(
                        index,
                        item.quantity !== undefined
                          ? "quantity"
                          : item.feet !== undefined
                          ? "feet"
                          : "cost",
                        e.target.value
                      )
                    }
                    required
                  />
                )}
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <label className="flex items-center gap-2 text-indigo-300 mb-4">
                <ClipboardList className="w-5 h-5" />
                <span className="font-medium text-white">Additional Notes</span>
              </label>
              <textarea
                className="modern-input h-32"
                placeholder="Add special instructions or comments..."
                value={contractorMessage}
                onChange={(e) => setContractorMessage(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Percent className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="text-indigo-200 font-medium">Volume Discount</p>
                  <p className="text-sm text-indigo-400/80">
                    Apply 8% bulk discount
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDiscountRequest(!discountRequest)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  discountRequest ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <motion.span
                  className="absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md"
                  animate={{ x: discountRequest ? 26 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </button>
            </div>

            <motion.div
              className="bg-gradient-to-br from-indigo-900/50 to-purple-900/30 p-6 rounded-xl border border-indigo-400/20"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 2,
              }}
            >
              <div className="grid grid-cols-2 gap-4 text-indigo-100">
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    <span className="text-yellow-50">Subtotal</span>
                  </p>
                  <p className="text-3xl font-bold">Rs-{totalAmount}</p>
                </div>

                {discountRequest && (
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-green-300">
                      <Percent className="w-5 h-5" />
                      <span>Discount</span>
                    </p>
                    <p className="text-3xl font-bold text-green-400">
                      -Rs{(totalAmount * 0.08).toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="col-span-2 pt-4 border-t border-indigo-400/20">
                  <div className="flex justify-between items-center">
                    <p className="text-xl">Total Payable</p>
                    <p className="text-3xl font-bold text-white">
                      Rs-{finalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
              disabled={formLoading}
            >
              {formLoading ? (
                <div className="flex items-center justify-center">
                  <Miniloader />
                </div>
              ) : (
                "Generate Professional Invoice"
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatingBill;
