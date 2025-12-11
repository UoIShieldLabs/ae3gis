"use client";

import { useState, useEffect } from "react";
import { useCreateServers } from "../hooks/useCreateServers";

interface Student {
  student_id: string;
  student_number: number;
}

interface CreateServersFormProps {
  onServersCreated?: (ips: string[]) => void;
}

export default function CreateServersForm({ 
  onServersCreated 
}: CreateServersFormProps) {
  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const { creating, error, createdServers, createServers } = useCreateServers();

  useEffect(() => {
    if (createdServers.length > 0 && onServersCreated) {
      const ips = createdServers.map(server => server.ip);
      onServersCreated(ips);
    }
  }, [createdServers, onServersCreated]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim()) return;

    const newStudent: Student = {
      student_id: studentName.trim(),
      student_number: students.length + 1,
    };

    setStudents([...students, newStudent]);
    setStudentName("");
  };

  const handleRemoveStudent = (index: number) => {
    const updated = students.filter((_, i) => i !== index);
    // Re-number students
    const renumbered = updated.map((student, idx) => ({
      ...student,
      student_number: idx + 1,
    }));
    setStudents(renumbered);
  };

  const handleCreateServers = async () => {
    if (students.length === 0) {
      alert("Please add at least one student");
      return;
    }

    try {
      await createServers(students);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleClearAll = () => {
    setStudents([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Student Servers</h1>

      {/* Add Student Form */}
      <form onSubmit={handleAddStudent} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student ID (e.g., John)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            Add Student
          </button>
        </div>
      </form>

      {/* Students List */}
      {students.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">
              Students ({students.length})
            </h2>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg divide-y">
            {students.map((student, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 hover:bg-gray-50"
              >
                <div>
                  <span className="font-medium">#{student.student_number}</span>
                  <span className="ml-3 text-gray-700">{student.student_id}</span>
                </div>
                <button
                  onClick={() => handleRemoveStudent(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Servers Button */}
      <button
        onClick={handleCreateServers}
        disabled={creating || students.length === 0}
        className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {creating ? "Creating Servers..." : `Create ${students.length} Server${students.length !== 1 ? 's' : ''}`}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">Error:</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Created Servers Display */}
      {createdServers && createdServers.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3 text-green-700">
            ✓ Servers Created Successfully
          </h2>
          <div className="border border-green-200 rounded-lg bg-green-50 divide-y divide-green-200">
            {createdServers.map((server) => (
              <div
                key={server.student_name}
                className="p-3 flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">
                  {server.student_name}
                </span>
                <code className="px-3 py-1 text-gray-800 bg-white border border-green-300 rounded text-sm">
                  {server.ip}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}