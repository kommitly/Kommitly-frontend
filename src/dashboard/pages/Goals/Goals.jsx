import React, { useContext, useState, useEffect, useRef } from 'react';
import { GoalsContext } from '../../../context/GoalsContext';
import { Link, useNavigate, useLocation , useParams} from "react-router-dom";
import Button from '../../components/Button';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
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
import Backdrop from '@mui/material/Backdrop';
import { ProfileContext } from '../../../context/ProfileContext';
import SellIcon from '@mui/icons-material/Sell';
import Empty from '../../components/Empty';

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


  useEffect(() => {
    if (goals.goals && goals.ai_goals) {
      setLoading(false);
    }
  }, [goals]);

  useEffect(() => {
    reloadGoals();

  }, [location.pathname])


  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseCreateGoal = () => {
    setOpenCreateGoal(false);
  };

  const filterAiGoals = (category) => {
    switch (category) {
      // {case 'recentlyAdded':
      //   return [...goals.ai_goals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));}
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
      // {case 'recentlyAdded':
      //   return [...goals.goals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));}
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

  const openCreateGoalModal = () => {
    setOpenCreateGoal(true);
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
 <>
    {loading ? (
      <div className="text-center py-4 text-gray-500">Loading goals...</div>
    ) : goals?.goals?.length === 0 && goals?.ai_goals?.length === 0 ? (
      <>
      <div className="flex flex-col p-4 md:p-4 xl:p-18 min-h-screen h-full">
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={openCreateGoal}// Use openCreateGoal state for backdrop
          onClick={handleCloseCreateGoal} // Clicking outside should close it
        >
          <div 
            className=" md:w-4/12 w-11/12 p-6 rounded-lg shadow-lg text-center" style={{ backgroundColor: colors.menu.primary }} 
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
            <div className='flex w-full mb-4 justify-end'>
            <div className='flex w-2/3 items-center justify-between'>
            <h1 className='text-xl font-bold  mt-4 flex items-center justify-center gap-2' style={{ color: colors.text.secondary }} >
              New Goal
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="cursor-pointer"
              onClick={handleCloseCreateGoal}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>  
            



            </div>

            </div>
            
           

            <div className="flex items-center mb-4 gap-4">
              <p className='text-sm text-start w-20 ' style={{color:colors.text.primary}}>Title</p>
              <input
                type="text"
                placeholder="Enter goal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border  border-gray-200 rounded-lg focus:outline-none" style={{color:colors.text.primary}}
              />
            </div>

          <div className="flex items-center mb-4 gap-4">
            <p className="text-sm w-20" style={{ color: colors.text.primary }}>Category</p>
            <select
              value={category}
              onChange={(e) => {
              setCategory(e.target.value);
              console.log("Selected category:", e.target.value);
            }}

              className="w-full p-2 border border-gray-200 rounded-lg text-black focus:outline-none"
            >
            
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>


            <button onClick={handleAddGoal} className="mt-4 px-4 py-2  text-white rounded-lg cursor-pointer"  style={{backgroundColor: colors.primary[400], '&:hover':{ opacity: 0.7} }}>
              Add Goal
            </button>
          
          </div>
        </Backdrop>

        <div className='w-full flex justify-between items-center'>

         <Typography 
                                       variant="h2" 
                                       color={colors.text.primary} 
                                       fontWeight="bold" 
                                       
                                       >Goals</Typography>

<div className=''>
          <Button onClick={openCreateGoalModal} text=' Create Goal' >
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
             
            </Button>

        </div>


        </div>

         

         <div className="flex flex-col items-center justify-center  h-full">
        
      
        <Empty />
  
      </div>



      </div>



     

      </>
      
      
        


      
    
    ) : (
      <>
     <div className='w-full sm:w-full xs:w-full lg:w-full xl:w-full 2xl:w-full p-2 grid gap-1 grid-cols-12  sm:grid-cols-12 justify-center  flex min-h-screen'>
       <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={open}
          onClick={handleClose} // Clicking outside should close it
        >
          <div 
            className=" md:w-4/12 w-11/12 p-6 rounded-lg shadow-lg text-center"  style={{backgroundColor: colors.menu.primary }}
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
            <div className='flex w-full mb-4 justify-end'>
            <div className='flex w-2/3 items-center justify-between'>
            <h1 className='text-xl font-semibold  mt-4 flex items-center justify-center gap-2' style={{ color: colors.text.secondary }}>
              New Goal
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.text.primary}
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
              <p className='text-sm text-start w-20 ' style={{color:colors.text.primary}}>Title</p>
              <input
                type="text"
                placeholder="Enter goal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border  border-gray-200 rounded-lg focus:outline-none" style={{color:colors.text.primary}}
              />
            </div>
<div className="flex items-center mb-4 gap-4">
  <p className="text-sm w-20" style={{ color: colors.text.primary }}>Category</p>
  <select
    value={category}
    onChange={(e) => {
    setCategory(e.target.value);
    console.log("Selected category:", e.target.value);
  }}

    className="w-full p-2 border border-gray-200 rounded-lg text-black focus:outline-none"
  >
    
    <option value="weekly">Weekly</option>
    <option value="monthly">Monthly</option>
    <option value="yearly">Yearly</option>
  </select>
</div>

<button
  onClick={handleAddGoal}
  className="mt-8 px-4 py-2 text-white rounded-lg cursor-pointer hover:opacity-70"
  style={{ backgroundColor: colors.primary[500] }}
>
  Add Goal
</button>

          
          </div>
        </Backdrop>

      <div className="md:flex flex-col md:col-span-7 col-span-12  md:p-0 p-0">
       
        <Box className='w-full  container md:h-46 xl:h-50 2xl:h-64  h-36 flex items-center justify-between rounded-2xl md:p-8 xl:p-8 p-6 pl-4 md:mt-4 mt-0'
        sx={{backgroundColor:colors.background.paper}}
        >
          <div className='space-y-4 h-full'>
            <h1 className='text-2xl font-semibold'>
            <p
               
              className="font-semibold md:text-xl xl:text-xl  2xl:text-3xl text-base"
              style={{ color: colors.text.primary }}
              
            >Manage your Goals 
            </p>
            </h1>
           {/* {         <p
            className="hidden md:block font-regular md:text-xs xl:text-sm 2xl:text-lg 2xl:mb-12 xl:mb-6 mb-6 text-lg"
            style={{ color: colors.text.secondary }}
          >
            Track your progress, and achieve more with AI assistance.
          </p>} */}
            <Button onClick={openModal} text='Create Goal'>
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
             
            </Button>
          </div>
          <img src={analysis} alt='Analysis' className='md:h-46  h-36 xl:h-52 2xl:h-60 ' />
        </Box>



        <div className='w-full    mt-8 justify-between items-center '>
          <h1 className='text-lg font-medium  mb-2 '>
          <Typography
              component="span"
              variant="h3"
              className=" text-semibold"
              color='text.primary'
            >AI Goals </Typography></h1>

                 <SlidingButton 
  options={[ "pending", "inProgress", "completed"]}
  selected={selectedAiCategory}
  onChange={setSelectedAiCategory}
/>
            


 


        </div>


        <div className='relative '>
             {goals?.aiGoals?.length === 0 ? (
              <div className=' w-full flex justify-center items-center'>

              <div className='w-24'>
              <Empty/>
              </div>
          </div>

  ) : (
    <>
         {/* Buttons for medium and larger screens */}



    <div className='relative mt-4'>
      {filteredAiGoals.length === 0 ? (
        <div className='w-full md:h-[16vh] h-[12vh] flex justify-center'>
          <div className='w-1/8'>

               <Empty  /> 

            </div>

        
          </div>
   
  ) : (
    <>
    <button 
          onClick={() => scrollAiGoals('left')} 
          className='absolute cursor-pointer left-0 top-8 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center'  style={{ backgroundColor: colors.tag.primary }}
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
          <div ref={aiGoalsContainerRef} className='flex  gap-2 overflow-x-auto no-scrollbar  w-10/12 md:ml-14 ml-10 '>
            {filteredAiGoals.map((goal) => (
              <Link key={goal.id} to={`/dashboard/ai-goal/${goal.id}`}>
              <li  className=' w-1/3 min-w-[280px] min-h-[100px] list-none  '  >
                <div className='flex w-full   px-2 py-4 h-full rounded-xl transition-transform duration-300 hover:scale-[0.95]' style={{backgroundColor:colors.background.paper}}>
                            <div className='w-1/4  full    overflow-hidden'>
                                  {/* { <img src={background } alt="goals"  className='h-full'/>} */}
                                                <CircularProgressWithLabel  value={goal.progress}
                                progressColor={colors.primary[500]}
                                textColor={colors.text.primary}
                                size={50}
                                fontSize={
                                  isXs ? '0.8rem' : isSm ? '0.6rem' : isMd ? '0.7rem' : isLg ? '0.8rem' : isXl ? '0.9rem' : '1rem'
                                } 
                                />


                            </div>
                                          <div className='w-3/4    flex flex-col gap-2'>
                                                    <div className='flex  w-full    justify-between'>
                                                      <span className='w-full h-auto font-regular text-sm lg:text-sm   2xl:text-lg '>
                                                      {goal.title}
                                                      </span>
                                                     
                                                    
                                                      </div>
                                                      <div className='flex items-center gap-2'>
                                                        <SellIcon className='text-[#65558F] text-xs' />
                                                        <span className='text-xs  lg:text-xs   2xl:text-xs   font-normal' style={{ color: colors.primary[500] }}>
                                                        {goal.tag ? goal.tag : 'No Tag'}
                                                        </span>

                                                      </div>
                                             
                                            </div>
                                                  </div>
                </li>
                                                </Link>
                                              ))}
                                            </div>
                                          <button onClick={() => scrollAiGoals('right')} className='absolute right-0 top-8  transform -translate-y-1/2  w-10 h-10 p-2 rounded-full cursor-pointer'  style={{ backgroundColor: colors.tag.primary }}>
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
    </>
  )}
    </div>
                               


          
    
    </>
       
        
        )}
        </div>
       



        <div className='w-full  justify-between items-center mt-4'>
          <h1 className='text-lg font-medium  mb-2 '>
            <Typography
              component="span"
              variant="h3"
              className=" text-semibold"
              color='text.primary'
            >
            Goals

            </Typography>
            </h1>
                         <SlidingButton
  options={["pending","inProgress",  "completed"]}
  selected={selectedCategory}
  onChange={setSelectedCategory}
/>

        </div>


        <div className='relative  mt-4'>
                {goals?.goals?.length === 0 ? (
    <div className=' w-full flex justify-center items-center'>

              <div className='w-24'>
              <Empty/>
              </div>
          </div>
  ) : (
    <>

   



  <div className='relative mt-4'>
      {filteredGoals.length === 0 ? (
        <div className='w-full md:h-[16vh] h-[12vh] flex justify-center'>
          <div className='w-1/8'>

               <Empty  /> 

            </div>

        
          </div>
   
  ) : (
    <>

     <button 
          onClick={() => scrollGoals('left')} 
          className='absolute cursor-pointer left-0 top-1/2  transform -translate-y-1/2  w-10 h-10 rounded-full flex items-center justify-center'
          style={{ backgroundColor: colors.tag.primary }}
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
          <div ref={goalsContainerRef} className='flex gap-2 overflow-x-auto no-scrollbar  w-10/12 ml-14'>
            {filteredGoals.map((goal) => (
              <Link key={goal.id} to={`/dashboard/goal/${goal.id}`}>
              <li className='w-1/3 min-w-[280px] min-h-[100px] list-none '>
              <Box className='flex w-full   px-2 py-4 h-full rounded-xl transition-transform duration-300 hover:scale-[0.95]' sx={{backgroundColor:colors.background.paper}}>
                   <div className='w-1/4  full    overflow-hidden'>
                                  {/* { <img src={background } alt="goals"  className='h-full'/>} */}
                                                   <CircularProgressWithLabel  value={goal.progress}
                                progressColor={colors.primary[500]}
                                textColor={colors.text.primary}
                                size={50}
                                fontSize={
                                  isXs ? '0.8rem' : isSm ? '0.6rem' : isMd ? '0.7rem' : isLg ? '0.8rem' : isXl ? '0.9rem' : '1rem'
                                } 
                                />


                            </div>
                  <div className='w-3/4 flex flex-col gap-2 '>
                   <div className='flex  w-full    justify-between'>
                                                      <span className='w-full h-auto font-regular text-sm lg:text-sm   2xl:text-lg '>
                                                      {goal.title}
                                                      </span>
                                                      
                                                    
                                                      </div>
                                                      <div className='flex items-center gap-2'>
                                                        <SellIcon className='text-[#65558F] text-xs' />
                                                        <span className='text-xs  lg:text-xs   2xl:text-xs   font-normal' style={{ color: colors.primary[500] }}>
                                                        {goal.tag ? goal.tag : 'No Tag'}
                                                        </span>

                                                      </div>
                   
                
                  </div>
                </Box>
              </li>
              </Link>
            ))}
          </div>
          <button onClick={() => scrollGoals('right')} className='absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 p-2 rounded-full cursor-pointer'  style={{ backgroundColor: colors.tag.primary }}>
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
        
  </>
  )}
    </div>
                               


          
    
    </>
       
        
        )}
        </div>
       



      

     

      
    </div>
    <Box className='  block col-span-12 md:col-span-5   space-y-4 md:ml-4 rounded-2xl justify-center  md:mt-4 mt-8 p-4' sx={{backgroundColor:colors.background.paper}}>
        
        <div className=''>
        <div className='w-full flex justify-center mb-3'>
            {/* Buttons for medium and larger screens */}

          <SlidingButton
  options={["weekly", "monthly", "yearly"]}
  selected={selectedPeriod}
  onChange={setSelectedPeriod}
/>


        



      
       </div>
       <div className="w-full flex justify-center items-center  rounded-xl py-4" style={{ backgroundColor: colors.background.default }}>
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
             <li key={goal.id} className='p-4 gap-2 flex   rounded-xl  transition-transform duration-300 hover:scale-[0.95] ' style={{ backgroundColor: colors.background.paper }}>
             
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
        <div className='w-full   flex p-4 rounded-lg flex-col justify-center items-center' style={{ backgroundColor: colors.background.default }}>
        
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