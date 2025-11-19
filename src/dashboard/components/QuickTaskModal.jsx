import React, { useState } from "react";
import { createTask, deleteTaskById, createSubtask } from "../../utils/Api";



const QuickAddTaskModal = ({ 
  open, 
  handleClose, 
  selectedDateTime, 
  colors 
}) => {
  const [quickTitle, setQuickTitle] = useState("");
  const [quickReminder, setQuickReminder] = useState("");
  const [quickSubtasks, setQuickSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");

 

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setQuickSubtasks([...quickSubtasks, { title: newSubtask }]);
    setNewSubtask("");
  };

  const handleSave = async () => {
    if (!quickTitle) {
      alert("Please enter a title!");
      return;
    }

    try {
      // create the main task
      const newTask = await createTask({
        title: quickTitle,
        due_date: selectedDateTime,
        reminder_time: quickReminder || null,
        priority: "Low", // default or choose another
        progress: 0,
      });

      // create subtasks
      for (const subtask of quickSubtasks) {
        await createSubtask({ taskId: newTask.id, title: subtask.title });
      }

      // update context or refresh
      addTask && addTask(newTask);
      alert("Quick task added!");
      handleClose();
    } catch (error) {
      console.error("Error creating quick task:", error);
      alert("Failed to create quick task.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        style={{ backgroundColor: colors.background.default }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-3 text-[#6F2DA8]">Quick Add Task</h2>

        {/* Task title */}
        <input
          type="text"
          placeholder="Task title"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md mb-3 text-black"
        />

        {/* Reminder time */}
        <input
          type="time"
          value={quickReminder}
          onChange={(e) => setQuickReminder(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md mb-3 text-black"
        />

        {/* Subtasks */}
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Enter subtask"
              className="flex-1 p-2 border border-gray-200 rounded-md text-black"
            />
            <button
              onClick={handleAddSubtask}
              className="bg-[#6F2DA8] text-white px-3 py-2 rounded-md"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 text-sm text-gray-600">
            {quickSubtasks.map((subtask, i) => (
              <li key={i}>• {subtask.title}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#6F2DA8] text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddTaskModal;
