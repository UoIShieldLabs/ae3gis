import { useState } from "react";
import { generateTopologyJSON } from "../utils/topologyGenerator";

export type Topology = ReturnType<typeof generateTopologyJSON>;

export const useBuildScenario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const buildScenario = async (
    scenario: Topology,
    gns3Ip: string,
    startNodes: boolean
  ) => {
    try {
      setLoading(true);
      setError(null);

      const apiRequest = {
        base_url: `http://${gns3Ip}`,
        start_nodes: startNodes,
        scenario,
      };

      console.log("Payload to AE3GIS:", apiRequest);
      const response = await fetch("/api/gns3/build-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to build scenario: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Build scenario error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    buildScenario, // function you call
    loading,
    error,
    result,
  };
};
