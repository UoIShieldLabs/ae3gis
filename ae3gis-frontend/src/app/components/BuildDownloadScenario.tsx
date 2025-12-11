import React from "react";

interface TopologyControlsProps {
  buildLoading: boolean;
  startScenario: boolean;
  onStartScenarioChange: (checked: boolean) => void;
  onDownload: () => void;
  onBuild: () => void;
}

const TopologyControls: React.FC<TopologyControlsProps> = ({
  buildLoading,
  startScenario,
  onStartScenarioChange,
  onDownload,
  onBuild,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      {/* Download Button */}
      <button
        onClick={onDownload}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-medium"
      >
        Download JSON
      </button>

      {/* Build Button */}
      <button
        onClick={onBuild}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-medium"
      >
        {buildLoading ? "Building..." : "Build & Send"}
      </button>

      {/* Checkbox */}
      <label className="flex items-center gap-2 text-lg font-medium">
        <input
          type="checkbox"
          checked={startScenario}
          onChange={(e) => onStartScenarioChange(e.target.checked)}
          className="w-5 h-5 accent-indigo-600"
        />
        Start Scenario
      </label>
    </div>
  );
};

export default TopologyControls;
