import { useState, useEffect } from "react";
import { DeviceConfig, Template, DeviceType } from "../types/topology";
import {
  defaultItDevices,
  defaultOtDevices,
  defaultFirewallConfig,
} from "../constants/deviceConfig";

export const useTopologyConfig = (templates: Template[]) => {
  const [itDevices, setItDevices] = useState<DeviceConfig[]>(defaultItDevices);
  const [otDevices, setOtDevices] = useState<DeviceConfig[]>(defaultOtDevices);
  const [firewallConfig, setFirewallConfig] = useState<DeviceConfig>(
    defaultFirewallConfig
  );

    // SCOTT TEMPLATE NAMES
    // Template mapping for specific device types
    //const getTemplateId = (deviceName: string): string => {
    //  const templateMap: Record<string, string> = {
    //    Workstations: "benign-client",
    //    // Workstation: "benign-client",
    //    Switches: "openvswitch-xp",
    //    // Switch: "openvswitch-xp",
    //    DHCP_Server: "isc-dhcp-server",
    //    Web_Server: "apache-server",
    //    PLC: "malicious-client",
    //    HMI: "malicious-client",
    //    Industrial_Switch: "openvswitch-xp",
    //    Firewall: "iptables",
    //  };
    
  // BRAXTON TEMPLATE NAMES
  const getTemplateId = (deviceName: string): string => {
    const templateMap: Record<string, string> = {
      Workstations: "tollan-benign-client",
      Workstation: "tollan-benign-client",
      Switches: "tollan-openvswitch-xp",
      Switch: "tollan-openvswitch-xp",
      DHCP_Server: "tollan-isc-dhcp-server",
      Web_Server: "tollan-apache-server",
      PLC: "tollan-malicious-client",
      HMI: "tollan-malicious-client",
      Industrial_Switch: "tollan-openvswitch-xp",
      Firewall: "tollan-iptables",
      DNS_Server: "tollan-benign-client"
    };

    const templateName = templateMap[deviceName];
    if (templateName) {
      const matchingTemplate = templates.find(
        (t: Template) => t.name === templateName
      );
      return matchingTemplate?.template_id || templates[0]?.template_id || "";
    }

    // Fallback to first available template if no specific mapping
    return templates[0]?.template_id || "";
  };

  // Automatically initialize template IDs when templates are loaded
  useEffect(() => {
    if (templates.length === 0) return;

    // Update IT devices with template IDs (only if not already set)
    setItDevices((prev) =>
      prev.map((device) => ({
        ...device,
        templateId: device.templateId || getTemplateId(device.name),
      }))
    );

    // Update OT devices with template IDs (only if not already set)
    setOtDevices((prev) =>
      prev.map((device) => ({
        ...device,
        templateId: device.templateId || getTemplateId(device.name),
      }))
    );

    // Update firewall with template ID (only if not already set)
    setFirewallConfig((prev) => ({
      ...prev,
      templateId: prev.templateId || getTemplateId(prev.name),
    }));
  }, [templates]); // Only re-run when templates change

  const updateDeviceCount = (
    deviceName: string,
    newCount: number,
    isIT: boolean
  ) => {
    const setter = isIT ? setItDevices : setOtDevices;
    setter((prev) =>
      prev.map((device) =>
        device.name === deviceName
          ? { ...device, count: Math.max(0, newCount) }
          : device
      )
    );
  };

  const updateDeviceTemplate = (
    deviceName: string,
    templateId: string,
    isIT: boolean
  ) => {
    const setter = isIT ? setItDevices : setOtDevices;
    setter((prev) =>
      prev.map((device) =>
        device.name === deviceName ? { ...device, templateId } : device
      )
    );
  };

  const removeDevice = (deviceName: string, isIT: boolean) => {
    const setter = isIT ? setItDevices : setOtDevices;
    setter((prev) => prev.filter((device) => device.name !== deviceName));
  };

  const addDevice = (deviceType: DeviceType, isIT: boolean) => {
    const setter = isIT ? setItDevices : setOtDevices;
    const getTemplateIdByName = (templateName: string) => {
      if (!templateName) return templates[0]?.template_id || "";
      const matchingTemplate = templates.find((t) => t.name === templateName);
      return matchingTemplate?.template_id || templates[0]?.template_id || "";
    };

    const newDevice: DeviceConfig = {
      name: deviceType.name,
      count: 1,
      templateId: getTemplateIdByName(deviceType.templateName),
      icon: deviceType.icon,
      description: deviceType.description,
    };

    setter((prev) => [...prev, newDevice]);
  };

  return {
    itDevices,
    otDevices,
    firewallConfig,
    setFirewallConfig,
    updateDeviceCount,
    updateDeviceTemplate,
    removeDevice,
    addDevice,
  };
};