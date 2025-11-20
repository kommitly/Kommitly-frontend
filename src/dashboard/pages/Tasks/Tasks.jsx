import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { TasksContext} from '../../../context/TasksContext';
import { GoalsContext } from '../../../context/GoalsContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoSearch } from "react-icons/io5";  // Correct module for IoSearch
import Backdrop from '@mui/material/Backdrop'; // Import Backdrop from MUI
import analysis from '../../../assets/analyze-data.svg'; // Adjust the path as necessary
import { createTask, deleteTaskById, createSubtask } from "../../../utils/Api";
import aiGoals from '../../../assets/goals.svg';
import CalendarComponent from './Calendar';
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
import { FaCalendarAlt, FaClock, FaTasks } from "react-icons/fa"; // Import calendar icon
import TaskItem from '../../components/TaskItem'; // Import TaskItem component
import { Box, IconButton, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../../../theme";
import { Divider } from '@mui/material';
import SlidingButton from "../../components/SlidingButton";import CircularProgress from '@mui/material/CircularProgress';
import { useMediaQuery } from '@mui/material'
import Empty from "../../components/Empty";
import ReminderTimePicker from "../AiGoal/ReminderTimePicker";
import FlagIcon from '@mui/icons-material/Flag';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import SellIcon from '@mui/icons-material/Sell';
import Circles from '../../../assets/Circles.svg';
import FormButton from '../../components/FormButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import ReusableFormModal from '../../components/ReusableFormModal';
import { Target, Check, ArrowRight, Star, Bell, Calendar, LineChart } from 'lucide-react';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';



const Tasks = () => {
  const navigate = useNavigate();
  const {tasks, addTask} = useContext(TasksContext); // Use the TasksContext
  const {goals, ai_goals} = useContext(GoalsContext); // Use the GoalsContext
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedAiCategory, setSelectedAiCategory] = useState('inProgress');
  const [selectedCategory, setSelectedCategory] = useState('inProgress');
  const tasksContainerRef = useRef(null);
  const [title, setTitle] = useState('');
  const aiTasksContainerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});
  const {removeTask, addTaskToSidebar} = useContext(TasksContext); // Use the TasksContext
  const [showFilters, setShowFilters] = useState(false);
  const [task, setTask] = useState({ title: "", due_date:null, reminder_time: null, priority: "Low", subtasks: [] });
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file
  const [newSubtask, setNewSubtask] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [newSubtasks, setNewSubtasks] = useState([]);
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
  const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));

  const [openQuickModal, setOpenQuickModal] = useState(false);
  const [showCustomReminderPicker, setShowCustomReminderPicker] = useState(false);
  const [taskTypeFilter, setTaskTypeFilter] = useState("all"); 
  
  const cycleTaskTypeFilter = () => {
  
   setTaskTypeFilter(prevFilter => {
          switch (prevFilter) {
              case 'all':
                  return 'ai'; // 1. All -> AI Goals
              case 'ai':
                  return 'user'; // 2. AI Goals -> My Goals (User)
              case 'user':
              default:
                  return 'all'; // 3. My Goals (User) -> All Goals (Cycle back)
          }
      });
};

 
const getTaskFilterLabel = (filter) => {
  switch (filter) {
    case "ai": return "AI Tasks";
    case "user": return "My Tasks";
    default: return "All Tasks";
  }
};

const getTaskFilterIcon = (filter) => {
  switch (filter) {
    case "ai": return <AutoFixHighIcon />;
    default: return null;
  }
};


  useEffect(() => {
    if (tasks.length > 0) { // Check if tasks array has items
      setLoading(false);
      console.log("tasks", tasks);
      
    }
    if (tasks.length ===0){
      console.log("No tasks found");
    }
    if (goals.goals && goals.ai_goals) {
      setLoading(false);
      console.log("ai goals", goals.ai_goals);
    }
  }, [tasks, goals]);

const allTasks = useMemo(() => {
  if (!tasks || !goals?.ai_goals) return [];

  // Flatten AI tasks
  const aiTasks = goals.ai_goals.flatMap(goal =>
    (goal.ai_tasks || []).map(task => ({
      ...task,
      isAiTask: true,
      type: "ai",
      parentGoalId: goal.id,
      linkPath: `/dashboard/ai-task/${task.id}`,
      // ✅ ADD GOAL TAG TO AI TASK HERE
      tag: goal.tag, // <-- This ensures the AI task inherits the parent goal's tag
    }))
  );

  // Mark User Tasks
  const userTasks = tasks.map(task => ({
    ...task,
    isAiTask: false,
    type: "user",
    linkPath: `/dashboard/task/${task.id}`
    // User tasks will use their own existing 'tag' property if defined
  }));

  return [...userTasks, ...aiTasks];
}, [tasks, goals]);

