import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, PlayCircle, AlertCircle, CheckCircle } from 'lucide-react';

const AVAILABLE_SCRIPTS = [
  'hi.sh',
  'hello.sh',
  'run_dhcp.sh',
  'run_dhcp_client.sh',
  'run_http.sh',
  'run_server.sh',
];

interface ScriptConfig {
  id: string;
  node_name: string;
  local_path: string;
  remote_path: string;
  run_after_upload: boolean;
  executable: boolean;
  overwrite: boolean;
  run_timeout: number;
  shell: string;
}

interface Device {
  name: string;
  count: number;
}

interface FirewallConfig {
  count: number;
}

interface ScriptDeploymentProps {
  itDevices?: Device[];
  otDevices?: Device[];
  firewallConfig?: FirewallConfig;
  gns3ServerIp?: string;
  createdServers?: string[];
}

const ScriptDeployment: React.FC<ScriptDeploymentProps> = ({ 
  itDevices = [],
  otDevices = [],
  firewallConfig = { count: 0 },
  gns3ServerIp,
  createdServers = []
}) => {
  const [scripts, setScripts] = useState<ScriptConfig[]>([]);
  const [concurrency, setConcurrency] = useState(5);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Generate nodes from devices
  const generateNodes = () => {
    const nodes: Array<{ node_id: string; name: string }> = [];

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

  const nodes = generateNodes();

  // Add initial empty script configuration
  useEffect(() => {
    if (scripts.length === 0) {
      addScript();
    }
  }, []);

  const addScript = () => {
    const newScript: ScriptConfig = {
      id: `script_${Date.now()}`,
      node_name: nodes.length > 0 ? nodes[0].name : '',
      local_path: AVAILABLE_SCRIPTS[0],
      remote_path: AVAILABLE_SCRIPTS[0],
      run_after_upload: true,
      executable: true,
      overwrite: true,
      run_timeout: 10,
      shell: 'sh'
    };
    setScripts([...scripts, newScript]);
  };

  const removeScript = (id: string) => {
    setScripts(scripts.filter(script => script.id !== id));
  };

  const updateScript = (id: string, updates: Partial<ScriptConfig>) => {
    setScripts(scripts.map(script => 
      script.id === id ? { ...script, ...updates } : script
    ));
  };

  const handleDeploy = async () => {
    if (scripts.length === 0) {
      setDeploymentStatus('error');
      setStatusMessage('No scripts configured for deployment');
      return;
    }

    // Validate all scripts have node names
    const missingNodes = scripts.filter(s => !s.node_name);
    if (missingNodes.length > 0) {
      setDeploymentStatus('error');
      setStatusMessage('All scripts must have a node selected');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('idle');
    setStatusMessage('');
    for (const serverIp of createdServers) {
      const deploymentPromises = createdServers.map(async (serverIp) => {
        try {
          const payload = {
            scripts: scripts.map(({ id, ...script }) => script),
            gns3_server_ip: serverIp,
            concurrency
          };

          console.log('Deploying scripts to', serverIp, ':', payload);

          const response = await fetch('/api/gns3/push-script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error(`Deployment to ${serverIp} failed: ${response.statusText}`);
          }

          const result = await response.json();
          console.log('Deployment result for', serverIp, ':', result);
          return { serverIp, success: true, result };
        } catch (error) {
          console.error('Deployment error for', serverIp, ':', error);
          return { 
            serverIp, 
            success: false, 
            error: error instanceof Error ? error.message : 'Deployment failed' 
          };
        }
      });

      try {
        const results = await Promise.all(deploymentPromises);
        
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;
        
        if (failCount === 0) {
          setDeploymentStatus('success');
          setStatusMessage(`Successfully deployed ${scripts.length} script(s) to all ${createdServers.length} servers`);
        } else if (successCount === 0) {
          setDeploymentStatus('error');
          setStatusMessage(`Failed to deploy to all ${createdServers.length} servers`);
        } else {
          setDeploymentStatus('warning');
          setStatusMessage(`Deployed to ${successCount}/${createdServers.length} servers. ${failCount} failed.`);
        }
        
        console.log('All deployment results:', results);
      } catch (error) {
        setDeploymentStatus('error');
        setStatusMessage('Deployment failed');
        console.error('Deployment error:', error);
      } finally {
        setIsDeploying(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Script Deployment
        </h1>
        <p className="text-gray-400">
          Deploy and execute scripts on network nodes ({nodes.length} nodes available)
        </p>
      </div>

      {/* Global Configuration */}
      <div className="mb-6 bg-[#2a2a3e] rounded-lg p-6 border border-[#3a3a4e]">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Deployment Settings
        </h2>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Concurrency Level
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={concurrency}
            onChange={(e) => setConcurrency(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Script Configurations */}
      <div className="mb-6 space-y-4">
        {scripts.map((script) => (
          <div 
            key={script.id}
            className="bg-[#2a2a3e] rounded-lg p-6 border border-[#3a3a4e]"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">
                Push Scripts
              </h3>
              <button
                onClick={() => removeScript(script.id)}
                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                title="Remove script"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Node Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Node
                </label>
                <select
                  value={script.node_name}
                  onChange={(e) => updateScript(script.id, { node_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {nodes.length === 0 ? (
                    <option value="">No nodes available</option>
                  ) : (
                    nodes.map((node) => (
                      <option key={node.node_id} value={node.name}>
                        {node.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Script Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Script File
                </label>
                <select
                  value={script.local_path}
                  onChange={(e) => updateScript(script.id, { 
                    local_path: e.target.value,
                    remote_path: e.target.value 
                  })}
                  className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {AVAILABLE_SCRIPTS.map((scriptName) => (
                    <option key={scriptName} value={scriptName}>
                      {scriptName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remote Path */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remote Path
                </label>
                <input
                  type="text"
                  value={script.remote_path}
                  onChange={(e) => updateScript(script.id, { remote_path: e.target.value })}
                  className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Timeout */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Run Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={script.run_timeout}
                  onChange={(e) => updateScript(script.id, { run_timeout: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={script.run_after_upload}
                  onChange={(e) => updateScript(script.id, { run_after_upload: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 bg-[#252535] border-[#3a3a4e] rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-300">Run After Upload</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={script.executable}
                  onChange={(e) => updateScript(script.id, { executable: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 bg-[#252535] border-[#3a3a4e] rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-300">Make Executable</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={script.overwrite}
                  onChange={(e) => updateScript(script.id, { overwrite: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 bg-[#252535] border-[#3a3a4e] rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-300">Overwrite Existing</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Add Script Button */}
      <div className="mb-6">
        <button
          onClick={addScript}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-green-900 border border-green-50 rounded-lg hover:bg-green-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Script</span>
        </button>
      </div>

      {/* Status Message */}
      {deploymentStatus !== 'idle' && (
        <div className={`mb-6 p-4 rounded-lg border ${
          deploymentStatus === 'success' 
            ? 'bg-green-900/20 border-green-500/50' 
            : 'bg-red-900/20 border-red-500/50'
        }`}>
          <div className="flex items-center space-x-2">
            {deploymentStatus === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={deploymentStatus === 'success' ? 'text-green-400' : 'text-red-400'}>
              {statusMessage}
            </span>
          </div>
        </div>
      )}

      {/* Deploy Button */}
      <div className="flex justify-center">
        <button
          onClick={handleDeploy}
          disabled={isDeploying || scripts.length === 0}
          className={`flex items-center space-x-2 px-8 py-3 font-medium rounded-lg shadow-lg transition-colors ${
            isDeploying || scripts.length === 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-500'
          }`}
        >
          {isDeploying ? (
            <>
              <Upload className="w-5 h-5 animate-pulse" />
              <span>Deploying...</span>
            </>
          ) : (
            <>
              <PlayCircle className="w-5 h-5" />
              <span>Deploy Scripts</span>
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-[#252535] rounded-lg border border-[#3a3a4e]">
        <p className="text-sm text-gray-400">
          <span className="font-semibold">Note:</span> Scripts will be uploaded and executed on the selected nodes. 
          Ensure the GNS3 server and nodes are running before deployment.
        </p>
      </div>
    </div>
  );
};

export default ScriptDeployment;