"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Node, Project } from "../types/topology";

interface ActiveScenario {
  name: string;
  nodes: Node[];
  gns3_server_ip: string;
  project_id: string;
}

interface ScriptConfig {
  node_name: string;
  local_path: string;
  remote_path: string;
  run_after_upload: boolean;
  executable: boolean;
  overwrite: boolean;
  run_timeout: number;
  shell: string;
}

interface DeploymentPayload {
  scripts: ScriptConfig[];
  gns3_server_ip: string;
  concurrency: number;
}

const TestPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>("");
  const [localPath, setLocalPath] = useState<string>("");
  const [remotePath, setRemotePath] = useState<string>("");
  const [gns3ServerIp, setGns3ServerIp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeScenario, setActiveScenario] = useState<ActiveScenario | null>(
    null
  );

  // Load active scenario from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("activeScenario");
    if (stored) {
      try {
        const scenario: ActiveScenario = JSON.parse(stored);
        setActiveScenario(scenario);
        if (scenario.gns3_server_ip) {
          setGns3ServerIp(scenario.gns3_server_ip);
        }
      } catch (err) {
        console.error("Failed to load active scenario:", err);
      }
    }
  }, []);

  // Extract node names from active scenario, grouped by zone
  const nodesByZone = useMemo(() => {
    if (!activeScenario?.nodes) return { IT: [], OT: [], DMZ: [] };

    return activeScenario.nodes.reduce(
      (acc, node) => {
        const zone = node.zone as keyof typeof acc;
        if (!acc[zone]) acc[zone] = [];
        acc[zone].push(node);
        return acc;
      },
      { IT: [] as Node[], OT: [] as Node[], DMZ: [] as Node[] }
    );
  }, [activeScenario]);

  // All nodes sorted by name
  const availableNodes = useMemo(() => {
    if (!activeScenario?.nodes) return [];

    return [...activeScenario.nodes].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [activeScenario]);

  const handleSubmit = async () => {
    if (!selectedNode) {
      setMessage({ type: "error", text: "Please select a node" });
      return;
    }

    if (!localPath || !remotePath) {
      setMessage({ type: "error", text: "Please fill in all paths" });
      return;
    }

    if (!gns3ServerIp) {
      setMessage({ type: "error", text: "Please enter GNS3 server IP" });
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload: DeploymentPayload = {
      scripts: [
        {
          node_name: selectedNode,
          local_path: localPath,
          remote_path: remotePath,
          run_after_upload: false,
          executable: true,
          overwrite: true,
          run_timeout: 10,
          shell: "sh",
        },
      ],
      gns3_server_ip: gns3ServerIp,
      concurrency: 5,
    };

    try {
      const res = await fetch("/api/gns3/scripts/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setMessage({
        type: "success",
        text: `Script deployed successfully to ${selectedNode}!`,
      });

      // Reset form fields
      setSelectedNode("");
      setLocalPath("");
      setRemotePath("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const getZoneBadgeColor = (zone: string): string => {
    switch (zone) {
      case "IT":
        return "bg-blue-900/30 text-blue-400 border-blue-500/50";
      case "OT":
        return "bg-orange-900/30 text-orange-400 border-orange-500/50";
      case "DMZ":
        return "bg-purple-900/30 text-purple-400 border-purple-500/50";
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-100 mb-2">
        Script Deployment
      </h1>
      <p className="text-gray-400 mb-6">
        Deploy scripts to nodes in your active scenario
      </p>

      {!activeScenario ? (
        <div className="bg-amber-900/20 border border-amber-500/50 rounded-lg p-6 mb-6">
          <h3 className="text-amber-400 font-semibold mb-2">
            ⚠️ No Active Scenario
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Please build or load a scenario first:
          </p>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Go to Topology Builder → Configure devices → Build scenario</li>
            <li>Or load a saved scenario from the Topology Builder</li>
          </ul>
        </div>
      ) : (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-400 font-semibold text-sm">
                ✓ Active Scenario
              </h3>
              <p className="text-gray-300 text-sm mt-1">
                {activeScenario.name}
              </p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <div>{availableNodes.length} nodes available</div>
              {activeScenario.project_id && (
                <div className="mt-1">Project: {activeScenario.project_id}</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#2a2a3e] rounded-lg p-6 border border-[#3a3a4e] space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            GNS3 Server IP
          </label>
          <input
            type="text"
            value={gns3ServerIp}
            onChange={(e) => setGns3ServerIp(e.target.value)}
            placeholder="192.168.56.102"
            className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Node
            {availableNodes.length > 0 && (
              <span className="ml-2 text-xs text-gray-500">
                ({availableNodes.length} available)
              </span>
            )}
          </label>
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            disabled={!activeScenario}
            className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" className="bg-[#252535]">
              -- Select a Node --
            </option>
            {availableNodes.length === 0 ? (
              <option value="" disabled className="bg-[#252535] text-gray-500">
                No nodes in active scenario
              </option>
            ) : (
              <>
                {nodesByZone.IT.length > 0 && (
                  <optgroup label="IT Network" className="bg-[#252535]">
                    {nodesByZone.IT.map((node) => (
                      <option
                        key={node.node_id}
                        value={node.name}
                        className="bg-[#252535]"
                      >
                        {node.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {nodesByZone.OT.length > 0 && (
                  <optgroup label="OT Network" className="bg-[#252535]">
                    {nodesByZone.OT.map((node) => (
                      <option
                        key={node.node_id}
                        value={node.name}
                        className="bg-[#252535]"
                      >
                        {node.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {nodesByZone.DMZ.length > 0 && (
                  <optgroup label="DMZ / Security" className="bg-[#252535]">
                    {nodesByZone.DMZ.map((node) => (
                      <option
                        key={node.node_id}
                        value={node.name}
                        className="bg-[#252535]"
                      >
                        {node.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Local Path
            <span className="ml-2 text-xs text-gray-500">
              (path on your local machine)
            </span>
          </label>
          <input
            type="text"
            value={localPath}
            onChange={(e) => setLocalPath(e.target.value)}
            placeholder="/path/to/script.sh"
            disabled={!activeScenario}
            className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Remote Path
            <span className="ml-2 text-xs text-gray-500">
              (destination path on the node)
            </span>
          </label>
          <input
            type="text"
            value={remotePath}
            onChange={(e) => setRemotePath(e.target.value)}
            placeholder="/tmp/script.sh"
            disabled={!activeScenario}
            className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !activeScenario || availableNodes.length === 0}
          className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Deploying..." : "Deploy Script"}
        </button>
      </div>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-900/20 border border-green-500/50 text-green-400"
              : "bg-red-900/20 border border-red-500/50 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Node list grouped by zone */}
      {activeScenario && availableNodes.length > 0 && (
        <div className="mt-6 bg-[#2a2a3e] rounded-lg p-4 border border-[#3a3a4e]">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Available Nodes by Zone
          </h3>
          <div className="space-y-4">
            {Object.entries(nodesByZone).map(([zone, nodes]) => {
              if (nodes.length === 0) return null;
              return (
                <div key={zone}>
                  <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                    {zone} Network ({nodes.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {nodes.map((node) => (
                      <div
                        key={node.node_id}
                        className={`text-xs px-3 py-2 rounded border ${getZoneBadgeColor(
                          zone
                        )}`}
                      >
                        <div className="font-medium">{node.name}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">
                          ID: {node.node_id.slice(0, 8)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
