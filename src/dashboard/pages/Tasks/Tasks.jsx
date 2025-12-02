import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { TasksContext} from '../../../context/TasksContext';
import { GoalsContext } from '../../../context/GoalsContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Backdrop from '@mui/material/Backdrop'; // Import Backdrop from MUI
import { createTask, fetchDashboardStats, createSubtask } from "../../../utils/Api";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
import { FaCalendarAlt, FaClock, FaTasks } from "react-icons/fa"; // Import calendar icon
import { Box, IconButton, Stack, Typography, useTheme, } from "@mui/material";
import { tokens } from "../../../theme";
import CustomButton from "../../components/Button";
import SlidingButton from "../../components/SlidingButton";import CircularProgress from '@mui/material/CircularProgress';
import Empty from "../../components/Empty";
import ReminderTimePicker from "../AiGoal/ReminderTimePicker";
import SellIcon from '@mui/icons-material/Sell';
import Circles from '../../../assets/Circles.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; 
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReusableFormModal from '../../components/ReusableFormModal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import { DialogContent, TextField } from "@mui/material";
import { Button, Menu, MenuItem, Dialog, DialogTitle, DialogActions } from "@mui/material";


const Tasks = () => {
  const navigate = useNavigate();
  const {
  tasks,
  addTask,
  removeTask,
  addTaskToSidebar
} = useContext(TasksContext);

  const {goals, ai_goals} = useContext(GoalsContext); // Use the GoalsContext
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('in-progress');

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(true); // default ON
   
  const [dueTime, setDueTime] = useState("");

   const fields = [
    { name: "title", label: "Title", type: "text" },
    { name: "dueDate", label: "Date", type: "date" },
    { name: "dueTime", label: "Time", type: "time" },
   
  ];
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    dueTime: "",
    reminderOption: "",
    customReminderTime: "",
  });
  
    const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  
  
    const label = { inputProps: { 'aria-label': 'Reminder switch ' } };
  const [openNewSnackbar, setOpenNewSnackbar] = useState(false);
      
  const [dashboardStats, setDashboardStats] = useState(null);
  const [task, setTask] = useState({ title: "", due_date:null, reminder_time: null, priority: "Low", subtasks: [] });

  const [newSubtask, setNewSubtask] = useState('');
  const [showInput, setShowInput] = useState(false);
  
  const [newSubtasks, setNewSubtasks] = useState([]);
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
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




