import { useState } from "react";
import {
  Hammer,
  Zap,
  Plug,
  Box,
  Lightbulb,
  Fan,
  ChevronDown,
} from "lucide-react";

const BillBreakdown = ({ project }) => {
  const [openBreakdown, setOpenBreakdown] = useState(null);

  const toggleBreakdown = (field) => {
    setOpenBreakdown(openBreakdown === field ? null : field);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300 divide-y divide-gray-800/50">
            <thead>
              <tr className="bg-gray-800/80">
                <th className="py-4 px-4 text-left font-medium text-gray-200">
                  Service
                </th>
                <th className="py-4 px-4 text-right font-medium text-gray-200 hidden sm:table-cell">
                  Price
                </th>
                <th className="py-4 px-4 text-right font-medium text-gray-200 hidden lg:table-cell">
                  Rate
                </th>
                <th className="py-4 px-4 text-right font-medium text-gray-200">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <TableRow
                icon={<Hammer className="w-4 h-4" />}
                service="Main Labour"
                price={project.mainLabourCost * 100}
                rate="Rs: 100/meter"
                total={project.mainLabourCost * 100}
              />
              <TableRow
                icon={<Zap className="w-4 h-4" />}
                service="AC Points"
                price={project.acPoints * 2000}
                rate="Rs: 2,000/point"
                total={project.acPoints * 2000}
                showBreakdown
                open={openBreakdown === "acPoints"}
                onToggle={() => toggleBreakdown("acPoints")}
                details={{
                  points: project.acPoints * 2000,
                  ratePerPoint: 2000,
                }}
              />
              <TableRow
                icon={<Plug className="w-4 h-4" />}
                service="Current Points"
                price={project.currentPoints * 350}
                rate="Rs: 350/point"
                total={project.currentPoints * 350}
                showBreakdown
                open={openBreakdown === "currentPoints"}
                onToggle={() => toggleBreakdown("currentPoints")}
                details={{
                  points: project.currentPoints * 350,
                  ratePerPoint: 350,
                }}
              />
              <TableRow
                icon={<Box className="w-4 h-4" />}
                service="Panel Board"
                price={project.panelBoardType === "Three-Phase" ? 9000 : 4000}
                rate={
                  project.panelBoardType === "Three-Phase"
                    ? "Rs: 9,000"
                    : "Rs: 4,000"
                }
                total={project.panelBoardType === "Three-Phase" ? 9000 : 4000}
              />
              <TableRow
                icon={<Lightbulb className="w-4 h-4" />}
                service="Lightning Meters"
                price={project.lightningMeters * 20}
                rate="Rs: 20/meter"
                total={project.lightningMeters * 20}
                showBreakdown
                open={openBreakdown === "lightningMeters"}
                onToggle={() => toggleBreakdown("lightningMeters")}
                details={{
                  meters: project.lightningMeters * 20,
                  ratePerMeter: 20,
                }}
              />
              <TableRow
                icon={<Fan className="w-4 h-4" />}
                service="Fan Installation"
                price={project.fanInstallation * 400}
                rate="Rs: 400/unit"
                total={project.fanInstallation * 400}
              />
              <tr className="bg-gray-800/40 font-medium">
                <td className="px-4 py-4 text-gray-200">Earthing Cost</td>
                <td className="px-4 py-4 text-right hidden sm:table-cell">-</td>
                <td className="px-4 py-4 text-right hidden lg:table-cell">-</td>
                <td className="px-4 py-4 text-right text-green-400">
                  Rs: {project.earthingCost.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({
  icon,
  service,
  price,
  rate,
  total,
  showBreakdown,
  open,
  onToggle,
  details,
}) => {
  return (
    <>
      <tr
        className={`group transition-colors duration-200 hover:bg-gray-800/20 ${
          open ? "bg-gray-800/40" : ""
        }`}
      >
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800/50 text-gray-200">
              {icon}
            </span>
            <span className="font-medium text-gray-200">{service}</span>
          </div>
        </td>
        <td className="px-4 py-4 text-right hidden sm:table-cell">
          Rs: {price.toLocaleString()}
        </td>
        <td className="px-4 py-4 text-right hidden lg:table-cell">{rate}</td>
        <td className="px-4 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="text-green-400 font-medium">
              Rs: {total.toLocaleString()}
            </span>
            {showBreakdown && (
              <button
                onClick={onToggle}
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-all duration-200 ${
                  open ? "rotate-180 bg-gray-800/50" : ""
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={4} className="relative">
            <div className="absolute left-4 top-2 w-[calc(100%-2rem)] sm:w-80 bg-gray-800/95 backdrop-blur-sm text-gray-200 p-4 rounded-lg shadow-xl z-50 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gray-700/50 text-gray-200">
                  {icon}
                </span>
                <strong className="text-sm">{service} Breakdown</strong>
              </div>
              <div className="space-y-3">
                {details?.points && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Price:</span>
                      <span className="font-medium text-gray-200">
                        Rs: {details.points.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rate per Point:</span>
                      <span className="font-medium text-gray-200">
                        Rs: {details.ratePerPoint.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-700/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Calculation:</span>
                        <span className="font-medium text-gray-200">
                          {details.points.toLocaleString()} ÷{" "}
                          {details.ratePerPoint.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-400">Total Points:</span>
                        <span className="font-medium text-green-400">
                          {(details.points / details.ratePerPoint).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                {details?.meters && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Price:</span>
                      <span className="font-medium text-gray-200">
                        Rs: {details.meters.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rate per Meter:</span>
                      <span className="font-medium text-gray-200">
                        Rs: {details.ratePerMeter.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-700/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Calculation:</span>
                        <span className="font-medium text-gray-200">
                          {details.meters.toLocaleString()} ÷{" "}
                          {details.ratePerMeter.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-400">Total Meters:</span>
                        <span className="font-medium text-green-400">
                          {(details.meters / details.ratePerMeter).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default BillBreakdown;
