import { CheckSquare, Square, CalendarDays, Edit, Trash2, MoreVertical } from 'lucide-react';
import PropTypes from 'prop-types';
import { updateTaskStatus } from "../../../utils/Api";
import { TasksContext } from '../../../context/TasksContext';

import { useState, useContext } from 'react';

const TaskItem = ({ task }) => {
  const [checked, setChecked] = useState(task.status === "completed");
  const { setTasks } = useContext(TasksContext);
  const handleTaskCompletion = async () => {
    try {
      const newStatus = checked ? "pending" : "completed";
      const taskId = task.id;

      //optimistic UI update
      setChecked(!checked);

      await updateTaskStatus(taskId, { status: newStatus });

       // Update local tasks state
       setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
        // If your pie chart depends on tasks state, it'll auto-update!
    } catch (error) {
      console.error("Error updating task status:", error);
      // Rollback if needed
      setChecked(checked); // Reset to previous state on error
    }
  };

  return (
    <div className="flex items-start gap-2">
      {/* Checkbox */}
      <div
        className=" mt-14 cursor-pointer"
        onClick={handleTaskCompletion}
      >
        {checked ? (
          <CheckSquare className="text-purple-400" size={18} />
        ) : (
          <Square className="text-gray-400" size={18} />
        )}
      </div>

      {/* Task Card */}
      <div className="w-full bg-purple-50 p-4 rounded-xl shadow-sm">
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-medium text-base text-gray-900">{task.title || 'Task title'}</h2>
            <p className="text-xs flex items-center gap-1 text-gray-600 mt-1">
              📝 {task.subtasksCompleted}/{task.totalSubtasks}
            </p>
          </div>

          {/* Status and Menu */}
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-700">Status: {checked ? "Completed" : task.status}</span>
            <MoreVertical size={18} className="text-gray-600" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mt-2">{task.description || 'Description'}</p>

        {/* Bottom Row */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarDays size={16} />
            {task.timeline || 'Timeline'}
          </div>

          <div className="flex items-center gap-3">
            <button className="text-gray-700 hover:text-purple-600">
              <Edit size={18} />
            </button>
            <button className="text-gray-700 hover:text-red-600">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    subtasksCompleted: PropTypes.number,
    totalSubtasks: PropTypes.number,
    status: PropTypes.string,
    description: PropTypes.string,
    timeline: PropTypes.string,
  }).isRequired,
};

export default TaskItem;
