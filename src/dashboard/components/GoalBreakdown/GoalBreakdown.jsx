import { colors, IconButton } from '@mui/material';
import React, { useState, useContext, useEffect,forwardRef } from 'react';
import { Divider } from '@mui/material';
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { createAiGoal } from '../../../utils/Api';
import { GoalsContext } from '../../../context/GoalsContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { color, motion } from "framer-motion";
import { IoAdd } from "react-icons/io5";
import { MdClear } from "react-icons/md";

const extractTimeline = (details) => {
  if (!details) return { timeline: 'No detail available', cleanedDetails: details };

  console.log('Details:', details); // Debugging

  // Updated regex to match time expressions with an optional "within" before them
   const match = details.match(/\b(within\s+)?((Days|Weeks|Months|Years)\s*\d+-\d+|\d+-\d+\s*(days|weeks|months|years)|\d+(Days|Weeks|Months|Years)|\d+\s*(day|week|month|year)|On-going)\b/i);

  console.log('Match:', match); // Debugging

  const timeline = match ? match[2] : 'No timeline available'; // Extract actual time value, ignoring "within"
  console.log('Timeline:', timeline); // Debugging
  
  let cleanedDetails = match ? details.replace(match[0], '').trim() : details;

  // Ensure no leftover empty phrases
  cleanedDetails = cleanedDetails.replace(/\s+([,.])/, '$1'); // Remove spaces before punctuation
  cleanedDetails = cleanedDetails.replace(/\s*\(\s*\)\s*/g, ''); // Remove empty parentheses
  cleanedDetails = cleanedDetails.replace(/\s+\.$/, '.'); // Remove trailing spaces before period
  cleanedDetails = cleanedDetails.replace(/\bwithin\s*$/, ''); // Remove hanging "within" if left alone
  cleanedDetails = cleanedDetails.replace(/\b(for|in|at|on|by|Allocate)\s*[.,]*\s*$/, ''); // Remove orphaned prepositions and "Allocate" if at the end

  return { timeline, cleanedDetails };
};




