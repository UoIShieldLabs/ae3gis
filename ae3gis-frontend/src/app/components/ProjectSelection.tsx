// components/ProjectSelector.tsx
import React from "react";

export type Project = {
  project_name: string;
  name: string;
};

interface ProjectSelectorProps {
  /**
   * Current project object
   */
  project: Project;
  
  /**
   * Callback to update project (sets both project_name and name)
   */
  setProject: (project: Project) => void;
  
  /**
   * Optional custom className for the container
   */
  className?: string;
  
  /**
   * Optional label text
   */
  label?: string;
  
  /**
   * Optional placeholder text
   */
  placeholder?: string;
  
  /**
   * Make the selector compact (no background card)
   */
  compact?: boolean;
  
  /**
   * Disable the input
   */
  disabled?: boolean;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  project,
  setProject,
  className = "",
  label = "Project Name:",
  placeholder = "Enter project name...",
  compact = false,
  disabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setProject({
      project_name: newName,
      name: newName,
    });
  };

  // Compact version (no card wrapper)
  if (compact) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
        <input
          type="text"
          value={project.name}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] 
            rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
            focus:border-indigo-500 min-w-[200px]
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>
    );
  }

  // Full version with card wrapper
  return (
    <div className={`mb-8 bg-[#2a2a3e] rounded-lg p-6 border border-[#3a3a4e] ${className}`}>
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Project Selection
      </h2>
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
        <input
          type="text"
          value={project.name}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            px-3 py-2 bg-[#252535] text-gray-200 border border-[#3a3a4e] 
            rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
            focus:border-indigo-500 min-w-[250px]
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>
    </div>
  );
};

export default ProjectSelector;