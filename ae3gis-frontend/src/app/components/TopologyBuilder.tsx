import React, { useState, useEffect, useCallback  } from "react";

// Hooks
import { useTemplates } from "../hooks/useTemplates";
import { useProjects } from "../hooks/useProjects";
import { useTopologyConfig } from "../hooks/useTopologyConfig";
import { useTopologyOperations } from "../hooks/useTopologyOperations";
import { useTopologies } from "../hooks/useTopology";
import { useBuildScenario } from "../hooks/useBuild";

//types
import { Project } from "../types/topology";

// Components
import SaveScenarioSection from "./SaveTopology";
import SavedTopologyList from "./SavedTopologyList";
import ScriptDeployment from "./ScriptPusher";
import CreateServersForm from "./CreateServersForm";
import ProjectSelector from "./ProjectSelection";
import DeviceConfigurationSection from "./DeviceCountConfig";
import TopologyControls from "./BuildDownloadScenario";
import ManualIpAdder from "./IpInput";

const TopologyBuilder: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentGns3Ip, setCurrentGns3Ip] = useState<string>(
    process.env.NEXT_PUBLIC_GNS3_IP || ""
  );
  const [startScenario, setStartScenario] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project>({
    project_name: "",
    name: ""
  });
  const [createdServers, setCreatedServers] = useState<string[]>([]);

  const handleServersCreated = useCallback((servers: string[]) => {
    // Append currentGns3Ip to the created servers list
    if (currentGns3Ip && !servers.includes(currentGns3Ip)) {
      setCreatedServers([currentGns3Ip, ...servers]);
    } else {
      setCreatedServers(servers);
    }
  }, [currentGns3Ip]);

  // Custom hooks
  const {
    templates,
    loading: templatesLoading,
    error: templatesError,
  } = useTemplates();

  //const {
  //  projects,
  //  selectedProject,
  //  setSelectedProject,
  //  loading: projectsLoading,
  //  error: projectsError,
  //} = useProjects();

  const {
    itDevices,
    otDevices,
    firewallConfig,
    setFirewallConfig,
    updateDeviceCount,
    updateDeviceTemplate,
    removeDevice,
    addDevice,
  } = useTopologyConfig(templates);

  const { loading: saveLoading } = useTopologies();
  const { loading: buildLoading } = useBuildScenario();

    const {
    handleSaveJSON,
    handleLoadTopology,
    handleExportTopology,
    handleDownloadJSON,
    handleBuildJSON,
  } = useTopologyOperations({
    currentGns3Ip,
    setCurrentGns3Ip,
    itDevices,
    otDevices,
    firewallConfig,
    setFirewallConfig,
    templates,
    selectedProject,
    setSelectedProject,
    updateDeviceCount,
    updateDeviceTemplate,
    startScenario,
    createdServers,
  });



  if (templatesLoading ) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  if (templatesError ) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <div className="text-red-400">
            Error: {templatesError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Network Topology Builder
        </h1>
        <p className="text-gray-400">
          Configure and generate GNS3 network topologies
        </p>
      </div>

      <CreateServersForm onServersCreated={handleServersCreated} />

      <ManualIpAdder 
      currentIps={createdServers}
      onIpsAdded={setCreatedServers}
      />
      
      <ProjectSelector 
        project={selectedProject}
        setProject={setSelectedProject}
        compact={false}
      />
      

      <DeviceConfigurationSection
        itDevices={itDevices}
        otDevices={otDevices}
        firewallConfig={firewallConfig}
        setFirewallConfig={setFirewallConfig}
        updateDeviceCount={updateDeviceCount}
        updateDeviceTemplate={updateDeviceTemplate}
        removeDevice={removeDevice}
        addDevice={addDevice}
        templates={templates}
        showAdvanced={showAdvanced}
        toggleAdvanced={() => setShowAdvanced(!showAdvanced)}
      />


      <TopologyControls
        buildLoading={buildLoading}
        startScenario={startScenario}
        onStartScenarioChange={setStartScenario}
        onDownload={handleDownloadJSON}
        onBuild={handleBuildJSON}
      />

      {/* Save Topology Section */}
      <div className="mt-8">
        <SaveScenarioSection onSave={handleSaveJSON} loading={saveLoading} />
      </div>

      {/* Saved Topologies List */}
      <SavedTopologyList
        onLoad={handleLoadTopology}
        onExport={handleExportTopology}
      />

      {/* Script Deployment Section */}
      <div className="mt-12">
      <div className="mt-12">
      <ScriptDeployment
        itDevices={itDevices}
        otDevices={otDevices}
        firewallConfig={firewallConfig}
        gns3ServerIp={currentGns3Ip}
        createdServers={createdServers}
      />
      </div>
      </div>
    </div>
  );
};

export default TopologyBuilder;
