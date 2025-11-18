import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { GoalsContext } from '../../../context/GoalsContext';
import { Link, useNavigate, useLocation , useParams} from "react-router-dom";
import CustomButton from '../../components/Button';
import { IconButton, Typography, useTheme, Button, Menu } from "@mui/material";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { tokens } from "../../../theme";
import { useMediaQuery } from '@mui/material';
import { color, motion } from 'framer-motion';
import analysis from '../../../assets/analyze-data.svg';
import aiGoals from '../../../assets/goals.svg';
import { createGoal } from '../../../utils/Api';
import CircularProgress from '@mui/material/CircularProgress';
import background from '../../../assets/goal.svg';
import SlidingButton from '../../components/SlidingButton';
import { Divider } from '@mui/material';
import GoalsPieChart from './GoalsPieChart'; // Import the PieChart component
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { IoSearch } from "react-icons/io5";
import {
  Backdrop,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ProfileContext } from '../../../context/ProfileContext';
import SellIcon from '@mui/icons-material/Sell';
import Empty from '../../components/Empty';
import FormButton from '../../components/FormButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import ReusableFormModal from '../../components/ReusableFormModal';
import { Target, Check, ArrowRight, Star, Bell, Calendar, LineChart } from 'lucide-react';
import Circles from '../../../assets/Circles.svg';




