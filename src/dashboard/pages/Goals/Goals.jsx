import React, { useContext, useState, useEffect, useRef } from 'react';
import { GoalsContext } from '../../../context/GoalsContext';
import { Link, useNavigate, useLocation , useParams} from "react-router-dom";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import analysis from '../../../assets/analyze-data.svg';
import aiGoals from '../../../assets/goals.svg';
import { createGoal } from '../../../utils/Api';
import CircularProgress from '@mui/material/CircularProgress';
import background from '../../../assets/goal.svg';

import { Divider } from '@mui/material';
import GoalsPieChart from './GoalsPieChart'; // Import the PieChart component
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { IoSearch } from "react-icons/io5";
import Backdrop from '@mui/material/Backdrop';
import { ProfileContext } from '../../../context/ProfileContext';



function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} size={36} sx={{color: "#6246AC"}} />
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
          fontSize: '1rem',
        }}
      ><Typography
      variant="caption"
      component="div"
      sx={{ color: 'text.secondary', fontSize: '0.6rem' }}
    >{`${Math.round(props.value)}%`}</Typography>
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
  const { goals, addGoal } = useContext(GoalsContext);
  const [loading, setLoading] = useState(true);
  const [selectedAiCategory, setSelectedAiCategory] = useState('recentlyAdded');
  const [selectedCategory, setSelectedCategory] = useState('recentlyAdded');
  const goalsContainerRef = useRef(null);
  const aiGoalsContainerRef = useRef(null);
  const [selectedPeriod, setSelectedPeriod] = useState('yearly');
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { profile, setProfile } = useContext(ProfileContext);
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
  const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));
  

  useEffect(() => {
    if (goals.goals && goals.ai_goals) {
      setLoading(false);
    }
  }, [goals]);


  const handleClose = () => {
    setOpen(false);
  };

  const filterAiGoals = (category) => {
    switch (category) {
      case 'recentlyAdded':
        return [...goals.ai_goals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'inProgress':
        return [...goals.ai_goals].filter(goal => goal.progress > 0 && goal.progress < 100);
      case 'pending':
        return [...goals.ai_goals].filter(goal => goal.progress === 0);
      case 'completed':
        return [...goals.ai_goals].filter(goal => goal.progress === 100);
      default:
        return [];
    }
  };

  const filterGoals = (category) => {
    switch (category) {
      case 'recentlyAdded':
        return [...goals.goals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'inProgress':
        return [...goals.goals].filter(goal => goal.progress > 0 && goal.progress < 100);
      case 'pending':
        return [...goals.goals].filter(goal => goal.progress === 0);
      case 'completed':
        return [...goals.goals].filter(goal => goal.progress === 100);
      default:
        return [];
    }
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

  const handleAddGoal = async () => {
    if (!title || !category) {
      alert("Please enter both title and category!");
      return;
    }
  
    try {
      const newGoal = await createGoal(title, category); // Ensure this returns the goal object with an ID
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
  const scrollAiGoals = (direction) => {
    if (aiGoalsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      aiGoalsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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

  const filteredGoals = filterGoals(selectedCategory);
  const filteredAiGoals = filterAiGoals(selectedAiCategory);
  const filteredPeriods = filterPeriods(selectedPeriod);


  return (
    <div className='w-full sm:w-full xs:w-full lg:w-full xl:w-full 2xl:w-full p-4  grid gap-1 grid-cols-12  sm:grid-cols-12 justify-center  flex min-h-screen'>
       <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={open}
          onClick={handleClose} // Clicking outside should close it
        >
          <div 
            className="bg-white w-4/12 p-6 rounded-lg shadow-lg text-center" 
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
            <div className='flex w-full mb-4 justify-end'>
            <div className='flex w-2/3 items-center justify-between'>
            <h1 className='text-xl font-bold text-[#6F2DA8] mt-4 flex items-center justify-center gap-2'>
              New Goal
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
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
            
           

            <div className="flex items-center mb-4 gap-4">
              <p className='text-sm text-start w-20 text-[#000000]'>Title</p>
              <input
                type="text"
                placeholder="Enter goal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border text-black border-gray-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex items-center mb-4 gap-4">
              <p className='text-sm w-20 text-[#000000]'>Category</p>
              <input
                type="text"
                placeholder="Weekly, Monthly, Yearly"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-black focus:outline-none"
              />
            </div>

            <button onClick={handleAddGoal} className="mt-4 px-4 py-2 bg-[#6200EE] text-white rounded-lg cursor-pointer">
              Add Goal
            </button>
          
          </div>
        </Backdrop>

      <div className="md:flex flex-col md:col-span-7 col-span-12  md:p-0 p-0">
       
        <Box className='w-full  container md:h-40 h-40 flex items-center justify-between rounded-2xl bg-[#F4F1FF] md:p-8 pl-4 md:mt-4 mt-0'
        sx={{backgroundColor:colors.background.paper}}
        >
          <div className='space-y-4'>
            <h1 className='text-2xl font-semibold'>
            <p
               
              className="font-semibold md:text-xl text-base"
              style={{ color: colors.text.primary }}
              
            >Manage your Goals 
            </p>
            </h1>
            <Button onClick={openModal}  className=' flex items-center text-sm font-light text-white px-4 gap-2 py-2 cursor-pointer rounded-lg' sx={{backgroundColor:colors.primary[500], borderRadius: '6px', paddingX: '12px'}}>
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
                component="span"
                className='md:text-base text-xs '
                style={{ color: colors.primary[100] }}
               
              >
              Create Goal
              </p>
            </Button>
          </div>
          <img src={analysis} alt='Analysis' className='md:h-36 h-28' />
        </Box>

        <div>
          <h1 className='text-lg font-medium mt-8'>
          <Typography
              component="span"
              variant="h3"
              className=" text-semibold"
              color='text.primary'
            >AI Goals </Typography></h1>
            
         {/* Buttons for medium and larger screens */}
<div className="hidden md:flex space-x-4 mt-4">
  {["recentlyAdded", "inProgress", "pending", "completed"].map((category) => (
    <button
      key={category}
      onClick={() => setSelectedAiCategory(category)}
      className={`px-4 py-2 font-light cursor-pointer rounded-md ${
        selectedAiCategory === category
          ? "bg-[#6246AC] text-white"
          : "bg-gray-200"
      }`}
    >
      {category === "recentlyAdded"
        ? "Recently Added"
        : category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  ))}
</div>

{/* Dropdown for small screens */}
<div className="md:hidden mt-4">
  <select
    value={selectedAiCategory}
    onChange={(e) => setSelectedAiCategory(e.target.value)}
    className="w-7/12 px-4 py-2 rounded-lg bg-gray-200 text-black  focus:outline-none"
  >
    <option value="recentlyAdded">Recently Added</option>
    <option value="inProgress">In Progress</option>
    <option value="pending">Pending</option>
    <option value="completed">Completed</option>
  </select>
</div>

        </div>

        <div className='relative mt-4'>
        <button 
          onClick={() => scrollAiGoals('left')} 
          className='absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center'
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
          <div ref={aiGoalsContainerRef} className='flex gap-2 overflow-x-auto no-scrollbar  w-full'>
            {filteredAiGoals.map((goal) => (
              <Link key={goal.id} to={`/dashboard/ai-goal/${goal.id}`}>
              <li  className='bg-[#F4F1FF] w-1/3 min-w-[300px] min-h-[100px] list-none  '  >
                <Box className='flex w-full items-center gap-2 px-2 py-1 rounded-xl' sx={{backgroundColor:colors.background.paper}}>
                  <div className='w-1/4 '>
                   <img src={background } alt="goals"  className='h-auto'/>
                  </div>
                  <div className='w-2/3 h-24  flex flex-col gap-2'>
                  <div className='flex items-start h-10  mb-4 justify-between'>
                    <span className='w-full h-auto font-medium'>
                    {goal.title}
                    </span>
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
                    </div>
                    <span className='flex  flex-col w-full  text-xs text-[#1D1B20] '> 
                   Progress
                   <span className='text-[#49454F] flex gap-4 items-center w-full font-normal text-xs xl:text-xs 2xl:text-base'>
                   <BorderLinearProgress variant="determinate" value={goal.progress} className="w-full" />
                   
                  {goal.progress}%  
                </span>
                   </span>
                  </div>
                </Box>
              </li>
              </Link>
            ))}
          </div>
          <button onClick={() => scrollAiGoals('right')} className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 w-10 h-10 p-2 rounded-full cursor-pointer'>
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
        </div>


        <div>
          <h1 className='text-lg font-medium mt-8'>
            <Typography
              component="span"
              variant="h3"
              className=" text-semibold"
              color='text.primary'
            >
            Goals

            </Typography>
            </h1>
            <div className="hidden md:flex space-x-4 mt-4">
  {["recentlyAdded", "inProgress", "pending", "completed"].map((category) => (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      className={`px-4 py-2 font-light cursor-pointer rounded-md ${
        selectedCategory === category
          ? "bg-[#6246AC] text-white"
          : "bg-gray-200"
      }`}
    >
      {category === "recentlyAdded"
        ? "Recently Added"
        : category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  ))}
</div>

{/* Dropdown for small screens */}
<div className="md:hidden mt-4">
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="w-7/12 px-4 py-2 rounded-lg bg-gray-200 text-black  focus:outline-none"
  >
    <option value="recentlyAdded">Recently Added</option>
    <option value="inProgress">In Progress</option>
    <option value="pending">Pending</option>
    <option value="completed">Completed</option>
  </select>
</div>

        </div>


        <div className='relative mt-4'>
        <button 
          onClick={() => scrollGoals('left')} 
          className='absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center'
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
          <div ref={goalsContainerRef} className='flex gap-2 overflow-x-auto no-scrollbar  w-full'>
            {filteredGoals.map((goal) => (
              <Link key={goal.id} to={`/dashboard/goal/${goal.id}`}>
              <li className='bg-[#F4F1FF] w-1/3 min-w-[300px] min-h-[100px] list-none  rounded-lg'>
              <Box className='flex w-full items-center gap-2 p-2 rounded-xl' sx={{backgroundColor:colors.background.paper}}>
                  <div className='w-1/4 '>
                   <img src={background } alt="goals"  className='h-auto'/>
                  </div>
                  <div className='w-2/3 h-24  flex flex-col '>
                    <div className='flex h-10 mb-4 items-center  justify-between'>
                    <span className='w-full h-auto font-medium'>
                    {goal.title}
                    </span>
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
                    </div>
                   
                   <span className='flex  flex-col w-full gap-2 text-xs text-[#1D1B20] '> 
                   Progress
                   <span className='text-[#49454F] flex gap-4 items-center w-full font-normal text-xs xl:text-xs 2xl:text-base'>
                   <BorderLinearProgress variant="determinate" value={goal.progress} className="w-full" />
                   
                  {goal.progress}%  
                </span>
                   

                    
                   </span>
                  </div>
                </Box>
              </li>
              </Link>
            ))}
          </div>
          <button onClick={() => scrollGoals('right')} className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 w-10 h-10 p-2 rounded-full cursor-pointer'>
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
        </div>





      </div>


      








      <Box className=' block col-span-12 md:col-span-5 c  space-y-4 md:ml-4 rounded-2xl justify-center  md:mt-4 mt-8 p-4' sx={{backgroundColor:colors.background.paper}}>
        
        <div className=''>
        <div className='w-full flex justify-center mb-3'>
        <div className="flex w-1/2 rounded-full justify-center" style={{ backgroundColor: theme.palette.background.default }}>
      <button
        onClick={() => setSelectedPeriod("yearly")}
        className={`px-4 font-light cursor-pointer py-1 rounded-full ${
          selectedPeriod === "yearly" ? "text-white" : ""
        }`}
        style={{
          backgroundColor: selectedPeriod === "yearly" ? theme.palette.primary.main : theme.palette.background.default,
        }}
      >
        Yearly
      </button>
      <button
        onClick={() => setSelectedPeriod("monthly")}
        className={`px-4 font-light cursor-pointer py-1 rounded-full ${
          selectedPeriod === "monthly" ? "text-white" : ""
        }`}
        style={{
          backgroundColor: selectedPeriod === "monthly" ? theme.palette.primary.main : theme.palette.background.default,
        }}
      >
        Monthly
      </button>
      <button
        onClick={() => setSelectedPeriod("weekly")}
        className={`px-4 font-light cursor-pointer py-1 rounded-full ${
          selectedPeriod === "weekly" ? "text-white" : ""
        }`}
        style={{
          backgroundColor: selectedPeriod === "weekly" ? theme.palette.primary.main : theme.palette.background.default,
        }}
      >
        Weekly
      </button>
    </div>
       </div>
       <div className='w-full flex justify-center items-center bg-white rounded-xl  p-3'>
         <ul className='w-11/12 flex flex-col overflow-hidden max-h-[35vh] overflow-y-auto scrollbar-hide no-scrollbar '>
          {filteredPeriods.map((goal, index) => (
            <>
            <Link to={`/dashboard/ai-goal/${goal.id}`} className='w-full'>
             <li key={goal.id} className='p-4 gap-2 flex   rounded-xl  ' style={{ backgroundColor: colors.background.paper }}>
              <div className='w-[3px] bg-[#4F378A] h-auto rounded-full flex items-center justify-center'>

              </div>
              <div className='flex p-2 items-center w-full gap-4'>
                <div className='flex-1'>
                <h2 className='font-regular text-[#2C2C2C] text-sm'>{goal.title}</h2>
                 {/* { <p className='text-sm text-gray-600'>{goal.description}</p>} */}
                </div>
                <CircularProgressWithLabel value={goal.progress} />
              </div>
            </li>

            </Link>
           
            
              {index < filteredPeriods.length - 1 && (
                <div className='py-4'>
                  <Divider orientation="horizontal" sx={{ borderColor: "#00000", opacity: 0.8 }} />
                </div>
              )}

           
         
          </>

        ))}
         
        </ul>

       </div>
       
        </div>
       
       <div>
       <h1 className=' text-lg text-center font-medium mb-1'>STATS </h1>
        <div className='w-full  bg-white flex p-4 rounded-lg flex-col justify-center items-center'>
        
        <GoalsPieChart goals={goals.goals} aiGoals={goals.ai_goals} />
       </div>
       </div>


      
       
    
      </Box>

     

      
    </div>
  );
};

export default Goals;