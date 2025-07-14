import {
  Zap,
  Wrench,
  ClipboardCheck,
  CheckCircle,
  List,
  FileText,
} from "lucide-react"; // Replaced react-icons/fa with lucide-react

// PointRateCard Component
const PointRateCard = () => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-500/20 rounded-lg">
          <Zap className="text-blue-400 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-blue-300 ml-4">Point Rates</h2>
      </div>
      <p className="text-gray-300 mb-6">
        The current point rate for electricians is{" "}
        <strong className="text-blue-200">350 points</strong>. This is the
        standard rate that will be applied to your projects.
      </p>
      <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
        <List className="text-purple-400 mr-2" /> Additional Rates:
      </h3>
      <ul className="list-disc list-inside text-gray-400 space-y-2">
        <li>
          Complex wiring: <span className="text-green-400">+50 points</span>
        </li>
        <li>
          High-voltage systems:{" "}
          <span className="text-green-400">+100 points</span>
        </li>
        <li>
          Emergency repairs: <span className="text-green-400">+75 points</span>
        </li>
      </ul>
    </div>
  );
};

// ProjectStagesCard Component
const ProjectStagesCard = () => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-green-500/20 rounded-lg">
          <Wrench className="text-green-400 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-green-300 ml-4">
          Project Stages
        </h2>
      </div>
      <ul className="space-y-4 text-gray-300">
        <li className="flex items-start">
          <CheckCircle className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
          <div>
            <strong className="text-blue-300">Stage-1:</strong> Electric Roof
            Pimping
          </div>
        </li>
        <li className="flex items-start">
          <CheckCircle className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
          <div>
            <strong className="text-blue-300">Stage-2:</strong> Electric Insert
            Pimpes Concealed Fitting
          </div>
        </li>
        <li className="flex items-start">
          <CheckCircle className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
          <div>
            <strong className="text-blue-300">Stage-3:</strong> Electric
            Troubleshooting, Wiring, Installation Switch Boards, Panel Boards,
            etc.
          </div>
        </li>
      </ul>
    </div>
  );
};

// ProjectSubmissionCard Component
const ProjectSubmissionCard = () => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-purple-500/20 rounded-lg">
          <ClipboardCheck className="text-purple-400 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-purple-300 ml-4">
          Project Submission
        </h2>
      </div>
      <p className="text-gray-300 mb-6">
        Once you submit your project, it will be reviewed and approved by an
        admin. The stages will then be unlocked for you to begin your work.
      </p>
      <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
          <FileText className="text-yellow-400 mr-2" /> Submission Checklist:
        </h3>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>Complete all required fields</li>
          <li>Attach necessary diagrams or plans</li>
          <li>Provide accurate time estimates</li>
          <li>Include any special requirements or notes</li>
        </ul>
      </div>
    </div>
  );
};

export { PointRateCard, ProjectStagesCard, ProjectSubmissionCard };
