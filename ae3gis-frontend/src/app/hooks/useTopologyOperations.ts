import { useTopologies } from "./useTopology";
import { useBuildScenario } from "./useBuild";
import { generateTopologyJSON, downloadJSON } from "../utils/topologyGenerator";

export const useTopologyOperations = (config: {
  currentGns3Ip: string;
  itDevices: any[];
  otDevices: any[];
  firewallConfig: any;
  templates: any[];
  selectedProject: any;
  setCurrentGns3Ip: (ip: string) => void;
  setSelectedProject: (project: any) => void;
  updateDeviceCount: (name: string, count: number, isIT: boolean) => void;
  updateDeviceTemplate: (name: string, templateId: string, isIT: boolean) => void;
  setFirewallConfig: (value: any) => void;
  startScenario: boolean;
  createdServers: string[]
}) => {
  // Call hooks INSIDE the custom hook
  const { createTopology, fetchTopologyById } = useTopologies();
  const { buildScenario } = useBuildScenario();

  const saveActiveScenario = (scenarioData: any, scenarioName: string) => {
    const activeScenario = {
      name: scenarioName,
      nodes: scenarioData.nodes || [],
      gns3_server_ip: scenarioData.gns3_server_ip,
      project_id: scenarioData.project_id,
    };
    localStorage.setItem("activeScenario", JSON.stringify(activeScenario));
  };


  const handleSaveJSON = async (name: string, description: string) => {
    const scenario = generateTopologyJSON(
      config.currentGns3Ip,
      config.itDevices,
      config.otDevices,
      config.firewallConfig,
      config.templates,
      config.selectedProject
    );

    try {
      const response = await createTopology(name, scenario, description);

      if (response) {
        const scenarioName = `${name} - ${new Date().toLocaleString()}`;
        saveActiveScenario(scenario, scenarioName);
        alert(`Topology "${name}" saved successfully!`);
      }
    } catch (err) {
      console.error("Failed to save topology:", err);
      alert("Failed to save topology. Please try again.");
    }
  };

  const handleLoadTopology = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Load topology "${name}"? This will replace your current configuration.`
    );

    if (!confirmed) return;

    try {
      const topology = await fetchTopologyById(id);
      const topologyData = topology.scenario;

      if (!topologyData || !topologyData.nodes) {
        throw new Error("Invalid topology data - missing nodes");
      }

      if (topologyData.gns3_server_ip) {
        config.setCurrentGns3Ip(topologyData.gns3_server_ip);
      }

      //if (topologyData.project_id) {
      //  const project = config.projects.find(
      //    (p) => p.project_id === topologyData.project_id
      //  );
      //  if (project) {
      //    config.setSelectedProject(project);
      //  }
      //}

      const deviceCounts = topologyData.nodes.reduce((acc: any, node: any) => {
        const deviceType = node.name.replace(/_\d+$/, "");
        const key = `${node.zone}-${deviceType}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Use config.itDevices instead of just itDevices
      config.itDevices.forEach((device) => {
        const count = deviceCounts[`IT-${device.name}`] || 0;
        config.updateDeviceCount(device.name, count, true);

        const nodeWithType = topologyData.nodes.find(
          (n: any) => n.zone === "IT" && n.name.startsWith(device.name)
        );
        if (nodeWithType?.template_id) {
          config.updateDeviceTemplate(device.name, nodeWithType.template_id, true);
        }
      });

      config.otDevices.forEach((device) => {
        const count = deviceCounts[`OT-${device.name}`] || 0;
        config.updateDeviceCount(device.name, count, false);

        const nodeWithType = topologyData.nodes.find(
          (n: any) => n.zone === "OT" && n.name.startsWith(device.name)
        );
        if (nodeWithType?.template_id) {
          config.updateDeviceTemplate(device.name, nodeWithType.template_id, false);
        }
      });

      const firewallCount = deviceCounts["DMZ-Firewall"] || 0;
      const firewallNode = topologyData.nodes.find((n: any) =>
        n.name.startsWith("Firewall")
      );

      config.setFirewallConfig((prev: any) => ({
        ...prev,
        count: firewallCount,
        ...(firewallNode?.template_id && {
          templateId: firewallNode.template_id,
        }),
      }));

      saveActiveScenario(topologyData, name);
      alert(`Successfully loaded topology: ${name}`);
    } catch (err) {
      console.error("Failed to load topology:", err);
      alert(
        `Failed to load topology: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleExportTopology = async (id: string) => {
    try {
      const topology = await fetchTopologyById(id);
      downloadJSON(topology.scenario);
    } catch (err) {
      console.error("Failed to export topology:", err);
      alert("Failed to export topology. Please try again.");
    }
  };

  const handleDownloadJSON = () => {
    const scenario = generateTopologyJSON(
      config.currentGns3Ip,
      config.itDevices,
      config.otDevices,
      config.firewallConfig,
      config.templates,
      config.selectedProject
    );
    downloadJSON(scenario);
  };

  const handleBuildJSON = async () => {          
    // If there are created servers, build on all of them
    if (config.createdServers.length > 0) {
      const buildPromises = config.createdServers.map(async (serverIp) => {
        try {
          // Generate topology JSON with the specific server IP
          const scenario = generateTopologyJSON(
            serverIp, // Use each server IP
            config.itDevices,
            config.otDevices,
            config.firewallConfig,
            config.templates,
            config.selectedProject
          );

          const response = await buildScenario(
            scenario,
            serverIp, // Use the same server IP
            config.startScenario
          );
          
          if (response) {
            const scenarioName = `Built Scenario - ${serverIp} - ${new Date().toLocaleString()}`;
            saveActiveScenario(scenario, scenarioName);
            console.log(`Successfully built scenario on ${serverIp}`);
            return { ip: serverIp, success: true };
          } else {
            console.error(`Failed to build scenario on ${serverIp}`);
            return { ip: serverIp, success: false };
          }
        } catch (error) {
          console.error(`Failed to build scenario on ${serverIp}:`, error);
          return { 
            ip: serverIp, 
            success: false, 
            error: error instanceof Error ? error.message : 'Build failed' 
          };
        }
      });

      const results = await Promise.all(buildPromises);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      alert(
        `Scenario build complete!\n` +
        `✓ Success: ${successCount}/${config.createdServers.length}\n` +
        `✗ Failed: ${failCount}\n\n` +
        `You can now deploy scripts to the nodes.`
      );
    } else {
      // Original behavior: build on single currentGns3Ip
      const scenario = generateTopologyJSON(
        config.currentGns3Ip,
        config.itDevices,
        config.otDevices,
        config.firewallConfig,
        config.templates,
        config.selectedProject
      );

      const response = await buildScenario(
        scenario,
        config.currentGns3Ip,
        config.startScenario
      );

      if (response) {
        const scenarioName = `Built Scenario - ${new Date().toLocaleString()}`;
        saveActiveScenario(scenario, scenarioName);
        alert(
          "Scenario built successfully! You can now deploy scripts to the nodes."
        );
      }
    }
  };


  return {
    handleSaveJSON,
    handleLoadTopology,
    handleExportTopology,
    handleDownloadJSON,
    handleBuildJSON,
  };
};