import React, { useState } from "react";
import { Plus } from "lucide-react";
import { DeviceType, DeviceConfig } from "../types/topology";

interface AddDeviceButtonProps {
  deviceTypes: DeviceType[];
  currentDevices: DeviceConfig[];
  isIT: boolean;
  label: string;
  onAddDevice: (deviceType: DeviceType, isIT: boolean) => void;
}

export const AddDeviceButton: React.FC<AddDeviceButtonProps> = ({
  deviceTypes,
  currentDevices,
  isIT,
  label,
  onAddDevice,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const availableTypes = deviceTypes.filter(
    (type) => !currentDevices.some((device) => device.name === type.name)
  );

  if (availableTypes.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-green-900 border border-green-50 rounded-lg hover:bg-green-400 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add {label} Device</span>
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
          {availableTypes.map((deviceType) => (
            <button
              key={deviceType.name}
              onClick={() => {
                onAddDevice(deviceType, isIT);
                setShowDropdown(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
            >
              {deviceType.icon}
              <div>
                <div className="font-medium text-gray-900">
                  {deviceType.name}
                </div>
                <div className="text-sm text-gray-500">
                  {deviceType.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
