
import { useEffect, useState, useContext } from "react";
import { TasksContext } from "../../../context/TasksContext";
import PropTypes from 'prop-types';
import { Modal, Box, Typography, TextField, Button, IconButton, MenuItem, useTheme} from "@mui/material";
import { tokens } from "../../../theme";
import { CalendarToday, AccessTime, Notifications, AttachFile, PushPin, Add } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { deleteTaskById, updateTaskById, fetchTaskById, createSubtask, updateSubtask, deleteSubtaskById} from "../../../utils/Api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock, FaFlag, FaTasks, } from "react-icons/fa"; // Calendar icon
import SubtaskDetails from "./Subtask";
import ReminderTimePicker from "../AiGoal/ReminderTimePicker";
import SubtaskDateTimePicker from "../AiGoal/SubtaskDateTimePicker";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { TbSubtask } from "react-icons/tb";
import { TbCheck } from "react-icons/tb";
import { TbListDetails } from "react-icons/tb"; // or TbListCheck






   
  



const TaskPage = () => {
    const { taskId } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubtaskVisible, setIsSubtaskVisible] = useState(false);
    const [showCustomReminderPicker, setShowCustomReminderPicker] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
   
  
    
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
    

    const handleSubtaskClick = (subtask) => {
  setSelectedSubtask(subtask);
  setIsSubtaskVisible(true);
  if (window.innerWidth < 640) {
    setIsModalOpen(true);
  }
};

const handleSubtaskClose = () => {
  setIsSubtaskVisible(false);
  setSelectedSubtask(null);
};

//change in task properties
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTask((prev) => ({ ...prev, [name]: value }));
      // If user chooses "custom", show time picker
      if (name === "reminder_offset") {
        setShowCustomReminderPicker(value === "custom");
      }
    };
    
    const handleDueDateChange = (date) => {
  setTask((prev) => ({
    ...prev,
    due_date: date?.toISOString(), // Convert to ISO for backend
  }));
};