// 2. UPDATED useEffect for fetching tasks and stats
  useEffect(() => {
    let tasksLoaded = tasks.length > 0;
    let goalsLoaded = goals.goals && goals.ai_goals;

    if (tasksLoaded || goalsLoaded) {
      setLoading(false);
    }
    
    // Fetch dashboard stats regardless of task length to populate the insights column
    fetchStats(); 

    // console logs remain the same
    if (tasks.length > 0) { console.log("tasks", tasks); }
    if (tasks.length === 0) { console.log("No tasks found"); }
    if (goals.goals && goals.ai_goals) { console.log("ai goals", goals.ai_goals); }
    
  }, [tasks, goals]);

  // Function to fetch stats
  const fetchStats = async () => {
    try {
      const stats = await fetchDashboardStats();
      setDashboardStats(stats);
      // Only mark loading false here if this is the last resource being loaded, 
      // otherwise, rely on the useEffect above based on tasks/goals.
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };



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
    linkPath: `/dashboard/tasks/${task.id}`
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
    // This assumes task.status is provided by the backend (e.g., 'pending', 'in-progress', 'completed')
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


  const handleClose = () => {
    setOpen(false);
  };
  



 const handleCloseQuickModal = () => setOpenQuickModal(false);

 
  
  










  

  const openModal = () => {
    setOpen(true);
    console.log("Modal rendered");
  }

    const openCreateModal = () => {
    setOpenQuickModal(true);
    console.log("Create Modal rendered");
  }
  



  const handleAddTask = async () => {
     const { title, dueDate, dueTime, reminderOption, customReminderTime } = formData;

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




    const handleCreateTask = async () => {
      const { title, dueDate, dueTime, reminderOption, customReminderTime } = formData;
    
      // VALIDATION
      if (!title) {
        alert("Please enter title!");
        return;
      }
    
      if (!dueDate) {
        alert("Please select a due date!");
        return;
      }
    
      try {
        // 1. DUE DATE: Combine date and time into a local ISO-like string (e.g., "2025-12-01T16:46")
        // This string does not contain 'Z' or a timezone offset, so the backend interprets it
        // based on its default settings (often as UTC, or as a naive local timestamp).
        const dueDateTime = `${dueDate}T${dueTime || "00:00"}`; 
    
        // REMINDER
        let reminderTime = null;
    
        if (reminderEnabled) {
          if (reminderOption !== "custom") {
            const [hrs, mins] = reminderOption.split(":").map(Number);
            
            // 2. REMINDER TIME (BEFORE/OFFSET): Calculate the time by subtracting the offset locally.
            // We use the basic moment object and manipulate it to get the resulting time string.
            // NOTE: This assumes the subtraction logic is solely concerned with hours/minutes.
            // This relies on Moment.js parsing the string as local time.
            const reminderMoment = moment(dueDateTime) // Parse as local time
              .subtract(hrs, "hours")
              .subtract(mins, "minutes");
    
            // Format only the time component (HH:mm:ss)
            reminderTime = reminderMoment.format("HH:mm:ss"); 
          } else {
            // 3. REMINDER TIME (CUSTOM): The custom time is already a local time string.
            // We just need to ensure it's in the correct 'HH:mm:ss' format.
            // Since customReminderTime is from a <TextField type="time">, it's already 'HH:mm'.
            reminderTime = `${customReminderTime}:00`; 
          }
        }
    
        // CREATE TASK
        const newTask = await createTask({
          title,
          due_date: dueDateTime, // Sending the local ISO string
          reminder_time: reminderTime // Sending the local time string
        });

        
    
        console.log("Task created:", newTask);
        
    
        addTask(newTask);
    
    
    
        // RESET
        setOpenQuickModal(false);
        setFormData({
          title: "",
          dueDate: "",
          dueTime: "",
          reminderOption: "00:30",
          customReminderTime: "09:00"
        });
        setReminderEnabled(true);
    
        setOpenNewSnackbar(true);
        navigate(`/dashboard/tasks/${newTask.id}`);
    
      } catch (error) {
        console.error("Error creating task:", error);
      }
    };
    

       const handleAddNewTask = async () => {
      const { title, dueDate, dueTime, reminderOption, customReminderTime } = formData;
    
      // VALIDATION
      if (!title) {
        alert("Please enter title!");
        return;
      }
    
      if (!dueDate) {
        alert("Please select a due date!");
        return;
      }
    
      try {
        // 1. DUE DATE: Combine date and time into a local ISO-like string (e.g., "2025-12-01T16:46")
        // This string does not contain 'Z' or a timezone offset, so the backend interprets it
        // based on its default settings (often as UTC, or as a naive local timestamp).
        const dueDateTime = `${dueDate}T${dueTime || "00:00"}`; 
    
        // REMINDER
        let reminderTime = null;
    
        if (reminderEnabled) {
          if (reminderOption !== "custom") {
            const [hrs, mins] = reminderOption.split(":").map(Number);
            
            // 2. REMINDER TIME (BEFORE/OFFSET): Calculate the time by subtracting the offset locally.
            // We use the basic moment object and manipulate it to get the resulting time string.
            // NOTE: This assumes the subtraction logic is solely concerned with hours/minutes.
            // This relies on Moment.js parsing the string as local time.
            const reminderMoment = moment(dueDateTime) // Parse as local time
              .subtract(hrs, "hours")
              .subtract(mins, "minutes");
    
            // Format only the time component (HH:mm:ss)
            reminderTime = reminderMoment.format("HH:mm:ss"); 
          } else {
            // 3. REMINDER TIME (CUSTOM): The custom time is already a local time string.
            // We just need to ensure it's in the correct 'HH:mm:ss' format.
            // Since customReminderTime is from a <TextField type="time">, it's already 'HH:mm'.
            reminderTime = `${customReminderTime}:00`; 
          }
        }
    
        // CREATE TASK
        const newTask = await createTask({
          title,
          due_date: dueDateTime, // Sending the local ISO string
          reminder_time: reminderTime // Sending the local time string
        });

        
    
        console.log("Task created:", newTask);
        
    
        addTask(newTask);
    
    
    
        // RESET
        setOpen(false);
        setFormData({
          title: "",
          dueDate: "",
          dueTime: "",
          reminderOption: "00:30",
          customReminderTime: "09:00"
        });
        setReminderEnabled(true);
    
        setOpenNewSnackbar(true);

        navigate(`/dashboard/tasks/${newTask.id}`);
    
      } catch (error) {
        console.error("Error creating task:", error);
      }
    };
    
    





  
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

    <CustomButton  onClick={openModal} text="Create Tasks">
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
    </CustomButton>

</div>
 
        <ReusableFormModal
          open={open}
          onClose={handleClose}
          title="New Task"
          fields={fields} // This only contains title, date, time now
          formData={formData}
          onChange={handleChange}
          onSubmit={handleAddNewTask}
          colors={colors}
        >
          {/* 1. REMINDER TOGGLE (Your desired TOP element) */}
          <div className="flex justify-between items-center mt-2">
            <span style={{ color: colors.text.primary }}>Reminder</span>
            <Switch
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
            />
          </div>
        
          {/* 2. REMINDER OPTION DROPDOWN (Now rendered after the Toggle) */}
          {reminderEnabled && ( // Optionally hide the select if reminder is disabled
            <TextField
              select
              fullWidth
              label="Reminder Time" // This was the label of your old fields item
              name="reminderOption"
              value={formData.reminderOption || "00:30"} // Ensure a default value is set
              onChange={handleChange}
              margin="normal"
            >
              {/* Recreate the options from your original fields array */}
              <MenuItem value="00:05">5 minutes before</MenuItem>
              <MenuItem value="00:10">10 minutes before</MenuItem>
              <MenuItem value="00:30">30 minutes before</MenuItem>
              <MenuItem value="01:00">1 hour before</MenuItem>
              <MenuItem value="custom">Custom…</MenuItem>
            </TextField>
          )}
        
          {/* 3. CUSTOM REMINDER */}
          {reminderEnabled && formData.reminderOption === "custom" && (
            <TextField
              fullWidth
              type="time"
              label="Custom Reminder"
              name="customReminderTime"
              value={formData.customReminderTime}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          )}
        </ReusableFormModal>

          <Snackbar
                              open={openNewSnackbar}
                              autoHideDuration={3000}
                              onClose={() => setOpenNewSnackbar(false)}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            >
                              <MuiAlert onClose={() => setOpenNewSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                                Task successfully created!
                              </MuiAlert>
                            </Snackbar>


          <div className="flex flex-col items-center justify-center h-[50vh] w-full text-center p-6">
            <div className="w-7/12">
              <Empty/>
            </div>
        
          </div>

          {/* Mobile floating + button 
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

*/}


     
    </div>
  );
}

 
  
    return (
<div className="w-full p-4  grid gap-1 grid-cols-1  sm:grid-cols-12 p-2 flex min-h-screen">
    
 <ReusableFormModal
          open={openQuickModal}
          onClose={handleCloseQuickModal}
          title="New Task"
          fields={fields} // This only contains title, date, time now
          formData={formData}
          onChange={handleChange}
          onSubmit={handleCreateTask}
          colors={colors}
        >
          {/* 1. REMINDER TOGGLE (Your desired TOP element) */}
          <div className="flex justify-between items-center mt-2">
            <span style={{ color: colors.text.primary }}>Reminder</span>
            <Switch
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
            />
          </div>
        
          {/* 2. REMINDER OPTION DROPDOWN (Now rendered after the Toggle) */}
          {reminderEnabled && ( // Optionally hide the select if reminder is disabled
            <TextField
              select
              fullWidth
              label="Reminder Time" // This was the label of your old fields item
              name="reminderOption"
              value={formData.reminderOption || "00:30"} // Ensure a default value is set
              onChange={handleChange}
              margin="normal"
            >
              {/* Recreate the options from your original fields array */}
              <MenuItem value="00:05">5 minutes before</MenuItem>
              <MenuItem value="00:10">10 minutes before</MenuItem>
              <MenuItem value="00:30">30 minutes before</MenuItem>
              <MenuItem value="01:00">1 hour before</MenuItem>
              <MenuItem value="custom">Custom…</MenuItem>
            </TextField>
          )}
        
          {/* 3. CUSTOM REMINDER */}
          {reminderEnabled && formData.reminderOption === "custom" && (
            <TextField
              fullWidth
              type="time"
              label="Custom Reminder"
              name="customReminderTime"
              value={formData.customReminderTime}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          )}
        </ReusableFormModal>

          <Snackbar
                              open={openNewSnackbar}
                              autoHideDuration={3000}
                              onClose={() => setOpenNewSnackbar(false)}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            >
                              <MuiAlert onClose={() => setOpenNewSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                                Task successfully created!
                              </MuiAlert>
                            </Snackbar>


    
   
    
    

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
                   <Button onClick={openCreateModal} sx={{backgroundColor: "#A89FE3", borderRadius: 100, color: "#FFFFFF", textTransform: "none", paddingY: 0.5, paddingX: 2, gap: 0.2}}>
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
      options={["pending", "in-progress", "completed"]}
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
        

            {/* Scrollable Goals Container */}
            <div 
          
              // Adjust padding/margin for scroll buttons on desktop, or full width on mobile
              className='flex gap-2 overflow-x-auto no-scrollbar w-full md:w-full md:mx-auto'
            >
              {finalFilteredTasks.map((t) => (
                // Use the pre-calculated linkPath
                <Link key={t.id} to={t.linkPath} className='md:w-6/12 w-full min-w-[280px] list-none block'>
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

          </>
        )}
      </div>











</div>



                          



     
   

    
       

      
</div> 
{/* 🚀 AI TASK COACH INSIGHTS (RIGHT COLUMN) 🚀 */}
{/* 🚀 AI TASK COACH INSIGHTS (RIGHT COLUMN) 🚀 */}
<Box
  className="mt-4 md:col-span-5 col-span-12 md:ml-4 ml-0 rounded-2xl p-6"
  sx={{
    backgroundColor: colors.background.paper,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  }}
>

  {dashboardStats ? (
    <Stack spacing={4}>
      {/* === 1. TODAY'S FOCUS === */}
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ color: colors.text.secondary }}
        >
        
          Today's Productivity
        </Typography>
          <div className="p-2 mt-2 flex gap-2  items-center  rounded-lg" style={{backgroundColor: colors.menu.primary}}>
            <span style={{ color: "#10D3F1", fontWeight: "bold", fontSize: "1.1rem" }}>
            {dashboardStats.tasks_completed_today.count + dashboardStats.ai_tasks_completed_today.count}
          </span>
                <Typography
          variant="body2"
          sx={{ color: colors.text.primary}}
        >
          {" "}
          Tasks Finished Today!
        </Typography>
          </div>
      
        {dashboardStats.ai_tasks_completed_week.count > 0 && (
          <Typography
            variant="body2"
            sx={{ color: colors.text.secondary, mt: 0.5 }}
          >
            ✅ Weekly Win: Completed "{dashboardStats.ai_tasks_completed_week.titles[0]}" this week.
          </Typography>
        )}
      </Box>

      {/* === 2. COMMITMENT GAPS === */}
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ color: colors.text.secondary }}
        >
          <WarningAmberIcon fontSize="small" sx={{ color: colors.background.warning }} />
          Commitment Gaps
        </Typography>
        <Stack spacing={1} mt={1}>
          {dashboardStats.least_tags.length > 0 ? (
            dashboardStats.least_tags.map(([tag, count]) => (
              <Box key={tag} sx={{ p: 1, borderRadius: 2, backgroundColor: colors.background.default }}>
                <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: "bold" }}>
                  🚨 {tag}: {count} overdue task(s)
                </Typography>
                <Typography variant="caption" sx={{ color: colors.background.warning }}>
                  Nudge: This area is suffering from procrastination. Break down the oldest task now.
                </Typography>
              </Box>
            ))
          ) : (
            <div className="p-2 rounded-lg" style={{backgroundColor: colors.menu.primary}}>
               <Typography variant="body2" sx={{ color: "#10D3F1" }}>
              Great job! No overdue tasks detected.
            </Typography>

            </div>
           
          )}
        </Stack>
      </Box>

      {/* === 3. EFFORT & FOCUS SUMMARY === */}
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ color: colors.text.secondary }}
        >
          <TrendingUpIcon fontSize="small" sx={{ color: "#20A0E6" }} />
          Effort & Success Map
        </Typography>
        <Stack spacing={1} mt={1}>
          {dashboardStats.popular_tags.length > 0 && (
            <Box sx={{ p: 1, borderRadius: 2, backgroundColor: colors.menu.primary }}>
              <Typography variant="body2" sx={{ color: colors.text.primary }}>
                ✨ Current Focus: {dashboardStats.popular_tags[0][0]} ({dashboardStats.popular_tags[0][1]} recent activities)
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Your energy is here. Ensure this focus supports your main goals.
              </Typography>
            </Box>
          )}
          {dashboardStats.top_tags.length > 0 && (
            <Box sx={{ p: 1, borderRadius: 2, backgroundColor: colors.menu.primary }}>
              <Typography variant="body2" sx={{ color: colors.text.primary }}>
                🏆 Proven Success: {dashboardStats.top_tags[0][0]} (Completed {dashboardStats.top_tags[0][1]} tasks)
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Leverage this momentum. Apply successful strategies here to your Commitment Gaps.
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Stack>
  ) : (
    <Box className="w-full flex justify-center items-center h-full min-h-[150px]">
      <CircularProgress size={28} sx={{ color: colors.primary[500] }} />
    </Box>
  )}
</Box>

</div>
    
  );
};

export default Tasks;