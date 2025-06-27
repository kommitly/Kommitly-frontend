import  { useEffect, useState,useCallback, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { fetchAiGoalById, deleteAiGoalById, updateAiGoalById, updateAiTaskStatus,updateAiTaskById, deleteAiTaskById, createAiTask , updateAiSubtaskById} from '../../../utils/Api'; // Adjust the import path as needed
import flag from '../../../assets/flag-dynamic-color.svg';
import { GoDotFill } from "react-icons/go";
import { Divider } from '@mui/material';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { CiMenuKebab } from "react-icons/ci";
import { GoalsContext } from '../../../context/GoalsContext'; // Adjust the import path as needed
import { TasksContext } from '../../../context/TasksContext'; // Adjust the import path as needed
import GoalTrophyAnimation from './GoalTrophyAnimation';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import TrophyAnimation from './TrophyAnimation';
import PickerWithButtonField from './PickerWithButtonField';
import GoalBadgeAnimation from './GoalBadge';
import aiGoals from '../../../assets/goals.svg';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';

import * as motion from "motion/react-client"
import { VisibilityRounded } from '@mui/icons-material';
import AiSubtask from './AiSubtask';
import goal from '../../../assets/goal.svg';
import useMediaQuery from '@mui/material/useMediaQuery';
import AiSubtaskPage from './AiSubtaskPage'; // Adjust the import path as needed



const extractTimeline = (description) => {
  if (!description) return { timeline: 'No detail available', cleanedDetails: description };

  console.log('Details:', description); // Debugging

   // Updated regex to match time ranges and single values even without parentheses
   const match = description.match(/\b(\d+-\d+ (days|weeks|months|years)|\d+ (day|week|month|year)|On-going|Ongoing|\d+\s*(days|weeks|months|years))\b/i);

  console.log('Match:', match); // Debugging

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





const AiGoal = () => {
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
  const [subtaskOpen, setSubtaskOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);
  const [isTaskRenaming, setIsTaskRenaming] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedStep, setSelectedStep] = useState(null);
  const { reloadGoals } = useContext(GoalsContext); 
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const [openTaskView, setOpenTaskView] = useState(false);
  const [dueDates, setDueDates] = useState({});
  


 
    const loadGoal = useCallback(async () => {
      try {
            const fetchedGoal = await fetchAiGoalById(goalId);
            setGoal(fetchedGoal);
             // Update taskCompletionStatus based on fetched goal data
             setTaskCompletionStatus(fetchedGoal.ai_tasks.map(task => task.status === 'completed'));

            const inProgressTaskIndex = fetchedGoal.ai_tasks.findIndex(task => task.status === 'in-progress');
            setActiveTaskIndex(inProgressTaskIndex !== -1 ? inProgressTaskIndex : 0);
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

  const handleCloseTaskView = () => {
    setOpenTaskView(false);
  };
 
  const handleStepCheck = async (stepIndex) => {
  const activeTask = goal.ai_tasks[activeTaskIndex];
  const step = activeTask.ai_subtasks[stepIndex];

  const taskId = activeTask.id;
  const subtaskId = step.id;

  const newStatus = step.status === "completed" ? "pending" : "completed";

  try {
    await updateAiSubtaskById(taskId, subtaskId, { status: newStatus });
    await loadGoal();
    setGoal(prevGoal => {
      // Deep copy to avoid state mutation
      const newGoal = JSON.parse(JSON.stringify(prevGoal));
      const task = newGoal.ai_tasks[activeTaskIndex];
      task.ai_subtasks[stepIndex].status = newStatus;

      // Check if all subtasks completed here
      const allCompleted = task.ai_subtasks.every(s => s.status === "completed");
      if (allCompleted) {
        handleTaskCompletion();
      }

      return newGoal;
    });

  } catch (error) {
    console.error("Failed to update subtask:", error);
    // Optionally show an error toast or revert checkbox UI
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
      }
    
    }, 100); // Hide confetti after 2 seconds
  };
  

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleTaskMenu = (id) => {
    setTaskMenuVisible(prevId => (prevId === id ? null : id)); // Toggle menu for the selected task
  };

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenaming]);

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
  
  const handleTaskUpdate = async () => {
    if (!newTaskTitle.trim() || newTaskTitle === task.title) {
      setIsTaskRenaming(false); // Cancel rename if empty or unchanged
      return;
    }
  
    try {
      await updateAiTaskById(taskId, newTaskTitle);
      setTask((prevTask) => ({ ...prevTask, title: newTaskTitle }));
      setIsTaskRenaming(false);
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
  const now = new Date();
  const formattedDueDate = now.toISOString(); // Ensure this is defined before useState
  const formattedCompletedAt = now.toISOString(); 
  const formattedReminderTime = now.toTimeString().split(" ")[0]; // Extracts "HH:MM:SS"

  const [formData, setFormData] = useState({
    ai_goal: goalId,
    title: "",
    description: "",
    due_date: formattedDueDate,
    status: "pending",
   
    completed_at: formattedCompletedAt,
    reminder_time: formattedReminderTime
  });

  const handleChange = (e) => {
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
    <div className='w-full  flex min-h-screen px-4'>
      

      <div className="w-full    overflow-y-auto  no-scrollbar  ">
        
        
        <div className=' flex  w-full '>
        <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        <div className="bg-white w-4/12 p-6 rounded-lg shadow-lg text-center">
          <GoalTrophyAnimation/>
            
            
            <h1 className='text-xl font-bold text-[#6F2DA8] mt-4 flex items-center justify-center gap-2'>
              Goal Completed!
            </h1>
            <p className='mt-4 text-sm text-[#49454F] font-normal'
            >You have successfully completed all your tasks!</p>
            <button 
              onClick={handleClose} 
                className="mt-4 px-4 py-2 bg-[#6200EE] text-white rounded-lg"
            >
                Close
            </button>
        </div>
    
    </Backdrop>

       {isXs && (
    <Backdrop 
     sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openTaskView}
        onClick={handleCloseTaskView}>
       <Box className=" actionable-steps w-11/12 space-y-4 p-4 max-h-full rounded-xl mt-4 " sx={{ backgroundColor: colors.background.paper }}>
              
               
              
            
            
           
            <Box className="text-lg container w-full px-4 py-2 mb-4 rounded-xl bg-[#FFFFFF] relative" sx={{ backgroundColor: colors.background.default }}>
              {isVisible ? (<TrophyAnimation />) : 
              (
                  <>
                 <div className='flex justify-between items-center mb-2 gap-4 w-full pr-2'
                 >
                 <p className="md:text-sm lg:text-md flex items-center m-2 gap-2 w-full  text-[#000000] font-normal">
                 <span className=" md:text-sm lg:text-base">📌</span>
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
                <div className='w-6/12 flex justify-end'
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

                 </div>
             
              
              

          
              
              </div>
              <div className='space-y-6 mt-4'>
                {activeTask && activeTask.ai_subtasks.map((step, stepIndex) => {
                  const {timeline, cleanedDetails } = extractTimeline(step.description); // Extract cleaned description for each step
              
                  return (
                    <Box key={stepIndex}  className="step  p-4 rounded-xl cursor-pointer flex items-center gap-4" sx={{ backgroundColor: colors.background.paper }}>
                    <label className="custom-checkbox">
                        <input
                        type="checkbox"
                        checked={step.status === "completed"}
                        onChange={() => handleStepCheck(stepIndex)} // Call the new handler
                        size={16}
                        />

                        </label>
                        <div className='w-full'>
                        <div className="flex flex-col w-full ">
                      
                        <Box width={"100%"} justifyContent={"space-between"} display={"flex"} alignItems={"center"} >
                        <span className=' md:text-sm xl:text-sm xl:w-full 2xl:text-base font-regular' style={{color: colors.text.primary }}>{step.title}</span>
                         <div onClick={() => navigate(`/dashboard/ai-goal/${goal.id}/task/${activeTask.id}/subtask/${step.id}`, { state: { step } })} >
                        <ArrowForwardIosOutlinedIcon sx={{ fontSize: 12 }} />
                         </div>
                    
                        </Box>
                    
                      
                      
                      
                      <Box className=' 2xl:h-6 h-6  flex items-center  gap-2   ' sx={{ color: colors.text.secondary }}>
                      <AccessTimeIcon fontSize='small'/>
                          <p className='md:text-xs xl:text-xs text-sm font-medium gap-4 '
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
             
            

            </Box>

            
          </Box>
      
      
    </Backdrop>
        )}
          <div className='md:px-4 xl:px-0 mt-4 lg:px-0 xl:w-9/12 md:w-10/12'>
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

              <div className="relative">
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
                  <div className="absolute right-0 mt-2 w-48  rounded-md shadow-lg z-50" style={{ backgroundColor: colors.background.default }}>
                    <button 
                      onClick={() => {
                        setIsRenaming(true);
                        setTimeout(() => inputRef.current?.focus(), 0); // Ensure focus on input
                      }} 
                      className="block w-full text-left px-4 py-2 text-xs  hover:bg-[#F4F1FF]" style={{ color: colors.text.primary }}
                    >
                      Rename goal
                    </button>
                    <button onClick={() => setTaskOpen(true)} className='block w-full text-left px-4 py-2 text-xs  hover:bg-[#F4F1FF]' style={{ color: colors.text.primary }}>
                      Add Task 
                    </button>
                    <button onClick={() => addGoalToSidebar(goal.id)}  className="block w-full text-left px-4 py-2 text-xs  hover:bg-[#F4F1FF]" style={{ color: colors.text.primary }}>
                      Pin to Sidebar
                    </button>

                    <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-xs  hover:bg-[#F4F1FF]" style={{color: colors.background.warning }}>Delete</button>
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
              <Modal open={taskOpen} onClose={() => setTaskOpen(false)}>
                  <Box className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white rounded-xl w-96'>
                    <h2 className='text-xl font-semibold mb-4'>Add  Task</h2>
                    <TextField fullWidth label='Title' name='title' value={formData.title} onChange={handleChange} margin='normal' />
                    <TextField fullWidth label='Description' name='description' value={formData.description} onChange={handleChange} margin='normal' />
                    <TextField fullWidth label='Due Date' type='datetime-local' name='due_date' value={formData.due_date} onChange={handleChange} margin='normal' />
                    <TextField fullWidth label='Task Timeline' name='task_timeline' value={formData.task_timeline} onChange={handleChange} margin='normal' />
                    <TextField fullWidth label='Reminder Time' name='reminder_time' value={formData.reminder_time} onChange={handleChange} margin='normal' />
                    <div className='flex justify-end gap-4 mt-4'>
                      <Button onClick={() => setTaskOpen(false)} variant='outlined'>Cancel</Button>
                      <Button onClick={handlesumbitAiTask} variant='contained' color='primary'>Submit</Button>
                    </div>
                  </Box>
                </Modal>





         
           
            <div className="ai-tasks overflow-visible overflow-y-clip  px-4 w-full  flex flex-col items-center  justify-center  " >
              <div className="md:w-full w-full gap-4 pl-4 pb-10 md:pl-36 xl:pl-10 2xl:pl-26 m-2">
                {goal.ai_tasks.map((task, index) => {
                  const isCompleted = taskCompletionStatus[index];
                  const allTasksCompleted = goal.ai_tasks.every(t => t.status === 'completed');
                  const isActive = !allTasksCompleted && (index === activeTaskIndex || (index === 0 && activeTaskIndex === null));
                  const isLastTask = index === goal.ai_tasks.length - 1;
                  open
                  return (
                    <div className="mx-auto" key={task.id} 
>
                         <motion.div
      className={`task ${isCompleted ? "completed" : ""} relative mt-8 border-l md:p-4 p-2 md:space-y-2 xl:space-y-2 rounded-xl xl:border-l-[2px] 2xl:border-l-[2.5px] lg:border-l-[2.5px] md:border-l-[2.5px] 2xl:w-10/12 md:w-11/12`}
      style={{
        backgroundColor: allTasksCompleted
          ? theme.palette.background.paper // Adjust to your theme color
          : isActive
          ? "#4F378A" // White background for active
          : theme.palette.background.paper,
        borderLeftColor: theme.palette.primary.main, // Replace with the desired theme color
        // boxShadow:
        //  "2px 3px 8px 2px rgba(101, 85, 143, 0.2), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          delay: index * 0.3, // Staggered delay based on index
                        }} onClick={() => {
  setActiveTaskIndex(index);
  setOpenTaskView(true);
}}>
                        <div className="flex   justify-between md:gap-4 gap-2 relative  max-h-full">
                          <div className={`md:w-1/4 w-20 rounded-lg p-4 ${isActive ? 'bg-[#F4F1FF]' : 'bg-[#FFFFFF]'}`}  style={{
        backgroundColor:isActive
          ? theme.palette.background.paper // White background for active
          : theme.palette.background.default,

      }}>
                              <img src={aiGoals} alt="goals"  className='h-20 object-cover'/>
                                 </div>
                            <div className='w-full ' >
                              <div className='flex  items-center h-auto gap-4  mb-4  w-full justify-between '>
                  
                                 
                                  <h3 className="md:text-sm xl:text-sm 2xl:text-base  font-medium" style={{color: isActive ? colors.primary[100] : colors.text.primary
                                  }}>{task.title}</h3>
                                  <div className="relative overflow-visible">
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
                                            onClick={() => toggleTaskMenu(task.id)} // Pass task ID
                                          >
                                            <circle cx="12" cy="5" r="1"></circle>
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="12" cy="19" r="1"></circle>
                                          </svg>
                                          {taskMenuVisible === task.id && (
                                                    <div className="absolute z-[1000] -left-20 mt-2 w-32  rounded-md shadow-lg" style={{ backgroundColor: colors.background.default }}>
                                                      <button 
                                                        onClick={() => {
                                                          setIsRenaming(true);
                                                          setTimeout(() => inputRef.current?.focus(), 0); // Ensure focus on input
                                                        }} 
                                                        className="block w-full text-left px-4 py-2 text-sm  hover:bg-[#F4F1FF]" style={{ color: colors.text.primary }}
                                                      >
                                                        Rename
                                                      </button>
                                                      <button onClick={() => handleTaskDelete(task.id)} className="block w-full text-left px-4 py-2 text-sm  hover:bg-[#F4F1FF]" style={{ color: colors.background.warning }}>Delete</button>
                                                    </div>
                                                  )}
                                 </div>




                            
                                </div>

                                <div className="flex flex-col gap-2">
                                                  <div className="flex items-center">
                                                    <p className="w-20 md:text-xs xl:text-xs 2xl:text-sm  text-xs font-medium " style={{color: isActive ? colors.primary[100] : colors.text.secondary }}>Timeline:</p>
                                                    <span className="px-3 py-0.5 border  2xl:text-sm text-xs rounded-sm md:text-xs xl:text-xs " style={{color: isActive ? colors.primary[100] : colors.text.secondary , borderColor: isActive ? colors.primary[100] : colors.text.secondary}}>
                                                      {task.task_timeline}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center">
                                                    <p className="w-20 md:text-xs xl:text-xs 2xl:text-sm text-xs  font-medium " style={{color: isActive ? colors.primary[100] : colors.text.secondary }}>Status:</p>
                                                    <span className="px-3 py-0.5 border  2xl:text-sm  text-center  text-xs rounded-sm md:text-xs xl:text-xs  flex items-center " style={{color: isActive ? colors.primary[100] : colors.text.secondary , borderColor: isActive ? colors.primary[100] : colors.text.secondary}}>
                                                      {task.status}
                                                    </span>
                                                  </div>
                                                


                                                </div>





                              </div>
                           
                         
                                        </div>
                                          

                         {index < goal.ai_tasks.length && (
                                          
                                   <div className="absolute md:-left-18 xl:-left-6  -left-24  transform md:-translate-x-1/4 translate-x-1/12 top-1/5   flex flex-col items-center  overflow-hidden">

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
                                              y2="230" // End at the next task’s top
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

          <Box className="hidden md:block actionable-steps xl:w-6/12 md:w-5/12 space-y-4 p-4 max-h-full rounded-xl mt-4 " sx={{ backgroundColor: colors.background.paper }}>
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
            <Box className='w-full    rounded-lg p-2 flex justify-center items-center' sx={{ backgroundColor: colors.background.default }}>
                 <p className="md:text-sm lg:text-md 2xl:text-lg  font-medium" style={{color: colors.text.primary}}>
                Start working on your goal today! 🚀
              </p>
            </Box>
           
            <Box className="text-lg container w-full px-4 py-2 mb-4 rounded-xl bg-[#FFFFFF] relative" sx={{ backgroundColor: colors.background.default }}>
              {isVisible ? (<TrophyAnimation />) : 
              (
                  <>
                 <div className='flex justify-between items-center mb-2 gap-4 w-full pr-2'
                 >
                 <p className="md:text-sm lg:text-md flex items-center m-2 gap-2 w-full  text-[#000000] font-normal">
                 <span className=" md:text-sm lg:text-base" >📌</span>
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
                {activeTask && activeTask.ai_subtasks.map((step, stepIndex) => {
                  const {timeline, cleanedDetails } = extractTimeline(step.description); // Extract cleaned description for each step
              
                  return (
                    <Box key={stepIndex}  className="step  p-4 rounded-xl cursor-pointer flex items-center gap-4" sx={{ backgroundColor: colors.background.paper }}>
                    <label className="custom-checkbox">
                        <input
                        type="checkbox"
                        checked={step.status === "completed"}
                        onChange={() => handleStepCheck(stepIndex)} // Call the new handler
                        size={16}
                        />

                        </label>
                        <div className='w-full'>
                        <div className="flex flex-col w-full ">
                      
                        <Box width={"100%"} justifyContent={"space-between"} display={"flex"} alignItems={"center"} >
                        <span className=' md:text-sm xl:text-sm xl:w-full 2xl:text-base font-regular' style={{color: colors.text.primary}}>{step.title}</span>
                         <div onClick={() => openSubtaskPage(step)} >
                        <ArrowForwardIosOutlinedIcon sx={{ fontSize: 12 }} />
                         </div>
                    
                        </Box>
                    
                      
                      
                      
                      <Box className=' 2xl:h-6 h-6  flex items-center  gap-2   '>
                      <AccessTimeIcon fontSize='small' sx={{color: colors.text.secondary}}/>
                          <p className='md:text-xs xl:text-xs text-xs font-medium gap-4 ' style={{color: colors.text.secondary}}
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
        <AiSubtask step={selectedStep} setStep={setSelectedStep} taskId={activeTask?.id}  onClose={closeSubtaskPage} />
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
             
            

            </Box>

            
          </Box>
  
          
        </div>
      </div>
    </div>
  );
  };
  
  export default AiGoal;