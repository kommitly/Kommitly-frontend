import React, { useState, useEffect, useContext } from "react";
import { fetchTasks } from "../../../utils/Api"; // only tasks for now
import { GoalsContext } from "../../../context/GoalsContext";
import { color } from "framer-motion";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";


export default function ActivityForm({ onSave, onCancel, initialData }) {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const [title, setTitle] = useState(initialData?.title || "");
  const [startTime, setStartTime] = useState(initialData?.start_time || "");
  const [endTime, setEndTime] = useState(initialData?.end_time || "");
  const [type, setType] = useState("task");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState("");

  // pull ai_goals from context
  const { goals } = useContext(GoalsContext);
  const aiGoals = goals.ai_goals || [];

  // helper to find next unfinished subtask
  function findNextAiSubtask(goal) {
    const inProgressTask = goal.ai_tasks?.find((t) => t.status === "in-progress");
    if (!inProgressTask) return null;

    const nextSubtask = inProgressTask.ai_subtasks?.find((st) => !st.completed_at);
    if (!nextSubtask) return null;

    return {
      goalId: goal.id,
      goalTitle: goal.title,
      taskId: inProgressTask.id,
      taskTitle: inProgressTask.title,
      subtask: nextSubtask,
    };
  }

  const recommendations = aiGoals.map(findNextAiSubtask).filter(Boolean);

  // load options only when needed
  useEffect(() => {
    if (type === "task") {
      fetchTasks().then(setOptions);
    } else {
      setOptions([]); // reset for ai_subtask since we use recommendations
    }
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      start_time: startTime,
      end_time: endTime,
      task: type === "task" ? selected : null,
      subtask: null, // no API yet
      ai_subtask: type === "ai_subtask" ? selected : null,
    };

    onSave(payload);

    // reset form
    setTitle("");
    setStartTime("");
    setEndTime("");
    setSelected("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8   rounded-xl space-y-3"
       style={{color: colors.text.primary}}
    >
      <p className="w-full mb-8 justify-center flex font-semibold text-xl">
        Add Activity
      </p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Activity title..."
        className="w-full border rounded px-2 py-1"
      />

      <div className="flex space-x-2">
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border rounded px-2 py-1 w-1/2"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border rounded px-2 py-1 w-1/2"
        />
      </div>

      <div>
        <label className="block mb-1">Link Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="task">Task</option>
          <option value="ai_subtask">AI Subtask</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 capitalize">Select {type}</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">None</option>
          {type === "ai_subtask"
            ? recommendations.map((r) => (
                <option key={r.subtask.id} value={r.subtask.id}>
                  {r.goalTitle} → {r.taskTitle} → {r.subtask.title}
                </option>
              ))
            : options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.title}
                </option>
              ))}
        </select>
      </div>

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