const filterTasks = () => {
  let filtered = allTasks;

  // --- 1. Filter by Status using the 'status' property (Recommended) ---
  filtered = filtered.filter(task => {
    // If the category is 'all' or no category is selected, include all tasks
    if (selectedCategory === 'all' || !selectedCategory) {
      return true;
    }
    
    // Check if the task's status matches the selected category
    // This assumes task.status is provided by the backend (e.g., 'pending', 'inProgress', 'completed')
    return task.status === selectedCategory; 
  });

  // --- 2. Filter by Task Type (All, AI, User) ---
  switch (taskTypeFilter) {
    case "ai":
      filtered = filtered.filter(t => t.isAiTask);
      break;
    case "user":
      filtered = filtered.filter(t => !t.isAiTask);
      break;
    case "all":
    default:
      break;
  }

  return filtered;
};


const finalFilteredTasks = filterTasks();



  
  
  

function CircularProgressWithLabel({ value, textColor = '#000000', progressColor = '#4F378A' , size = 40, fontSize = '0.6rem' }) {
  
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        sx={{ color: progressColor }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: textColor, fontSize: fontSize }}
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}






  //Quck add modal for  hourly slot task
 const handleHourClick = (hourLabel) => {
  // Example: suppose your selected date is stored in `selectedDate`
  const date = new Date(selectedDate);

  // Convert "1am" or "2pm" into a number
  let hour = parseInt(hourLabel);
  if (hourLabel.toLowerCase().includes("pm") && hour !== 12) hour += 12;
  if (hourLabel.toLowerCase().includes("am") && hour === 12) hour = 0;

  date.setHours(hour, 0, 0, 0); // set time on selected day

  setTask({
    title: "",
    reminder_time: null,
    due_date: date,
    subtasks: [],
  });
  setOpenQuickModal(true);
};


 const handleCloseQuickModal = () => setOpenQuickModal(false);

 const handleChange = (e) => {
      const { name, value } = e.target;
      setTask((prev) => ({ ...prev, [name]: value }));
      // If user chooses "custom", show time picker
      if (name === "reminder_offset") {
        setShowCustomReminderPicker(value === "custom");
      }
    };

    const handleCustomReminderChange = (time) => {
  setTask((prev) => ({
    ...prev,
    custom_reminder_time: time,
  }));
};
  
  
// Filter tasks based on selected date
  const filteredTasksByDate = tasks.filter((task) => {
    if (!task.due_date) return false; // Ensure task has a due date
  
    const taskDate = new Date(task.due_date).toISOString().split("T")[0]; // Extract "YYYY-MM-DD"
    const selectedDateFormatted = selectedDate.format("YYYY-MM-DD"); // Ensure consistency
  
    return taskDate === selectedDateFormatted;
  });
  
  // Filter tasks based on selected date
  const hours = Array.from({ length: 24 }, (_, i) => {
  const suffix = i < 12 ? "am" : "pm";
  const hour = i % 12 === 0 ? 12 : i % 12;
  return `${hour}${suffix}`;
});

const renderTaskBlock = (hour) => {
  const tasksThisHour = filteredTasksByDate.filter((task) => {
    const taskHour = new Date(task.due_date).getHours();
    return taskHour === hour;
  });

  const taskCount = tasksThisHour.length;

  return tasksThisHour.map((task, index) => {
    const taskTime = new Date(task.due_date);

    const height = 100 / taskCount;       // each task gets equal slice
    const topOffset = index * height;     // stack them one after another

      return (
        <div
          key={index}
          className="absolute   left-[0px] right-4 bg-[#6246AC] text-white  px-2 py-1 rounded shadow"
          style={{
            top: `${topOffset}%`,
            height: "50px", // You can adjust or make this dynamic if needed
          }}
        >
          <div className="text-s"> {task.title} </div>
          <div className="mt-1 text-xs">
           {taskTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })} </div>
        </div>
      );
    });
};









  

  const openModal = () => {
    setOpen(true);
     console.log("Modal rendered");
  }


  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTask = async () => {
      if (!title) {
        alert("Please enter title !");
        return;
      }
    
      try {
        const newTask = await createTask({
          title: title, 
          priority: task.priority,
          due_date: task.due_date,
          reminder_time: task.reminder_time,
          progress: task.progress,
          });
        console.log("Task details sent for creation:", newTask); // Ensure this returns the goal object with an ID
        for (const subtask of newSubtasks) {
       await createSubtask({ taskId: newTask.id, title: subtask.title });
  }
        addTask(newTask); // Add the new task to the context
        setOpen(false);
        alert("New task created")
        console.log("New task created:", newTask);
        //navigate(`/dashboard/task/${newTask.id}`); // Use newTask.id instead of undefined goal.id
      } catch (error) {
        console.error("Error creating task:", error);
      }
    };


  
  /*const toggleTaskMenu = (taskId) => {
    console.log(`Toggled task menu for task ID: ${taskId}`);
      setMenuVisible(prev => ({
        [taskId]: !prev[taskId],
        
      }
    ));
    console.log("menuVisible");
    };*/

    const toggleTaskMenu = (taskId) => {
      setMenuVisible((prev) => ({
        ...prev,
        [taskId]: !prev[taskId]
      }));
    };

    //Delete task
       const handleDeleteTask = async (taskId) => {
         try {
           await deleteTaskById(taskId);
           removeTask(taskId); // if task is stored in local state
           alert("Task deleted successfully!");
       
         } catch (error) {
           console.error("Error deleting task:", error);
           alert("Failed to delete task.");
         }
       };

       //change in task properties
  
    const handleDueDateChange = (date) => {
      setTask((prev) => ({
        ...prev,
        due_date: date?.toISOString(), // Convert date to string for compatibility with backend
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



const handleAddSubtask = () => {
  if (newSubtask.trim() !== "") {
    setNewSubtasks(prev => [...prev, { title: newSubtask }]);
    console.log("New subtask added to state:", newSubtask, "Subtasks:", newSubtasks);
    setNewSubtask("");
    setShowInput(false);
  }
};

     
       
  
    if (loading) {
      return (
        <div className='w-full mt-8 flex min-h-screen'>
          <div className="w-11/12 p-8 mt-8 py-8 flex-1 flex justify-center items-center overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
            <motion.div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[#65558F] rounded-full"
                  initial={{ y: -10 }}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      );
    }



// ✅ If no tasks exist, show empty state
if (!loading && tasks.length === 0) {
  return (
    <div className="flex flex-col min-h-screen h-full  p-4">
     
        <div className='flex justify-between w-full'>
  <Typography 
    variant="h2" 
    color={colors.text.primary} 
    fontWeight="bold"
  >
   My Tasks
  </Typography>

  {/* Desktop button */}
  <div className="hidden sm:block">
    <Button onClick={openModal} text="Create Tasks">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="#6246AC"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: '#FFFFFF' }}
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </Button>
  </div>
</div>

          <div className="flex flex-col items-center justify-center h-[50vh] w-full text-center p-6">
            <div className="w-7/12">
              <Empty/>
            </div>
        
          </div>

          {/* Mobile floating + button */}
<button
  onClick={openModal}
  className="sm:hidden fixed bottom-36 right-12 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
  style={{ backgroundColor: colors.background.sidebar }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
</button>


     
    </div>
  );
}
  
    return (
<div className="w-full p-4  grid gap-1 grid-cols-1  sm:grid-cols-12 p-2 flex min-h-screen">
    

    
    <Backdrop
          sx={(theme) => ({ color: '#000000', zIndex: theme.zIndex.drawer + 1 })}
          open={open}
          onClick={handleClose} // Clicking outside should close it
        >
          <div 
            className="bg-white w-10/12 sm:w-5/12 p-6 rounded-lg shadow-lg text-center" style={{ backgroundColor: colors.background.default }}  
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
            <div className='flex w-full mb-4 justify-end'>
            <div className='flex w-2/3 items-center justify-between'>
            <h1 className='text-xl font-bold text-[#6F2DA8] mt-4 flex items-center justify-center gap-2'>
              New Task
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="cursor-pointer"
              onClick={handleClose}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>  
            



            </div>

            </div>
            
           

            <div className="flex items-center mb-4 gap-2">
              <p className='text-sm text-start w-8 ' style={{color:colors.text.primary}}>Title</p>
              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border text-black border-gray-200 rounded-lg focus:outline-none" style={{color:colors.text.primary}}
              />
            </div>

         

       <div className="flex flex-col sm:flex-row justify-between mb-4 gap-6 sm:gap-2">

        <div className="flex items-center space-x-2">
          {/* Calendar Icon */}
          <FaCalendarAlt className="text-gray-500" />
          {/* Date Picker Input */}
          <div className="relative" style={{color:colors.text.primary}}>
            <DatePicker
              id="due-date"
              selected={task.due_date ? new Date(task.due_date) : null}
              onChange={handleDueDateChange}
              showTimeSelect
              dateFormat="yyyy-MM-dd h:mm aa"
              placeholderText="Due_date"
              className="p-2  rounded-md border border-gray-200" style={{color:colors.text.primary}}
            />
      </div>
        </div>

         
            <div className="flex items-center space-x-2">
              {/*Clock icon*/}
              <FaClock className="  text-gray-500" />
              
              {/*Time Picker Input*/}
              <div className="relative" style={{color:colors.text.primary}}>
           <DatePicker
  id="reminder-time"
  selected={
    task.reminder_time
      ? new Date(`1970-01-01T${task.reminder_time}`) // time-only string → Date
      : null
  }
  onChange={handleReminderTimeChange}
  showTimeSelect
  showTimeSelectOnly
  timeIntervals={15}
  timeCaption="Time"
  dateFormat="HH:mm:ss"
  placeholderText="Reminder"
  className="p-2 rounded-md border border-gray-200" style={{color:colors.text.primary}}
/>

           </div>
          </div> 

          <div className="flex  gap-2">
                  <div className="flex items-center space-x-2 ">
                    {/* Description Icon */}
                    <FaTasks className="text-gray-500" />
                    
                    </ div>
                    {/*Description input*/}
                    <div className="relative" style={{color:colors.text.primary}}>
                    <select
              value={task.priority || ''}
              onChange={(e) => setTask((prev) => ({ ...prev, priority: e.target.value }))}
              className="w-full p-2 rounded-md border border-gray-200" style={{color:colors.text.primary}}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
                  </div>
                  </div>

                   </div>
            
             {/* Subtask List */}

          <div className="mt-4  w-full">
        {/* Subtasks Title & Progress Bar */}
        <div className="flex justify-between w-full items-center">
          <label className="block text-[#6F2DA8] text-lg font-semibold" style={{color:colors.text.primary}}>Subtasks</label>
         
        </div>
       {/* Subtask List */}
       
          <ul className="mt-2">
            {newSubtasks.map((subtask, index) => (
              <li key={index} className="flex items-center gap-2 mt-1" style={{color:colors.text.primary}}
              onClick={() => setSelectedSubtask(subtask)}
              >
                  {subtask.title}
              </li>
            ))}
          </ul>
        
  
  
        {/* Add Subtask Button & Input Field */}
        {showInput ? (
          <div className="mt-3 flex gap-2" style={{color:colors.text.primary}}>
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Enter subtask"
              className="w-full border border-gray-200 p-2 rounded-md" style={{color:colors.text.primary}}
            />
            <button onClick={handleAddSubtask} className="bg-[#6246AC] text-white px-3 py-2 rounded-md">
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="mt-3  flex text-[#6246AC]  hover:underline "
          >
            + Add Subtask
          </button>
        )}
        </div>

                      
               <div className="flex justify-end w-full"> 
            <button onClick={handleAddTask} className="mt-4 px-4 py-2 bg-[#6246AC] hover:bg-purple-600 text-white rounded-lg">
              Create Task
            </button>
          </div>
          </div>
    </Backdrop>
    
    <Backdrop
      sx={(theme) => ({ color: "#000000", zIndex: theme.zIndex.drawer + 1 })}
      open={openQuickModal}
      onClick={handleCloseQuickModal}
    >
      <div
        className="bg-white w-10/12 sm:w-4/12 p-6 rounded-lg shadow-lg text-center"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-[#6F2DA8]">Quick Add Task</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer"
            onClick={handleCloseQuickModal}
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        {/* Floating Label Input - Title */}
        <div className="relative mb-6">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="peer w-full border border-gray-300 rounded-md px-3 pt-3 pb-2 text-sm text-gray-900 placeholder-transparent focus:outline-none focus:border-[#6F2DA8]"
            placeholder="Title"
          />
         
        </div>

        {/* Floating Label Input - Reminder 
        <div className="relative mb-6">
          <div className="flex items-center gap-2">
            <FaClock className="text-gray-500" />
            <div className="relative w-full">
              <DatePicker
                id="reminder-time"
                selected={
                  task.reminder_time
                    ? new Date(`1970-01-01T${task.reminder_time}`)
                    : null
                }
                onChange={handleReminderTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm:ss"
                placeholderText="Reminder"
                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:outline-none focus:border-[#6F2DA8]"
              />
              <label
                htmlFor="reminder-time"
                className="absolute left-3 top-2 text-gray-500 text-xs transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:text-xs peer-focus:text-[#6F2DA8] peer-focus:top-2"
              >
                Reminder
              </label>
            </div>
          </div>
        </div>  */}

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
          

        {/* Subtasks Section */}
        <div className="mt-4 text-left">
          <div className="flex justify-between items-center">
            <label className="block text-[#6F2DA8] text-lg font-semibold">
              Subtasks
            </label>
          </div>

          <ul className="mt-2">
            {newSubtasks.map((subtask, index) => (
              <li
                key={index}
                className="flex items-center gap-2 mt-1 text-gray-700 cursor-pointer hover:text-[#6F2DA8]"
                onClick={() => setSelectedSubtask(subtask)}
              >
                <FaTasks className="text-gray-500" /> {subtask.title}
              </li>
            ))}
          </ul>

          {showInput ? (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Enter subtask"
                className="w-full border border-gray-300 p-2 rounded-md text-sm"
              />
              <button
                onClick={handleAddSubtask}
                className="bg-[#6F2DA8] text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="mt-3 flex text-[#6F2DA8] text-sm hover:underline"
            >
              + Add Subtask
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end w-full">
          <button
            onClick={handleAddTask}
            className="mt-5 px-4 py-2 bg-[#6F2DA8] hover:bg-purple-700 text-white rounded-md"
          >
            Create Task
          </button>
        </div>
      </div>
    </Backdrop>
    

    <div className=" md:flex flex-col md:col-span-7 col-span-12  md:p-0 p-0"> 
       
        <Box className='w-full relative  container md:h-46 xl:h-50 2xl:h-64  h-42 flex items-center justify-between rounded-4xl md:p-8 xl:p-8 p-6 pl-4 md:mt-4 mt-0'
        sx={{backgroundColor: "#4F378A", boxShadow: "0px 0px 6px rgba(79, 55, 138, 0.7)"}}
         >
      
                  <div className='space-y-4 relative h-full flex flex-col justify-center items-start'>
                    <h1 className='text-2x1  font-semibold'><p
               
              className="font-semibold md:text-xl  xl:text-xl  2xl:text-3xl text-base"
              style={{ color: "#ffffff"}}
              
            >Manage your Tasks 
            </p></h1>
                   <Button onClick={openModal} sx={{backgroundColor: "#A89FE3", borderRadius: 100, color: "#FFFFFF", textTransform: "none", paddingY: 0.5, paddingX: 2, gap: 0.2}}>
                                   <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   width="16"
                                   height="16"
                                   viewBox="0 0 24 24"
                                   fill="#A89FE3"
                                   stroke="#FFFFFF"
                                   strokeWidth="2"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                
                                   style={{ stroke: '#FFFFFF', }} // Inline style to ensure white stroke
                                 >
                                   <line x1="12" y1="5" x2="12" y2="19" />
                                   <line x1="5" y1="12" x2="19" y2="12" />
                                 </svg>
                                Create Task
                               </Button>
                   
                  </div>
                   <img src={Circles} alt='Circles'  className='md:h-46  h-32 xl:h-48 2xl:h-60 ' />
                </Box>


<div className='w-full mt-6'>
  <div className="w-full flex flex-col md:flex-row justify-between items-center mt-4">
    
    {/* Status Filter */}
    <SlidingButton
      options={["pending", "inProgress", "completed"]}
      selected={selectedCategory}
      onChange={setSelectedCategory}
      className="mb-4"
    />

    {/* Task Type Filter (All / AI / User) */}
    <div className='flex-shrink-0 ml-4 w-full md:mt-0 mt-2 md:w-auto flex justify-end'>
      <Button
        onClick={cycleTaskTypeFilter}
        sx={{
          color: colors.text.secondary,
          backgroundColor: 'transparent',
          padding: '6px 10px',
          fontWeight: 'semibold',
          border: `1px solid ${colors.divider}`, 
          textTransform: 'none',
          borderRadius: '100px',
          '&:hover': {
            backgroundColor: colors.background.default, 
          },
          minWidth: '120px'
        }}
        startIcon={getTaskFilterIcon(taskTypeFilter)}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {getTaskFilterLabel(taskTypeFilter)}
      </Button>
    </div>

  </div>




<div className='relative mt-4'>
        {tasks.length === 0 ? (
          <div className='w-full flex justify-center items-center h-[12vh]'>
            <div className='w-24'><Empty /></div>
            <Typography variant="body1" className="ml-4">Start by adding your first task!</Typography>
          </div>
        ) : finalFilteredTasks.length === 0 ? (
          <div className='w-full h-[12vh]  flex justify-center items-center'>
            <div className='w-1/6  flex justify-center items-center'>
                     <Empty />
              </div>
    
          </div>
        ) : (
          <>
            {/* Left Scroll Button (Hidden on XS/SM screens where swiping is preferred, but kept for desktop UX) */}
         {/* {   <button
              onClick={() => scrollGoals('left')}
              className='absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 hidden md:flex'
              style={{ backgroundColor: colors.tag.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>} */}

            {/* Scrollable Goals Container */}
            <div 
          
              // Adjust padding/margin for scroll buttons on desktop, or full width on mobile
              className='flex gap-4 overflow-x-auto no-scrollbar w-full md:w-full md:mx-auto'
            >
              {finalFilteredTasks.map((t) => (
                // Use the pre-calculated linkPath
                <Link key={t.id} to={t.linkPath} className='w-full min-w-[280px] list-none block'>
                  <li className='w-full h-full list-none'>
                    <Box className='flex w-full px-2 py-4 h-full rounded-2xl transition-transform duration-300 hover:scale-[0.95] relative'
                         sx={{ backgroundColor: colors.background.paper }}>

                      {/* AI Icon for distinction */}
                      {t.isAiTask && (
                        <AutoFixHighIcon
                          className='absolute top-2 right-2'
                          style={{ color: colors.primary[500], fontSize: '1.2rem' }}
                        />
                      )}

                      
                      <div className='w-full flex flex-col gap-2 pl-2'>
                        <div className='flex w-11/12 justify-between'>
                          <span className='w-full h-auto font-regular text-sm lg:text-sm 2xl:text-lg'>
                            {t.title}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <SellIcon className='text-[#65558F] text-xs' /> 
                          <span className='text-xs font-normal' style={{ color: colors.primary[500] }}>
                            {t.tag ? t.tag : 'No Tag'}
                          </span>
                        </div>
                      </div>
                    </Box>
                  </li>
                </Link>
              ))}
            </div>

            {/* Right Scroll Button (Hidden on XS/SM screens where swiping is preferred, but kept for desktop UX) */}
           {/* { <button
              onClick={() => scrollGoals('right')}
              className='absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 p-2 rounded-full flex items-center justify-center z-10 hidden md:flex'
              style={{ backgroundColor: colors.tag.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>} */}
          </>
        )}
      </div>











</div>



                          



     
   

    
       

      
</div> 

<Box className='hidden md:block mt-4 sm:col-span-5 space-y-4 mx-4 rounded-2xl  p-6'sx={{backgroundColor:colors.background.paper}}>

      {/* Calendar Component */}
      <div className="calendar">
      <CalendarComponent onDateChange={setSelectedDate} />
      </div>

      {/* Task List */}
      <h3 className="text-lg font-medium pl-2 mt-10 text-gray-800" style={{
                  color: colors.text.primary,
                }}>
          Tasks for {selectedDate.format("YYYY-MM-DD")}
        </h3>
      <div className="mt-4  rounded-xl bg-black  p-4 h-[250px] overflow-y-auto border" style={{ backgroundColor: colors.background.default }}>
        {hours.map((hourLabel, hourIndex) => (
  <div
    key={hourIndex}
    className="border-t border-gray-300 h-16 relative pl-4 text-sm text-gray-600"
  >
    <div className="absolute left-0 top-0">
      <button onClick={() => handleHourClick(hourLabel)}>{hourLabel}
        </button>
      </div>
    <div className="ml-10 h-auto text-xs  relative">
      {renderTaskBlock(hourIndex)}
    </div>
  </div>
))}

    </div>
    



  
  </Box>   
</div>
    
  );
};

export default Tasks;
