import { IconButton } from '@mui/material';
import React, { useState, useContext, useEffect } from 'react';
import { Divider } from '@mui/material';
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { createGoal } from '../../../utils/Api';
import { GoalsContext } from '../../../context/GoalsContext';

const extractTimeline = (details) => {
  if (!details) return { timeline: 'No detail available', cleanedDetails: details };

  console.log('Details:', details); // Debugging

  // Updated regex to match time ranges and single values even without parentheses
  const match = details.match(/\b(\d+-\d+ (days|weeks|months)|\d+ (day|week|month)|Ongoing)\b/);

  console.log('Match:', match); // Debugging

  const timeline = match ? match[1] : 'No timeline available';
  const cleanedDetails = match ? details.replace(match[0], '').trim() : details;

  return { timeline, cleanedDetails };
};



const TaskComponent = ({ task, index }) => {
  const { timeline, cleanedDetails } = extractTimeline(task.details);
  return (
    <div className='w-11/12'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center justify-center'>
          <div className='flex items-center p-3 justify-center bg-[#EADDFF] text-[#65558F] rounded-[100px]'>
            <p className='flex items-center justify-center text-md w-4 h-4 text-center'>{index + 1}</p>
          </div>
        </div>
        <div className='w-full gap-4'>
          <div className='font-normal text-lg text-[#1D1B20] px-2 py-1'>{task.subtask_title || task.title || "No title available"}</div>
          <div className='font-medium text-[#65558F] px-2 py-1'>
            <div className='font-medium w-9/12 text-sm'>
              {cleanedDetails ? (
                <span className='text-[#49454F]'>{cleanedDetails}</span>
              ) : (
                <span className='text-[#4F378A]'>{`Timeline: ${task.task_timeline || 'No timeline available'}`}</span>
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
      const response = await createGoal(goalData, taskData);
      console.log("Goal Creation API Response:", response); // Debugging
      setGoals((prevGoals) => [...prevGoals, response.ai_goal]);
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
      <div className='bg-[#ECE6F0] w-6/12 rounded-4xl p-2 mt-4'>
        <div className='flex items-center p-4 justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <IconButton onClick={handleCreateGoal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
              <div className='bg-[#F7F2FA] font-semibold text-[#65558F] px-4 py-1 rounded-lg'>
                {goalData.title}
              </div>
            </div>
          </div>
          <IconButton onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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

        <div className='flex flex-col mt-2 p-4 gap-4'>
          <p className='inline-block'>
            <span className='bg-[#F7F2FA] font-semibold text-[#65558F] px-2 py-1 rounded-lg'>
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
                        className="custom-button w-5/12 inline-flex items-center cursor-pointer mt-2 relative overflow-hidden group"
                        onClick={() => {
                          setSelectedTask(task);
                          setShowSteps(true);
                        }}
                      >
                        <span className="btn-text text-sm text-[#4F378A] font-medium">
                          Actionable Steps
                          <span className="hover-line"></span>
                        </span>
                      </button>
                    )}
                    {showSteps && (
                      <div className='flex w-4/12 items-center '>
                        <p className='text-sm font-medium text-[#4F378A]'>
                          Timeline: {timeline}
                        </p>
                      </div>
                    )}
                    <div className='flex ml-4 items-center gap-4'>
                      <MdCheckBoxOutlineBlank size={24} className='text-[#65558F]' />
                    </div>
                  </div>
                  <div className='py-4'>
                    <Divider orientation="horizontal" sx={{ borderColor: "#CAC4D0", opacity: 0.8 }} />
                  </div>
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
              <span className="btn-text">
                ⬅ Back to Tasks
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