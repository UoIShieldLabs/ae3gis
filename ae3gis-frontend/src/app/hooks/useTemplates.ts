import { useState, useEffect } from "react";
import { Template } from "../types/topology";

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/gns3/templates");
        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Failed to fetch templates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const getTemplateId = (templateName: string): string => {
    if (!templateName) return templates[0]?.template_id || "";
    const matchingTemplate = templates.find((t) => t.name === templateName);
    return matchingTemplate?.template_id || templates[0]?.template_id || "";
  };

  return { templates, loading, error, getTemplateId };
};
