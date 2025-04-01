import React, { useContext, useState, useEffect, useRef } from 'react';
import { GoalsContext } from '../../../context/GoalsContext';
import { Link, useNavigate, useLocation , useParams} from "react-router-dom";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { motion } from 'framer-motion';
import analysis from '../../../assets/analyze-data.svg';
import aiGoals from '../../../assets/goals.svg';
import { createGoal } from '../../../utils/Api';
import CircularProgress, {


} from '@mui/material/CircularProgress';

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

  const filteredGoals = filterGoals(selectedCategory);
  const filteredAiGoals = filterAiGoals(selectedAiCategory);
  const filteredPeriods = filterPeriods(selectedPeriod);


  return (
    <div className='w-full  grid gap-1 grid-cols-12  px-6  flex min-h-screen'>
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

      <div className="col-span-8  flex-1 overflow-y-auto scrollbar-hide  no-scrollbar">
       
        <Box className='w-full container h-40 flex items-center justify-between rounded-2xl bg-[#F4F1FF] p-8 mt-4'
        sx={{backgroundColor:colors.background.paper}}
        >
          <div className='space-y-4'>
            <h1 className='text-2xl font-semibold'>
            <Typography
              component="span"
              variant="h2"
              className=" text-semibold"
              color='text.primary'
            >Manage your Goals 
            </Typography>
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
                style={{ stroke: '#FFFFFF' }} // Inline style to ensure white stroke
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <Typography
                component="span"
                variant="h5"  
                sx={{color:colors.primary[100]}}
              >
              Add New Goal
              </Typography>
            </Button>
          </div>
          <img src={analysis} alt='Analysis' className='h-36' />
        </Box>

        <div>
          <h1 className='text-lg font-medium mt-8'>
          <Typography
              component="span"
              variant="h3"
              className=" text-semibold"
              color='text.primary'
            >AI Goals </Typography></h1>
          <div className='flex space-x-4 mt-4'>
            <button onClick={() => setSelectedAiCategory('recentlyAdded')} className={`px-4 font-light cursor-pointer py-2 rounded-md ${selectedAiCategory === 'recentlyAdded' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Recently Added</button>
            <button onClick={() => setSelectedAiCategory('inProgress')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedAiCategory === 'inProgress' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>In Progress</button>
            <button onClick={() => setSelectedAiCategory('pending')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedAiCategory === 'pending' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Pending</button>
            <button onClick={() => setSelectedAiCategory('completed')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedAiCategory === 'completed' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Completed</button>
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
                <Box className='flex w-full items-center gap-2 p-2 rounded-lg' sx={{backgroundColor:colors.background.paper}}>
                  <div className='w-1/3 bg-white rounded-lg p-4'>
                   <img src={aiGoals} alt="goals"  className='h-20'/>
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
          <div className='flex space-x-4 mt-4'>
            <button onClick={() => setSelectedCategory('recentlyAdded')} className={`px-4 font-light cursor-pointer py-2 rounded-md ${selectedCategory === 'recentlyAdded' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Recently Added</button>
            <button onClick={() => setSelectedCategory('inProgress')} className={`px-4 py-2  font-light cursor-pointer rounded-md ${selectedCategory === 'inProgress' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>In Progress</button>
            <button onClick={() => setSelectedCategory('pending')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedCategory === 'pending' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Pending</button>
            <button onClick={() => setSelectedCategory('completed')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedCategory === 'completed' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Completed</button>
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
              <Box className='flex w-full items-center gap-2 p-2 rounded-lg' sx={{backgroundColor:colors.background.paper}}>
                  <div className='w-1/3 bg-white rounded-lg p-4'>
                   <img src={aiGoals} alt="goals"  className='h-20'/>
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


      








      <Box className='col-span-4  space-y-4 ml-6 rounded-2xl justify-center  mt-4 p-4' sx={{backgroundColor:colors.background.paper}}>
        
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
        <ul className='bg-white p-4 rounded-lg max-h-[35vh] overflow-y-auto scrollbar-hide no-scrollbar'>
          {filteredPeriods.map((goal, index) => (
            <>
            <li key={goal.id} className='bg-white p-4 border-l border-l-2 border-l-[#4F378A] rounded-lg  ' style={{ boxShadow: '2px 3px 3px 2px rgba(101, 85, 143, 0.2)' }}>
              <div className='flex items-center gap-4'>
                <div className='flex-1'>
                <h2 className='font-regular text-[#2C2C2C] text-sm'>{goal.title}</h2>
                  <p className='text-sm text-gray-600'>{goal.description}</p>
                </div>
                <CircularProgressWithLabel value={goal.progress} />
              </div>
            </li>

            
              {index < filteredPeriods.length - 1 && (
                <div className='py-4'>
                  <Divider orientation="horizontal" sx={{ borderColor: "#00000", opacity: 0.8 }} />
                </div>
              )}

           
         
          </>

        ))}
         
        </ul>
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