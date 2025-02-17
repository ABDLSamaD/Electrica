import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Zap,
  FileSpreadsheet,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  HomeIcon,
  Shield,
  Users,
  Sparkles,
  PenTool as Tool,
  Cpu,
  Phone,
  Lightbulb,
  WrenchIcon,
  Plug,
  Clock,
  Calendar,
  MessageSquare,
} from "lucide-react";

const FirstTimeInstruction = ({ handleSkip }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleNavigate = () => {
    handleSkip();
    navigate("/db-au-user/project");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/20 via-gray-950/70 to-gray-900/20 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Progress bar - Simplified for mobile */}
          <div className="flex justify-between mb-8 md:mb-12 px-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center ${
                    step <= currentStep ? "bg-blue-500" : "bg-gray-700/50"
                  } transition-all duration-300`}
                >
                  {step === 1 && <Zap className="w-4 h-4 md:w-8 md:h-8" />}
                  {step === 2 && (
                    <FileSpreadsheet className="w-4 h-4 md:w-8 md:h-8" />
                  )}
                  {step === 3 && (
                    <PlusCircle className="w-4 h-4 md:w-8 md:h-8" />
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 md:h-1.5 ${
                      step < currentStep ? "bg-blue-500" : "bg-gray-700/50"
                    } transition-all duration-300`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Content Container */}
          <div className="glass-card p-4 md:p-8 rounded-xl">
            {/* Step 1 Content */}
            {currentStep === 1 && (
              <div className="space-y-6 md:space-y-8 animate-fadeIn">
                <div className="text-center mb-6 md:mb-12">
                  <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
                    <Zap className="w-12 h-12 md:w-20 md:h-20 text-blue-500" />
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      Welcome to Electrica
                    </h1>
                  </div>
                  <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                    Experience the future of electrical project management
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                  {/* Feature cards */}
                  <div className="glass-card p-4 md:p-8 rounded-xl">
                    <HomeIcon className="w-10 h-10 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Smart Home Solutions
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-200">
                          Professional installation
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-200">
                          Energy optimization
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="glass-card p-4 md:p-8 rounded-xl">
                    <Shield className="w-10 h-10 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Safety Guaranteed
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-200">
                          Certified professionals
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-200">Quality materials</span>
                      </li>
                    </ul>
                  </div>

                  <div className="glass-card p-4 md:p-8 rounded-xl">
                    <Users className="w-10 h-10 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Expert Network
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-200">
                          Verified contractors
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-200">24/7 support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 Content */}
            {currentStep === 2 && (
              <div className="space-y-6 md:space-y-8 animate-fadeIn">
                <div className="text-center mb-6 md:mb-12">
                  <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Project Stages
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300">
                    Our three-stage approach ensures quality and safety
                  </p>
                </div>

                <div className="space-y-6 md:space-y-8">
                  {/* Stage 1 */}
                  <div className="glass-card p-4 md:p-8 rounded-xl">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      <Lightbulb className="w-12 h-12 text-blue-400 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-4">
                          Stage 1: Electric Roof Pimping
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-blue-400 mb-2">
                              Key Activities
                            </h4>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-200">
                                  Electrical conduit installation
                                </span>
                              </li>
                              <li className="flex items-center gap-2 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-200">
                                  Junction box placement
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="glass-card p-4 md:p-8 rounded-xl">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      <WrenchIcon className="w-12 h-12 text-blue-400 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-4">
                          Stage 2: Concealed Fitting
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-blue-400 mb-2">
                              Installation Process
                            </h4>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-200">
                                  Wall chase cutting and fitting
                                </span>
                              </li>
                              <li className="flex items-center gap-2 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-200">
                                  Electrical box placement
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="glass-card p-4 md:p-8 rounded-xl">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      <Plug className="w-12 h-12 text-blue-400 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-4">
                          Stage 3: Final Installation
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-blue-400 mb-2">
                              Final Setup
                            </h4>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-200">
                                  Switchboard installation
                                </span>
                              </li>
                              <li className="flex items-center gap-2 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-200">
                                  System integration
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Content */}
            {currentStep === 3 && (
              <div className="space-y-6 md:space-y-8 animate-fadeIn">
                <div className="text-center mb-6 md:mb-12">
                  <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Start Your Project
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300">
                    Begin your journey with Electrica
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-12">
                  <div className="space-y-6">
                    <div className="glass-card p-4 md:p-6 rounded-xl">
                      <Clock className="w-10 h-10 text-blue-400 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Real-time Updates
                      </h3>
                      <p className="text-gray-300">
                        Stay informed with instant notifications
                      </p>
                    </div>

                    <div className="glass-card p-4 md:p-6 rounded-xl">
                      <Shield className="w-10 h-10 text-blue-400 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Quality Assurance
                      </h3>
                      <p className="text-gray-300">
                        Professional oversight at every step
                      </p>
                    </div>
                  </div>

                  <div className="glass-card p-4 md:p-8 rounded-xl">
                    <h3 className="text-2xl font-semibold mb-6 text-center">
                      Ready to Begin?
                    </h3>
                    <button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1 shadow-lg"
                      onClick={handleNavigate}
                    >
                      <PlusCircle className="w-6 h-6" />
                      <span className="text-gray-200">Create New Project</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 md:mt-12">
              <button
                onClick={handleSkip}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm md:text-base"
              >
                Skip
              </button>
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 md:px-8 py-2 md:py-3 rounded-xl flex items-center gap-2 transition-all duration-300 text-sm md:text-base"
                >
                  Next <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSkip}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 md:px-8 py-2 md:py-3 rounded-xl flex items-center gap-2 transition-all duration-300 text-sm md:text-base"
                >
                  Complete <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeInstruction;
