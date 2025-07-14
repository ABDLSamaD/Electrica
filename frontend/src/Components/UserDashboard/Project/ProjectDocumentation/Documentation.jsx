import { Link } from "react-router-dom";
import {
  PlusCircle,
  Lightbulb,
  Rocket,
  Workflow,
  LayoutDashboard,
  DollarSign,
  ShieldCheck,
} from "lucide-react"; // Added PlusCircle for the button

const Documentation = () => {
  return (
    <div className="min-h-screen text-white p-4 sm:p-6 relative top-8 mb-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-0">
            Project Overview & Guidelines
          </h1>
          <Link
            to="/db-au-user/project/prjfrom"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30
                       hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-600/40
                       transition-all duration-300"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Project
          </Link>
        </div>

        {/* Section: Why Use Our Platform? (Dashboard Widgets) */}
        <div className="mb-8 p-6 bg-gray-800/20 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-green-300 mb-6 text-center">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <LayoutDashboard className="w-10 h-10 text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">
                Streamlined Management
              </h3>
              <p className="text-gray-300 text-sm">
                Effortlessly manage all your electrical projects from a single,
                intuitive dashboard.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <DollarSign className="w-10 h-10 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">
                Transparent Pricing
              </h3>
              <p className="text-gray-300 text-sm">
                Understand point rates and costs clearly, ensuring fair and
                transparent transactions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <ShieldCheck className="w-10 h-10 text-purple-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">
                Secure & Reliable
              </h3>
              <p className="text-gray-300 text-sm">
                Your project data is secure, and our processes are designed for
                reliability.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Your Project Journey (Step-by-step guide) */}
        <div className="mb-8 p-6 bg-gray-800/20 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">
            Your Project Journey
          </h2>
          <div className="space-y-5">
            <div className="flex items-start space-x-4 bg-gray-700/50 p-4 rounded-xl border border-gray-600">
              <Lightbulb className="w-7 h-7 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  1. Submit Your Project
                </h3>
                <p className="text-gray-300 text-sm">
                  Provide detailed information about your electrical project,
                  including descriptions, location, and technical
                  specifications.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 bg-gray-700/50 p-4 rounded-xl border border-gray-600">
              <Workflow className="w-7 h-7 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  2. Admin Review & Approval
                </h3>
                <p className="text-gray-300 text-sm">
                  Our team will review your submission. Once approved, project
                  stages will be unlocked for you.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 bg-gray-700/50 p-4 rounded-xl border border-gray-600">
              <Rocket className="w-7 h-7 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  3. Execute & Track Progress
                </h3>
                <p className="text-gray-300 text-sm">
                  Begin work on your project and track its progress through
                  defined stages until completion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Add a Project (Textual Guide) */}
        <div className="p-6 bg-gray-800/20 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">
            Detailed Submission Guide
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            To initiate a new project, navigate to the "Add New Project" button
            located at the top right of this page. You will be presented with a
            multi-step form designed to capture all essential details. This
            includes client contact information, a comprehensive project
            description, precise location details, technical requirements such
            as voltage type and phase configuration, and financial estimates
            including estimated budget and advance payment. Ensure all required
            fields are accurately filled to expedite the review process.
          </p>
          <p className="text-gray-300 text-base leading-relaxed mt-4">
            Upon successful submission, your project will be queued for
            administrative review. Once approved, the project's specific stages
            will become active, allowing you to commence work and track progress
            seamlessly within your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
