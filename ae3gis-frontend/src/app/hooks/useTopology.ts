import { useState, useEffect, useCallback } from "react";

// Topology list item (from LIST endpoint - no scenario data)
export interface TopologyListItem {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Full topology (from GET endpoint - includes scenario data)
export interface Topology extends TopologyListItem {
  scenario: any;
}

export function useTopologies() {
  const [topologies, setTopologies] = useState<TopologyListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all topologies (LIST - metadata only)
  const fetchTopologies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/gns3/get-topology", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch topologies");
      }

      const data = await response.json();
      setTopologies(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch topologies";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single topology by ID (GET - includes scenario data)
  const fetchTopologyById = async (id: string): Promise<Topology> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/gns3/get-topology/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch topology");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch topology";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new topology
  const createTopology = async (
    name: string,
    scenario: any,
    description: string = ""
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/gns3/save-topology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, scenario }),
      });

      if (!response.ok) {
        throw new Error("Failed to create topology");
      }

      const data = await response.json();

      // Refresh the list after creating
      await fetchTopologies();

      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create topology";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update topology
  const updateTopology = async (
    id: string,
    updates: { name?: string; description?: string; scenario?: any }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/gns3/update-topology/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update topology");
      }

      const data = await response.json();

      // Refresh the list after updating
      await fetchTopologies();

      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update topology";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete topology
  const deleteTopology = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/gns3/delete-topology/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete topology");
      }

      // Refresh the list after deleting
      await fetchTopologies();

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete topology";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load topologies on mount
  useEffect(() => {
    fetchTopologies();
  }, [fetchTopologies]);

  return {
    topologies,
    loading,
    error,
    createTopology,
    updateTopology,
    deleteTopology,
    fetchTopologyById,
    refreshTopologies: fetchTopologies,
  };
}
