import { useState } from "react";

interface Student {
  student_id: string;
  student_number: number;
}

interface ServerInfo {
  student_name: string;
  ip: string;
}

interface CreateServersResponse {
  server_list: ServerInfo[];
}

export const useCreateServers = () => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdServers, setCreatedServers] = useState<ServerInfo[]>([]);

  const createServers = async (students: Student[]) => {
    try {
      setCreating(true);
      setError(null);
      
      const response = await fetch("/api/gns3/create-servers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create servers");
      }

      const data: CreateServersResponse = await response.json();
      setCreatedServers(data.server_list);
      return data.server_list;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Failed to create servers:", err);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  return {
    creating,
    error,
    createdServers,
    createServers,
  };
};