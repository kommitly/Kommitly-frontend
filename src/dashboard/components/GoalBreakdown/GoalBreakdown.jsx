import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import React, { useState, useContext, useEffect,forwardRef } from 'react';
import { Box, Button, IconButton, Typography, useTheme, Modal, Card, CardContent } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Divider } from '@mui/material';
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { createAiGoal } from '../../../utils/Api';
import { GoalsContext } from '../../../context/GoalsContext';
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../../theme";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { color, motion } from "framer-motion";
import { IoAdd } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import Loading from "../Loading";
import useMediaQuery from '@mui/material/useMediaQuery';


const extractTimeline = (details) => {
  if (!details) {
    return { timeline: 'No timeline available', cleanedDetails: '' };
  }

  console.log('Details:', details); // Debugging

  // Regex to specifically find "**Timeline:**" and capture the following text
  const match = details.match(/\*\*Timeline:\*\*\s*(.+)$/i);
  
  console.log('Match:', match); // Debugging

  // Access the first capture group (the timeline text itself)
  const timeline = match ? match[1].trim() : 'No timeline available';
  
  console.log('Timeline:', timeline); // Debugging
  
  // Get the cleaned details by removing the matched timeline string from the original details
  const cleanedDetails = match ? details.replace(match[0], '').trim() : details;

  // You can keep your existing cleanup logic, although the new regex approach makes it less necessary.
  // The primary logic of splitting the string is handled by the regex itself.
  // ... (your other cleanup code can go here if needed)

  console.log("cleaned details :", cleanedDetails);
  
  return { timeline, cleanedDetails };
};


// New Subtask Component (since your TaskComponent was already using this logic)
const SubtaskDisplayComponent = ({ task, index }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { timeline, cleanedDetails } = extractTimeline(task.description); // Re-use your extraction logic

  return (
    <div className='w-full flex items-start gap-4 py-2 border-l-2 ml-4 ' style={{ borderColor: colors.primary[500], backgroundColor: colors.primary[700] }}>
    {/* {  <Box className='flex items-center justify-center text-[#65558F] rounded-md' sx={{ backgroundColor: colors.primary[100] }}>
        <p className='flex items-center justify-center text-sm w-4 h-4 text-center'>{index + 1}</p>
      </Box>} */}
      <div className='flex md:p-4 p-2 flex-col w-full'>
        <div className='w-full mb-2 flex justify-between items-center'>
           <Typography variant="body" component="p" sx={{ color: colors.text.primary, fontWeight: 'normal' }}>
          {task.subtask_title || task.title || "No title available"}
        </Typography>

           {timeline !== 'No timeline available' && (
          <span className=" hidden md:flex text-xs  items-center space-x-1 mt-1" style={{ color: colors.text.subtitle }}>
            <AccessTimeIcon className="w-4 h-4" />
           <p>
             {timeline}
           </p>
          </span>
        )}
        </div>
       
        <div className=' md:w-10/12 w-full'>
          <Typography variant="body2" component="p" sx={{ color: colors.text.secondary, fontSize: '0.75rem', mt: 0.5 }}>
          {cleanedDetails}
        </Typography>

            {timeline !== 'No timeline available' && (
          <span className=" md:hidden flex text-xs flex items-center gap-1 md:mt-0 mt-2" style={{ color: colors.text.subtitle }}>
            <AccessTimeIcon className="w-4 h-4" />
            {timeline}
          </span>
        )}
        

          
       
          </div>
      </div>
    </div>
  );
};

// **The new Accordion Component**
const TaskAccordion = ({ task, index }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // You can use the extractTimeline on the main task description here if needed, 
  // but since you are showing subtasks, we focus on the main task title here.

  // Check if the task has subtasks to enable/disable the expand icon
  const hasSubtasks = task.ai_subtasks && task.ai_subtasks.length > 0;
  
  return (
    <Accordion
  disableGutters
  elevation={0} // removes Paper elevation
  sx={{
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important', // removes Paper shadow
    '--Paper-shadow': 'none', // removes MUI shadow variable
    '--Paper-overlay': 'none', // removes overlay gradient
    '&:before': { display: 'none' }, // removes default border line
  }}
>

     <AccordionSummary
        expandIcon={hasSubtasks ? <ExpandMoreIcon sx={{ color: colors.text.secondary }} /> : null}
        aria-controls={`panel-content-${task.id || index}`}
        id={`panel-header-${task.id || index}`}
        sx={{
          padding: 0,
          minHeight: '48px',
          
          // Target the visible content wrapper
          '& .MuiAccordionSummary-content': {
            margin: '12px 0',
            // Ensure the content itself doesn't have a background (though it shouldn't)
              backgroundColor: 'transparent !important',
          },
              '& .MuiPaper-root ': {
          '--Paper-shadow': 'none', // removes MUI shadow variable
          '--Paper-overlay': 'none', // removes overlay gradient
            
          },
          
          // *** FIX 2: Target the root button and its interactive states ***
          
          // Default background
          backgroundColor: 'transparent', 
          
          // Remove background on hover, focus, and the Mui-focusVisible state
          '&:hover, &:focus, &.Mui-focusVisible': {
            backgroundColor: 'transparent',
          },
          
          // Remove the background overlay when actively clicking/touching
          '&:active': {
            backgroundColor: 'transparent',
          },
        }}
      >

        {/* Task Title Display (The part that is always visible) */}
        <div className='flex  p-4 items-center gap-4 w-full'>
          <Box className='flex items-center justify-center text-[#65558F] rounded-md' sx={{ backgroundColor: colors.primary[200] }}>
            <p className='flex items-center justify-center text-sm w-5  h-5 text-xs text-center'>{index + 1}</p>
          </Box>
         <div>
           <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 'medium' }}>
            {task.title || "No title available"}
          </Typography>

            {task.task_timeline !== 'No timeline available' && (
          <span className=" flex text-xs  items-center space-x-1 mt-1" style={{ color: colors.text.subtitle }}>
            <AccessTimeIcon className="w-4 h-4" />
           <p>
             {task.task_timeline}
           </p>
           </span>)}

         </div>
        </div>
        
      </AccordionSummary>
      
      {/* Subtask Details (The part that expands/collapses) */}
      <AccordionDetails sx={{ padding: '0 0 16px 0' }}>
        <div className='flex md:px-8 px-4 flex-col gap-2'>
          {hasSubtasks ? (
            task.ai_subtasks.map((subtask, subIndex) => (
              <SubtaskDisplayComponent key={subtask.id || `subtask-${subIndex}`} task={subtask} index={subIndex} />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: colors.text.subtitle, ml: 8 }}>
              No subtasks found.
            </Typography>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};


const LightTooltip = styled(({ className,placement, ...props }) => (
  <Tooltip {...props} arrow placement={placement} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.background.sidebar,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.sidebar,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[3],
    fontSize: '0.9rem',
    padding: '1rem',
    borderRadius: '12px',
    maxWidth: 320,
   
    
  },
}));