const handleCustomReminderChange = (time) => {
  setTask((prev) => ({
    ...prev,
    custom_reminder_time: time,
  }));
};

    const handleReminderTimeChange = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }); // e.g., "14:30:00"

    setTask((prev) => ({
      ...prev,
      reminder_time: formattedTime, // store as formatted string
    }));
  } else {
    setTask((prev) => ({
      ...prev,
      reminder_time: null,
    }));
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


   //update task with new properties(need to redo this function)
  const handleUpdateTask = async () => {
    try {
      const updatedTask = {
        ...task,
       subtasks: task.subtasks.map(({ title, status }) => ({
  title,
  status, })) // Keep subtasks structured
      };
      await updateTaskById(task.id, updatedTask );
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

      subtask.status = subtask.completed ? "completed" : "pending";
  
      await updateSubtask(
  task.id,
  subtask.id,
   {
  completed: subtask.completed,
  status: subtask.status,
  description: subtask.description,
  reminder_time: subtask.reminder_time
});

  
     // Update the task UI
    const allCompleted = updatedSubtasks.every(st => st.completed);
    setTask({
      ...task,
      subtasks: updatedSubtasks,
      status: allCompleted ? "completed" : task.subtasks.length ? task.status : "pending"
    });

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
        <div className="w-full  p-4">
        <div className="flex justify between items-center pl-2  mb-2">
       {/* <svg
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
  </svg>*/}
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        className="w-full font-semibold  text-2xl"
      />
<div className="flex gap-4">
          {/* 🔘 Actions */}
          <div className="mt-2 flex gap-4">
            <FaTrashAlt
              onClick={handleDeleteTask}
              className="text-red-500 hover:text-red-600 cursor-pointer text-2xl"
              title="Delete subtask"
            />
          </div>
      
          <Button className="py-2 text-sm cursor-pointer" sx={{border: "1px solid #0D81E0"  , color: colors.primary[400],   '&:hover': {
                opacity: 0.7, // or any other value < 1
              }, textTransform: "none",  gap: "10px"  } }
                       onClick={handleUpdateTask}
          
                      >
                             UPDATE
                      </Button>
      
                      <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={() => setOpenSnackbar(false)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      >
                        <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                          Subtask successfully updated!
                        </MuiAlert>
                      </Snackbar>
        
          </div>

      </div>


      <div 
      className="max-w-xl ml-1 p-2 ">

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

  <div className="w-full  flex-col flex-wrap  ">
  <div className=" w-full gap-4 ">
        <div className="flex items-center  space-x-2">
          {/* Description Icon */}
           <span className='bg-[#D6CFFF] p-2 rounded-md'>
                                      <FaTasks className="text-[#4F378A] " size={12} />
                                    </span>
          {/* Label */}
          <label htmlFor="description" className="text-gray-700 font-semibold">
            Description
          </label>
          </div>
          {/* Description Input */}
        
        <div className="w-full flex pl-9  flex-wrap  ">
        <textarea
        name="description"
        className="mt-1 w-full flex flex-wrap outline-none focus:ring-0 focus:outline-none placeholder:text-xm"
        value={task.description || ''} 
        placeholder="Enter task description..."
        onChange={handleChange}
        />
        
        </div>
        </div>
       <div className="w-full  mt-4 flex gap-16 items-center">
        <div className="flex items-center  space-x-2">
         <span className= 'bg-[#D6CFFF] p-2 rounded-md'> 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={12}
              height={12}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="#4F378A"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2l4-4" />
            </svg>
            </span>
          {/* Label */}
          
          <p className="font-semibold">
            Status:
          </p>
          </div>
         <div className="mt-2">
  <select
    value={
      task.subtasks && task.subtasks.length > 0
        ? task.subtasks.every((sub) => sub.status === 'completed')
          ? 'completed'
          : 'pending'
        : task.status
    }
    onChange={(e) => setTask((prev) => ({ ...prev, status: e.target.value }))}
    disabled={task.subtasks && task.subtasks.length > 0} // disable if there are subtasks
    className="p-2 rounded-md"
    style={{ backgroundColor: colors.background.paper, color: colors.text.secondary }}
  >
    <option value="pending">Pending</option>
    <option value="completed">Completed</option>
  </select>
</div>

    </div>
  
  <div className="mt-4 flex gap-4">
        <div className="flex items-center space-x-2">
          {/* Calendar Icon */}
           <span className='bg-[#D6CFFF] p-2 rounded-md'>
                                   <FaCalendarAlt className="text-[#4F378A] " size={12} />
                                       </span>  
          {/* Label */}
          <label htmlFor="due-date" className="text-gray-700 w-20 font-semibold">
            Due Date
          </label>
           
          </div>
          {/* Date Picker Input */}
          <div className="relative pl-4">
          <SubtaskDateTimePicker
  id="due-date"
  value={task.due_date ? dayjs(task.due_date) : null}
  onChange={(newValue) => {
    setTask((prev) => ({
      ...prev,
      due_date: newValue ? newValue.toISOString() : null,
    }));
  }}
/>


          
        </div>
      </div>
  
      
  <div className="flex gap-7 mt-4">
    <div className="flex items-center space-x-2">
      {/*Clock icon*/}
       <span className='bg-[#D6CFFF] p-2 rounded-md'>
                 <FaClock className="text-[#4F378A] " size={12} />
                      </span>
      {/*Label*/}
      <label htmlFor="reminder-time" className="text-gray-700 font-semibold">Reminder</label>
      </div>
      {/*Time Picker Input*/}
      <div className="flex gap-6 items-center relative">
  <select
    name="reminder_offset"
    className="text-sm p-4 "
    onChange={handleChange}
    value={task.reminder_offset || "15"} // default to 15 mins if not set
  >
    <option value="15">15 minutes before</option>
    <option value="30">30 minutes before</option>
    <option value="60">1 hour before</option>
    <option value="1440">1 day before</option>
    <option value="custom">Custom</option>
  </select>

 {showCustomReminderPicker && (
       <div className="mt-2">
         <ReminderTimePicker
           value={task.custom_reminder_time}
           onChange={handleCustomReminderChange}
         />
       </div>
     )}
</div>

  
  </div> 
  
{/* {<div className="flex mt-4 gap-14">
    <div className="flex items-center space-x-2 ">

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
    </div>} */}
  
{/* {  <div className="mt-4  w-full gap-4">
          <label className="block text-gray-700">Files and Media</label>
        <input
          type="file"
          className="mt-2 bg-[#6246AC] text-white px-4 py-2  border rounded hover:bg-purple-600"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
          </div>} */}
  
     <div className="mt-4 w-full">
  {/* Only show this whole section if there are subtasks */}
  {totalSubtasks > 0 ? (
    <>
      {/* Subtasks Title */}
      <div className="flex gap-2 items-centre">
        {/* Subtasks Icon */}
           <span className='bg-[#D6CFFF] p-2 rounded-md'>
                                      <TbSubtask className="text-[#4F378A] " size={12} />
                                    </span>
        <label className="block text-gray-700 font-semibold">Subtasks</label>
      </div>

      {/* Subtask List */}
      <ul className="mt-2 ">
        {task.subtasks.map((subtask, index) => (
          <li
            key={index}
            className="flex items-center gap-2 mt-1 cursor-pointer"
            
          >
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={(e) => {
                e.stopPropagation();
                handleSubtaskToggle(index)
              }
              }
                
              className="w-4 h-4"
            />

            <span
              className={subtask.completed ? "line-through text-gray-500" : ""}
              onClick={() => handleSubtaskClick(subtask)}
            >
              {subtask.title}
            </span>
          </li>
        ))}
      </ul>

      {/* Add Subtask Button / Input */}
      {showInput ? (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Enter subtask"
            className="w-full border p-2 rounded-md"
          />
          <button
            onClick={handleAddSubtask}
            className="bg-[#6246AC] text-white px-3 py-2 rounded-md"
          >
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
    </>
  ) : (
    // When there are no subtasks, show only this button
    <button
      onClick={() => setShowInput(true)}
      className="text-[#6246AC] font-semibold hover:underline"
    >
      + Add Subtask
    </button>
  )}

  {/* Show input when adding the first subtask */}
  {showInput && totalSubtasks === 0 && (
    <div className="mt-3 flex gap-2">
      <input
        type="text"
        value={newSubtask}
        onChange={(e) => setNewSubtask(e.target.value)}
        placeholder="Enter subtask"
        className="w-full border p-2 rounded-md"
      />
      <button
        onClick={handleAddSubtask}
        className="bg-[#6246AC] text-white px-3 py-2 rounded-md"
      >
        Add
      </button>
    </div>
  )}
</div>


       
    </div>
    </div>

    <div className="hidden sm:block w-1/2 p-4">
     {selectedSubtask && (
  <SubtaskDetails
    subtask={selectedSubtask}
    taskId={String(taskId)}
    visible={isSubtaskVisible}
    handleClose={handleSubtaskClose}
    onUpdateSubtask={handleSubtaskUpdate}
    onDeleteSubtask={handleSubtaskDelete}
  />
     )}
      </div>


  {/* Modal for mobile */}
{isModalOpen && selectedSubtask && (
  
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center sm:hidden">
    <div className="bg-white w-11/12 max-h-[90vh] rounded-xl p-4 shadow-lg overflow-y-auto relative">
      <button
        className="absolute top-2 right-4 text-gray-600 text-xl"
        onClick={() => setIsModalOpen(false)}
      >
        &times;
      </button>
      <SubtaskDetails
        subtask={selectedSubtask}
        taskId={String(taskId)}
        onUpdateSubtask={handleSubtaskUpdate}
        onDeleteSubtask={handleSubtaskDelete}
      />
    </div>
  </div>
)}
    </div>
   </div>

    );
  };
};

export default TaskPage;