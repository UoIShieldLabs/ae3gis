export type Template = {
  template_id: string;
  name: string;
};

export type DeviceConfig = {
  name: string;
  count: number;
  templateId: string;
  icon: React.ReactNode;
  description: string;
};

export type TopologyType = "IT" | "OT" | "HYBRID";

export type NetworkConfig = {
  type: TopologyType;
  devices: DeviceConfig[];
};

export type Node = {
  node_id: string;
  name: string;
  template_id: string;
  x: number;
  y: number;
  zone: string;
};

export type Link = {
  nodes: {
    node_id: string;
    adapter_number: number;
    port_number: number;
  }[];
};

export type DeviceType = {
  name: string;
  templateName: string;
  icon: React.ReactNode;
  description: string;
};

export type Project = {
  project_name: string;
  name: string;
};
