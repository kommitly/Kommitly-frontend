import { IconButton } from '@mui/material';
import React, { useState, useContext, useEffect } from 'react';
import { Divider } from '@mui/material';
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { createAiGoal } from '../../../utils/Api';
import { GoalsContext } from '../../../context/GoalsContext';
import { useNavigate } from 'react-router-dom';

const extractTimeline = (details) => {
  if (!details) return { timeline: 'No detail available', cleanedDetails: details };

  console.log('Details:', details); // Debugging

  // Updated regex to match time expressions with an optional "within" before them
  const match = details.match(/\b(within\s+)?(\d+-\d+ (days|weeks|months|years)|\d+ (day|week|month|year)|On-going|\d+\s*(days|weeks|months|years))\b/i);

  console.log('Match:', match); // Debugging

  const timeline = match ? match[2] : 'No timeline available'; // Extract actual time value, ignoring "within"
  
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
  const { timeline, cleanedDetails } = extractTimeline(task.details);
  return (
    <div className='w-11/12'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center justify-center'>
          <div className='flex items-center p-2 justify-center bg-[#EADDFF] text-[#65558F] rounded-[100px]'>
            <p className='flex items-center justify-center text-xs w-4 h-4 text-center'>{index + 1}</p>
          </div>
        </div>
        <div className='w-full gap-4'>
          <div className='font-normal text-sm text-[#1D1B20] px-2 py-1'>{task.subtask_title || task.title || "No title available"}</div>
          <div className='font-medium text-[#65558F] px-2 py-1'>
            <div className='font-medium w-9/12 text-sm'>
              {cleanedDetails ? (
                <span className='text-[#49454F] text-xs font-normal'>{cleanedDetails}</span>
              ) : (
                <span className='text-[#4F378A] text-xs'>{`Timeline: ${task.task_timeline || 'No timeline available'}`}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoalBreakdown = ({ goalData, taskData, onClose }) => {
  const [showSteps, setShowSteps] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { goals, setGoals } = useContext(GoalsContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (goalData && taskData) {
      setLoading(false);
    }
  }, [goalData, taskData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!goalData || !taskData || taskData.length === 0) {
    return <p>No tasks available.</p>;
  }

  const handleCreateGoal = async () => {
    setLoading(true);
    try {
      const response = await createAiGoal(goalData, taskData);
      console.log("Goal Creation API Response:", response); // Debugging
      setGoals((prevGoals) => [...prevGoals, response.ai_goal]);
      navigate(`/dashboard/goal/${response.ai_goal.id}`);
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayData = showSteps && selectedTask
    ? selectedTask.actionable_steps.map((step, i) => ({
        ...step,
        id: `step-${i}`, // Ensure each step has a unique ID
      }))
    : taskData;

  return (
    <div className="mt-6 w-full flex justify-center p-4 flex-1 overflow-y-auto scrollbar-hide">
      <div className='bg-[#ECE6F0] xl:w-6/12 md:w-8/12 rounded-4xl px-2 mt-8'>
        <div className='flex items-center px-4 py-4 justify-between '>
          <div className='flex items-center gap-4'>
            <IconButton onClick={handleCreateGoal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1D1B20"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#65558F]"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </IconButton>
            <div className='flex items-center gap-1'>
              <div className='bg-[#F7F2FA] font-semibold text-[#65558F] text-sm px-4 py-1 rounded-lg'>
                {goalData.title}
              </div>
            </div>
          </div>
          <IconButton onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1D1B20"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#65558F]"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </IconButton>
        </div>

        <Divider orientation="horizontal" sx={{ borderColor: "#79747E", opacity: 0.8 }} />

        <div className='flex flex-col  p-4 gap-4'>
          <p className='inline-block'>
            <span className='bg-[#F7F2FA] font-semibold text-[#65558F] text-sm px-2 py-1 rounded-lg'>
              {showSteps && selectedTask ? selectedTask.title : "Tasks"}
            </span>
          </p>

          <div className='flex flex-col gap-4 justify-center'>
            {displayData.map((task, index) => {
              const { timeline, cleanedDetails } = extractTimeline(task.details);

              return (
                <div key={task.id || `task-${index}`} className="">
                  <div className='flex w-11/12 items-center'>
                    <TaskComponent task={{ ...task, details: cleanedDetails }} index={index} />
                    {!showSteps && (
                      <button
                        className="custom-button w-6/12 inline-flex items-center cursor-pointer mt-2 relative overflow-hidden group"
                        onClick={() => {
                          setSelectedTask(task);
                          setShowSteps(true);
                        }}
                      >
                        <span className="btn-text text-xs text-[#4F378A] font-medium">
                          Actionable Steps
                          <span className="hover-line"></span>
                        </span>
                      </button>
                    )}
                    {showSteps && (
                      <div className='flex w-4/12 items-center '>
                        <p className=' font-medium text-xs text-[#4F378A]'>
                         <span>
                         Timeline: {timeline}
                         </span>
                        </p>
                      </div>
                    )}
                    <div className='flex ml-4 items-center gap-4'>
                      <MdCheckBoxOutlineBlank size={16} className='text-[#65558F]' />
                    </div>
                  </div>
                  {index < displayData.length - 1 && (
                      <div className='py-4'>
                        <Divider orientation="horizontal" sx={{ borderColor: "#CAC4D0", opacity: 0.8 }} />
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          {showSteps && (
            <button
              className="custom-button font-medium text-sm text-[#4F378A] inline-flex items-center cursor-pointer mt-4 relative overflow-hidden group"
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
                stroke="#4F378A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-arrow-left"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg> Back to Tasks
              </span>
                <span className="hover-line"></span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalBreakdown;