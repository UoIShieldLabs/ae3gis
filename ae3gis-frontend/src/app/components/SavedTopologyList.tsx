import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTopologies, TopologyListItem } from "../hooks/useTopology";
import { TopologyListItem as TopologyCard } from "./ScenarioListItem";

interface SavedTopologyListProps {
  onLoad: (id: string, name: string) => Promise<void>;
  onExport: (id: string, name: string) => Promise<void>;
}

const SavedTopologyList: React.FC<SavedTopologyListProps> = ({
  onLoad,
  onExport,
}) => {
  const [showSavedTopologies, setShowSavedTopologies] = useState(false);
  const { topologies, loading, error, deleteTopology } = useTopologies();

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteTopology(id);
      alert("Topology deleted successfully!");
    } catch (err) {
      console.error("Failed to delete topology:", err);
      alert("Failed to delete topology. Please try again.");
    }
  };

  if (loading && !topologies.length) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-300">Loading topologies...</div>
        </div>
      </div>
    );
  }

  if (error && !topologies.length) {
    return (
      <div className="mt-8">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <button
        onClick={() => setShowSavedTopologies(!showSavedTopologies)}
        className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-4"
      >
        {showSavedTopologies ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span className="text-lg font-semibold">
          Saved Topologies {topologies && `(${topologies.length})`}
        </span>
      </button>

      {showSavedTopologies && (
        <div className="bg-[#2a2a3e] rounded-lg p-6 border border-[#3a3a4e]">
          {!topologies || topologies.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No saved topologies yet. Save your first configuration above!
            </p>
          ) : (
            <div className="space-y-3">
              {topologies.map((topology) => (
                <TopologyCard
                  key={topology.id}
                  topology={topology}
                  onLoad={() => onLoad(topology.id, topology.name)}
                  onExport={() => onExport(topology.id, topology.name)}
                  onDelete={() => handleDelete(topology.id, topology.name)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedTopologyList;
