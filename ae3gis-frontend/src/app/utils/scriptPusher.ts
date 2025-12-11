interface Device {
  name: string;
  count: number;
}

interface FirewallConfig {
  count: number;
}

interface Node {
  node_id: string;
  name: string;
}

export const pushScripts = (
  itDevices: Device[],
  otDevices: Device[],
  firewallConfig: FirewallConfig
): Node[] => {
  const nodes: Node[] = [];

  // Generate IT device nodes
  itDevices.forEach((device) => {
    for (let i = 0; i < device.count; i++) {
      nodes.push({
        node_id: `${device.name}_${i + 1}`,
        name: `${device.name}_${i + 1}`,
      });
    }
  });

  // Generate OT device nodes
  otDevices.forEach((device) => {
    for (let i = 0; i < device.count; i++) {
      nodes.push({
        node_id: `${device.name}_${i + 1}`,
        name: `${device.name}_${i + 1}`,
      });
    }
  });

  // Generate firewall nodes
  for (let i = 0; i < firewallConfig.count; i++) {
    nodes.push({
      node_id: `Firewall_${i + 1}`,
      name: `Firewall_${i + 1}`,
    });
  }

  return nodes;
};