const TaskComponent = ({ task, index }) => {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);

  const { timeline, cleanedDetails } = extractTimeline(task.description);
  return (
    <div className='w-11/12'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center justify-center'>
          <Box className='flex items-center p-2 justify-center  text-[#65558F] rounded-md' sx={{ backgroundColor: colors.primary[100] }}>
            <p className='flex items-center justify-center text-sm w-4 h-4 text-center'>{index + 1}</p>
          </Box>
        </div>
        <div className='w-full gap-4'>
          <div className='font-normal  text-[#1D1B20] px-2 py-1'>
            <p className='md:text-sm text-sm ' style={{ color: colors.text.primary }}>
            {task.subtask_title || task.title || "No title available"}
            </p>
            </div>
          <div className='font-medium text-[#65558F] px-2 py-1'>
            <div className='font-medium w-full text-sm'>
              {cleanedDetails ? (
                <span className='text-[#49454F] text-xs font-normal'>
                  <Typography variant="body2" component="p" sx={{ color: colors.text.secondary }}>
                  {cleanedDetails}
                  </Typography>
                  </span>
              ) : (
                <span className=" text-xs flex items-center gap-1" style={{ color: colors.text.subtitle }}>
                <AccessTimeIcon className="w-4 h-4" />
                {task.task_timeline || "No timeline available"}
              </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoalBreakdown = forwardRef(({ goalData, taskData, onClose }, ref) => {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const [showSteps, setShowSteps] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { goals, setGoals } = useContext(GoalsContext);
  const [loading, setLoading] = useState(false);
  const { goal, setGoal } = useContext(GoalsContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (goalData && taskData) {
      setLoading(false);
    }
  }, [goalData, taskData]);

  if (loading) {
    return (
         <div className="w-11/12 p-8  min-h-screen flex justify-center items-center no-scrollbar">
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
    );
  }

  if (!goalData || !taskData || taskData.length === 0) {
    return <p>No tasks available.</p>;
  }

  const handleCreateGoal = async () => {
    setLoading(true);
    try {
      const response = await createAiGoal(goalData, taskData);
      console.log("Goal Creation API Response:", response); // Debugging
      setGoals((prevGoals) => ({
        goals: [...prevGoals.goals, response.ai_goal], // Add to goals array
        ai_goals: [...prevGoals.ai_goals, response.ai_goal], // Add to ai_goals array
    }));


      navigate(`/dashboard/ai-goal/${response.ai_goal.id}`);
    return; // ✅ ensures no further code runs after navigation
  } catch (error) {
    console.error('Error creating goal:', error);
    setLoading(false);
  }
  };

  const displayData = showSteps && selectedTask
    ? selectedTask.ai_subtasks.map((step, i) => ({
        ...step,
        id: `step-${i}`, // Ensure each step has a unique ID
      }))
    : taskData;

  return (
    <div ref={ref} className="mt-6 w-full flex justify-center pb-4 flex-1 overflow-y-auto scrollbar-hide">
      <Box className=' xl:w-9/12 md:w-8/12 w-full rounded-2xl py-2  ' sx={{ backgroundColor: colors.background.paper }}>
        <div className='flex flex-col  px-2 py-4  '>
          <div className='flex items-center w-full p-1'>
     
           
             
      
            <div className='flex w-full items-center gap-1 '>
          <div className='p-2 w-14 relative'>
                  <button
                aria-label="Add a new goal"
                className="pulse button"
              
                onClick={handleCreateGoal}
              >
                <IoAdd size={16} />
                
              </button>
          </div>
              <Box className=' font-medium text-[#65558F]  rounded-lg' >
                <p className='text-lg' style={{ color: colors.text.primary }}>
                {goalData.title}
                </p>
              </Box>
            </div>
             <IconButton onClick={onClose}>
           <MdClear />
          </IconButton>
          </div>
         

          



        </div>

        <Divider orientation="horizontal" sx={{ borderColor: colors.text.primary, opacity: 0.8 }} />

        <div className='flex flex-col  p-4 gap-4'>
          <p className='inline-block'>
            <span className=' font-medium text-base px-2 py-1 rounded-lg' style={{color: colors.text.secondary}}>
              {showSteps && selectedTask ? selectedTask.title : "Tasks"}
            </span>
          </p>

          <div className='flex flex-col gap-4 justify-center'>
            {displayData.map((task, index) => {
              const { timeline, cleanedDetails } = extractTimeline(task.description);

              return (
                <div key={task.id || `task-${index}`} className="">
                  <div className='flex md:w-11/12 w-full items-center'>
                    <TaskComponent task={{ ...task, details: cleanedDetails }} index={index} />
                    {!showSteps && (
                      <button
                        className="custom-button w-6/12 inline-flex items-center cursor-pointer mt-2 relative overflow-hidden group"
                        onClick={() => {
                          setSelectedTask(task);
                          setShowSteps(true);
                        }}
                      >
                        <span className="btn-text text-xs p-1 font-regular" style={{ color: colors.text.secondary, background: "rgba(101, 55, 215, 0.14)" }}>
                          View Subtasks
                          <span className="hover-line"  style={{backgroundColor:colors.text.subtitle}}></span>
                        </span>
                      </button>
                    )}
                    {showSteps && (
                      <div className='flex w-4/12 item-start '>
                        <p className=' font-medium text-xs ' style={{ color: colors.text.subtitle }}>
                         <span>
                         <AccessTimeIcon/> {timeline}
                         </span>
                        </p>
                      </div>
                    )}
                 
                  </div>
                  {index < displayData.length - 1 && (
                      <div className='py-4'>
                        <Divider orientation="horizontal" sx={{ borderColor: colors.primary[500], opacity: 0.8 }} />
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          {showSteps && (
            <button
              className="custom-button font-medium text-sm  inline-flex items-center cursor-pointer mt-4 relative overflow-hidden group" style={{ color: colors.text.subtitle }}
              onClick={() => {
                setShowSteps(false);
                setSelectedTask(null);
              }}
            >
              <span className="flex  items-center btn-text">
              <span className='flex items-center gap-2 text-xs'><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.text.subtitle}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-arrow-left"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg> Back to Tasks
              </span>
                <span className="hover-line" style={{backgroundColor:colors.text.subtitle}}></span>
              </span>
            </button>
          )}
        </div>
      </Box>
    </div>
  );
});

export default GoalBreakdown;