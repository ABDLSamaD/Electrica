// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ProjectComplete = ({ projectId, stageNames, isCompleted }) => {
//   const [stageCosts, setStageCosts] = useState([]);
//   const [contractorBill, setContractorBill] = useState(0);
//   const [finalBill, setFinalBill] = useState(0);
//   const [paymentStatus, setPaymentStatus] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!isCompleted) {
//       fetchStageCosts();
//     }
//   }, [projectId, isCompleted]);

//   const fetchStageCosts = async () => {
//     try {
//       const response = await axios.get(
//         `/api/projects/${projectId}/stage-costs`
//       );
//       setStageCosts(response.data.stageCosts);
//     } catch (error) {
//       console.error("Error fetching stage costs:", error);
//     }
//   };

//   const handleAddContractorBill = async () => {
//     try {
//       const response = await axios.post(
//         `/api/projects/${projectId}/add-contractor-bill`,
//         {
//           amount: contractorBill,
//         }
//       );
//       alert("Contractor bill added successfully.");
//     } catch (error) {
//       console.error("Error adding contractor bill:", error);
//     }
//   };

//   const handleCalculateFinalBill = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `/api/projects/${projectId}/calculate-final-bill`
//       );
//       setFinalBill(response.data.finalBill);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.error("Error calculating final bill:", error);
//     }
//   };

//   const handleCheckPaymentStatus = async () => {
//     try {
//       const response = await axios.get(
//         `/api/projects/${projectId}/payment-status`
//       );
//       setPaymentStatus(response.data.paymentReceived);
//     } catch (error) {
//       console.error("Error checking payment status:", error);
//     }
//   };

//   const handleCompleteProject = async () => {
//     try {
//       const response = await axios.post(
//         `/api/projects/${projectId}/complete-project`
//       );
//       alert("Project marked as completed.");
//     } catch (error) {
//       console.error("Error completing project:", error);
//     }
//   };

//   if (isCompleted) {
//     return (
//       <div className="w-full h-dvh bg-green-300/5 backdrop-blur-2xl flex flex-col justify-center items-center text-white p-8">
//         <h2 className="text-3xl font-bold mb-4">Project Completed</h2>
//         <p className="mb-6">All stages are successfully completed!</p>
//         <button
//           onClick={() => console.log("Navigating...")}
//           className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition"
//         >
//           Proceed to Next Step
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full p-8">
//       <h2 className="text-2xl font-bold mb-4">Project Completion</h2>
//       <div className="mb-6">
//         <h3 className="font-semibold">Stage Costs:</h3>
//         <ul>
//           {stageNames.map((stage, index) => (
//             <li key={index}>
//               {stage}: ${stageCosts[index] || 0}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="mb-6">
//         <h3 className="font-semibold">Contractor Bill:</h3>
//         <input
//           type="number"
//           value={contractorBill}
//           onChange={(e) => setContractorBill(e.target.value)}
//           placeholder="Enter contractor bill"
//           className="border px-4 py-2 rounded"
//         />
//         <button
//           onClick={handleAddContractorBill}
//           className="ml-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
//         >
//           Add Contractor Bill
//         </button>
//       </div>

//       <div className="mb-6">
//         <h3 className="font-semibold">Final Bill:</h3>
//         <button
//           onClick={handleCalculateFinalBill}
//           className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
//         >
//           Calculate Final Bill
//         </button>
//         {loading ? <p>Loading...</p> : <p>Total: ${finalBill}</p>}
//       </div>

//       <div className="mb-6">
//         <h3 className="font-semibold">Payment Status:</h3>
//         <button
//           onClick={handleCheckPaymentStatus}
//           className={`px-6 py-2 rounded ${
//             paymentStatus ? "bg-green-500" : "bg-red-500"
//           } text-white`}
//         >
//           {paymentStatus ? "Payment Received" : "Check Payment"}
//         </button>
//       </div>

//       <div className="mb-6">
//         <button
//           onClick={handleCompleteProject}
//           className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
//           disabled={!paymentStatus}
//         >
//           Complete Project
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProjectComplete;
