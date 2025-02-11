import { IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { LuSendHorizontal } from "react-icons/lu";
import GoalBreakdown from '../../components/GoalBreakdown/GoalBreakdown';
import { createGoal, generateInsights } from '../../../utils/Api';

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
      <div className="w-full px-4 flex-1 overflow-y-auto scrollbar-hide max-h-[85vh] no-scrollbar">
        {loading && <p>Loading...</p>}
        {showGoalBreakdown && goalData && taskData && (
          <GoalBreakdown
            goalData={goalData}
            taskData={taskData}
            onClose={handleCloseGoalBreakdown}
          />
        )}
      </div>

      <div className='flex w-full items-center justify-center flex-wrap gap-4 mt-8'>
        <div className='w-6/12 bg-[#ECE6F0] p-2 z-10 rounded-full fixed bottom-16'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4 ml-2'>
              <IconButton>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
                className='text-[#49454F] outline-none border-none'
              />
            </div>
            <IconButton onClick={handleFormSubmit}>
              <LuSendHorizontal size={24} className='text-[#1D1B20] mr-2' />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;