import React from "react";
import { Monitor, Network, Server, Database, Wifi, Shield } from "lucide-react";
import { DeviceType, DeviceConfig } from "../types/topology";

// Available device types for adding new devices
export const availableItDeviceTypes: DeviceType[] = [
  {
    name: "Workstation",
    templateName: "benign-client",
    icon: <Monitor className="w-4 h-4" />,
    description: "End-user computer",
  },
  {
    name: "Switch",
    templateName: "openvswitch-xp",
    icon: <Network className="w-4 h-4" />,
    description: "Network switch",
  },
  {
    name: "DHCP Server",
    templateName: "isc-dhcp-server",
    icon: <Server className="w-4 h-4" />,
    description: "Dynamic IP assignment",
  },
  {
    name: "Web Server",
    templateName: "apache-server",
    icon: <Server className="w-4 h-4" />,
    description: "HTTP/HTTPS services",
  },
  {
    name: "DNS Server",
    templateName: "",
    icon: <Database className="w-4 h-4" />,
    description: "Domain name resolution",
  },
  {
    name: "Router",
    templateName: "",
    icon: <Wifi className="w-4 h-4" />,
    description: "Network gateway",
  },
  {
    name: "File Server",
    templateName: "",
    icon: <Server className="w-4 h-4" />,
    description: "File storage and sharing",
  },
  {
    name: "Email Server",
    templateName: "",
    icon: <Server className="w-4 h-4" />,
    description: "Email services",
  },
];

export const availableOtDeviceTypes: DeviceType[] = [
  {
    name: "PLC",
    templateName: "malicious-client",
    icon: <Monitor className="w-4 h-4" />,
    description: "Programmable Logic Controller",
  },
  {
    name: "HMI",
    templateName: "malicious-client",
    icon: <Monitor className="w-4 h-4" />,
    description: "Human Machine Interface",
  },
  {
    name: "Industrial Switch",
    templateName: "openvswitch-xp",
    icon: <Network className="w-4 h-4" />,
    description: "Industrial network switch",
  },
  {
    name: "Engineering Station",
    templateName: "",
    icon: <Monitor className="w-4 h-4" />,
    description: "Configuration workstation",
  },
  {
    name: "Historian Server",
    templateName: "",
    icon: <Database className="w-4 h-4" />,
    description: "Data collection and storage",
  },
  {
    name: "SCADA Server",
    templateName: "",
    icon: <Server className="w-4 h-4" />,
    description: "Supervisory control system",
  },
];

// Default device configurations
export const defaultItDevices: DeviceConfig[] = [
  {
    name: "Workstations",
    count: 3,
    templateId: "",
    icon: <Monitor className="w-5 h-5" />,
    description: "End-user computers",
  },
  {
    name: "Switches",
    count: 2,
    templateId: "",
    icon: <Network className="w-5 h-5" />,
    description: "Network switches",
  },
  {
    name: "DHCP_Server",
    count: 1,
    templateId: "",
    icon: <Server className="w-5 h-5" />,
    description: "Dynamic IP assignment",
  },
  {
    name: "Web_Server",
    count: 1,
    templateId: "",
    icon: <Server className="w-5 h-5" />,
    description: "HTTP/HTTPS services",
  },
  {
    name: "DNS_Server",
    count: 1,
    templateId: "",
    icon: <Database className="w-5 h-5" />,
    description: "Domain name resolution",
  },
];

export const defaultOtDevices: DeviceConfig[] = [
  {
    name: "PLC",
    count: 2,
    templateId: "",
    icon: <Monitor className="w-5 h-5" />,
    description: "Industrial control systems",
  },
  {
    name: "HMI",
    count: 1,
    templateId: "",
    icon: <Monitor className="w-5 h-5" />,
    description: "Industrial control systems",
  },
  {
    name: "Industrial_Switch",
    count: 1,
    templateId: "",
    icon: <Network className="w-5 h-5" />,
    description: "Industrial network switch",
  },
];

export const defaultFirewallConfig: DeviceConfig = {
  name: "Firewall",
  count: 1,
  templateId: "",
  icon: <Shield className="w-5 h-5" />,
  description: "Network security",
};
