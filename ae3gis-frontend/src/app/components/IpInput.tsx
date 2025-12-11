import React, { useState } from "react";

interface ManualIpAdderProps {
  onIpsAdded: (ips: string[]) => void;
  currentIps: string[];
}

export const ManualIpAdder: React.FC<ManualIpAdderProps> = ({ onIpsAdded, currentIps }) => {
  const [ipInput, setIpInput] = useState("");

  const handleAddIp = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedIp = ipInput.trim();
    if (!trimmedIp) return;

    // Basic IP validation (optional)
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(trimmedIp)) {
      alert("Please enter a valid IP address (e.g., 192.168.1.1)");
      return;
    }

    // Check if IP already exists
    if (currentIps.includes(trimmedIp)) {
      alert("This IP is already in the list");
      return;
    }

    onIpsAdded([...currentIps, trimmedIp]);
    setIpInput("");
  };

  const handleRemoveIp = (ipToRemove: string) => {
    onIpsAdded(currentIps.filter(ip => ip !== ipToRemove));
  };

  const handleClearAll = () => {
    onIpsAdded([]);
  };

  return (
    <div className="mb-8 bg-[#2a2a3e] rounded-lg p-6 border border-[#3a3a4e]">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Manual IP Management
      </h2>

      {/* Add IP Form */}
      <form onSubmit={handleAddIp} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="Enter IP address (e.g., 192.168.1.1)"
            className="flex-1 px-4 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
          >
            Add IP
          </button>
        </div>
      </form>

      {/* Current IPs List */}
      {currentIps.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-300">
              Server IPs ({currentIps.length})
            </h3>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="border border-[#3a3a4e] rounded-lg divide-y divide-[#3a3a4e]">
            {currentIps.map((ip, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-[#252535] hover:bg-[#2a2a45] transition-colors"
              >
                <code className="text-indigo-400 font-mono text-sm">
                  {ip}
                </code>
                <button
                  onClick={() => handleRemoveIp(ip)}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualIpAdder;