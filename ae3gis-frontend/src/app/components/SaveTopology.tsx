import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface SaveScenarioSectionProps {
  onSave: (name: string, description: string) => void;
  loading?: boolean;
}

const SaveScenarioSection: React.FC<SaveScenarioSectionProps> = ({ 
  onSave, 
  loading = false 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, description);
      // Optionally clear the fields after save
      // setName('');
      // setDescription('');
    }
  };

  return (
    <div className="bg-[#2a2a3e] rounded-lg p-6 border border-[#3a3a4e]">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Save Topology
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Scenario Topology <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., IT-OT Network v1"
            disabled={loading}
            className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this scenario..."
            rows={3}
            disabled={loading}
            className="w-full px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:opacity-50"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading || !name.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Save className="w-4 h-4 animate-pulse" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Scenario</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveScenarioSection;