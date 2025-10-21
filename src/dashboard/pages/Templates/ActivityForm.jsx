import React, { useState, useEffect, useContext } from "react";
import { fetchTasks } from "../../../utils/Api"; // only tasks for now
import { GoalsContext } from "../../../context/GoalsContext";
import { color } from "framer-motion";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import SlidingButton2 from '../../components/SlidingButton2';
import { Divider } from '@mui/material';


export default function ActivityForm({ onSave, onCancel, initialData }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [title, setTitle] = useState(initialData?.title || "");
  const [startTime, setStartTime] = useState(initialData?.start_time || "");
  const [endTime, setEndTime] = useState(initialData?.end_time || "");
  const [type, setType] = useState("task");
  const [selectedPeriod, setSelectedPeriod] = useState('Add from collection');
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
    console.log("Save button clicked");
    let finalTitle = title;

    if (type === "task" && selected) {
      const selectedTask = options.find((opt) => opt.id === parseInt(selected));
      finalTitle = selectedTask?.title || title;
    }

    if (type === "ai_subtask" && selected) {
      const selectedSubtask = recommendations.find(
        (r) => r.subtask.id === parseInt(selected)
      );
      finalTitle = selectedSubtask?.subtask.title || title;
    }

    if (!finalTitle.trim()) return;

    const payload = {
      title: finalTitle,
      start_time: startTime,
      end_time: endTime,
      task: type === "task" ? selected || null : null,
      subtask: null, // no API yet
      ai_subtask: type === "ai_subtask" ? selected || null : null,
    };

    onSave(payload);

    // reset form
    setTitle("");
    setStartTime("");
    setEndTime("");
    setSelected("");
  };

  return (
   <div className="h-screen w-full p-4 md:p-0 max-h-10/12 h-full  flex justify-center items-center  md:items-start">
     <form
      onSubmit={handleSubmit}
      className="  p-4 pb-6 md:h-screen w-full h-9/12 max-h-10/12 relative rounded-xl space-y-3"
      style={{
        color: colors.text.primary,
        backgroundColor: colors.background.paper,
      }}
    >
      <div className="w-full flex justify-center mb-8 items-center">
        <SlidingButton2
          options={["Add from collection", "Add new task"]}
          selected={selectedPeriod}
          onChange={setSelectedPeriod}
        />
      </div>

     <div className="relative  p-4 md:h-10/12 h-10/12 rounded-xl" style={{backgroundColor: colors.background.default}}>
       <p
        className="w-full mb-1 font-semibold text-lg"
        style={{ color: colors.text.secondary }}
      >
        {selectedPeriod}
      </p>

       <Divider orientation="horizontal" sx={{ borderColor: "#767676", opacity: 0.8 }} />

      {/* Conditionally render sections */}
      {selectedPeriod === "Add from collection" ? (
        <>
          <div className="mb-2 mt-4">
            <label className="block mb-2">Link Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="task">Task</option>
              <option value="ai_subtask">AI Subtask</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block mb-2 capitalize">Select {type}</label>
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
        </>
      ) : (
        <div className="mb-2 mt-4">
          <label className="block mb-2">Activity Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new task title..."
            className="w-full border rounded px-2 py-1"
          />
        </div>
      )}

      <div className="flex w-full space-x-2 mb-2">
        <div className="w-1/2">
          <label className="block mb-2">Start time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="w-1/2">
          <label className="block mb-2">End time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div className="flex p-4  absolute inset-x-0 bottom-4 justify-center w-full  space-x-4">
        <button
          type="submit"
          className="  w-1/2  cursor-pointer  text-white px-3 py-1 rounded-md"
          style={{backgroundColor: colors.primary[500]}}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="block  w-1/2   md:hidden border px-3 py-1 rounded-md"
          style={{borderColor: colors.primary[500], color: colors.text.secondary}}
        >
          Cancel
        </button>
      </div>
     </div>
    </form>
   </div>
  );
}