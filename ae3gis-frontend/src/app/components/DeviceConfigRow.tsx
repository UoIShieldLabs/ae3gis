import React from "react";
import { Minus } from "lucide-react";
import { DeviceConfig, Template } from "../types/topology";

interface DeviceConfigRowProps {
  device: DeviceConfig;
  isIT: boolean;
  templates: Template[];
  showAdvanced: boolean;
  onCountChange: (deviceName: string, newCount: number, isIT: boolean) => void;
  onTemplateChange: (
    deviceName: string,
    templateId: string,
    isIT: boolean
  ) => void;
  onRemove: () => void;
}

export const DeviceConfigRow: React.FC<DeviceConfigRowProps> = ({
  device,
  isIT,
  templates,
  showAdvanced,
  onCountChange,
  onTemplateChange,
  onRemove,
}) => (
  <div className="flex items-center justify-between p-4 bg-[#333347] rounded-lg border border-[#3a3a4e] hover:border-[#4a4a5e] transition-colors">
    <div className="flex items-center space-x-3">
      <div className="text-indigo-400">{device.icon}</div>
      <div>
        <h4 className="font-medium text-gray-100">{device.name}</h4>
        <p className="text-sm text-gray-400">{device.description}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-300">Count:</label>
        <input
          type="number"
          min="0"
          max="100"
          value={device.count}
          onChange={(e) =>
            onCountChange(device.name, parseInt(e.target.value) || 0, isIT)
          }
          className="w-16 px-2 py-1 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      {showAdvanced && (
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-300">Template:</label>
          <select
            value={device.templateId}
            onChange={(e) =>
              onTemplateChange(device.name, e.target.value, isIT)
            }
            className="px-3 py-1 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {templates.map((template) => (
              <option
                key={template.template_id}
                value={template.template_id}
                className="bg-[#252535]"
              >
                {template.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        onClick={onRemove}
        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
        title="Remove device type"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  </div>
);
