import React, { useState } from "react";

export default function ActivityForm({ onSave, onCancel, initialData }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [completed, setCompleted] = useState(initialData?.completed || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, completed });
    setTitle("");
    setCompleted(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-white rounded border shadow space-y-2"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Activity title..."
        className="w-full border rounded px-2 py-1"
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        <span>Completed</span>
      </label>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
