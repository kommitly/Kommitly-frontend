import React from 'react';
import { useState, useEffect } from 'react'; // Import useEffect
import { CiCircleMore } from "react-icons/ci";
import { RiProgress1Line } from "react-icons/ri";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';
import { Box,  useTheme } from "@mui/material";
import { tokens } from "../../theme";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { MoreHorizontal } from 'lucide-react';

import aiGoals from '../../assets/goals.svg';
import * as motion from "motion/react-client"
import useMediaQuery from '@mui/material/useMediaQuery';
import { BsHourglassTop } from "react-icons/bs";
import Constants from "./Constants"


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
   



const HeroComponent = () => {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const goal = Constants;
  
  const initialIndex = 0;

  // 2. State Initialization
  const [activeTaskIndex, setActiveTaskIndex] = useState(initialIndex);
  const [taskCompletionStatus, setTaskCompletionStatus] = useState([]); // Currently unused
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const [lineY2, setLineY2] = useState(210);
  
  // Get the current active task based on state
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


  // =========================================================================
  // 3. EFFECT FOR AUTOPLAY (Changing the active task every 2 seconds)
  // =========================================================================
  useEffect(() => {
    // Check if the goals list is not empty
    if (goal.ai_tasks.length === 0) return;

    // Set up the interval timer
    const intervalId = setInterval(() => {
      setActiveTaskIndex(prevIndex => {
        // Calculate the next index, looping back to 0 if we hit the end
        const nextIndex = (prevIndex + 1) % goal.ai_tasks.length;
        return nextIndex;
      });
    }, 2000); // 2000 milliseconds = 2 seconds

    // Cleanup function: Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [goal.ai_tasks.length]);

  const handleStepCheck = (id) => {
    console.log(`Toggling step: ${id}`);
  }
  
  return (
   <div 
  className='w-full h-[90vh] flex p-4 border border-b-0 rounded-xl' 
  style={{
    backgroundColor: colors.background.default, 
    borderColor: colors.background.paper,
    // Add box shadow that matches the borderColor (colors.background.paper)
    boxShadow: `2px 0px 5px ${colors.background.paper}` 
  }}
>

      <div className="w-full pt-2 h-full  ">
        
        
        <div className=' flex h-full  w-full '>
       
          <div className=' md:w-9/12 w-full '>
           <div className='flex items-center  mt-2 gap-4 justify-between'>
            <div className='flex items-center gap-4 2xl:ml-4 '>
            <span className='text-lg'> 🚩</span>
                
            <h1 className='md:text-sm  font-medium'>{goal.title}</h1>
                 


              </div>

              <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#65558F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              
         
              >
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
               
              </div>
              
            </div>
         
           

      {/* Modal for AI Subtask Task Form */}
         





         
           
            <div className="ai-tasks  overflow-visible overflow-y-clip   md:px-6 px-0 md:pr-6 pr-0 w-full  flex flex-col items-center  justify-center  " >
              <div className=" md:w-10/12 w-full  gap-4 pl-0 pb-10 md:pl-3 lg:pl-3 xl:pl-3 2xl:pl-3 md:m-2 m-0">
                {goal.ai_tasks.map((task, index) => {
                  const isCompleted = taskCompletionStatus[index];
                  const allTasksCompleted = goal.ai_tasks.every(t => t.status === 'completed');
                  const isActive = !allTasksCompleted && (index === activeTaskIndex || (index === 0 && activeTaskIndex === null));
                  const isLastTask = index === goal.ai_tasks.length - 1;
              
                  return (
                    <div className="mx-auto " key={task.id}  
>
                         <motion.div
      className={`task ${isCompleted ? "completed" : ""} relative mt-8`}
    
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          delay: index * 0.3, // Staggered delay based on index
                        }}>
                        <div className="flex  transition-transform duration-300 justify-between items-center md:gap-4 gap-2 relative  max-h-full   border-l md:p-4 p-2  rounded-xl xl:border-l-[2px] 2xl:border-l-[2.5px] lg:border-l-[2.5px] md:border-l-[2.5px] 2xl:w-10/12 lg:w-full md:w-11/12 w-full"   style={{
        backgroundColor: allTasksCompleted
          ? theme.palette.background.paper // Adjust to your theme color
          : isActive
          ? "#4F378A" // White background for active
          : theme.palette.background.paper,
        borderLeftColor: theme.palette.primary.main, // Replace with the desired theme color
        // boxShadow:
        //  "2px 3px 8px 2px rgba(101, 85, 143, 0.2), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}>
          <div className={`md:w-1/4 w-24 rounded-lg  p-2 flex justify-center items-center ${isActive ? 'bg-[#F4F1FF]' : 'bg-[#FFFFFF]'}`}  style={{
        backgroundColor:isActive
          ? "#D6CFFF" // White background for active
          : colors.menu.primary,

      }}>
                              <img src={aiGoals} alt="goals"  className='h-18 object-cover'/>
                                 </div>
                            <div className='w-full ' >
                              <div className='flex  items-center h-auto gap-4  md:mb-2 mb-2 w-full justify-between '>
                                 
                                  <h3 className="md:text-xs text-xs xl:text-xs 2xl:text-xs font-medium" style={{color: isActive ? colors.primary[100] : colors.text.primary}}>
                                    {task.title}
                                  </h3>
                          
                                  
                                  <div className="relative overflow-visible" >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke= {isActive ? colors.primary[100] : colors.text.secondary}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                         
                                           
                                      
                                          >
                                            <circle cx="12" cy="5" r="1"></circle>
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="12" cy="19" r="1"></circle>
                                          </svg>
                                          
                                 </div>




                            
                                </div>

                                 


                                <div className="flex flex-col gap-2">
                                                  <div className="flex items-center">
                                                    {isXs ? (  <div className="w-8 flex justify-center"> <BsHourglassTop fontSize='small'  style={{ color: isActive ? colors.primary[100] : colors.text.secondary }}/> </div> 
                                                     
                ):( <p className="w-16 text-[10px] font-medium " style={{color: isActive ? colors.primary[100] : colors.text.secondary }}>Timeline:</p>)}

                                                   <span
                                                        className="w-20 flex justify-center py-0.5 md:border text-[10px] rounded-sm "
                                                        style={{
                                                          color: isActive ? colors.primary[100] : colors.text.secondary,
                                                          borderColor: isActive ? colors.primary[100] : colors.text.secondary,
                                                        }}
                                                      >
                                                        {task.timeline}
                                                      </span>

                                                  </div>
      <div className="flex items-center">
    {isXs ? (
        <div className="w-8 flex justify-center"> 
            <StatusIcon 
  status={task.status} 
  color={isActive ? colors.primary[100] : colors.text.secondary} 
/>


        </div>
    ) : (
        // Use the descriptive text on medium screens and up
        <p className="w-16 text-[10px] font-medium " style={{ color: isActive ? colors.primary[100] : colors.text.secondary }}>Status:</p>
    )}
    <span className=" py-0.5 border w-20 text-center rounded-sm text-[10px] justify-center flex items-center " style={{ color: isActive ? colors.primary[100] : colors.text.secondary, borderColor: isActive ? colors.primary[100] : colors.text.secondary }}>
        {task.status}
    </span>
</div>
                                                


                                                </div>





                              </div>
                           
                         
                                        </div>
                                          

                         {index < goal.ai_tasks.length && (
                                          
                                   <div className="absolute  md:-left-18 xl:-left-6 lg:-left-5  -left-23  hidden md:block  transform md:-translate-x-1/4 translate-x-1/12 top-1/5   flex flex-col items-center  overflow-hidden">

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

          <Box className="hidden relative md:block actionable-steps xl:w-6/12 lg:w-5/12 md:w-5/12 space-y-4 p-4 h-auto rounded-xl mt-4 " sx={{ backgroundColor: colors.background.paper }}>
              <div className=' items-center gap-4 mb-4 mt-4'>
                <div className='flex items-center gap-4 w-full justify-between mb-2'>
                <span className=' font-regular text-[#00000] text-xs '
                >Progress</span>
                <span className=' font-regular text-xs ' style={{color: colors.text.primary}}>
                  24%
                </span>
                </div>

                <BorderLinearProgress variant="determinate" value={goal.progress} className="w-full" />

              
              </div>
            <Box className='w-full    rounded-lg p-2 flex justify-center items-center' sx={{ backgroundColor: colors.background.default }}>
                 <p className="md:text-xs lg:text-md 2xl:text-lg  font-medium" style={{color: colors.text.primary}}>
                Start working on your goal today! 🚀
              </p>
            </Box>
           
            <Box className="text-lg container h-[54vh] w-full px-4 py-2 mb-4 rounded-lg bg-[#FFFFFF] relative flex flex-col" sx={{ backgroundColor: colors.background.default }}>
             
    {/* Content Container: This holds everything EXCEPT the button */}
    <div className="flex-grow overflow-y-auto pb-16"> {/* Add padding-bottom to ensure content doesn't hide under the fixed button */}
        <div className='flex justify-between items-center mb-2 gap-4 w-full pr-2'>
            <p className="text-xs flex items-center m-2 gap-2 w-full  text-[#000000] font-normal">
                {activeTask ? (
                    <>
                        <span className="font-medium text-xs" style={{color: colors.text.primary}}>{activeTask.title}</span>
                    </>
                ) : (
                    "Select a task"
                )}
            </p>
        </div>

        <Divider orientation="horizontal" sx={{ borderColor: "#767676", opacity: 0.8 }} />

        {/* This div was empty, so I removed the flex classes */}
        <div className='mt-4'></div> 
        
        <div className='space-y-6 mt-4'>
            {activeTask?.ai_subtasks?.map((step) => (
                <Box key={step.id} className="step rounded-xl transition-transform duration-300  flex items-center" sx={{ backgroundColor: colors.background.paper }}>
                    <label className="custom-checkbox p-2">
                        <input
                            type="checkbox"
                            checked={step.status === "completed"}
                            onChange={() => handleStepCheck(step.id)}
                            size={16}
                        />
                    </label>

                    <div className='w-full py-4'>
                        <div className="flex flex-col w-full">
                            <Box width={"100%"} display={"flex"} alignItems={"center"}>
                                <span className='md:text-xs xl:text-xs xl:w-full 2xl:text-xs font-regular' style={{ color: colors.text.primary }}>
                                    {step.title}
                                </span>
                            </Box>

                            <Box className='2xl:h-6 h-6 flex items-center gap-2'>
                                <BsHourglassTop fontSize='small' style={{ color: colors.text.secondary }} />
                                <p className='text-[10px] font-medium gap-4' style={{ color: colors.text.secondary }}>
                                    {step.timeline}
                                </p>
                            </Box>
                        </div>
                    </div>
                </Box>
            ))}
        </div>
    </div>
    {/* END Content Container */}

    {/* The Button Container is NOW FIXED to the bottom */}
    <div className='flex absolute bottom-0 left-0 right-0 py-4 w-full justify-center bg-[#FFFFFF] rounded-b-lg' sx={{ backgroundColor: colors.background.default }}>
        <button className='bg-[#4F378A] text-xs w-11/12 max-w-sm text-white py-2 px-8 rounded-lg'>
            Add to List
        </button>
    </div>
           
</Box>
            
          </Box>
  
          
        </div>
      </div>
    </div>
  );
  };
  
  export default HeroComponent;