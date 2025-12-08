import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useOutletContext } from 'react-router-dom';
import  { useState, useContext, useEffect, useRef } from 'react';
import { LuSendHorizontal } from "react-icons/lu";
import GoalBreakdown from '../../components/GoalBreakdown/GoalBreakdown';
import {  generateInsights } from '../../../utils/Api';
import { color, motion } from 'framer-motion';
import { ProfileContext } from '../../../context/ProfileContext';
import { Box, Button, IconButton, Typography, useTheme, Modal, Card, CardContent } from "@mui/material";
import { tokens } from "../../../theme";
import FlowChart from './Flowchart';
import { animate } from "motion"
import TypingText from './TypingText';
import useMediaQuery from '@mui/material/useMediaQuery';
import Loading from '../../components/Loading';


const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow placement="top" classes={{ popper: className }} />
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
    textAlign: 'center',
  },
}));

const Home = () => {
  const { isCollapsed, isMobile } = useOutletContext();
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const [inputValue, setInputValue] = useState('');
  const [goalData, setGoalData] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [goal, setGoal] = useState("");
  const [showGoalBreakdown, setShowGoalBreakdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { profile } = useContext(ProfileContext);
  const [textComplete, setTextComplete] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const goalBreakdownRef = useRef(null); // Create ref for GoalBreakdown
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
  const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("seenNewUserModal");

    if (!hasSeenModal || hasSeenModal === "false") {
      setShowNewUserModal(true);
      localStorage.setItem("seenNewUserModal", "true");
    }
  }, []);


   
  useEffect(() => {
    if (goalBreakdownRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = goalBreakdownRef.current;
      setIsScrolledDown(scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight - 10);
    }
  }, [goalData, taskData, showGoalBreakdown]);

  const handleScrollToBottom = () => {
    if (goalBreakdownRef.current) {
      goalBreakdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };
  const steps = [
    "Enter your goal in the text field below",
    "Break it down into tasks",
    "Save it to your collection",
    "Schedule the tasks on your calendar",
    "Track your progress",
    "Stay consistent and celebrate your achievements!"
  ];
 

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async () => {
    // Prevent empty goal submission
    setLoading(true);
    setErrorMessage(null); 
    try {
      const response = await generateInsights('string', inputValue); // pass the input value as the description
      console.log("API Response:", response); // Debugging
      setGoalData(response.ai_goal);
      setTaskData(response.ai_tasks);
      setGoal(inputValue);
      setInputValue('');
      setShowGoalBreakdown(true); // Show the GoalBreakdown component
    } catch (error) {
      console.error('Error creating goal:', error);
      const message = error?.response?.data?.error || "Something went wrong.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseGoalBreakdown = () => {
    setShowGoalBreakdown(false);
    setGoalData(null);
    setTaskData([]);
  };

  const quotes = [
    "A goal without a plan is just a wish. – Antoine de Saint-Exupéry",
    "You don’t have to be great to start, but you have to start to be great. – Zig Ziglar",
    "Small steps every day lead to big changes."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

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

  
  return (
    <div className='w-full md:p-6 p-2 mt-4 '>

      

      <div className="w-full 2xl:px-16   md:px-0 px-2    flex-1 overflow-y-auto scrollbar-hide xl:max-h-[76vh] md:max-h-[70vh]  no-scrollbar">
      
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

          {/* Problem Statement Section */}


<Modal
  open={showNewUserModal}
  onClose={() => setShowNewUserModal(false)}
  aria-labelledby="new-user-modal"
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
    bottom: { xs: 120, sm: "56%" }, // higher on extra small screens
    left: { xs: '50%', sm: '50%' }, // slightly shifted on small screens
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  }}
  >
    <LightTooltip
      open
      title={
        <Box textAlign="start">
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 'bold', mb: 1 }}>
            Welcome to Kommitly 🎯
          </Typography>
          <Typography sx={{ color: "#fff",  fontSize: '0.9rem', mb: 2 }}>
            Start by typing your first goal below to see how Kommitly helps you
            break it down into actionable steps.
          </Typography>
         
         <div className='w-full flex justify-end'>
           <Button
            variant="outlined"
            onClick={() => setShowNewUserModal(false)}
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
          bottom: -40, // pushes tooltip slightly up
        }}
      />
    </LightTooltip>
  </Box>
</Modal>





{!showGoalBreakdown && (
   <div className='flex relative md:h-[70vh] h-[88vh]  w-full  items-center justify-center flex-wrap gap-4'>
    <div className='w-full h-full   flex flex-col justify-center items-center '>
    <Typography
  variant="body"
  sx={{
    color: colors.text.secondary,
     fontSize: {
      xs: "1.6rem",  // mobile
      sm: "1.2rem",
      md: "1.4rem",
      lg: "1.6rem", // desktop
      xl: "2rem",
      xxl: "2.2rem"
    },
    marginBottom: "4rem",
    textAlign: "center",
  }}
>
  What Goal do You Want to Break Down?
</Typography>

     <Box
   className="md:w-9/12 xl:w-8/12 w-full border p-2 md:p-2 xl:p-3 2xl:p-4  z-10 rounded-full"
  sx={{
    borderColor: colors.primary[200],
    boxShadow:
      theme.palette.mode === 'dark'
        ? `4px 4px 4px rgba(109, 91, 166, 0.5)`
        : `4px 4px 4px rgba(214, 207, 255, 0.6)`,

    // ✅ Fixed at bottom on small screens, centered on medium+
    position: { xs: 'fixed', md: 'relative' },
    bottom: { xs: '2rem', md: 'auto' },
    left: { xs: '50%', md: '0' },
    transform: { xs: 'translateX(-50%)', md: 'none' },
    width: { xs: '90%', md: '70%' },
    zIndex: 10,
  }}
>
     <div className='flex items-center justify-between gap-4'>
       <div className='flex items-center w-full gap-4 ml-2'>
         <IconButton>
           <svg
             xmlns="http://www.w3.org/2000/svg"
             width="16"
             height="16"
             viewBox="0 0 24 24"
             fill="none"
             stroke='currentColor'
             strokeWidth="2"
             strokeLinecap="round"
             strokeLinejoin="round"
            style={{color: colors.primary[500]}}
           >
             <line x1="3" y1="12" x2="21" y2="12"></line>
             <line x1="3" y1="6" x2="21" y2="6"></line>
             <line x1="3" y1="18" x2="21" y2="18"></line>
           </svg>
         </IconButton>




         <input
           type="text"
           placeholder='Enter a goal'
           value={inputValue}
           onChange={handleInputChange}
           onKeyDown={(e) => e.key === 'Enter' && handleFormSubmit()}
           className=' outline-none border-none w-full md:text-base text-sm xl:text-base 2xl:text-xl lg:text-base' style={{color: colors.text.primary}}
         />

       </div>
       <IconButton onClick={handleFormSubmit}>
         <LuSendHorizontal size={16} style={{color: colors.primary[500]}} />
       </IconButton>
     </div>
   </Box>


      </div>
  
 </div>


)}


        {showGoalBreakdown && goalData && taskData && (
          <>
             <GoalBreakdown
            goalData={goalData}
            taskData={taskData}
            ref={goalBreakdownRef} // Pass ref to GoalBreakdown
            onClose={handleCloseGoalBreakdown}
            isCollapsed={isCollapsed}
          />
          
          </>
       
        )}


      </div>
      


   
    </div>
  );
};

export default Home;