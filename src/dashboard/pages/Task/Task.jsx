
import { useEffect, useState, useContext } from "react";
import { TasksContext } from "../../../context/TasksContext";
import PropTypes from 'prop-types';
import { Modal, Box, Typography, TextField, Button, IconButton, MenuItem } from "@mui/material";
import { CalendarToday, AccessTime, Notifications, AttachFile, PushPin, Add } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { deleteTaskById, updateSingleTaskStatus, fetchTaskById, createSubtask, updateSubtask} from "../../../utils/Api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock, FaFlag, FaTasks  } from "react-icons/fa"; // Calendar icon
import SubtaskDetails from "./Subtask";



const TaskPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { tasks, setTasks} = useContext(TasksContext);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [newSubtask, setNewSubtask] = useState("");
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [task, setTask] = useState(
      {title: "", description: "", due_date: null, reminder_time: "", priority: "Low", subtasks: []}
    );
    
    //change in task properties
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTask((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleDateChange = (date) => {
      setTask((prev) => ({
        ...prev,
        due_date: date?.toISOString(), // Convert date to string for compatibility with backend
      }));
    };

    //Fetch task by id
    useEffect(() => {

      if (!taskId) {
        console.error("Task ID is missing");
        return;
      }
    
      const fetchTask = async () => {
        try {
          const taskData = await fetchTaskById(taskId);
          console.log("Fetched task:", taskData);
    
          setTask({
            ...taskData,
            due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null, // Normalize date
            subtasks: taskData.subtasks.length > 0 ? taskData.subtasks : [], // Default to an empty array if no subtasks
          });
        } catch (error) {
          console.error("Error fetching task:", error);
        }
      };
    
      fetchTask();
    }, [taskId]);
    
    
      //update task
  const handleUpdateTask = async () => {
    try {
      const updatedTask = {
        ...task,
        subtasks: task.subtasks.map(({ name, completed }) => ({ name, completed })), // Keep subtasks structured
      };
      await updateSingleTaskStatus(task.id, task );
      console.log("Updated task:", updatedTask); // ✅ Debug updated task

  
      // ✅ Update the selected task state
      setTask((prevTask) => ({ ...prevTask, ...updatedTask }));
  
      console.log("After update, task state:", updatedTask); // Check if state updates correctly
  
      //  Update the task list state
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
      );
  
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  const SubtasksSection = ({ task, setTask }) => {
    const [newSubtask, setNewSubtask] = useState("");
    const [showInput, setShowInput] = useState(false);
  };
     // Calculate progress
const totalSubtasks = task?.subtasks?.length || 0;
const completedSubtasks = task?.subtasks?.filter((sub) => sub.completed).length || 0;
const subTaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

   // Toggle subtask completion
  const handleSubtaskToggle = async (index) => {
    try {
      const updatedSubtasks = [...task.subtasks]; 
      const subtask = updatedSubtasks[index];
      subtask.completed = !subtask.completed; // Toggle completion
  
      await updateSubtask({
        taskId: task.id, 
        subtaskId: subtask.id, 
        updatedData: { completed: subtask.completed } 
      });
  
      setTask({ ...task, subtasks: updatedSubtasks }); // Update UI after API call
    } catch (error) {
      console.error("Failed to update subtask:", error);
    }
  };
  

  const handleAddSubtask = async () => {
    if (newSubtask.trim() !== "") {
      try {
        const newSubtaskData = await createSubtask({ taskId: task.id, title: newSubtask }); // API call to create subtask
  
        const updatedSubtasks = [...(task.subtasks || []), newSubtaskData]; // Add new subtask from API response
        setTask({ ...task, subtasks: updatedSubtasks });
  
        setNewSubtask("");  // Clear input field
        setShowInput(false); // Hide input field after adding
      } catch (error) {
        console.error("Failed to add subtask:", error);
      }
    }
  };
  
   //Delete task
  const handleDeleteTask = async () => {
    try {
      await deleteTaskById(task.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  
  
  if (!task) {
    return <div className="text-center w-full mt-6 text-gray-500">Loading task details...</div>;
  } else {
    return (
      <div className="flex w-full">
        <div className="w-1/2 p-4">
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        className="w-full p-2 font-semibold mt-10  text-2xl border-none"
      />

      <div 
      className="max-w-xl ml-6  p-6 rounded-lg border bg-[#F4F1FF] border-gray-200">
      {/*<label className="text-gray-700 ">Title</label>*/}

      

      <div className="mt-4 ">
      <div className="flex items-center  space-x-2">
        {/* Description Icon */}
        <FaTasks className="text-gray-500" />
        {/* Label */}
        <label htmlFor="description" className="text-gray-700">
          Description
        </label>
        {/* Description Input */}
      
      <div className="relative mt-6 ">
      <textarea
      name="description"
        className="pl-6 rounded "
        value={task.description}
        onChange={handleChange}
      />
      </div>
      </div>
      </div>

<div className="mt-4">
      <div className="flex items-center space-x-2">
        {/* Calendar Icon */}
        <FaCalendarAlt className="text-gray-500" />
        {/* Label */}
        <label htmlFor="due-date" className="text-gray-700">
          Due Date
        </label>
        {/* Date Picker Input */}
        <div className="relative">
          <DatePicker
            id="due-date"
            selected={task.due_date ? new Date(task.due_date) : null}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="yyyy-MM-dd h:mm aa"
            className="p-2 pl-10  rounded"
          />
        </div>
      </div>
    </div>
 

<div className=" mt-4">
  <div className="flex items-center space-x-2">
    {/*Clock icon*/}
    <FaClock className="  text-gray-500" />
    {/*Label*/}
    <label htmlFor="reminder-time" className="text-gray-700">Reminder</label>
    {/*Time Picker Input*/}
    <div className="relative">
  <input
    type="time"
    className="w-full p-2 pl-10  rounded "
    value={task.reminder_time}
    onChange={handleChange}
  />
  </div>
  
</div>

</div>

      <div className="mt-4">
        <label className="block text-gray-700">Priority</label>
        <select
          className="w-full p-2 border rounded"
          value={task.priority}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Files and Media</label>
      <input
        type="file"
        className="mt-2 bg-[#6246AC] text-white px-4 py-2  border rounded hover:bg-purple-600"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
        
      </div>

      <div className="mt-4 p-4 border rounded-lg">
      {/* Subtasks Title & Progress Bar */}
      <div className="flex justify-between items-center">
        <label className="block text-gray-700 text-lg font-semibold">Subtasks</label>
        <progress value={subTaskProgress} max="100" className="w-2/3 h-2 bg-purple-300 rounded-lg"></progress>
      </div>

      {/* Subtask List */}
      {totalSubtasks > 0 ? (
        <ul className="mt-2">
          {task.subtasks.map((subtask, index) => (
            <li key={index} className="flex items-center gap-2 mt-1"
            onClick={() => setSelectedSubtask(subtask)}
            >
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleSubtaskToggle(index)}
                className="w-4 h-4"
              />
              <span className={subtask.completed ? "line-through text-gray-500" : ""}>
                {subtask.title}
               
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-2">No subtasks available</p>
      )}

       

      {/* Add Subtask Button & Input Field */}
      {showInput ? (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Enter subtask"
            className="w-full border p-2 rounded-md"
          />
          <button onClick={handleAddSubtask} className="bg-[#6246AC] text-white px-3 py-2 rounded-md">
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="mt-3 text-[#6246AC] hover:underline"
        >
          + Add Subtask
        </button>
      )}
    </div>

      <div className="mt-6 flex gap-4 pl-85">
        <button
          onClick={handleDeleteTask}
          className="bg-red-400 text-red-100 px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={handleUpdateTask}
          className="bg-[#6246AC] text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Update
        </button>
      </div>
    </div>
    </div>
    {/* Modal for Subtask Details */}
    <div className="w-1/2 p-4">
        <SubtaskDetails subtask={selectedSubtask} />
      </div>
    </div>
  );
}; } 

export default TaskPage;



/*const AddTaskModal = ({ open, handleClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [attachment, setAttachment] = useState(null);
    const [priority, setPriority] = useState("");
    const [subtaskOpen, setSubtaskOpen] = useState(false);

    const handleFileUpload = (event) => setAttachment(event.target.files[0]);

    const handleSubmit = () => {
        const newTask = { title, description, date, time, attachment, priority };
        createTask(newTask);
        console.log("new task created")
        handleClose();
    };*/

    {/*return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: "absolute", top: "50%", left: "60%", transform: "translate(-50%, -50%)", width: 800, bgcolor: "#f5eefc", p: 3, borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ color: "#aaa", mb: 1 }}>Enter task title</Typography>
                    <TextField fullWidth variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />

                    <Typography variant="body1" sx={{ color: "#aaa", mt: 2, mb: 1 }}>Description</Typography>
                    <TextField fullWidth variant="outlined" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

                    {/* Task Options 
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <DatePicker value={date} onChange={setDate} renderInput={(props) => <Button {...props} startIcon={<CalendarToday />}>Date</Button>} />
                        <TimePicker value={time} onChange={setTime} renderInput={(props) => <Button {...props} startIcon={<AccessTime />}>Time</Button>} />
                        <Button component="label" startIcon={<AttachFile />}>Attachment<input type="file" hidden onChange={handleFileUpload} /></Button>
                        <TextField select value={priority} onChange={(e) => setPriority(e.target.value)} sx={{ width: 120 }}>
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </TextField>
                    </Box>

                    {/* Subtask Section 
                    <Typography variant="body1" sx={{ mt: 2 }}>Subtask</Typography>
                    <IconButton size="small" onClick={() => setSubtaskOpen(true)}><Add fontSize="small" /> Add sub-task</IconButton>

                    {/* Action Buttons 
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Add Task</Button>
                    </Box>
                </Box>
            </Modal>

            {/* Subtask Modal 
            <SubtaskModal open={subtaskOpen} handleClose={() => setSubtaskOpen(false)} />
        </LocalizationProvider>
    );
};

AddTaskModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default AddTaskModal;*/
    };