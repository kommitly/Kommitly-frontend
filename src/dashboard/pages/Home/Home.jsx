import { IconButton } from '@mui/material';
import  { useState,  } from 'react';
import { LuSendHorizontal } from "react-icons/lu";
import GoalBreakdown from '../../components/GoalBreakdown/GoalBreakdown';
import {  generateInsights } from '../../../utils/Api';
import { motion } from 'framer-motion';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [goalData, setGoalData] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [goal, setGoal] = useState("");
  const [showGoalBreakdown, setShowGoalBreakdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      const response = await generateInsights(inputValue, ''); // Assuming description is optional
      console.log("API Response:", response); // Debugging
      setGoalData(response.ai_goal);
      setTaskData(response.ai_tasks);
      setGoal(inputValue);
      setInputValue('');
      setShowGoalBreakdown(true); // Show the GoalBreakdown component
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseGoalBreakdown = () => {
    setShowGoalBreakdown(false);
    setGoalData(null);
    setTaskData([]);
  };

  return (
    <div className='w-full min-h-screen'>
      <div className="w-full px-4 flex-1 overflow-y-auto scrollbar-hide xl:max-h-[83vh] md:max-h-[80vh] no-scrollbar">
        {loading && 
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
        }
        {showGoalBreakdown && goalData && taskData && (
          <GoalBreakdown
            goalData={goalData}
            taskData={taskData}
            onClose={handleCloseGoalBreakdown}
          />
        )}
      </div>

      <div className='flex w-full items-center justify-center flex-wrap gap-4 mt-8'>
        <div className='w-6/12 bg-[#F4F1FF] p-2 z-10 rounded-full fixed bottom-16'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center w-full gap-4 ml-2'>
              <IconButton>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1D1B20"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#65558F]"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </IconButton>

              <input
                type="text"
                placeholder='Add a new goal'
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleFormSubmit()}
                className='text-[#49454F] outline-none border-none w-full text-xs'
              />

            </div>
            <IconButton onClick={handleFormSubmit}>
              <LuSendHorizontal size={16} className='text-[#1D1B20] ' />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;