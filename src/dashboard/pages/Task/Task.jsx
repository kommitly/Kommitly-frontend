
import { useEffect, useState, useContext } from "react";
import { TasksContext } from "../../../context/TasksContext";
import PropTypes from 'prop-types';
import { Modal, Box, Typography, TextField, Button, IconButton, MenuItem } from "@mui/material";
import { CalendarToday, AccessTime, Notifications, AttachFile, PushPin, Add } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { deleteTaskById, updateSingleTaskStatus, fetchTaskById, createSubtask, updateSubtask, deleteSubtaskById} from "../../../utils/Api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock, FaFlag, FaTasks, } from "react-icons/fa"; // Calendar icon
import SubtaskDetails from "./Subtask";

import TaskItem  from "../../components/TaskItem";

   
  



const TaskPage = () => {
    const { taskId } = useParams();
    const {setTasks} = useContext(TasksContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [newSubtask, setNewSubtask] = useState("");
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [subtasks, setSubtasks] = useState(null);
    const navigate = useNavigate(); // React Router hook
    const [task, setTask] = useState(
      {title: "", description: "", due_date: null, reminder_time: "", priority: "Low", subtasks: []}
    );
   
  
    
    //Fetch task by id (this enables display of task properties)
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
    

//change in task properties
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTask((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleDueDateChange = (date) => {
      setTask((prev) => ({
        ...prev,
        due_date: date?.toISOString(), // Convert date to string for compatibility with backend
      }));
    };
    const handleReminderTimeChange = (date) => {
  setTask((prev) => ({
    ...prev,
    reminder_time: date instanceof Date && !isNaN(date) ? date.toISOString() : null,
  }));
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


   //update task with new properties(need to redo this function)
  const handleUpdateTask = async () => {
    try {
      const updatedTask = {
        ...task,
        subtasks: task.subtasks.map(({ name, completed }) => ({ name, completed })), // Keep subtasks structured
      };
      await updateSingleTaskStatus(task.id, updatedTask );
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
    

    

  //Delete task
   const handleDeleteTask = async () => {
     try {
       console.log("Deleting task with ID:", task.id);
       await deleteTaskById(task.id);
   
       // Optional: clear state or update UI
       setTask(null); // if task is stored in local state
       // Redirect to main tasks page
       navigate("/dashboard/tasks"); // adjust path to your route structure
   
       alert("Task deleted successfully!");
   
       
     } catch (error) {
       console.error("Error deleting task:", error);
       alert("Failed to delete task.");
     }
   };
   

//handle subtask update 
    const handleSubtaskUpdate = async (updatedSubtask) => {
      const { id: subtaskId, task: taskId } = updatedSubtask;
      console.log("Type of taskId:", typeof taskId, "Value:", taskId);

      console.log("Task ID: ", taskId, "Subtask ID: ", subtaskId, "updated subtask: ", updatedSubtask);
       // Format due_date
  const cleanSubtask = {
    ...updatedSubtask,
    due_date: updatedSubtask.due_date?.split("T")[0],
  };

  console.log("Cleaned subtask for update:", cleanSubtask);

      try {
        const response = await updateSubtask(taskId, subtaskId, cleanSubtask);
        console.log("Response from updateSubtask:", response);
        if (response.success) {
          setTask((prevTask) => ({
            ...prevTask,
            subtasks: prevTask.subtasks.map((subtask) =>
              subtask.id === updatedSubtask.id ? updatedSubtask : subtask
            ),
          }));
        }
        alert("subtask updated successfully!");
      } catch (error) {
        console.error("Failed to update subtask:", error);
      }
    };
    

//handle subtask delete
    const handleSubtaskDelete = async (subtask) => {
      const { id: subtaskId } = subtask
      try {
        await deleteSubtaskById(subtaskId);
        setTask(prevTask => ({
          ...prevTask,
          subtasks: prevTask.subtasks.filter(st => st.id !== subtaskId),
        }));

         // Clear the selected subtask if it was the one deleted
         setSelectedSubtask(prev => (prev?.id === subtaskId ? null : prev));
        alert("Subtask deleted successfully!");
      } catch (error) {
        console.error("Error deleting subtask:", error);
        alert("Failed to delete subtask.");
      }
    };
    
    
    
    
     
  
  

  
   

  
  
  if (!task) {
    return <div className="text-center w-full mt-6 text-gray-500">Loading task details...</div>;
  } else {
    return (
      <div className="flex w-full">
        <div className="w-full sm:w-1/2 p-4">
        <div className="flex items-center pl-2 gap-2 mb-4">
        <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#65558F"
    width={24}
    height={24}
    className="inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 6.75h15M4.5 12h15m-15 5.25h15"
    />
    <circle cx="3" cy="6.75" r="1" fill="#65558F" />
    <circle cx="3" cy="12" r="1" fill="#65558F" />
    <circle cx="3" cy="17.25" r="1" fill="#65558F" />
  </svg>
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        className="w-full font-semibold  text-2xl border-none"
      />
      </div>


      <div 
      className="max-w-xl ml-2 p-2 rounded-lg border  border-gray-200">

    {/* <TaskItem
    task={task}
    setTask={setTask}
    setSelectedFile={setSelectedFile}
    selectedFile={selectedFile}
    showInput={showInput}
    setShowInput={setShowInput}
    newSubtask={newSubtask}
    handleAddSubtask={handleAddSubtask}
    setNewSubtask={setNewSubtask}
    handleSubtaskToggle={handleSubtaskToggle}
    setSelectedSubtask={setSelectedSubtask}
    selectedSubtask={selectedSubtask}
    subTaskProgress={subTaskProgress}
    totalSubtasks={totalSubtasks}
    
  />*/}

  <div className="w-full  flex flex-wrap  ">
  <div className="flex  w-full gap-4 mt-2">
        <div className="flex items-center  space-x-2">
          {/* Description Icon */}
          <FaTasks className="text-gray-500" />
          {/* Label */}
          <label htmlFor="description" className="text-gray-700">
            Description
          </label>
          </div>
          {/* Description Input */}
        
        <div className="w-full flex pl-9 flex-wrap  ">
        <textarea
        name="description"
          className="pl-2 w-full flex flex-wrap rounded "
          value={task.description || ''} 
          onChange={handleChange}
        />
        
        </div>
        </div>
  
  <div className="mt-4 flex gap-4">
        <div className="flex items-center space-x-2">
          {/* Calendar Icon */}
          <FaCalendarAlt className="text-gray-500 " />
          {/* Label */}
          <label htmlFor="due-date" className="text-gray-700 w-20 ">
            Due Date
          </label>
          </div>
          {/* Date Picker Input */}
          <div className="relative">
            <DatePicker
              id="due-date"
              selected={task.due_date ? new Date(task.due_date) : null}
              onChange={handleDueDateChange}
              showTimeSelect
              dateFormat="yyyy-MM-dd h:mm aa"
              className="p-2 pl-10  rounded"
            />
          
        </div>
      </div>
  
      
  <div className="flex gap-7 mt-4">
    <div className="flex items-center space-x-2">
      {/*Clock icon*/}
      <FaClock className="  text-gray-500" />
      {/*Label*/}
      <label htmlFor="reminder-time" className="text-gray-700">Reminder</label>
      </div>
      {/*Time Picker Input*/}
      <div className="relative">
    <DatePicker
      id="reminder-time"
      selected={
      task.reminder_time && !isNaN(new Date(task.reminder_time))
        ? new Date(task.reminder_time)
        : null
    }
      onChange={handleReminderTimeChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa" // Or "HH:mm" for 24-hour format
      placeholderText=""
      className="p-2 pl-10 rounded border-gray-300 w-full"
    />
    
    
  </div>
  
  </div> 
  
  <div className="flex mt-4 gap-14">
        <div className="flex items-center space-x-2 ">
          {/* Description Icon */}
          <FaTasks className="text-gray-500" />
          <label className="block text-gray-700">Priority</label>
          </ div>
          <div className="relative">
          <select
    value={task.priority || ''}
    onChange={(e) => setTask((prev) => ({ ...prev, priority: e.target.value }))}
    className="w-full p-2 pl-8 rounded-md"
  >
    <option value="Low">🟢 Low</option>
    <option value="Medium">🟡 Medium</option>
    <option value="High">🔴 High</option>
  </select>
        </div>
        </div>
  
  <div className="mt-4  w-full gap-4">
          <label className="block text-gray-700">Files and Media</label>
        <input
          type="file"
          className="mt-2 bg-[#6246AC] text-white px-4 py-2  border rounded hover:bg-purple-600"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
          </div>
  
     <div className="mt-4 p-4 w-full border border-gray-200  rounded-lg">
        {/* Subtasks Title & Progress Bar */}
        <div className="flex justify-between  items-center">
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
  
      </div>

      <div className="mt-6 flex gap-4 pl-38 sm:pl-95">
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

    <div className="hidden sm:block w-1/2 p-4">
  <SubtaskDetails
    subtask={selectedSubtask}
    taskId={String(taskId)}
    onUpdateSubtask={handleSubtaskUpdate}
    onDeleteSubtask={handleSubtaskDelete}
  />

      </div>
    </div>
   

    );
  };
};

export default TaskPage;