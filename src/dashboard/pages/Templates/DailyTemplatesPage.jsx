import React, { useEffect, useState } from "react";
import {
  fetchDailyTemplates,
  createDailyTemplates,
  deleteTemplatesById,
} from "../../../utils/Api"; // adjust path
import DailyTemplateDetail from "./DailyTemplateDetail";

export default function DailyTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await fetchDailyTemplates();
    setTemplates(data);
  };

  const addTemplate = async () => {
    if (!newTemplate.trim()) return;
    const template = await createDailyTemplates({ title: newTemplate });
    setTemplates([...templates, template]);
    setNewTemplate("");
  };

  const deleteTemplate = async (id) => {
    await deleteTemplatesById(id);
    setTemplates(templates.filter((t) => t.id !== id));
    if (selectedTemplate?.id === id) setSelectedTemplate(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daily Templates</h1>

      {/* Add new template */}
      <div className="flex space-x-2 mb-6">
        <input
          value={newTemplate}
          onChange={(e) => setNewTemplate(e.target.value)}
          placeholder="New template name..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          onClick={addTemplate}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>

      {/* Templates list */}
      <ul className="space-y-2">
        {templates.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center p-3 border rounded"
          >
            <button
              onClick={() => setSelectedTemplate(t)}
              className="text-left flex-1 font-medium"
            >
              {t.name}
            </button>
            <button
              onClick={() => deleteTemplate(t.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Show template detail */}
      {selectedTemplate && (
        <div className="mt-8">
          <DailyTemplateDetail template={selectedTemplate} />
        </div>
      )}
    </div>
  );
}
