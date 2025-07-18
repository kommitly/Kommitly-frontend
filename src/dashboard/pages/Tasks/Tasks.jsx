import { useContext, useEffect, useState, useRef } from "react";
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
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { Divider } from '@mui/material';





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
  const [aiTasks, setAiTasks] = useState([]);
  const [menuVisible, setMenuVisible] = useState({});
  const {removeTask, addTaskToSidebar} = useContext(TasksContext); // Use the TasksContext
  const [showFilters, setShowFilters] = useState(false);
  const [task, setTask] = useState({ title: "", due_date:null, reminder_time: null, progress: 0, priority: "Low", subtasks: [] });
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file
  const [newSubtask, setNewSubtask] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [newSubtasks, setNewSubtasks] = useState([]);
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  




  useEffect(() => {
    if (tasks.length > 0) { // Check if tasks array has items
      setLoading(false);
      console.log("tasks", tasks);
    }
    if (goals.goals && goals.ai_goals) {
      setLoading(false);
      console.log("ai goals", goals.ai_goals);
    }
  }, [tasks, goals]);
  
  

  // Filter tasks based on selected date
  const filteredTasksByDate = tasks.filter((task) => {
    if (!task.due_date) return false; // Ensure task has a due date
  
    const taskDate = new Date(task.due_date).toISOString().split("T")[0]; // Extract "YYYY-MM-DD"
    const selectedDateFormatted = selectedDate.format("YYYY-MM-DD"); // Ensure consistency
  
    return taskDate === selectedDateFormatted;
  });
  
  //filter ai tasks
  const filterAiTasks = (category) => {
    if (!goals.ai_goals || goals.ai_goals.length === 0) return [];
  
    const aiTasks = goals.ai_goals.flatMap(goal => goal.ai_tasks) ?? [];
    console.log("AI Tasks:", aiTasks);
  
    switch (category) {
      //case 'recentlyAdded':
       // return [...aiTasks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'inProgress':
        return aiTasks.filter(task => task.progress > 0 && task.progress < 100);
      //case 'pending':
        //return aiTasks.filter(task => task.progress === 0);
        case 'pending':
    return aiTasks.filter(task => task.status === 'pending');
      //case 'completed':
        //return aiTasks.filter(task => task.progress === 100);
        case 'completed':
    return aiTasks.filter(task => task.status === 'completed');
      default:
        return [];
    }
  };
  
  const filterLabels = [
 // { key: "recentlyAdded", label: "Recently Added" },
  { key: "inProgress", label: "In Progress" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" }
];

  
  
  const filterTasks = (category) => {
    switch (category) {
     // case 'recentlyAdded':
        //return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'inProgress':
        return tasks.filter(task => task.progress > 0 && task.progress < 100);
      //case 'pending':
        //return tasks.filter(task => task.progress === 0);
         case 'pending':
        return tasks.filter(task => task.status === 'pending');
      //case 'completed':
        //return tasks.filter(task => task.progress === 100);
         case 'completed':
        return tasks.filter(task => task.status === 'completed');
      default:
        return [];
    }
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
        //navigate(`/dashboard/task/${newTask.id}`); // Use newTask.id instead of undefined goal.id
      } catch (error) {
        console.error("Error creating task:", error);
      }
    };
    
    const scrollTasks = (direction) => {
      if (tasksContainerRef.current) {
        const scrollAmount = direction === 'left' ? -300 : 300;
        tasksContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };
    const scrollAiTasks = (direction) => {
      if (aiTasksContainerRef.current) {
        const scrollAmount = direction === 'left' ? -300 : 300;
        aiTasksContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

  const filteredTasks = filterTasks(selectedCategory);
  const filteredAiTasks = filterAiTasks(selectedAiCategory);

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
  
    return (
<div className="w-full  grid gap-1 grid-cols-1  sm:grid-cols-12 p-2 flex min-h-screen">
    

    
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

    <div className=" md:flex flex-col md:col-span-7 col-span-12  md:p-0 p-0"> 
       
        <Box className='w-full  container md:h-46 xl:h-50 2xl:h-64  h-36 flex items-center justify-between rounded-2xl bg-[#F4F1FF] md:p-8 xl:p-8 p-6 pl-4 md:mt-4 mt-0'
        sx={{backgroundColor:colors.background.paper}}
        >
      
                  <div className='space-y-4 h-full'>
                    <h1 className='text-2x1  font-semibold'><p
               
              className="font-semibold md:text-xl  xl:text-xl  2xl:text-3xl text-base"
              style={{ color: colors.text.primary }}
              
            >Manage your Tasks 
            </p></h1>
                   <Button onClick={openModal}  className=' flex items-center text-sm font-light text-white px-4 gap-2 py-2 cursor-pointer rounded-lg' sx={{backgroundColor:"#4F378A", borderRadius: '6px', paddingX: '12px'}}>
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
                                 className="hidden md:block"
                                   style={{ stroke: '#FFFFFF' }} // Inline style to ensure white stroke
                                 >
                                   <line x1="12" y1="5" x2="12" y2="19" />
                                   <line x1="5" y1="12" x2="19" y2="12" />
                                 </svg>
                                 <p
                                   
                                   className='md:text-xs text-xs xl:text-sm 2xl:text-xl '
                                   style={{ color: colors.primary[100] }}
                                  
                                 >
                                 Create New Task
                                 </p>
                               </Button>
                  </div>
                  <img src={analysis} alt='Analysis' className='md:h-46  h-28 xl:h-52 2xl:h-60' />
                </Box>

  <div>
        <h1 className='text-lg font-medium mt-8'>
          <Typography
                        component="span"
                        variant="h3"
                        className=" text-semibold"
                        color='text.primary'
                        >AI Tasks </Typography>
          </h1>
          
      <div className="flex mt-4 relative  p-1 rounded-md md:w-7/12 w-full" style={{ backgroundColor: colors.tag.primary}}>

  {/* Sliding Background */}
  <div
    className="absolute top-1 left-2  bottom-1 mx-2 w-1/3 bg-[#4F378A] shadow-sm shadow-[#4F378A] rounded-sm transition-all duration-300 ease-in-out"
    style={{
      left: `${["inProgress", "pending", "completed"].indexOf(selectedAiCategory) * 31.3}%`,
    }}
  />

  {/* Buttons */}
  {["inProgress", "pending", "completed"].map((category,i) => (
    <button
      key={category}
      onClick={() => setSelectedAiCategory(category)}
      className={`
        relative z-10 w-2/3  px-4 py-1 text-sm   text-center transition-colors duration-200 cursor-pointer hover:text-[#6D5BA6]
        ${selectedAiCategory === category ? "text-white" : colors.text.primary}
      `}
    >
      {category === "inProgress"
        ? "In Progress"
        : category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  ))}
</div>


        </div>


      <div className='relative mt-4'>
        {filteredAiTasks.length === 0 ? (
  <div className="text-sm text-gray-600 w-full text-center py-4">
    No AI Tasks fall under this category.
  </div>
) : (
  <>

       {filteredAiTasks.length > 3 && ( // Show left scroll button only if there are more than 3 tasks
  <button 
    onClick={() => scrollAiTasks('left')} 
    className="absolute cursor-pointer left-0 top-8 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
    style={{ backgroundColor: colors.tag.primary }}
  >  
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  </button>
)}



      <div ref={aiTasksContainerRef} className='flex gap-2  overflow-x-auto no-scrollbar   w-10/12 md:ml-14 ml-10'>
        {filteredAiTasks.map((task) => (
          <Link key={task.id} to={`/dashboard/ai-task/${task.id}`}>
          <li className=' w-1/3 min-w-[280px] min-h-[100px] list-none '>
          <Box className='flex w-full items-center h-full px-2 py-4 rounded-xl'sx={{backgroundColor:colors.background.paper}}>
            <div className='w-1/4  full overflow-hidden '>
              {/*<img src={aiGoals} alt="goals" className='h-auto'/> */}
            </div>
            <div className='w-full h-auto flex flex-col gap-0'>
              <div className='flex items-start h-10 mb-1 justify-between'>
                <span className='w-full h-auto font-regular' >
                  {task.title}
                </span>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65558F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer" 
                
                onClick={(e) => {
                  e.stopPropagation(); // Prevents clicking the menu from triggering other actions
                  e.preventDefault(); // Prevents the default action of the event
                  toggleTaskMenu(task.id)}}>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>

                {menuVisible[task.id] && (
                        <div className="absolute  mt-2 w-30 bg-white shadow-lg rounded-md z-[100]">
                          <button
                            className="block w-full text-left px-3 py-1 text-xs text-black hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault(); // Prevents the default action of the event
                              addTaskToSidebar(task.id);

                            }}
                          >
                            Add to Sidebar
                          </button>
                          <button
                            className="block w-full text-left px-3 py-1 text-xs text-[#E60178] hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault(); // Prevents the default action of the event
                              handleDeleteTask(task.id);
                            }}
                          >
                            Delete Task
                          </button>
                        </div>
                      )}
                      </div>

              </div>
              {/*<div className="flex items-center">
                  <p className="w-20 md:text-xs xl:text-xs 2xl:text-sm font-medium text-[#65558F]">Timeline:</p>
                  <span className="px-3 py-0.5 border border-[#65558F] 2xl:text-sm  rounded-sm md:text-xs xl:text-xs text-[#65558F]">
                  {task.task_timeline}
                  </span>
                  </div>*/}
            </div>
          </Box>
          </li>
          </Link>
        ))}
     </div>
    
     <button onClick={() => scrollAiTasks('right')} className='absolute right-0 top-8 transform -translate-y-1/2  w-10 h-10 p-2 rounded-full cursor-pointer' style={{ backgroundColor: colors.tag.primary }}>
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <polyline points="9 18 15 12 9 6" />
       </svg>
     </button>
     </>
     )}
     
    </div>

    <div>
      <h1 className='text-lg font-medium mt-8'>
        <Typography
                    component="span"
                    variant="h3"
                    className=" text-semibold"
                    color='text.primary'
                  >
                  Tasks
        </Typography>
      </h1>
      <div className="flex mt-4 relative p-1 rounded-md md:w-7/12 w-full" style={{backgroundColor: colors.tag.primary}} >

  {/* Sliding Background */}
  <div
    className="absolute top-1 bottom-1 mx-2 w-1/3 bg-[#4F378A] shadow-sm shadow-[#4F378A] rounded-sm transition-all duration-300 ease-in-out"
     style={{
      left: `${["inProgress", "pending", "completed"].indexOf(selectedCategory) * 31.3}%`,
    }}
  />

  {/* Buttons */}
  {["inProgress", "pending", "completed"].map((category) => (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      className={`
        relative z-10 w-2/3  px-4 py-1 text-sm text-center transition-colors duration-200 cursor-pointer hover:text-[#6D5BA6]
        ${selectedCategory === category ? "text-white" :  colors.text.primary}
      `}
    >
      {category === "inProgress"
        ? "In Progress"
        : category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  ))}
</div>


        </div>

    
    <div className='relative mt-4'>
      {filteredAiTasks.length > 3 && (
        <button onClick={() => scrollTasks('left')} className='absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2  w-10 h-10 rounded-full flex items-center justify-center' style={{ backgroundColor: colors.tag.primary }}
        >  <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
           </svg>
        </button>
      )}
          <div ref={tasksContainerRef} className='flex gap-2 overflow-x-auto no-scrollbar  w-10/12 md:ml-14 ml-10'>
            {filteredTasks.map((task) => (
              <Link key={task.id} to={`/dashboard/tasks/${task.id}`}> 
              <li className=' w-1/3 min-w-[280px] min-h-[100px] list-none  '>
                <Box className='flex w-full items-center h-full px-2 py-4 rounded-xl' sx={{backgroundColor:colors.background.paper}}>
                  <div className='w-1/4 full overflow-hidden '>
                   {/*<img src={aiGoals} alt="goals"  className='h-auto'/> */}
                  </div>
                  <div className='w-full h-auto flex flex-col gap-0'>
                    <div className='flex h-10 mb-1 items-start  justify-between'>
                    <span className='w-full h-auto font-medium'>
                    {task.title}
                    </span>

                    <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65558F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation(); // Prevents clicking the menu from triggering other actions
                  e.preventDefault(); // Prevents the default action of the event
                  toggleTaskMenu(task.id);
                  }}>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>

                {menuVisible[task.id] && (
                        <div className="absolute mt-2 w-30 bg-white shadow-lg rounded-md z-[100]">
                          <button
                            className="block w-full  text-left px-3 py-1 text-xs text-black hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault(); // Prevents the default action of the event
                              addTaskToSidebar(task.id);
                            }}
                          >
                            Add to Sidebar
                          </button>
                          <button
                            className="block w-full text-left px-3 py-1 text-xs text-[#E60178] hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault(); // Prevents the default action of the event
                              handleDeleteTask(task.id);
                            }}
                          >
                            Delete Task
                          </button>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>  
                    
                </Box>
              </li>
              </Link>
            ))}
          </div>

          {filteredAiTasks.length === 0 ? (
  <div className="text-sm text-gray-600 w-full text-center py-4">
    No Tasks fall under this category.
  </div>
) : (
  <>
          
        <button onClick={() => scrollTasks('right')} className='absolute right-0 top-1/2 transform -translate-y-1/2  w-10 h-10 p-2 rounded-full cursor-pointer' style={{ backgroundColor: colors.tag.primary }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
              >
               <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        </>
          )}
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
      <div className="mt-4  rounded-xl  p-4" style={{ backgroundColor: colors.background.default }}>
        {filteredTasksByDate.length ? (
          filteredTasksByDate.map((task, index) => (
            <div
              key={index}
              className="p-6  flex justify-between my-3   rounded-xl" 
              style={{
  
             backgroundColor: colors.background.paper,
 
}}

            > 
            <div className='flex  gap-2'>
              <div className='w-[4px] bg-[#4F378A]  rounded-full flex items-center justify-center'>

              </div>
              <div>
                <p className=" h-auto p-2 text-1g font-medium text-gray-900" style={{
                  color: colors.text.primary,
                }}>{task.title}</p>
              </div>
              </div>
              <button className="px-4 py-2 bg-[#6246AC] text-white text-sm rounded-lg hover:bg-purple-600">
                {task.due_date ? new Date(task.due_date).toLocaleTimeString([], {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}) : ''}
              </button>
              <div className='py-4'>
                                <Divider orientation="horizontal" sx={{ borderColor: "#00000", opacity: 0.8 }} />
                              </div>
            </div>
            
          ))
        ) : (
          <p className="text-gray-500 mt-2">No tasks for this day</p>
        )}

<button onClick={openModal}  className='bg-[#6246AC] flex items-center text-xs sm:text-sm font-light text-white mt-2 px-4 gap-2 py-2 rounded-md'>
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
                        style={{ stroke: '#FFFFFF' }} // Inline style to ensure white stroke
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add New Task
                    </button>
      </div>
    



  
  </Box> 
</div>
    
  );
};

export default Tasks;
