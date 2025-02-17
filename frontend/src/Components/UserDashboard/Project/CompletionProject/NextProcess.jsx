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
  DollarSign,
  Hammer,
  Zap,
  Plug,
  Box,
  Lightbulb,
  Fan,
  Landmark,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import LoaderAll from "../../../OtherComponents/LoaderAll";
import BillBreakdown from "./BillBreakDown";

const NextProcess = () => {
  const { projects } = useOutletContext();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [contractorBill, setContractorBill] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");

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
        setLoading(false);
      }
    };

    setTimeout(fetchData, 1800);
  }, [projects, projectId]);

  const handlePayment = () => {
    if (!selectedPayment) {
      return alert("Please select a payment method");
    }
    if (selectedPayment === "cash" && !paymentDate) {
      return alert("Please select a payment date");
    }

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
      <div className="flex flex-col items-center justify-center min-h-screen backdrop-blur gap-4 px-4">
        <AlertCircle className="w-16 h-16 text-yellow-400 animate-pulse" />
        <span className="text-xl md:text-2xl text-gray-200 font-semibold text-center">
          Project stages are not completed yet
        </span>
      </div>
    );
  }

  return (
    <motion.div
      className="relative top-12 mb-28 min-h-screen px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Bill Detailing Section */}
      <motion.div
        className="relative top-12 mb-12 p-4 sm:p-6 text-white max-w-4xl mx-auto bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Landmark className="w-7 h-7 sm:w-9 sm:h-9 text-purple-400" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Project Final Settlement
          </h1>
        </div>

        <motion.div
          className="mt-4 sm:mt-6 p-4 sm:p-6 border border-blue-700/40 border-solid rounded-2xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h2 className="flex gap-2 text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                <Projector className="w-5 h-5 text-purple-400" />
                {project.projectName}
              </h2>
              <p className="text-gray-400 text-sm">Project ID: {project._id}</p>
            </div>
            <div className="w-full sm:w-auto bg-gray-800/80 px-4 py-2 rounded-lg">
              <p className="text-base sm:text-lg font-medium text-gray-100 flex items-center justify-between sm:justify-start gap-2">
                <span className="text-gray-200">Total Stage Cost:</span>
                <span className="text-green-400 flex items-center">
                  Rs: {project.totalCost.toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* Bill Breakdown Table */}
          <BillBreakdown project={project} />

          {/* Discount & Final Amount */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-800/60 p-4 sm:p-6 rounded-xl">
            <div className="space-y-2">
              <p className="text-gray-400">Stage Cost Subtotal</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-100">
                Rs: {project.totalCost.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Discount</p>
              <p className="text-lg sm:text-xl font-semibold text-red-400">
                {project.discountApplied
                  ? `Rs: ${project.discountRate.toLocaleString()}`
                  : "-"}
              </p>
            </div>
            <div className="col-span-1 sm:col-span-2 pt-4 border-t border-gray-700">
              <p className="text-gray-400">Total Amount</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-400">
                Rs: {project.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="col-span-1 sm:col-span-2 pt-4 border-t border-gray-700">
              <p className="text-gray-400">Final Amount</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-400">
                Rs: {project.finalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Contractor Message */}
          {project.contractorMessageOfBill && (
            <div className="mt-6 p-4 border-l-4 border-purple-400 bg-gray-800/50 rounded-lg">
              <p className="text-sm sm:text-base text-gray-200">
                <span className="text-purple-400 font-medium">
                  Contractor Note:
                </span>{" "}
                {project.contractorMessageOfBill}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Payment Section */}
      <motion.div
        className="relative top-12 mb-12 p-4 sm:p-6 text-white max-w-4xl mx-auto bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Payment Gateway
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div className="space-y-4">
            <button
              className={`w-full p-4 sm:p-5 rounded-xl transition-all duration-300 ${
                selectedPayment === "cash"
                  ? "bg-blue-600/40 border-2 border-blue-400"
                  : "bg-gray-800/60 hover:bg-gray-700/60 border-2 border-transparent"
              }`}
              onClick={() => setSelectedPayment("cash")}
            >
              <div className="flex items-center gap-3">
                <Wallet2 className="w-5 h-5 text-blue-400" />
                <span className="text-lg font-semibold text-gray-200">
                  Cash Payment
                </span>
              </div>
              {selectedPayment === "cash" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <input
                    type="datetime-local"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full bg-gray-900/60 text-gray-100 px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Please confirm the payment date and time
                  </p>
                </motion.div>
              )}
            </button>

            <button
              className={`w-full p-4 sm:p-5 rounded-xl transition-all duration-300 ${
                selectedPayment === "online"
                  ? "bg-purple-600/40 border-2 border-purple-400"
                  : "bg-gray-800/60 hover:bg-gray-700/60 border-2 border-transparent"
              }`}
              onClick={() => setSelectedPayment("online")}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span className="text-lg font-semibold text-gray-200">
                  Online Payment
                </span>
              </div>
              {selectedPayment === "online" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <div className="bg-gray-900/60 p-4 rounded-lg">
                    <div className="animate-pulse flex items-center gap-2 text-gray-300">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-gray-200">
                        Redirecting to secure payment gateway...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </button>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-800/60 p-5 sm:p-6 rounded-xl border border-gray-700/60">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
              Payment Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-gray-200">
                  Rs: {project.totalCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Discount:</span>
                <span className="text-red-400">
                  {project.discountApplied
                    ? `- Rs: ${project.discountRate.toLocaleString()}`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <span className="text-gray-300 font-semibold">
                  Total Payable:
                </span>
                <span className="text-xl font-bold text-green-400">
                  Rs: {project.finalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {!project.isPaid ? (
              <motion.button
                className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 text-white font-semibold shadow-lg"
                onClick={handlePayment}
                disabled={paymentProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Payment
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            ) : (
              <div className="mt-6 p-4 bg-green-900/30 rounded-xl border border-green-700/50">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold text-white">
                    Payment Successfully Completed
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Reusable Table Row Component
const TableRow = ({ icon, service, quantity, rate, total }) => (
  <tr className="hover:bg-gray-800/40 transition-colors">
    <td className="px-4 py-4 flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <span className="text-gray-200">{service}</span>
    </td>
    <td className="px-4 py-4 text-right text-gray-300">{quantity}</td>
    <td className="px-4 py-4 text-right text-gray-300">{rate}</td>
    <td className="px-4 py-4 text-right text-green-400 font-medium">
      Rs: {total.toLocaleString()}
    </td>
  </tr>
);

export default NextProcess;
