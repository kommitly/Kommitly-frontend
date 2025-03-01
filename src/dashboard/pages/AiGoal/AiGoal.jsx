import  { useEffect, useState,useCallback, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { fetchAiGoalById, deleteAiGoalById, updateAiGoalById, updateTaskStatus } from '../../../utils/Api'; // Adjust the import path as needed
import flag from '../../../assets/flag-dynamic-color.svg';
import { GoDotFill } from "react-icons/go";
import { Divider } from '@mui/material';

import { motion } from 'framer-motion';
import { CiMenuKebab } from "react-icons/ci";
import { GoalsContext } from '../../../context/GoalsContext'; // Adjust the import path as needed
import GoalTrophyAnimation from './GoalTrophyAnimation';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Backdrop from '@mui/material/Backdrop';
import TrophyAnimation from './TrophyAnimation';
import PickerWithButtonField from './PickerWithButtonField';
import GoalBadgeAnimation from './GoalBadge';

const extractTimeline = (details) => {
  if (!details) return { timeline: 'No detail available', cleanedDetails: details };

  console.log('Details:', details); // Debugging

   // Updated regex to match time ranges and single values even without parentheses
   const match = details.match(/\b(\d+-\d+ (days|weeks|months|years)|\d+ (day|week|month|year)|On-going|Ongoing|\d+\s*(days|weeks|months|years))\b/i);

  console.log('Match:', match); // Debugging

  const timeline = match ? match[1] : 'No timeline available';
  let cleanedDetails = match ? details.replace(match[0], '').trim() : details;

  // Remove empty parentheses
  cleanedDetails = cleanedDetails.replace(/\s*\(\s*\)\s*/g, '');

  return { timeline, cleanedDetails };
};





const AiGoal = () => {
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
  const { removeGoal } = useContext(GoalsContext);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);



 
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
  const handleStepCompletion = async () => {
    
    // Show confetti when the current task is completed
    setIsVisible(true);
    console.log('Confetti visible:', true); // Debugging
     
  
    try {
      const taskId = goal.ai_tasks[activeTaskIndex].id;

      const response = await updateTaskStatus(taskId, { status: "completed" });

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
  
  const handleStepCheck = (stepIndex) => {
    setGoal(prevGoal => {
      const newGoal = JSON.parse(JSON.stringify(prevGoal)); // Deep copy the goal object
  
      const activeTask = newGoal.ai_tasks[activeTaskIndex];
      const updatedSteps = [...activeTask.actionable_steps]; // Create a copy of the steps array
      updatedSteps[stepIndex].completed = !updatedSteps[stepIndex].completed;
      activeTask.actionable_steps = updatedSteps;
  
      return newGoal;
    });
  
    // Delay checking if all steps are completed to ensure the last step is marked first
    setTimeout(() => {
      setGoal(prevGoal => {
        const newGoal = JSON.parse(JSON.stringify(prevGoal)); // Deep copy the goal object
  
        const activeTask = newGoal.ai_tasks[activeTaskIndex];
        const updatedSteps = [...activeTask.actionable_steps]; // Create a copy of the steps array
  
        if (updatedSteps.every(s => s.completed)) {
          handleStepCompletion();
        }
  
        return newGoal;
      });
    }, 2000); // Delay of 100ms (adjust as needed)
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
  

  

 

  
  const handleDelete = async () => {
    try {
      await deleteAiGoalById(goalId);
      
      removeGoal(goalId); // Remove from state immediately
      navigate('/dashboard/goals');
    } catch (error) {
      setError(error.message);
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
    <div className='w-full mt-8 flex min-h-screen '>
      

      <div className="w-full    overflow-y-auto  no-scrollbar  ">
        
        
        <div className=' flex space-x-4 w-full border-b border-[#ECE6F0]'>
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
          <div className='md:px-4 xl:px-0 mt-4 lg:px-0 xl:w-8/12 w-10/12'>
           <div className='flex items-center mb-12 gap-4 justify-between'>
              <div className='flex items-center gap-4 2xl:ml-4 '>
                <img src={flag} alt="Flag" className="w-8 h-8" />
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
                    <h1 className='md:text-lg  xl:text-md 2xl:text-xl font-semibold'>{goal.title}</h1>
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
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <button 
                      onClick={() => {
                        setIsRenaming(true);
                        setTimeout(() => inputRef.current?.focus(), 0); // Ensure focus on input
                      }} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F7F2FA]"
                    >
                      Rename
                    </button>
                    <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F7F2FA]">Delete</button>
                  </div>
                )}
              </div>
              
            </div>


         
           
            <div className="ai-tasks overflow-visible overflow-y-clip  px-4 w-full  flex flex-col items-center  justify-center " >
              <div className="w-full gap-4  pb-20 md:pl-36 xl:pl-24 2xl:pl-26 m-2">
                {goal.ai_tasks.map((task, index) => {
                  const isCompleted = taskCompletionStatus[index];
                  const allTasksCompleted = goal.ai_tasks.every(t => t.status === 'completed');
                  const isActive = !allTasksCompleted && (index === activeTaskIndex || (index === 0 && activeTaskIndex === null));

                  return (
                    <div className="mx-auto" key={task.id}>
                      <div className={`task ${allTasksCompleted ? 'bg-[#E8DEF8]' : isActive ? 'bg-[#FFFFFF]' : 'bg-[#ECE6F0]'} ${isCompleted ? 'completed' : ''} relative mt-12 border-l  p-4 md:space-y-2 xl:space-y-2 rounded-xl border-l-[#4F378A] xl:border-l-[2px] 2xl:border-l-[2.5px] lg:border-l-[2.5px] md:border-l-[2.5px] 2xl:w-10/12 md:w-11/12`} style={{ boxShadow: '2px 3px 8px 2px rgba(101, 85, 143, 0.2), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}>
                        <div className="flex items-center justify-between md:gap-2 relative ">
                            <div className='flex items-center gap-4  '>
                            <div className='flex items-center gap-2 bg-[#F4EDF8] p-2 rounded-md '>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#65558F"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-[#65558F] icon-small"
                            >
                                <path d="M12 6h14"></path>
                                <path d="M12 12h14"></path>
                                <path d="M12 18h14"></path>
                                <circle cx="3" cy="6" r="1"></circle>
                                <circle cx="3" cy="12" r="1"></circle>
                                <circle cx="3" cy="19" r="1"></circle>
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#65558F"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-[#65558F] icon-large"
                            >
                                <path d="M12 6h14"></path>
                                <path d="M12 12h14"></path>
                                <path d="M12 18h14"></path>
                                <circle cx="3" cy="6" r="1"></circle>
                                <circle cx="3" cy="12" r="1"></circle>
                                <circle cx="3" cy="19" r="1"></circle>
                            </svg>
                            </div>
                            <h3 className="md:text-sm xl:text-sm 2xl:text-base text-[#1D1B20] font-semibold">{task.title}</h3>
                         
                              </div>
                          <div>
                          <div className="relative overflow-visible">
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
                              onClick={() => toggleTaskMenu(task.id)} // Pass task ID
                            >
                              <circle cx="12" cy="5" r="1"></circle>
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="12" cy="19" r="1"></circle>
                            </svg>
                            {taskMenuVisible === task.id && (
                                <div className="absolute z-[1000] left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                                  <button 
                                    onClick={() => {
                                      setIsRenaming(true);
                                      setTimeout(() => inputRef.current?.focus(), 0); // Ensure focus on input
                                    }} 
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F7F2FA]"
                                  >
                                    Rename
                                  </button>
                                  <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F7F2FA]">Delete</button>
                                </div>
                              )}
                            </div>
                            
                      

                          
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                                          <div className="flex items-center">
                                            <p className="w-24 md:text-xs xl:text-xs 2xl:text-sm font-medium text-[#65558F]">Timeline:</p>
                                            <span className="px-3 py-0.5 border border-[#65558F] 2xl:text-sm  rounded-sm md:text-xs xl:text-xs text-[#65558F]">
                                              {task.task_timeline}
                                            </span>
                                          </div>
                                          <div className="flex items-center">
                                            <p className="w-24 md:text-xs xl:text-xs 2xl:text-sm  font-medium text-[#65558F]">Status:</p>
                                            <span className="px-3 py-0.5 border border-[#65558F] 2xl:text-sm  text-center rounded-sm md:text-xs xl:text-xs text-[#65558F] flex items-center ">
                                              {task.status}
                                            </span>
                                          </div>
                                          {task.status === "completed" && (
                                          <div className="flex items-center">
                                            <p className="w-24 md:text-xs xl:text-xs font-medium 2xl:text-sm text-[#65558F]">Completed_at:</p>
                                            <span className="px-3 py-0.5 border border-[#65558F] 2xl:text-sm rounded-sm md:text-sm xl:text-xs text-[#65558F]">
                                              {task.completed_at}
                                            </span>
                                          </div>
                                        )}


                                        </div>

                                        {index < goal.ai_tasks.length && (
                          <div className="absolute 2xl:-left-18 xl:-left-19 -left-18 transform -translate-x-1/4 -top-38 flex flex-col items-center overflow-hidden">
                            <svg 
                              width="100" 
                              height="222" 
                              viewBox="0 0 104 288" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              className='icon-small'>
                              <path d="M103.005 287.369C103.557 287.366 104.003 286.916 104 286.364C103.997 285.812 103.548 285.366 102.995 285.369L103.005 287.369ZM15.3315 236.84L16.3315 236.839L15.3315 236.84ZM65.5609 286.77L65.5654 287.77L65.5609 286.77ZM14 0.00139951L14.0055 3.94874L16.0055 3.94594L16 -0.00139951L14 0.00139951ZM14.0166 11.8434L14.0276 19.7381L16.0276 19.7353L16.0166 11.8406L14.0166 11.8434ZM14.0387 27.6328L14.0497 35.5274L16.0497 35.5246L16.0387 27.63L14.0387 27.6328ZM14.0608 43.4221L14.0718 51.3168L16.0718 51.314L16.0608 43.4193L14.0608 43.4221ZM14.0829 59.2115L14.0939 67.1062L16.0939 67.1034L16.0829 59.2087L14.0829 59.2115ZM14.105 75.0008L14.116 82.8955L16.116 82.8927L16.105 74.998L14.105 75.0008ZM14.1271 90.7902L14.1381 98.6849L16.1381 98.6821L16.1271 90.7874L14.1271 90.7902ZM14.1492 106.58L14.1602 114.474L16.1602 114.471L16.1492 106.577L14.1492 106.58ZM14.1712 122.369L14.1823 130.264L16.1823 130.261L16.1712 122.366L14.1712 122.369ZM14.1933 138.158L14.2044 146.053L16.2044 146.05L16.1933 138.155L14.1933 138.158ZM14.2155 153.948L14.2265 161.842L16.2265 161.839L16.2154 153.945L14.2155 153.948ZM14.2375 169.737L14.2486 177.632L16.2486 177.629L16.2375 169.734L14.2375 169.737ZM14.2596 185.526L14.2707 193.421L16.2707 193.418L16.2596 185.523L14.2596 185.526ZM14.2817 201.316L14.2928 209.21L16.2928 209.208L16.2817 201.313L14.2817 201.316ZM14.3038 217.105L14.3149 225L16.3149 224.997L16.3038 217.102L14.3038 217.105ZM14.3259 232.894L14.3315 236.842L16.3315 236.839L16.3259 232.892L14.3259 232.894ZM14.3315 236.842C14.3333 238.192 14.3877 239.53 14.4926 240.854L16.4864 240.696C16.3855 239.424 16.3333 238.137 16.3315 236.839L14.3315 236.842ZM15.7521 248.774C16.3857 251.4 17.2224 253.947 18.2446 256.396L20.0903 255.626C19.1085 253.273 18.3049 250.827 17.6964 248.305L15.7521 248.774ZM21.9079 263.531C23.318 265.814 24.903 267.978 26.6441 270.003L28.1606 268.699C26.4874 266.753 24.9644 264.674 23.6096 262.48L21.9079 263.531ZM32.3313 275.656C34.3667 277.385 36.5396 278.957 38.8313 280.353L39.872 278.645C37.6701 277.304 35.5822 275.793 33.6261 274.132L32.3313 275.656ZM45.9877 283.974C48.4436 284.981 50.9954 285.803 53.6254 286.421L54.0827 284.474C51.5567 283.88 49.1058 283.091 46.7468 282.124L45.9877 283.974ZM61.5524 287.633C62.8769 287.73 64.2152 287.776 65.5654 287.77L65.5563 285.77C64.2579 285.776 62.9714 285.731 61.6984 285.638L61.5524 287.633ZM65.5654 287.77L69.9374 287.75L69.9282 285.75L65.5563 285.77L65.5654 287.77ZM78.6813 287.71L87.4252 287.669L87.4161 285.67L78.6721 285.71L78.6813 287.71ZM96.1691 287.629L104.913 287.589L104.904 285.589L96.16 285.629L96.1691 287.629ZM113.657 287.549L122.401 287.509L122.392 285.509L113.648 285.549L113.657 287.549ZM131.145 287.469L139.889 287.429L139.88 285.429L131.136 285.469L131.145 287.469ZM148.633 287.389L153.005 287.369L152.995 285.369L148.623 285.389L148.633 287.389Z" fill="#4F378A" stroke="#4F378A" strokeWidth="0.5" className='dotted-line'/>
                              <circle cx="15" cy="252" r="12" fill="white" stroke="#4F378A" strokeWidth="2" className='circle-on-top'/>
                              {isCompleted && (
                                <g transform="translate(7, 246)">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="#4F378A"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M3 6l3 3 6-6" />
                                  </svg>
                                </g>
                              )}
                            </svg>
                            <svg 
                              width="100" 
                              height="242" 
                              viewBox="0 0 104 288" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              className='icon-large'>
                              <path d="M103.005 287.369C103.557 287.366 104.003 286.916 104 286.364C103.997 285.812 103.548 285.366 102.995 285.369L103.005 287.369ZM15.3315 236.84L16.3315 236.839L15.3315 236.84ZM65.5609 286.77L65.5654 287.77L65.5609 286.77ZM14 0.00139951L14.0055 3.94874L16.0055 3.94594L16 -0.00139951L14 0.00139951ZM14.0166 11.8434L14.0276 19.7381L16.0276 19.7353L16.0166 11.8406L14.0166 11.8434ZM14.0387 27.6328L14.0497 35.5274L16.0497 35.5246L16.0387 27.63L14.0387 27.6328ZM14.0608 43.4221L14.0718 51.3168L16.0718 51.314L16.0608 43.4193L14.0608 43.4221ZM14.0829 59.2115L14.0939 67.1062L16.0939 67.1034L16.0829 59.2087L14.0829 59.2115ZM14.105 75.0008L14.116 82.8955L16.116 82.8927L16.105 74.998L14.105 75.0008ZM14.1271 90.7902L14.1381 98.6849L16.1381 98.6821L16.1271 90.7874L14.1271 90.7902ZM14.1492 106.58L14.1602 114.474L16.1602 114.471L16.1492 106.577L14.1492 106.58ZM14.1712 122.369L14.1823 130.264L16.1823 130.261L16.1712 122.366L14.1712 122.369ZM14.1933 138.158L14.2044 146.053L16.2044 146.05L16.1933 138.155L14.1933 138.158ZM14.2155 153.948L14.2265 161.842L16.2265 161.839L16.2154 153.945L14.2155 153.948ZM14.2375 169.737L14.2486 177.632L16.2486 177.629L16.2375 169.734L14.2375 169.737ZM14.2596 185.526L14.2707 193.421L16.2707 193.418L16.2596 185.523L14.2596 185.526ZM14.2817 201.316L14.2928 209.21L16.2928 209.208L16.2817 201.313L14.2817 201.316ZM14.3038 217.105L14.3149 225L16.3149 224.997L16.3038 217.102L14.3038 217.105ZM14.3259 232.894L14.3315 236.842L16.3315 236.839L16.3259 232.892L14.3259 232.894ZM14.3315 236.842C14.3333 238.192 14.3877 239.53 14.4926 240.854L16.4864 240.696C16.3855 239.424 16.3333 238.137 16.3315 236.839L14.3315 236.842ZM15.7521 248.774C16.3857 251.4 17.2224 253.947 18.2446 256.396L20.0903 255.626C19.1085 253.273 18.3049 250.827 17.6964 248.305L15.7521 248.774ZM21.9079 263.531C23.318 265.814 24.903 267.978 26.6441 270.003L28.1606 268.699C26.4874 266.753 24.9644 264.674 23.6096 262.48L21.9079 263.531ZM32.3313 275.656C34.3667 277.385 36.5396 278.957 38.8313 280.353L39.872 278.645C37.6701 277.304 35.5822 275.793 33.6261 274.132L32.3313 275.656ZM45.9877 283.974C48.4436 284.981 50.9954 285.803 53.6254 286.421L54.0827 284.474C51.5567 283.88 49.1058 283.091 46.7468 282.124L45.9877 283.974ZM61.5524 287.633C62.8769 287.73 64.2152 287.776 65.5654 287.77L65.5563 285.77C64.2579 285.776 62.9714 285.731 61.6984 285.638L61.5524 287.633ZM65.5654 287.77L69.9374 287.75L69.9282 285.75L65.5563 285.77L65.5654 287.77ZM78.6813 287.71L87.4252 287.669L87.4161 285.67L78.6721 285.71L78.6813 287.71ZM96.1691 287.629L104.913 287.589L104.904 285.589L96.16 285.629L96.1691 287.629ZM113.657 287.549L122.401 287.509L122.392 285.509L113.648 285.549L113.657 287.549ZM131.145 287.469L139.889 287.429L139.88 285.429L131.136 285.469L131.145 287.469ZM148.633 287.389L153.005 287.369L152.995 285.369L148.623 285.389L148.633 287.389Z" fill="#4F378A" stroke="#4F378A" strokeWidth="0.5"/>
                              <circle cx="15" cy="252" r="12" fill="white" stroke="#4F378A" strokeWidth="2"/>
                              {isCompleted && (
                                <g transform="translate(7, 246)">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="#4F378A"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M3 6l3 3 6-6" />
                                  </svg>
                                </g>
                              )}
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            
          </div>

          <div className="actionable-steps xl:w-6/12 md:w-7/12 space-y-4 px-4 max-h-full  right-0" style={{ backgroundColor: 'rgba(254, 247, 255)' }}>
              <div className=' items-center gap-4 mb-4 mt-4'>
                <div className='flex items-center gap-4 w-full justify-between mb-2'>
                <span className=' font-semibold text-[#65558F] text-sm xl:text-sm 2xl:text-base'
                >Progress</span>
                <span className='text-[#49454F] font-normal text-sm xl:text-sm 2xl:text-base'>
                  {goal.progress}%
                </span>
                </div>

                <BorderLinearProgress variant="determinate" value={goal.progress} className="w-full" />

              
              </div>
            <div className='w-full bg-[#F4EDF8]   rounded-lg p-2 flex justify-center items-center'>
              <p className="md:text-sm lg:text-md 2xl:text-lg text-[#1D1B20] font-medium">Start working on your goal today!</p>
            </div>
           
            <div className="text-lg container w-full p-4 rounded-xl bg-[#F4EDF8] relative">
              {isVisible ? (<TrophyAnimation />) : 
              (
                  <>
                 <div className='flex justify-between items-center gap-4 w-full pr-2'
                 >
                 <p className="md:text-sm lg:text-md flex items-center m-2 gap-2 w-full  text-[#000000] font-normal">
                    <GoDotFill className="text-[#B3B3B3] md:text-sm lg:text-base" />
                    {activeTask ? (
                      <>
                       <span className="font-semibold text-[#1D1B20] md:text-sm xl:text-xs 2xl:text-base 
                        ">{activeTask.title}</span>
                      </>
                    ) : (
                      "Select a task"
                    )}
                  </p>
                 <div className='w-6/12 flex justify-end'
                 >
                 <PickerWithButtonField />
                 </div>
                 </div>

                <Divider orientation="horizontal" sx={{ borderColor: "#767676", opacity: 0.8 }} />
                <div className='flex mt-4 items-center justify-end gap-4'>
             
              
              

          
              
              </div>
              <div className='space-y-6 mt-4'>
                {activeTask && activeTask.actionable_steps.map((step, stepIndex) => {
                  const {timeline, cleanedDetails } = extractTimeline(step.details); // Extract cleaned details for each step
              
                  return (
                    <div key={stepIndex}  className="step bg-[#FFFFFF] p-4 rounded-xl cursor-pointer flex items-center gap-4">
                    <label className="custom-checkbox">
                        <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={() => handleStepCheck(stepIndex)} // Call the new handler
                        size={16}
                        />

                        </label>
                        
                      <div className="flex w-full ">
                       <div className="flex flex-col w-10/12">
                       <span className=' text-[#1D1B20] md:text-sm xl:text-xs 2xl:text-base font-medium'>{step.subtask_title}</span>
                       <span className='text-[#49454F] md:text-xs xl:text-xs 2xl:text-sm'>{cleanedDetails}</span>
                        </div>

                        <span className=' 2xl:h-6 h-6 flex justify-center items-center bg-[#F7F2FA]   text-[#4F378A] rounded-xl xl:w-4/12 md:w-3/12 2xl:w-3/12 '>
                        <p className='md:text-xs xl:text-xs font-semibold'
                        >
                        {timeline}
                          </p></span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className='flex  mt-8 w-full justify-center  '>
              <button className='bg-[#4F378A] w-full relative max-w-sm md:text-sm lg:text-md text-white py-2 px-8 rounded-lg'>
                Add to List
              </button>
              </div>
                </>
              )
              }
             
            

            </div>

            
          </div>
  
          
        </div>
      </div>
    </div>
  );
  };
  
  export default AiGoal;