const FloatingIcon = ({ icon: Icon, delay, size, top, left, right, className }) => {
  return (
    <motion.div
      className={`absolute z-0 opacity-50 ${className}`}
      style={{ top, left, right }} // ✅ include right here
      initial={{ y: 0 }}
      animate={{ y: [0, 10, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <Icon size={size} color="#A89FE3" />
    </motion.div>
  );
};


function CircularProgressWithLabel({ value, textColor = '#000000', progressColor = '#4F378A' , size = 40, fontSize = '0.6rem' }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        sx={{ color: progressColor }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: textColor, fontSize: fontSize }}
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}







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






const Goals = () => {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const goalId = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { goals, addGoal, reloadGoals } = useContext(GoalsContext);
  const [loading, setLoading] = useState(true);
  const [selectedAiCategory, setSelectedAiCategory] = useState("pending");
  const [selectedCategory, setSelectedCategory] = useState("pending");
  const goalsContainerRef = useRef(null);
  const aiGoalsContainerRef = useRef(null);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [period, setPeriod] = useState('');
  const [open, setOpen] = useState(false);
  const [openCreateGoal, setOpenCreateGoal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("weekly");
  const { profile, setProfile } = useContext(ProfileContext);
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
  const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));
  const [goalTypeFilter, setGoalTypeFilter] = useState("all"); // New filter (all, ai, user)
  const [formData, setFormData] = useState({
   
     title: "",
     category: "",
   
   });
  const getFilterLabel = (filter) => {
        switch (filter) {
            case 'all': return 'All Goals';
            case 'user': return 'My Goals';
            case 'ai': return 'AI Goals';
            default: return 'All Goals';
        }
    };


useEffect(() => {
    // Check if the goals object and its internal arrays are present to stop loading
    if (goals && goals.goals && goals.ai_goals) {
      setLoading(false);
    }
  }, [goals]);

  // --- UNIFIED GOAL LIST LOGIC (Memoized for performance) ---
  const allGoals = useMemo(() => {
    if (!goals || !goals.goals || !goals.ai_goals) return [];
    
    // Mark User Goals
    const userGoals = goals.goals.map(goal => ({ 
      ...goal, 
      isAiGoal: false, 
      type: 'user',
      linkPath: `/dashboard/goal/${goal.id}` // Pre-define link path
    }));
    
    // Mark AI Goals
    const generatedAiGoals = goals.ai_goals.map(goal => ({ 
      ...goal, 
      isAiGoal: true, 
      type: 'ai',
      linkPath: `/dashboard/ai-goal/${goal.id}` // Pre-define link path
    }));
    
    // Combine both lists
    return [...userGoals, ...generatedAiGoals];
  }, [goals]);


  // --- Unified Filtering Function ---
  const filterGoals = () => {
    let filtered = allGoals;

    // 1. Filter by Goal Status (Pending, In Progress, Completed)
    filtered = filtered.filter(goal => {
      switch (selectedCategory) {
        case 'inProgress':
          return goal.progress > 0 && goal.progress < 100;
        case 'pending':
          return goal.progress === 0;
        case 'completed':
          return goal.progress === 100;
        default:
          return true; 
      }
    });

    // 2. Filter by Goal Type (All, AI, User)
    switch (goalTypeFilter) {
      case 'ai':
        filtered = filtered.filter(goal => goal.isAiGoal);
        break;
      case 'user':
        filtered = filtered.filter(goal => !goal.isAiGoal);
        break;
      case 'all':
      default:
        break;
    }

    return filtered;
  };

  const finalFilteredGoals = filterGoals();




    // Helper to get the AI icon for the button
  const getFilterIcon = (filter) => {
      if (filter === 'ai') {
          return <AutoFixHighIcon style={{ fontSize: '1rem', marginRight: '4px' }} />;
      }
      return null;
  };

  // Function to cycle the filter state: All -> AI -> User -> All
  const cycleGoalTypeFilter = () => {
      setGoalTypeFilter(prevFilter => {
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

 useEffect(() => {
    // Reload goals when location changes (e.g., navigating back to the goal list)
    reloadGoals();
  }, [location.pathname, reloadGoals])


  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseCreateGoal = () => {
    setOpenCreateGoal(false);
  };




  const filterPeriods = (category) => {
    switch (category) {
      case 'yearly':
        return [...goals.ai_goals, ...goals.goals].filter(goal => goal.category === 'yearly');
      case 'monthly':
        return [...goals.ai_goals, ...goals.goals].filter(goal => goal.category === 'monthly');
      case 'weekly':
        return [...goals.ai_goals, ...goals.goals].filter(goal => goal.category === 'weekly');
     
      default:
        return [];
    }
  };

  const openModal = () => {
    setOpen(true);
  };

  const openCreateGoalModal = () => {
    setOpenCreateGoal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleAddGoal = async () => {
    if (!formData.title || !formData.category) {
  alert("Please enter both title and category!");
  return;
}

  
    try {
      const newGoal = await createGoal(formData.title, formData.category);
 // Ensure this returns the goal object with an ID
      addGoal(newGoal); // Add the new goal to the context
      setOpen(false);
      navigate(`/dashboard/goal/${newGoal.id}`); // Use newGoal.id instead of undefined goal.id
    } catch (error) {
      console.error("Error creating goal:", error);
    }


  };
  

 const scrollGoals = (direction) => {
    if (goalsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      goalsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  if (loading) {
    return (
      <div className='w-full sm:w-full xs:w-full lg:w-full xl:w-full 2xl:w-full justify-center items-center  flex min-h-screen'>
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



  const filteredPeriods = filterPeriods(selectedPeriod);


  return (
 <>
    {loading ? (
      <div className="text-center py-4 text-gray-500">Loading goals...</div>
    ) : goals?.goals?.length === 0 && goals?.ai_goals?.length === 0 ? (
      <>
      <div className="flex flex-col p-4 md:p-4 xl:p-4 min-h-screen h-full">
      <Backdrop
  sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
  open={openCreateGoal}
  onClick={handleCloseCreateGoal}
>
  <div
    className="md:w-4/12 w-11/12 rounded-lg shadow-lg"
    style={{
      backgroundColor: colors.menu.content,
      textAlign: "center",
      borderRadius: "12px",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header */}
    <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"

  sx={{
    backgroundColor: colors.menu.header,
    paddingX: "16px",
    paddingTop: "8px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  }}
>
  <h1
    className="text-base font-semibold flex items-center gap-2"
    style={{ color: colors.text.secondary }}
  >
    New Goal
  </h1>

  <IconButton>
     <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.text.secondary}
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="cursor-pointer"
    onClick={handleCloseCreateGoal}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>

  </IconButton>

 
</Box>

<div className='p-4 mt-6'>


   {/* Goal Title */}
    <TextField
      fullWidth
      label="Title"
      placeholder="Enter goal title"
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      sx={{
        mb: 3,
        "& .MuiInputBase-root": {
          borderRadius: "4px",
          color: colors.text.primary,
        },
        "& .MuiInputLabel-root": {
          color: colors.text.secondary,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#cbd5e1",
        },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#4F378A",
        },
      }}
    />

    {/* Category */}
   <FormControl fullWidth sx={{ mb: 3 }}>
  <InputLabel sx={{ color: colors.text.secondary }}>Category</InputLabel>
  <Select
    value={category}
    label="Category"
    onChange={(e) => {
      setCategory(e.target.value);
      console.log("Selected category:", e.target.value);
    }}
    sx={{
      borderRadius: "4px",
      color: colors.text.primary,
      backgroundColor: colors.menu.main, // closed input background
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e5e7eb",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#cbd5e1",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#4F378A",
      },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          backgroundColor: colors.menu.main, // dropdown menu background
        },
      },
    }}
  >
    <MenuItem value="weekly">Weekly</MenuItem>
    <MenuItem value="monthly">Monthly</MenuItem>
    <MenuItem value="yearly">Yearly</MenuItem>
  </Select>
</FormControl>


    {/* Submit Button */}
    <Box display="flex" justifyContent="center" mt={2} mb={1}>
      <FormButton onClick={handleAddGoal} text="Add Goal" className="w-full  " />
    </Box>



</div>


   
  </div>
</Backdrop>

        <div className='w-full flex justify-between items-center'>

         <Typography 
                                       variant="h2" 
                                       color={colors.text.primary} 
                                       fontWeight="bold" 
                                       
                                       >Goals</Typography>

<div className=''>
          <CustomButton onClick={openCreateGoalModal} text=' Create Goal' >
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
             
            </CustomButton>

        </div>


        </div>

         

         <div className="flex flex-col items-center justify-center  h-full">
        
      
        <Empty />
  
      </div>



      </div>



     

      </>
      
      
        


      
    
    ) : (
      <>
     <div className='w-full sm:w-full xs:w-full lg:w-full xl:w-full 2xl:w-full p-4 grid gap-1 grid-cols-12  sm:grid-cols-12 justify-center  flex min-h-screen'>
       

         <ReusableFormModal
          open={open}
          onClose={() => setOpen(false)}
          title="New Goal"
          colors={colors}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleAddGoal}
          fields={[
            { name: "title", label: "Title" },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: [
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
                { value: "yearly", label: "Yearly" },
              ],
            },
          ]}
        />

        

      <div className="md:flex flex-col md:col-span-7 col-span-12  md:p-0 p-0">
       
        <Box className='w-full relative  container md:h-46 xl:h-50 2xl:h-64  h-42 flex items-center justify-between rounded-4xl md:p-8 xl:p-8 p-6 pl-4 md:mt-4 mt-0'
        sx={{backgroundColor: "#4F378A"}}
        >
          <div className='space-y-4 relative h-full flex flex-col justify-center items-start'>
            <h1 className='text-2xl font-semibold'>
            <p
               
              className="font-semibold md:text-xl xl:text-xl  2xl:text-3xl text-base"
              style={{ color: "#ffffff"}}
              
            >Manage your Goals 
            </p>
            </h1>
           {/* {         <p
            className="hidden md:block font-regular md:text-xs xl:text-sm 2xl:text-lg 2xl:mb-12 xl:mb-6 mb-6 text-lg"
            style={{ color: colors.text.secondary }}
          >
            Track your progress, and achieve more with AI assistance.
          </p>} */}
            <Button onClick={openModal} sx={{backgroundColor: "#A89FE3", borderRadius: 100, color: "#FFFFFF", textTransform: "none", paddingY: 0.5, paddingX: 2, gap: 0.2}}>
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
             Create Goal
            </Button>
          </div>


          <img src={Circles} alt='Circles'  className='md:h-46  h-32 xl:h-48 2xl:h-60 ' />

        











         
        </Box>

        <div className='w-full mt-6'>
      {/* --- Unified Header and Filters --- */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center mt-4">


      
         {/* Goal Status Filter (Pending/In Progress/Completed) */}
        <SlidingButton
          options={["pending", "inProgress", "completed"]}
          selected={selectedCategory}
          onChange={setSelectedCategory}
          className="mb-4 "
        />
  

        {/* Goal Type Filter (AI / My Goals / All) */}
       <div className='flex-shrink-0 ml-4 w-full md:mt-0 mt-2 md:w-auto flex justify-end'>
            <Button
                // Removed Menu specific props (aria-controls, aria-haspopup, aria-expanded)
                onClick={cycleGoalTypeFilter} // Cycles through All -> AI -> User -> All
                // Style the button to look like simple text/label with an arrow
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
                    minWidth: '120px' // Ensure width consistency when content changes
                }}
                startIcon={getFilterIcon(goalTypeFilter)} // Shows AI icon if goalTypeFilter is 'ai'
                endIcon={<KeyboardArrowDownIcon />} // Always shows the down arrow
            >
                {getFilterLabel(goalTypeFilter)}
            </Button>
            
        </div>
      </div>

    

      {/* --- Unified Goal List Display --- */}
      <div className='relative mt-4'>
        {allGoals.length === 0 ? (
          <div className='w-full flex justify-center items-center h-[12vh]'>
            <div className='w-24'><Empty /></div>
            <Typography variant="body1" className="ml-4">Start by adding your first goal!</Typography>
          </div>
        ) : finalFilteredGoals.length === 0 ? (
          <div className='w-full h-[12vh]  flex justify-center items-center'>
            <div className='w-1/6  flex justify-center items-center'>
                     <Empty />
              </div>
    
          </div>
        ) : (
          <>
            {/* Left Scroll Button (Hidden on XS/SM screens where swiping is preferred, but kept for desktop UX) */}
         {/* {   <button
              onClick={() => scrollGoals('left')}
              className='absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 hidden md:flex'
              style={{ backgroundColor: colors.tag.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>} */}

            {/* Scrollable Goals Container */}
            <div 
              ref={goalsContainerRef} 
              // Adjust padding/margin for scroll buttons on desktop, or full width on mobile
              className='flex gap-4 overflow-x-auto no-scrollbar w-full md:w-full md:mx-auto'
            >
              {finalFilteredGoals.map((goal) => (
                // Use the pre-calculated linkPath
                <Link key={goal.id} to={goal.linkPath} className='w-full min-w-[280px] list-none block'>
                  <li className='w-full h-full list-none'>
                    <Box className='flex w-full px-2 py-4 h-full rounded-2xl transition-transform duration-300 hover:scale-[0.95] relative'
                         sx={{ backgroundColor: colors.background.paper }}>

                      {/* AI Icon for distinction */}
                      {goal.isAiGoal && (
                        <AutoFixHighIcon
                          className='absolute top-2 right-2'
                          style={{ color: colors.primary[500], fontSize: '1.2rem' }}
                        />
                      )}

                      <div className='w-1/4 full overflow-hidden flex justify-center items-center'>
                        <CircularProgressWithLabel
                          value={goal.progress}
                          progressColor={colors.primary[500]}
                          textColor={colors.text.primary}
                          size={50}
                          fontSize={
                            isXs ? '0.8rem' : '1rem' 
                          }
                        />
                      </div>
                      <div className='w-3/4 flex flex-col gap-2 pl-2'>
                        <div className='flex w-11/12 justify-between'>
                          <span className='w-full h-auto font-regular text-sm lg:text-sm 2xl:text-lg'>
                            {goal.title}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <SellIcon className='text-[#65558F] text-xs' /> 
                          <span className='text-xs font-normal' style={{ color: colors.primary[500] }}>
                            {goal.tag ? goal.tag : 'No Tag'}
                          </span>
                        </div>
                      </div>
                    </Box>
                  </li>
                </Link>
              ))}
            </div>

            {/* Right Scroll Button (Hidden on XS/SM screens where swiping is preferred, but kept for desktop UX) */}
           {/* { <button
              onClick={() => scrollGoals('right')}
              className='absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 p-2 rounded-full flex items-center justify-center z-10 hidden md:flex'
              style={{ backgroundColor: colors.tag.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>} */}
          </>
        )}
      </div>
    </div>





      

      
    </div>
    <Box className='  block col-span-12 md:col-span-5   space-y-4 md:ml-4 rounded-4xl md:rounded-2xl justify-center  md:mt-4 mt-8 p-4' sx={{backgroundColor:colors.background.paper}}>
        
        <div className=''>
        <div className='w-full flex justify-center mb-4'>
            {/* Buttons for medium and larger screens */}

          <SlidingButton
  options={["weekly", "monthly", "yearly"]}
  selected={selectedPeriod}
  onChange={setSelectedPeriod}
/>


        



      
       </div>
       <div className="w-full flex justify-center items-center  rounded-2xl py-4" style={{ backgroundColor: colors.background.default }}>
  <ul className="w-11/12 flex flex-col overflow-hidden max-h-[35vh] overflow-y-auto scrollbar-hide no-scrollbar">
    {filteredPeriods.length === 0 ? (
      <div className='w-full flex md:h-[14vh] h-[10vh] justify-center items-center'>
        <div className='w-20'>
             <Empty/>

        </div>
     
      </div>
    ) : (
          filteredPeriods.map((goal, index) => (
            <>
            <Link to={`/dashboard/ai-goal/${goal.id}`} className='w-full'>
             <li key={goal.id} className='p-4 gap-2 flex   rounded-2xl  transition-transform duration-300 hover:scale-[0.95] ' style={{ backgroundColor: colors.background.paper }}>
             
             <div className=' flex justify-center items-center  '>
                <CircularProgressWithLabel  value={goal.progress}
                                progressColor={colors.primary[500]}
                                textColor={colors.text.primary}
                                size={50}
                                fontSize={
                                  isXs ? '0.8rem' : isSm ? '0.6rem' : isMd ? '0.7rem' : isLg ? '0.8rem' : isXl ? '0.9rem' : '1rem'
                                } 
                                />
             </div>
                                
              <div className='flex items-center px-2 w-full gap-4'>
                <div className='flex-1 '>
                <h2 className='font-regular text-sm lg:text-sm   2xl:text-lg  mb-2' style={{ color: colors.text.primary }}>{goal.title}</h2>
                 <div className='flex items-center gap-2'>
                  <SellIcon className='text-[#65558F] text-xs' />
                  <span className='text-xs  lg:text-xs   2xl:text-xs  font-normal' style={{ color: colors.primary[500] }}>
                  {goal.tag ? goal.tag : 'No Tag'}
                  </span>

                </div>
                 {/* { <p className='text-sm text-gray-600'>{goal.description}</p>} */}
                </div>
                     
              </div>
            </li>

            </Link>
           
            
              {index < filteredPeriods.length - 1 && (
                <div className='py-4'>
                  <Divider orientation="horizontal" sx={{ borderColor: "#00000", opacity: 0.8 }} />
                </div>
              )}

           
         
          </>
          )))}

     
         
        </ul>

       </div>
       
        </div>
       
       <div>
       <h1 className=' text-lg text-center font-medium mb-1'>STATS </h1>
        <div className='w-full   flex p-4 rounded-2xl flex-col justify-center items-center' style={{ backgroundColor: colors.background.default }}>
        
        <GoalsPieChart goals={goals.goals} aiGoals={goals.ai_goals} />
       </div>
       </div>


      
       
    
      </Box>
    
    </div>
    

   
 </>
    )}
  </>

  )}

export default Goals;