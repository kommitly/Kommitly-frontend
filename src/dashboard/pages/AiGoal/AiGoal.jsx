import  { useEffect, useState,useCallback, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { fetchAiGoalById, deleteAiGoalById, updateAiGoalById, updateAiTaskStatus,updateAiTaskById, deleteAiTaskById, createAiTask , updateAiSubtaskById, createAISubtask} from '../../../utils/Api'; // Adjust the import path as needed
import flag from '../../../assets/flag-dynamic-color.svg';
import { GoDotFill } from "react-icons/go";
import { Divider } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { CiMenuKebab } from "react-icons/ci";
import { GoalsContext } from '../../../context/GoalsContext'; // Adjust the import path as needed
import { TasksContext } from '../../../context/TasksContext'; // Adjust the import path as needed
import GoalTrophyAnimation from './GoalTrophyAnimation';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Button from '../../components/Button'
import TrophyAnimation from './TrophyAnimation';
import PickerWithButtonField from './PickerWithButtonField';
import GoalBadgeAnimation from './GoalBadge';
import aiGoals from '../../../assets/goals.svg';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import Loading from '../../components/Loading';
import * as motion from "motion/react-client"
import { VisibilityRounded } from '@mui/icons-material';
import AiSubtask from './AiSubtask';
import goal from '../../../assets/goal.svg';
import useMediaQuery from '@mui/material/useMediaQuery';
import AiSubtaskPage from './AiSubtaskPage'; // Adjust the import path as needed
import AiAssistance from '../../components/AiAssistance';
import { color } from 'framer-motion';
import { BsHourglassSplit } from "react-icons/bs";
import { BsHourglassTop } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import { RiProgress1Line } from "react-icons/ri";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useSidebar } from '../../../context/SidebarContext';
import ReusableFormModal from '../../components/ReusableFormModal';

const extractTimeline = (description) => {
  if (!description) return { timeline: 'No detail available', cleanedDetails: description };

  //console.log('Details:', description); // Debugging

   // Updated regex to match time ranges and single values even without parentheses
   const match = description.match(/\b(\d+-\d+ (days|weeks|months|years)|\d+ (day|week|month|year)|On-going|Ongoing|\d+\s*(days|weeks|months|years))\b/i);

  //console.log('Match:', match); // Debugging

  const timeline = match ? match[1] : 'No timeline available';
  let cleanedDetails = match ? description.replace(match[0], '').trim() : description;

  // Remove empty parentheses
  cleanedDetails = cleanedDetails.replace(/\s*\(\s*\)\s*/g, '');

  return { timeline, cleanedDetails };
};

const pathVariant = {
  hidden : {
    opacity: 0,
    pathLength: 0,      
  },

  visible: { 
    opacity: 1, 
    pathLength: 1,
    transition: {
      duration: 1,
      ease: "easeIn"
    }
  }
  
 
}



const StatusIcon = ({ status, color, size = 16 }) => {
  const iconColor = color || "#000";
  switch (status?.toLowerCase().replace(/[-_]/g, " ")) {
  case "pending":
    return <CiCircleMore size={size} color={iconColor} />;
  case "in progress":
    return <RiProgress1Line size={size} color={iconColor} />;
  case "completed":
  case "done":
    return <AiOutlineCheckCircle size={size} color={iconColor} />;
  default:
    return <CiCircleMore size={size} color={iconColor} />;
}

};





const AiGoal = () => {
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebar();
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null); // Active task state
  const [taskCompletionStatus, setTaskCompletionStatus] = useState([]); // Track completion of each task
  const [isVisible, setIsVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { removeGoal, removeGoalFromSidebar } = useContext(GoalsContext);
  const { addGoalToSidebar} = useContext(GoalsContext);
  const { removeTask } = useContext(TasksContext);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [subtaskOpen, setSubtaskOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [addSubtaskOpen,setAddSubtaskOpen] = useState(false);
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);
  const [isTaskRenaming, setIsTaskRenaming] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedStep, setSelectedStep] = useState(null);
  const { reloadGoals } = useContext(GoalsContext); 
  const [renamingTaskId, setRenamingTaskId] = useState(null);
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const [openTaskView, setOpenTaskView] = useState(false);
  const [dueDates, setDueDates] = useState({});
  const [aiAnswer, setAiAnswer] = useState(null);
  const [lineY2, setLineY2] = useState(230);
  const [visible, setVisible] = useState(true); // Or false initially depending on your logic
  const menuRefs = useRef([]);
  const inputTaskRefs = useRef([]);
  const goalMenuRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  


 
    const loadGoal = useCallback(async () => {
      try {
            const fetchedGoal = await fetchAiGoalById(goalId);
            setGoal(fetchedGoal);
            console.log('Fetched goal:', fetchedGoal);
             // Update taskCompletionStatus based on fetched goal data
            setTaskCompletionStatus(fetchedGoal.ai_tasks.map(task => task.status === 'completed'));

            const inProgressTaskIndex = fetchedGoal.ai_tasks.findIndex(task => task.status === 'in-progress');
            setActiveTaskIndex(inProgressTaskIndex !== -1 ? inProgressTaskIndex : 0);
            return fetchedGoal;
          } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [goalId]);
    
    useEffect(() => {
        loadGoal();
    }, [loadGoal]);

    const handleClose = () => {
      setOpen(false);
    };
    const handleDeleteClose = () => {
      setOpenDelete(false);
    };

  const handleCloseTaskView = () => {
    setOpenTaskView(false);
  };
 
const handleStepCheck = async (subtaskId) => {
  console.log("✅ Clicked subtask:", subtaskId);

  const activeTask = goal.ai_tasks[activeTaskIndex];
  const stepIndex = activeTask.ai_subtasks.findIndex(s => s.id === subtaskId);
  if (stepIndex === -1) return console.error("Subtask not found:", subtaskId);

  const taskId = activeTask.id;
  const step = activeTask.ai_subtasks[stepIndex];
  const newStatus = step.status === "completed" ? "pending" : "completed";

  // 🔹 1. Optimistically update UI
  const updatedGoal = { ...goal };
  updatedGoal.ai_tasks[activeTaskIndex].ai_subtasks[stepIndex].status = newStatus;
  setGoal(updatedGoal); // 👈 instant UI feedback

  try {
    // 🔹 2. Update backend
    await updateAiSubtaskById(taskId, subtaskId, { status: newStatus });

    // 🔹 3. Optionally sync with backend after success
    const freshGoal = await loadGoal();
    setGoal(freshGoal);

    const updatedTask = freshGoal.ai_tasks[activeTaskIndex];
    if (updatedTask.ai_subtasks.every(s => s.status === "completed")) {
      handleTaskCompletion(freshGoal, updatedTask);
    }

  } catch (error) {
    console.error("Failed to update subtask:", error);

    // 🔹 4. Rollback on error
    const rolledBackGoal = { ...goal };
    rolledBackGoal.ai_tasks[activeTaskIndex].ai_subtasks[stepIndex].status = step.status;
    setGoal(rolledBackGoal);
  }
};



 const handleTaskCompletion = async () => {
    
    // Show confetti when the current task is completed
    setIsVisible(true);
    console.log('Confetti visible:', true); // Debugging
     
  
    try {
      const taskId = goal.ai_tasks[activeTaskIndex].id;

      const response = await updateAiTaskStatus(taskId, { status: "completed" });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }
   
    
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  
    setTimeout(() => {
      setIsVisible(false);
       // **Fetch updated goal data to refresh progress and completed_at**
   
      loadGoal(); 
  
      // Move to next task if it exists
      if (activeTaskIndex + 1 < goal.ai_tasks.length) {
        const nextTaskIndex = activeTaskIndex + 1;
        setActiveTaskIndex(nextTaskIndex);
      }
      else {
        setOpen(true); // Show modal when all tasks are completed
         if (window.innerWidth < 768) {
        setOpenTaskView(false);
      }

      }
    
    }, 1000); // Hide confetti after 2 seconds
  };
  

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleTaskMenu = (id) => {
    setTaskMenuVisible(prevId => (prevId === id ? null : id)); // Toggle menu for the selected task
  };

  useEffect(() => {
  const updateY2 = () => {
    setLineY2(window.innerWidth < 640 ? 200 : 230); // Adjust for small screens (e.g., <640px)
  };



  updateY2(); // Initial run
  window.addEventListener("resize", updateY2); // Update on resize

  return () => window.removeEventListener("resize", updateY2);
}, []);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
    }
    if (isTaskRenaming && inputTaskRefs.current) {
      inputTaskRefs.current.focus();
    }

    
  }, [isRenaming, isTaskRenaming]);

  useEffect(() => {
  console.log("isTaskRenaming:", isTaskRenaming);
  console.log("renamingTaskId:", renamingTaskId);
}, [isTaskRenaming, renamingTaskId]);



  useEffect(() => {
  document.body.style.overflow = subtaskOpen ? 'hidden' : 'auto';
  return () => {
    document.body.style.overflow = 'auto';
  };
}, [subtaskOpen]);

  const handleUpdate = async () => {
    if (!newTitle.trim() || newTitle === goal.title) {
      setIsRenaming(false); // Cancel rename if empty or unchanged
      return;
    }
  
    try {
      await updateAiGoalById(goalId, newTitle, goal.description);
      setGoal((prevGoal) => ({ ...prevGoal, title: newTitle }));
      setIsRenaming(false);
      setMenuVisible(false);
    } catch (error) {
      setError(error.message);
    }
  };

    useEffect(() => {
    const handleClickOutside = (event) => {
        // Check if the click happened outside of ANY of the task menus.
      // The .some() method checks if at least one item in the array passes the test.
      const isClickInsideAnyTaskMenu = menuRefs.current.some(ref => ref && ref.contains(event.target));
      
      if (!isClickInsideAnyTaskMenu) {
        setTaskMenuVisible(null); // Close the task menu if the click was outside of all of them.
      }
      if (goalMenuRef.current && !goalMenuRef.current.contains(event.target)) {
        setMenuVisible(null); // Close the menu
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);






  const handleTaskUpdate = async (task) => {
    if (!newTaskTitle.trim() || newTaskTitle === task.title) {
       setRenamingTaskId(null); // Stop renaming// Cancel rename if empty or unchanged
      return;
    }
  
    try {
      await updateAiTaskById(task.id, newTaskTitle);
      setTask((prevTask) => ({ ...prevTask, title: newTaskTitle }));
      setRenamingTaskId(null);
      setTaskMenuVisible(false);
    } catch (error) {
      setError(error.message);
    }
  };
  

  
  const openSubtaskPage = (step) => {
    setSelectedStep(step);
    setSubtaskOpen(true); // show Backdrop
    // If you also want to navigate to a specific route for the subtask:
   // navigate(`/dashboard/ai-goal/${goalId}/subtask/${step.id}`, { state: { step } });
 
  };

  const closeSubtaskPage = () => {
    setSelectedStep(null);
    setSubtaskOpen(false);
  };

 

  
  const handleDelete = async () => {
    try {
      await deleteAiGoalById(goalId);
      
      removeGoal(goalId); // Remove from state immediately
   

    
      navigate('/dashboard/goals');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteAiTaskById(taskId);
      removeTask(taskId); // Remove from state immediately
      loadGoal(); // Refresh goal data after deletion
    } catch (error) {
      setError(error.message);
    } <Box width={"100%"} justifyContent={"space-between"} display={"flex"} alignItems={"center"} >
    <span className=' text-[#1D1B20] md:text-sm xl:text-sm xl:w-full 2xl:text-base font-regular'>{step.title}</span>
      <ArrowForwardIosOutlinedIcon sx={{ fontSize: 12 }} onClick={() => openSubtaskPage(step)}  />

    </Box>
  };

  const [formData, setFormData] = useState({
    ai_goal: goalId,
    title: "",
    description: "",
    due_date: null,
    status: "pending",
    completed_at: null,
    reminder_time: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleSubtaskChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlesumbitAiTask = async () => {
    try {
      const newTask = await createAiTask({ goalId, taskData: formData });

      // Update the goal state to include the new task
      setGoal((prevGoal) => ({
        ...prevGoal,
        ai_tasks: [...prevGoal.ai_tasks, newTask], // Append the new task
      }));

      alert("AI Task Created Successfully");
      setTaskOpen(false);
      
    } catch (error) {
      alert("Failed to create AI Task");
    }
  };


const handleSubmitAiSubtask = async () => {
  try {
    const activeTask = goal.ai_tasks[activeTaskIndex];

    const newSubtask = await createAISubtask({
      taskId: activeTask.id,    // 👈 make sure this is .id, not the whole object
      title: formData.title
    });

    // Update state with new subtask
    setGoal((prevGoal) => ({
      ...prevGoal,
      ai_tasks: prevGoal.ai_tasks.map((task) =>
        task.id === activeTask.id
          ? { ...task, ai_subtasks: [...(task.ai_subtasks || []), newSubtask] }
          : task
      ),
    }));


    setAddSubtaskOpen(false);
    setOpenSnackbar(true);
  } catch (error) {
    alert("Failed to create AI Subtask");
  }
};

  
  
  
if (loading) {
    return (
         <>
         <Loading/>
         </>
      
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!goal) {
    return (
      <div className='w-full mt-8 flex min-h-screen'>
        <div className="w-11/12 p-8 mt-8 py-8 flex-1 overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
          Goal not found
        </div>
      </div>
    );
  }

   const activeTask = goal.ai_tasks[activeTaskIndex];

   const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 3,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 3,
      boxShadow: '0px 4px 4px rgba(98,0,238,0.2)', // Add shadow here
      backgroundColor: '#6441C1',
      ...theme.applyStyles('dark', {
        backgroundColor: '#E8DEF8',
      }),
    },
  }));
  
  return (
    <div className='w-full  flex min-h-screen md:px-4 px-0'>
      

      <div className="w-full h-full overflow-y-auto  ">
        
        
        <div className=' flex  w-full '>
        <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
      <div
  className="relative md:w-4/12 w-11/12 p-6 rounded-lg shadow-lg text-center"
  style={{ backgroundColor: colors.menu.primary }}
>
  {/* ❌ Close icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.text.placeholder}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="absolute top-4 right-4 cursor-pointer hover:opacity-70 transition"
    onClick={handleClose}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>

  <GoalTrophyAnimation />

  <h1
    className="text-xl font-bold mt-4 flex items-center justify-center gap-2"
    style={{ color: colors.text.secondary }}
  >
    Goal Completed!
  </h1>
  <p
    className="mt-4 text-sm font-normal"
    style={{ color: colors.text.placeholder }}
  >
    You have successfully completed all your tasks!
  </p>
</div>

    
    </Backdrop>

       {isXs && (
    <Backdrop 
     sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openTaskView}
         onClick={(e) => {
    // Only close if user clicks directly on the backdrop (not on the children inside it)
    if (e.target === e.currentTarget) {
      handleCloseTaskView();
    }
  }}>
       <Box className=" actionable-steps w-11/12 space-y-4  rounded-xl mt-4 " sx={{ backgroundColor: colors.menu.primary }}>
              
               
              
            
            
           
            <Box className="text-lg container w-full px-4 py-2 mb-4 rounded-xl bg-[#FFFFFF] relative" sx={{ backgroundColor: colors.menu.primary }}>
              {isVisible ? (<TrophyAnimation />) : 
              (
                  <>
                 <div className='flex justify-between items-center mb-2 gap-4 w-full pr-2'
                 >
                 <p className="md:text-sm lg:text-md flex items-center m-2 gap-2 w-full  text-[#000000] font-normal">
                 {/* {<span className=" md:text-sm lg:text-base">📌</span>} */}
                    {activeTask ? (
                      <>
                       <span className="font-medium  text-lg md:text-sm xl:text-sm 2xl:text-base 
                        " style={{color: colors.text.primary}}>{activeTask.title}</span>
                      </>
                    ) : (
                      "Select a task"
                    )}
                  </p>
                
                 </div>

                <Divider orientation="horizontal" sx={{ borderColor: "#767676", opacity: 0.8 }} />
                <div className='flex mt-4 items-center justify-end gap-4'>
           {/* {     <div className='w-6/12 flex justify-end'
                 >
                 <PickerWithButtonField
  value={dueDates[activeTask?.id] || null}
  onChange={(newDate) =>
    setDueDates((prev) => ({
      ...prev,
      [activeTask.id]: newDate
    }))
  }
/>

                 </div>} */}
             
              
              

          
              
              </div>
              <div className='space-y-6 mt-4'>
              {activeTask &&
  [...activeTask.ai_subtasks] // make a shallow copy
    .sort((a, b) => a.id - b.id) // sort by ID
    .map((step) => { 
      const { timeline, cleanedDetails } = extractTimeline(step.description);
      
                  return (
                    <Box key={step.id}  className="step  p-4 rounded-xl cursor-pointer flex items-center gap-4" sx={{ backgroundColor: colors.background.paper }}>
                    <label className="custom-checkbox">
                        <input
                        type="checkbox"
                        checked={step.status === "completed"}
                        onChange={() => handleStepCheck(step.id)} // Call the new handler
                        size={16}
                        />

                        </label>
                        <div className='w-full' onClick={() => navigate(`/dashboard/ai-goal/${goal.id}/task/${activeTask.id}/subtask/${step.id}`, { state: { step } })}>
                        <div className="flex flex-col w-full ">
                      
                        <Box width={"100%"} justifyContent={"space-between"} display={"flex"} alignItems={"center"} >
                        <span className=' text-sm font-regular' style={{color: colors.text.primary }}>{step.title}</span>
                        
                    
                        </Box>
                    
                      
                      
                      
                      <Box className=' 2xl:h-6 h-6 mt-1 flex items-center  gap-2   ' sx={{ color: colors.text.secondary }}>
                      <AccessTimeIcon fontSize='small'/>
                          <p className='text-xs  font-medium gap-4 '
                          >
                           
                          {timeline}
                            </p>

                      </Box>
                      
                     

                       
                     </div>
                    

                      {/* {  <span className='text-[#49454F] md:text-md xl:text-xs font-light 2xl:text-sm'>{cleanedDetails}</span>} */}
                
                        </div>


            
                     
                    </Box>
                  );
                })}

      {selectedStep && (

        <AiSubtaskPage step={selectedStep} setStep={setSelectedStep} taskId={activeTask?.id}  onClose={closeSubtaskPage} />
      )}
              </div>
              <div className='flex  my-8 w-full justify-center  '>
             {/* { <button onClick={() => setTaskOpen(true)} className='bg-[#4F378A] w-full max-w-sm text-white py-2 px-8 rounded-lg'>
                Add to List
              </button>} */}
             
              </div>
                </>
              )
              }
             
               <div className='flex  my-8 w-full justify-center  '>
         <Button onClick={() => setAddSubtaskOpen(true)} className='w-full' text='Add to List'>
              
              </Button>
              </div>
                        
            

            </Box>

            
          </Box>
      
      
    </Backdrop>
        )}
          <div className='md:px-4 xl:px-0 mt-4 lg:px-0 px-4 xl:w-9/12 lg:w-7/12 md:w-10/12'>
           <div className='flex items-center mb-4 mt-2 gap-4 justify-between'>
              <div className='flex items-center gap-4 2xl:ml-4 '>
               <span className='text-lg'> 🚩</span>
                {isRenaming ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate()} // Only update on Enter key
                      onBlur={handleUpdate} // Update when clicking away
                      ref={inputRef}
                      className="md:text-md font-semibold border border-gray-300 rounded-md p-1"
                    />
                  ) : (
                    <h1 className='md:text-lg text-xl  xl:text-lg 2xl:text-xl font-medium'>{goal.title}</h1>
                  )}


              </div>

              <div className="relative" ref={goalMenuRef}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#65558F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer"
                onClick={toggleMenu}
              >
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
               {menuVisible && (
                  <div className="absolute right-0 mt-2 w-48  rounded-md shadow-lg z-50" style={{ backgroundColor: colors.menu.primary }}>
                    <button 
                      onClick={() => {
                        setIsRenaming(true);
                        setTimeout(() => inputRef.current?.focus(), 0); // Ensure focus on input
                      }} 
                      className="block w-full text-left px-4 py-2 text-xs  hover:bg-[#D6CFFF]/20" style={{ color: colors.text.primary }}
                    >
                      Rename goal
                    </button>
                    <button onClick={() => setTaskOpen(true)} className='block w-full text-left px-4 py-2 text-xs  hover:bg-[#D6CFFF]/20' style={{ color: colors.text.primary }}>
                      Add Task 
                    </button>
                  {/* {  <button onClick={() => addGoalToSidebar(goal.id)}  className="block w-full text-left px-4 py-2 text-xs  hover:bg-[#D6CFFF]/20" style={{ color: colors.text.primary }}>
                      Pin to Sidebar
                    </button>} */}

                    <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-xs  hover:bg-[#D6CFFF]/20" style={{color: colors.background.warning }}>Delete</button>
                  </div>
                )}
              </div>
              
            </div>
             {isXs && (
          <>
          <div className='flex flex-col items-center w-full  '>
              <div className='flex items-center justify-between  gap-4 w-10/12  mb-2'>
                <span className=' font-regular text-[#00000] text-base xl:text-sm 2xl:text-base'
                >Progress</span>
                <span className=' font-regular text-base xl:text-xs 2xl:text-base' style={{color: colors.text.secondary}}>
                  {goal.progress}%
                </span>
                </div>
                  <BorderLinearProgress variant="determinate" value={goal.progress} className="w-10/12" />
          </div>
          
</>
              )}

              {/* Modal for AI Task Form */}
           

                 <ReusableFormModal
                open={taskOpen}
                onClose={() => setTaskOpen(false)}
                title="Add Task"
                colors={colors}
                formData={formData}
                onChange={handleChange}
                onSubmit={handlesumbitAiTask}
                fields={[
                  { name: "title", label: "Title" },
                  { name: "description", label: "Description" },
                  { name: "due_date", label: "Due Date", type: "datetime-local" },
                  { name: "task_timeline", label: "Task Timeline" },
                ]}
              />

      {/* Modal for AI Subtask Task Form */}
             <ReusableFormModal
  open={addSubtaskOpen}
  onClose={() => setAddSubtaskOpen(false)}
  title="Add Subtask"
  colors={colors}
  formData={formData}
  onChange={handleSubtaskChange}
  onSubmit={handleSubmitAiSubtask}
  fields={[
    { name: "title", label: "Title" },
    { name: "description", label: "Description" },
    { name: "due_date", label: "Due Date", type: "datetime-local" },
    { name: "task_timeline", label: "Task Timeline" },
  ]}
/>






         
           
           <div
  className="ai-tasks overflow-visible overflow-y-clip md:px-6 px-6 md:pr-6 pr-0 w-full flex flex-col items-center justify-center"
  style={{
    paddingLeft: !isMobile
      ? isCollapsed
        ? "60px" // add margin when sidebar collapsed (desktop)
        : "40px"  // no margin when expanded
      : "20px",   // no margin on mobile
      paddingRight: !isMobile
      ? isCollapsed
        ? "80px" // add margin when sidebar collapsed (desktop)
        : "60px"  // no margin when expanded
      : "10px",   // no margin on mobile
     
    transition: "margin-left 0.3s ease-in-out",
  }}
>
  <div className="md:w-full w-full  gap-4 pl-4 pb-10 md:pl-36 lg:pl-8 xl:pl-10 2xl:pl-26 md:m-2 m-0">
                {goal.ai_tasks.map((task, index) => {
                  const isCompleted = taskCompletionStatus[index];
                  const allTasksCompleted = goal.ai_tasks.every(t => t.status === 'completed');
                  const isActive = !allTasksCompleted && (index === activeTaskIndex || (index === 0 && activeTaskIndex === null));
                  const isLastTask = index === goal.ai_tasks.length - 1;
                  open
                  return (
                    <div className="mx-auto " key={task.id}  onClick={() => {
  setActiveTaskIndex(index);
  setOpenTaskView(true);
}}
>
                         <motion.div
      className={`task ${isCompleted ? "completed" : ""} relative mt-8`}
    
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          delay: index * 0.3, // Staggered delay based on index
                        }}>
                        <div className="flex  transition-transform duration-300 hover:scale-[0.95] cursor-pointer justify-between md:gap-4 gap-2 relative  max-h-full  border-l md:p-4 p-2 md:space-y-2 xl:space-y-2 rounded-2xl xl:border-l-[2px] 2xl:border-l-[2.5px] lg:border-l-[2.5px] md:border-l-[2.5px] 2xl:w-10/12 lg:w-full md:w-11/12 w-full"   style={{
        backgroundColor: allTasksCompleted
          ? theme.palette.background.paper // Adjust to your theme color
          : isActive
          ? theme.palette.background.sidebar // White background for active
          : theme.palette.background.paper,
        borderLeftColor: theme.palette.primary.main, // Replace with the desired theme color
        // boxShadow:
        //  "2px 3px 8px 2px rgba(101, 85, 143, 0.2), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}>
                          <div className={`md:w-1/4 w-24 rounded-lg p-4 ${isActive ? 'bg-[#F4F1FF]' : 'bg-[#FFFFFF]'}`}  style={{
        backgroundColor:isActive
          ? "#D6CFFF" // White background for active
          : colors.menu.primary,

      }}>
                              <img src={aiGoals} alt="goals"  className='h-20 object-cover'/>
                                 </div>
                            <div className='w-full ' >
                              <div className='flex  items-center h-auto gap-4  md:mb-4 mb-2 w-full justify-between '>
                                  {isTaskRenaming && renamingTaskId === task.id ? (
                                  <input
                                     type="text"
                                     value={newTaskTitle}
                                     onChange={(e) => setNewTaskTitle(e.target.value)}
                                     onKeyDown={(e) => e.key === 'Enter' && handleTaskUpdate(task)}
                                     onBlur={() => handleTaskUpdate(task)}

                                     ref={inputTaskRefs}
                                     className="md:text-md font-semibold border border-gray-300 rounded-md p-1"
                                     style={{color: colors.primary[100]}}
                                   />
                                
                                ) : (
                                  <h3 className="md:text-sm text-sm xl:text-sm 2xl:text-base font-medium" style={{color: isActive ? colors.primary[100] : colors.text.primary}}>
                                    {task.title}
                                  </h3>
                                )}

                                 
                                  
                                  <div className="relative overflow-visible" ref={el => (menuRefs.current[index] = el)}>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke= {isActive ? colors.primary[100] : colors.text.secondary}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                            e.stopPropagation();
                                            toggleTaskMenu(task.id);
                                          }}
                                          // Pass task ID
                                          >
                                            <circle cx="12" cy="5" r="1"></circle>
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="12" cy="19" r="1"></circle>
                                          </svg>
                                          {taskMenuVisible === task.id && (
                                                    <div className="absolute z-[1000] -left-20 mt-2 w-32  rounded-md shadow-lg" style={{ backgroundColor: colors.menu.primary }}>
                                                      <button 
                                                      onClick={() => {
                                                      console.log("Renaming button clicked for task:");
                                                     // setNewTaskTitle(task.title); // ← Set input to current title
                                                      setIsTaskRenaming(true);
                                                      setRenamingTaskId(task.id);
                                                      setTimeout(() => inputTaskRefs.current?.focus(), 0);
                                                     
                                                    
                                                    }}


                                                        className="block w-full text-left px-4 py-2 text-sm  cursor-pointer hover:bg-[#D6CFFF]/20" style={{ color: colors.text.primary }}
                                                      >
                                                        Rename
                                                      </button>
                                                          
                                                      <button onClick={()=> {
                                                        setOpenDelete(true)
                                                      }}  className="block w-full text-left px-4 py-2 text-sm cursor-pointer  hover:bg-[#D6CFFF]/20" style={{ color: colors.background.warning }}>Delete</button>
                                                    </div>
                                                  )}
                                 </div>




                            
                                </div>

                                   <Backdrop
                              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                              open={openDelete}
                              onClick={handleDeleteClose}
                            >
                              <div className="bg-white w-4/12 p-6 rounded-lg shadow-lg text-center"   onClick={(e) => e.stopPropagation()} >
                                
                                  
                                  
                                  <h1 className='text-xl font-bold text-[#6F2DA8] mt-4 flex items-center justify-center gap-2'>
                                    This task will be deleted permanently
                                  </h1>
                                  <p className='mt-4 mb-8 text-sm text-[#49454F] font-normal'
                                  >Are you sure you want to delete it?</p>
                                   <Button 
                                    onClick={() => handleTaskDelete(task.id)}
                                      className="mt-4 px-4 py-2 cursor-pointer  text-white rounded-lg "
                                      style={{color: colors.primary[100], backgroundColor: colors.background.warning, '&:hover':{ opacity: 0.7} }}
                                  >
                                      DELETE
                                  </Button>
                                  <Button 
                                    onClick={handleDeleteClose} 
                                      className="mt-4 px-4 py-2  ml-4 cursor-pointer  rounded-lg"
                                      style={{color: colors.text.secondary, border: "1px solid #6200EE", marginLeft: 8}}
                                  >
                                      CLOSE
                                  </Button>

                              </div>
                          
                          </Backdrop>


                                <div className="flex flex-col gap-2">
                                                  <div className="flex gap-2 items-center">
                                                    {isXs ? (<BsHourglassTop fontSize='small' style={{color: isActive ? colors.primary[100] : colors.text.secondary }}/>
                                                     
                ):( <p className="w-16 md:text-xs xl:text-xs 2xl:text-sm  text-xs font-medium " style={{color: isActive ? colors.primary[100] : colors.text.secondary }}>Timeline:</p>)}

                                                   <span
                                                        className="  2xl:text-sm text-xs rounded-sm md:text-xs xl:text-xs"
                                                        style={{
                                                          color: isActive ? colors.primary[100] : colors.text.secondary,
                                                          borderColor: isActive ? colors.primary[100] : colors.text.secondary,
                                                        }}
                                                      >
                                                        {task.task_timeline || "No timeline"}
                                                      </span>

                                                  </div>
                                                  <div className="flex gap-2 items-center">
                                                   {isXs ? (<StatusIcon 
  status={task.status} 
  color={isActive ? "#F6F3F3" : colors.text.secondary} 
/>):( <p className="w-16 md:text-xs xl:text-xs 2xl:text-sm text-xs  font-medium " style={{color: isActive ? colors.primary[100] : colors.text.secondary }}>Status:</p>)}
                                                    <span className="  2xl:text-sm  text-center  text-xs rounded-sm md:text-xs xl:text-xs  flex items-center " style={{color: isActive ? colors.primary[100] : colors.text.secondary , borderColor: isActive ? colors.primary[100] : colors.text.secondary}}>
                                                      {task.status}
                                                    </span>
                                                  </div>
                                                


                                                </div>





                              </div>
                           
                         
                                        </div>
                                          

                         {index < goal.ai_tasks.length && (
                                          
                                   <div className="absolute md:-left-18 xl:-left-6 lg:-left-5  -left-26  transform md:-translate-x-1/4 translate-x-1/12 top-1/5   flex flex-col items-center  overflow-hidden">

                                    <motion.svg 
                                      width="300" 
                                      height="300" 
                                      viewBox="0 0 300 300" 
                                      fill="none" 
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      {/* Circle Moving Along the Line */}
                                      <motion.circle
                                      cx="50"
                                      cy="50"
                                      r="8"
                                      fill="#4F378A"
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{
                                        delay: index * 0.5, // Stagger animation for each task
                                        duration: 0.6,
                                        ease: "easeOut",
                                      }}
                                    />
                                       {/* Line connecting to the next task (only if it's not the last task) */}
                                       {!isLastTask && (
                                            <motion.line
                                              x1="50"
                                              y1="50"  // Start from this circle’s bottom
                                              x2="50"
                                              y2={lineY2} // End at the next task’s top
                                              stroke="#4F378A"
                                              strokeWidth="2"
                                              strokeDasharray="6 4"
                                              initial={{ pathLength: 0 }}
                                              animate={{ pathLength: 1 }}
                                              transition={{ duration: 1.2, ease: "easeInOut" }}
                                            />
                                          )}
                                  {isCompleted && (
                                    <motion.g
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                      <path
                                        d="M47 50 L49 52 L53 47"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </motion.g>
                                  )}

                                   {isActive && (
                                    <motion.g
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                      <circle
                                        cx="50"
                                        cy="50"
                                        r="6"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </motion.g>

                                  )}
                                      

                                       
                                        </motion.svg> 

                           
                          </div>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            
          </div>

          <Box className="hidden md:block actionable-steps xl:w-6/12 lg:w-5/12 md:w-5/12 space-y-4 p-4 max-h-full rounded-2xl mt-4 " sx={{ backgroundColor: colors.background.paper }}>
              <div className=' items-center gap-4 mb-4 mt-4'>
                <div className='flex items-center gap-4 w-full justify-between mb-2'>
                <span className=' font-regular text-[#00000] text-sm xl:text-sm 2xl:text-base'
                >Progress</span>
                <span className=' font-regular text-sm xl:text-xs 2xl:text-base' style={{color: colors.text.primary}}>
                  {goal.progress}%
                </span>
                </div>

                <BorderLinearProgress variant="determinate" value={goal.progress} className="w-full" />

              
              </div>
            <Box className='w-full    rounded-lg p-2 flex justify-center items-center' sx={{ backgroundColor: colors.menu.primary }}>
                 <p className="md:text-sm lg:text-md 2xl:text-lg  font-medium" style={{color: colors.text.primary}}>
                Start working on your goal today! 🚀
              </p>
            </Box>
           
            <Box className="text-lg container w-full px-4 py-2 mb-4 rounded-lg bg-[#FFFFFF] relative" sx={{ backgroundColor: colors.menu.primary }}>
              {isVisible ? (<TrophyAnimation />) : 
              (
                  <>
                 <div className='flex justify-between items-center mb-2 gap-4 w-full pr-2'
                 >
                 <p className="md:text-sm lg:text-md flex items-center m-2 gap-2 w-full  text-[#000000] font-normal">
               
                    {activeTask ? (
                      <>
                       <span className="font-medium md:text-sm xl:text-sm 2xl:text-base 
                        " style={{color: colors.text.primary}}>{activeTask.title}</span>
                      </>
                    ) : (
                      "Select a task"
                    )}
                  </p>
                
                 </div>

                <Divider orientation="horizontal" sx={{ borderColor: "#767676", opacity: 0.8 }} />
                <div className='flex mt-4 items-center justify-end gap-4'>
                <div className='w-6/12 flex justify-end'
                 >
                 <PickerWithButtonField />
                 </div>
             
              
              

          
              
              </div>
              <div className='space-y-6 mt-4'>
                {activeTask &&
  [...activeTask.ai_subtasks] // make a shallow copy
    .sort((a, b) => a.id - b.id) // sort by ID
    .map((step) => { 
      const { timeline, cleanedDetails } = extractTimeline(step.description);
      
                  return (
                    <Box key={step.id}  className="step  rounded-xl transition-transform duration-300 hover:scale-[0.95] cursor-pointer flex items-center " sx={{ backgroundColor: colors.background.paper }}>
                    <label className="custom-checkbox  p-4 ">
                        <input
                        type="checkbox"
                        checked={step.status === "completed"}
                        onChange={() => handleStepCheck(step.id)} // Call the new handler
                        size={16}
                        />

                        </label>
                        <div className='w-full py-4 ' onClick={() => openSubtaskPage(step)}>
                        <div className="flex flex-col w-full ">
                      
                        <Box width={"100%"}  display={"flex"} alignItems={"center"} >
                        <span className=' md:text-sm xl:text-sm xl:w-full 2xl:text-base font-regular' style={{color: colors.text.primary}}>{step.title}</span>
                         <div  >
                      
                         </div>
                    
                        </Box>
                    
                      
                      
                      
                      <Box className=' 2xl:h-6 h-6  flex items-center  gap-2   '>
                      <BsHourglassTop fontSize='small' style={{color: colors.text.secondary}}/>
                          <p className='md:text-xs xl:text-xs text-xs  gap-4 ' style={{color: colors.text.secondary}}
                          >
                           
                          {timeline}
                            </p>

                      </Box>
                      
                     

                       
                     </div>
                    

                      {/* {  <span className='text-[#49454F] md:text-md xl:text-xs font-light 2xl:text-sm'>{cleanedDetails}</span>} */}
                
                        </div>
                        
                     
                    </Box>
                  );
                })}

    {selectedStep && !aiAnswer && (
  <AiSubtask
    step={selectedStep}
    setStep={setSelectedStep}
    taskId={activeTask?.id}
    onClose={closeSubtaskPage}
   
  />
)}


              </div>

              <div className='flex  my-8 w-full justify-center  '>
         <Button onClick={() => setAddSubtaskOpen(true)}  text='Add to List' className='w-full'>
             
              </Button>
             
              </div>
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
                </>
              )
              }
             
            

            </Box>

            
          </Box>
  
          
        </div>
      </div>
    </div>
  );
  };
  
  export default AiGoal;