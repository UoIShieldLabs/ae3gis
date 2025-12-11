import React from "react";
import { Download, Upload, Trash2 } from "lucide-react";

interface TopologyListItemData {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface TopologyListItemProps {
  topology: TopologyListItemData;
  onLoad: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export const TopologyListItem: React.FC<TopologyListItemProps> = ({
  topology,
  onLoad,
  onExport,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-[#333347] rounded-lg p-4 border border-[#3a3a4e] hover:border-indigo-500/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100 mb-1">
            {topology.name}
          </h3>
          {topology.description && (
            <p className="text-sm text-gray-400 mb-2">{topology.description}</p>
          )}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Created: {formatDate(topology.created_at)}</span>
            <span>Updated: {formatDate(topology.updated_at)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onLoad}
            className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-500 transition-colors flex items-center space-x-1"
            title="Load this topology"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Load</span>
          </button>

          <button
            onClick={onExport}
            className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500 transition-colors flex items-center space-x-1"
            title="Export as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-500 transition-colors flex items-center space-x-1"
            title="Delete this topology"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