const GoalBreakdown = forwardRef(({ goalData, taskData, onClose, isCollapsed }, ref) => {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const isSm = useMediaQuery(theme.breakpoints.down('xs')); // This checks for screens 'sm' and smaller
  const tooltipPlacement = isCollapsed && isSm ? "bottom-start" : "top-start";
  const anchorLeftPosition = (isCollapsed && isSm)
      ? { xs: '5%', sm: '23%' } // Shift farther left when collapsed on small screens
      : { xs: '10%', sm: '32%' }; // Default position
  const { goals, setGoals } = useContext(GoalsContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
   const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  
    
  
    useEffect(() => {
      const hasSeenModal = localStorage.getItem("seenNewGoalModal");
  
      if (!hasSeenModal || hasSeenModal === "false") {
        setShowNewGoalModal(true);
        localStorage.setItem("seenNewGoalModal", "true");
      }
    }, []);


  useEffect(() => {
    if (goalData && taskData) {
      setLoading(false);
    }
  }, [goalData, taskData]);

  if (loading) {
    return (
         <>
         <Loading/>
         </>
      
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

 

  return (
    <div ref={ref} className="mt-6 w-full  flex justify-center pb-4 flex-1 overflow-y-auto scrollbar-hide">

      <Modal
        open={showNewGoalModal}
        onClose={() => setShowNewGoalModal(false)}
        aria-labelledby="new-goal-modal"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      >
        <Box
           sx={{
          position: 'absolute',
          top: { xs: "40%", sm: "26%" }, // higher on extra small screens
          left: anchorLeftPosition, // slightly shifted on small screens
        
          pointerEvents: 'none',
        }}
        >
          <LightTooltip
            open
            placement={tooltipPlacement}
            title={
              <Box textAlign="start">
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 'bold', mb: 1 }}>
                  Save this goal 📁
                </Typography>
                <Typography sx={{ color: "#fff",  fontSize: '0.8rem', mb: 2 }}>
                  Like this goal breakdown? Save it to your collection and revisit it anytime.
                </Typography>
               
               <div className='w-full flex justify-end'>
                 <Button
                  variant="outlined"
                  onClick={() => setShowNewGoalModal(false)}
                  sx={{
                    borderColor: '#fff',
                    color: '#fff',
                    borderRadius: '100px',
                    px: 3,
                    py: 0.8,
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    '&:hover': { backgroundColor: 'primary.light' },
                  }}
                >
                  Got it
                </Button>
               </div>
              </Box>
            }
          >
            {/* Visible anchor element */}
            <Box
                sx={{
          width: 0,
          height: 0,
          pointerEvents: 'auto',
          position: 'relative',
        }}
            />
          </LightTooltip>
        </Box>
      </Modal>
      
      
      <Box className=' xl:w-9/12 md:w-8/12 w-full rounded-2xl py-2 border ' sx={{ backgroundColor: colors.background.default, borderColor: colors.background.paper,  boxShadow:
      theme.palette.mode === 'dark'
        ? `4px 4px 4px rgba(109, 91, 166, 0.5)`
        : `4px 4px 4px rgba(214, 207, 255, 0.6)`, 

      }}>
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
             <IconButton onClick={onClose} className='text-[#4F378A]'>
           <MdClear />
          </IconButton>
          </div>
         

          



        </div>

        <Divider orientation="horizontal" sx={{ borderColor: colors.background.paper, opacity: 0.8 }} />

        <div className='flex flex-col  p-4 gap-4'>
          <p className='inline-block'>
          <span className=' font-medium text-base px-2 py-1 rounded-lg' style={{color: colors.text.secondary}}>
            Tasks Overview
          </span>
        </p>

        <div className='flex flex-col gap-2 justify-center'>
    {taskData.map((task, index) => (
      <React.Fragment key={task.id || `task-${index}`}>
        {/* *** Use the new Accordion component here *** */}
        <TaskAccordion task={task} index={index} />
        
        {index < taskData.length - 1 && (
            // Add a slight divider between the accordions
            <div className='py-1'> 
              <Divider orientation="horizontal" sx={{ borderColor:  colors.background.paper, opacity: 0.6 }} />
            </div>
        )}
      </React.Fragment>
    ))}
  </div>

          

         
        </div>
      </Box>
    </div>
  );
});

export default GoalBreakdown;