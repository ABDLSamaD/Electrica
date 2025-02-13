import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  CreditCard,
  Wallet2,
  Loader2,
  Projector,
  DollarSignIcon,
} from "lucide-react";
import LoaderAll from "../../../OtherComponents/LoaderAll";

const NextProcess = () => {
  const { projects } = useOutletContext();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [contractorBill, setContractorBill] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const matchedProject = projects.find((prj) => prj._id === projectId);
      if (matchedProject) {
        const allStageCompleted = matchedProject.stages.every(
          (stage) => stage.isCompleted
        );

        if (allStageCompleted) {
          setIsCompleted(true);
          setContractorBill(matchedProject.contractorBill);
        }
        setProject(matchedProject);
      }
      setLoading(false);
    };

    setTimeout(fetchData, 1800);
  }, [projects, projectId]);

  const handlePayment = () => {
    if (!selectedPayment) return alert("Please select a payment method");

    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      alert("Payment Successful!");
    }, 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderAll />
      </div>
    );
  }

  if (!isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen backdrop-blur">
        <span className="text-2xl text-gray-200">
          Each stage is not completed
        </span>
      </div>
    );
  }

  return (
    <motion.div
      className="relative top-12 mb-12 p-6 text-white max-w-3xl glassmorphism"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-4">Final Contractor Bill</h1>

      <motion.div
        className="mt-6 p-5 border border-purple-400/20 border-solid rounded-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="flex gap-2 text-xl font-semibold text-gray-300 mb-2">
          <Projector />
          {project.projectName}
        </h2>
        <p className="text-lg font-medium text-gray-100 flex items-center gap-2">
          Total Cost:{" "}
          <span className="text-green-400 flex">
            <DollarSignIcon />
            Rs- {project.totalCost}
          </span>
        </p>
        <p className="text-gray-300 flex items-center gap-2">
          Payment Status:
          <span
            className={`ml-2 px-2 py-1 rounded-md ${
              project.isPaid ? "bg-green-600" : "bg-red-700/60 text-gray-200"
            }`}
          >
            {project.isPaid ? "Paid" : "Pending"}
          </span>
        </p>

        <h3 className="text-lg font-semibold mt-4 text-gray-100">
          Select Payment Method:
        </h3>
        <div className="flex gap-4 mt-3">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              selectedPayment === "cash"
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedPayment("cash")}
          >
            <Wallet2 size={20} />
            Cash on Hand
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              selectedPayment === "online"
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedPayment("online")}
          >
            <CreditCard size={20} />
            Online Payment
          </button>
        </div>

        {selectedPayment === "cash" && (
          <motion.div
            className="mt-4 p-4 bg-gray-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-200">
              Please confirm when you will make the payment:
            </p>
            <input
              type="datetime-local"
              className="mt-2 w-full bg-gray-900 p-2 rounded-md text-gray-100"
            />
          </motion.div>
        )}

        {selectedPayment === "online" && (
          <motion.div
            className="mt-4 p-4 bg-gray-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-200">
              Redirecting to secure payment gateway...
            </p>
          </motion.div>
        )}

        {!project.isPaid ? (
          <motion.button
            className="mt-6 px-4 py-2 w-full rounded-lg bg-green-600 hover:bg-green-700 transition flex items-center justify-center gap-2"
            onClick={handlePayment}
            disabled={paymentProcessing}
          >
            {paymentProcessing ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Confirm Payment"
            )}
          </motion.button>
        ) : (
          <p className="mt-4 text-green-400 font-medium flex items-center gap-2">
            <CheckCircle size={20} />
            Payment Completed
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NextProcess;
