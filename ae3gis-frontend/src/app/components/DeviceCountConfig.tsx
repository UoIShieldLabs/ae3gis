import React from "react";
import { Shield, Check } from "lucide-react";
import { AddDeviceButton } from "./AddDeviceButton";
import { DeviceConfigRow } from "./DeviceConfigRow";
import { DeviceType } from "../types/topology";
import {
  availableItDeviceTypes,
  availableOtDeviceTypes,
} from "../constants/deviceConfig";

interface DeviceConfigurationSectionProps {
  itDevices: any[];
  otDevices: any[];
  firewallConfig: any;
  setFirewallConfig: (value: any) => void;
  templates: any[];
  showAdvanced: boolean;
  addDevice: (name: DeviceType, isIT: boolean) => void;
  removeDevice: (name: string, isIT: boolean) => void;
  updateDeviceCount: (name: string, count: number, isIT: boolean) => void;
  updateDeviceTemplate: (name: string, templateId: string, isIT: boolean) => void;
  toggleAdvanced: () => void;
}

const DeviceConfigurationSection: React.FC<DeviceConfigurationSectionProps> = ({
  itDevices,
  otDevices,
  firewallConfig,
  setFirewallConfig,
  templates,
  showAdvanced,
  addDevice,
  removeDevice,
  updateDeviceCount,
  updateDeviceTemplate,
  toggleAdvanced,
}) => {
  return (
    <>
      {/* Advanced Toggle */}
      <div className="mb-6">
        <button
          onClick={toggleAdvanced}
          className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors group"
        >
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              showAdvanced
                ? "bg-indigo-600 border-indigo-600"
                : "border-gray-500 group-hover:border-indigo-400"
            }`}
          >
            {showAdvanced && <Check className="w-3 h-3 text-white" />}
          </div>
          <span>Advanced Configuration</span>
        </button>
      </div>

      {/* Device Configuration */}
      <div className="space-y-8">
        {/* IT Devices */}
        <div className="bg-[#2a2a3e] rounded-lg p-6 border border-[#3a3a4e]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">
              IT Network Devices
            </h2>
            <AddDeviceButton
              deviceTypes={availableItDeviceTypes}
              currentDevices={itDevices}
              isIT={true}
              label="IT"
              onAddDevice={addDevice}
            />
          </div>
          <div className="space-y-3">
            {itDevices.map((device) => (
              <DeviceConfigRow
                key={device.name}
                device={device}
                isIT={true}
                templates={templates}
                showAdvanced={showAdvanced}
                onCountChange={updateDeviceCount}
                onTemplateChange={updateDeviceTemplate}
                onRemove={() => removeDevice(device.name, true)}
              />
            ))}
          </div>
        </div>

        {/* OT Devices */}
        <div className="bg-[#2a2a3e] rounded-lg p-6 border border-[#3a3a4e]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">
              OT Network Devices
            </h2>
            <AddDeviceButton
              deviceTypes={availableOtDeviceTypes}
              currentDevices={otDevices}
              isIT={false}
              label="OT"
              onAddDevice={addDevice}
            />
          </div>
          <div className="space-y-3">
            {otDevices.map((device) => (
              <DeviceConfigRow
                key={device.name}
                device={device}
                isIT={false}
                templates={templates}
                showAdvanced={showAdvanced}
                onCountChange={updateDeviceCount}
                onTemplateChange={updateDeviceTemplate}
                onRemove={() => removeDevice(device.name, false)}
              />
            ))}
          </div>
        </div>

        {/* Firewall */}
        <div className="bg-[#2a2a3e] rounded-lg p-6 border border-[#3a3a4e]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Security Infrastructure
          </h2>
          <div className="flex items-center justify-between p-4 bg-[#333347] rounded-lg border border-[#3a3a4e]">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="font-medium text-gray-100">
                  {firewallConfig.name}
                </h4>
                <p className="text-sm text-gray-400">
                  {firewallConfig.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-300">
                  Count:
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={firewallConfig.count}
                  onChange={(e) =>
                    setFirewallConfig((prev: any) => ({
                      ...prev,
                      count: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-16 px-2 py-1 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {showAdvanced && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-300">
                    Template:
                  </label>
                  <select
                    value={firewallConfig.templateId}
                    onChange={(e) =>
                      setFirewallConfig((prev: any) => ({
                        ...prev,
                        templateId: e.target.value,
                      }))
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
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Topology Preview
        </h3>
        <div className="bg-[#2a2a3e] border border-[#3a3a4e] rounded-lg p-6">
          <div className="text-center text-gray-300">
            IT/OT Network with{" "}
            {itDevices.reduce((sum, d) => sum + d.count, 0)} IT devices,{" "}
            {otDevices.reduce((sum, d) => sum + d.count, 0)} OT devices, and{" "}
            {firewallConfig.count} firewall
            {firewallConfig.count !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceConfigurationSection;