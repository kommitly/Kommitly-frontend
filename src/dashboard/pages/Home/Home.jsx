import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
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

  if (!hasSeenModal) {
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
    <div className='w-full   md:px-0 px-2  mt-4 '>

      

      <div className="w-full   flex-1 overflow-y-auto scrollbar-hide xl:max-h-[76vh] md:max-h-[70vh]  no-scrollbar">
      
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

          {/* Problem Statement Section */}
      {!showGoalBreakdown && (
        <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.5 } }, // Stagger effect
        }}
        className="py-8 px-4 space-y-4"
      > 
          <motion.div className='flex h-10 items-center gap-4 mb-4 '
          style={{marginBottom: isXs
        ? '10px'
        : isSm
        ? '20px'
        : isMd
        ? '20px'
        : isLg
        ? '20px'
        : isXl
        ? '20px'
        : isXxl
        ? '20px'
        : '20px'
           }}>

           <Box>
           <motion.div
              className='flex items-center justify-center w-4 h-4 rounded-full'
              style={{ backgroundColor: colors.primary[500],
                width: isXs ? '10px' : isSm ? '20px' : isMd ? '20px' : isLg ? '20px' : isXl ? '20px' : isXxl ? '20px' : '20px', 
                height: isXs ? '10px' : isSm ? '20px' : isMd ? '20px' : isLg ? '20px' : isXl ? '20px' : isXxl ? '20px' : '20px',
                
               }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              ref={(el) => {
                if (el) {
                  animate(el, { scale: [0.8, 1.4, 0.8] }, { duration: 1.5, repeat: Infinity });
                }
              }}
            >

              </motion.div>
           </Box>

              <TypingText color={colors.primary[500]}  onComplete={() => setTextComplete(true)} />

          </motion.div>

          { textComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} // Remove fixed delay
            className='flex w-full items-center gap-5'
          >
            <div className='w-3  h-8'>

            </div>
            <div>

             
          <Typography variant="h4" className="mt-2 w-full" style={{ color: colors.text.tertiary, fontWeight: '400' ,  fontSize: isXs
        ? "0.8rem" // Smallest size for XS
        : isSm
        ? "1.2rem" // Medium size for SM
        : isMd
        ? "1.2rem" // Medium size for MD
        : isLg
        ? "1.2rem" // Large size for LG
        : isXl
        ? "1.5rem" // Extra large size for XL
        : "1.2rem", // Default size for larger screens (or the largest)
    }}>
            Achieve your goals in just a few steps:
          </Typography>
          <motion.ul
  className="mt-4"
  style={{ color: colors.primary[500] }}
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.2 } } // Stagger effect
  }}
>
  {steps.map((step, index) => (
    <motion.li
      key={index}
      className="flex items-center gap-3 text-primary "
      style={{ marginLeft: `${index * 8}px` }}
      variants={{
        hidden: { opacity: 0, x: -20 }, // Start slightly to the left
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } // Slide in
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="#A89FE3"
        className="w-5 h-8 text-secondary"
      >
        <path d="M4 4 Q4 14 14 14" strokeLinecap="round" />{/* Smooth right-angle bend */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l6 6-6 6" />
      </svg>
      <Typography  style={{fontSize: isXs
        ? "0.8rem" // Smallest size for XS
        : isSm
        ? "1rem" // Medium size for SM
        : isMd
        ? "1rem" // Medium size for MD
        : isLg
        ? "1rem" // Large size for LG
        : isXl
        ? "1.2rem" // Extra large size for XL
        : "1rem", // Default size for larger screens (or the largest)
    }}>
      {step}
      </Typography>
   
    </motion.li>
  ))}
</motion.ul>





            </div>
           
          </motion.div>
        )}

          
          
        </motion.div>
      )}

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
    bottom: { xs: 170, sm: 160 }, // higher on extra small screens
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
   <div className='flex  w-full  items-center justify-center flex-wrap gap-4'>
   <Box className='md:w-8/12 xl:w-6/12 w-10/12  bg-[#F4F1FF] p-2 z-10 rounded-full fixed bottom-20' sx={{
    backgroundColor: colors.background.paper,
    position: 'fixed',
    zIndex: (theme) => theme.zIndex.modal + 3
  }}>
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
           placeholder='Break down a new goal'
           value={inputValue}
           onChange={handleInputChange}
           onKeyDown={(e) => e.key === 'Enter' && handleFormSubmit()}
           className=' outline-none border-none w-full text-xs' style={{color: colors.text.primary}}
         />

       </div>
       <IconButton onClick={handleFormSubmit}>
         <LuSendHorizontal size={16} style={{color: colors.primary[500]}} />
       </IconButton>
     </div>
   </Box>
 </div>


)}


        {showGoalBreakdown && goalData && taskData && (
          <>
             <GoalBreakdown
            goalData={goalData}
            taskData={taskData}
            ref={goalBreakdownRef} // Pass ref to GoalBreakdown
            onClose={handleCloseGoalBreakdown}
          />
          
          </>
       
        )}


      </div>
      


   
    </div>
  );
};

export default Home;