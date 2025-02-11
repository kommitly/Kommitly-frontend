import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGoalById } from '../../../utils/Api'; // Adjust the import path as needed
import flag from '../../../assets/flag-dynamic-color.svg';
import line from '../../../assets/line.svg';
import line2 from '../../../assets/line2.svg';
import { GoDotFill } from "react-icons/go";
import { Divider } from '@mui/material';
import Confetti from './Confetti';

const extractTimeline = (details) => {
  if (!details) return { timeline: 'No detail available', cleanedDetails: details };

  console.log('Details:', details); // Debugging

  // Updated regex to match time ranges and single values even without parentheses
  const match = details.match(/\b(\d+-\d+ (days|weeks|months)|\d+ (day|week|month)|Ongoing)\b/);

  console.log('Match:', match); // Debugging

  const timeline = match ? match[1] : 'No timeline available';
  let cleanedDetails = match ? details.replace(match[0], '').trim() : details;

  // Remove empty parentheses
  cleanedDetails = cleanedDetails.replace(/\s*\(\s*\)\s*/g, '');

  return { timeline, cleanedDetails };
};





const Goal = () => {
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null); // Active task state
  const [taskCompletionStatus, setTaskCompletionStatus] = useState([]); // Track completion of each task
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    const loadGoal = async () => {
      try {
        const fetchedGoal = await fetchGoalById(goalId);
        setGoal(fetchedGoal);
        console.log("Fetched goal:", fetchedGoal); // Debugging
        setTaskCompletionStatus(new Array(fetchedGoal.ai_tasks.length).fill(false)); // Initialize task completion state
        setActiveTaskIndex(0); // Initialize active task index to 0
    
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadGoal();
  }, [goalId]);

  const handleStepCompletion = () => {
    const newCompletionStatus = [...taskCompletionStatus];
    newCompletionStatus[activeTaskIndex] = true;
    setTaskCompletionStatus(newCompletionStatus);
  
    // Show confetti when the current task is completed
    setIsVisible(true);
    console.log('Confetti visible:', true); // Debugging
    setTimeout(() => {
      setIsVisible(false);
      // Move to next task if it exists
      if (activeTaskIndex + 1 < goal.ai_tasks.length) {
        const nextTaskIndex = activeTaskIndex + 1;
        setActiveTaskIndex(nextTaskIndex);
  
        // Reset the completion status of the actionable steps for the new active task
        setGoal(prevGoal => {
          const newGoal = JSON.parse(JSON.stringify(prevGoal)); // Deep copy the goal object
          newGoal.ai_tasks[nextTaskIndex].actionable_steps = newGoal.ai_tasks[nextTaskIndex].actionable_steps.map(step => ({
            ...step,
            completed: false
          }));
          return newGoal;
        });
      }
    }, 2000); // Hide confetti after 2 seconds
  };
  
  const handleStepCheck = (stepIndex) => {
    setGoal(prevGoal => {
      const newGoal = JSON.parse(JSON.stringify(prevGoal)); // Deep copy the goal object
  
      const activeTask = newGoal.ai_tasks[activeTaskIndex];
      const updatedSteps = [...activeTask.actionable_steps]; // Create a copy of the steps array
      updatedSteps[stepIndex].completed = !updatedSteps[stepIndex].completed;
      activeTask.actionable_steps = updatedSteps;
  
      return newGoal;
    });
  
    // Delay checking if all steps are completed to ensure the last step is marked first
    setTimeout(() => {
      setGoal(prevGoal => {
        const newGoal = JSON.parse(JSON.stringify(prevGoal)); // Deep copy the goal object
  
        const activeTask = newGoal.ai_tasks[activeTaskIndex];
        const updatedSteps = [...activeTask.actionable_steps]; // Create a copy of the steps array
  
        if (updatedSteps.every(s => s.completed)) {
          handleStepCompletion();
        }
  
        return newGoal;
      });
    }, 100); // Delay of 100ms (adjust as needed)
  };
  if (loading) {
    return (
      <div className='w-full mt-8 flex min-h-screen'>
        <div className="w-11/12 p-8 mt-8 py-8 flex-1 overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!goal) {
    return (
      <div className='w-full mt-8 flex min-h-screen'>
        <div className="w-11/12 p-8 mt-8 py-8 flex-1 overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
          Goal not found
        </div>
      </div>
    );
  }

   const activeTask = goal.ai_tasks[activeTaskIndex];
  
  return (
    <div className='w-full mt-8 flex min-h-screen'>
      <div className="w-full  mt-8 ">
        
        <div className=' flex space-x-4 w-full  '>
          <div className=' px-8 w-6/12 fixed'>
            <div className='flex items-center   mb-4 gap-4'>
            <img src={flag} alt="Flag" className="w-8 h-8" />
            <h1 className='text-2xl font-semibold'>{goal.title}</h1>
            </div>
            <div className="ai-tasks   px-4 w-full  flex flex-col items-center  justify-center h-full relative" >
            <div className="w-full gap-4 overflow-hidden overflow-y-auto  no-scrollbar   max-h-[85vh] pb-20 pl-40 relative m-2">
              {goal.ai_tasks.map((task, index) => {
                const isCompleted = taskCompletionStatus[index];
                const isActive = index === activeTaskIndex || (index === 0 && activeTaskIndex === null);
                const { timeline, cleanedDetails } = extractTimeline(task.details); // Extract timeline and cleaned details from each task or step
  
                return (
                  <div className="mx-auto" key={task.id}>
                    <div className={`task ${isActive ? 'bg-[#FFFFFF]' : 'bg-[#ECE6F0]'} ${isCompleted ? 'completed' : ''} relative mt-12 border p-4 space-y-2 rounded-xl border-[#4F378A] border-[2.5px] w-10/12`}>
                      <div className="flex justify-between gap-4">
                        <h3 className="text-lg text-[#1D1B20] font-normal">{task.title}</h3>
                        
                      </div>
                      <p className="text-sm font-medium text-[#65558F]">Due_date:
                        <span className='px-8 ml-4 py-1 text-sm bg-[#E8DEF8] rounded-md text-[#65558F]'>
                          {task.due_date}
                        </span>
                      </p>
                      <p className="text-sm font-medium text-[#65558F]">Status:
                        <span className='px-3 ml-4 py-1 bg-[#E8DEF8] rounded-md text-sm text-[#65558F]'>
                          {task.status}
                        </span>
                      </p>
                      <p className="text-sm font-medium text-[#65558F]">Completed_at:
                        <span className='px-8 ml-4 py-1 bg-[#E8DEF8] rounded-md text-sm text-[#65558F]'>
                          {task.completed_at}
                        </span>
                      </p>
                                      {index < goal.ai_tasks.length && (
                        <div className="absolute -left-14 transform -translate-x-1/2 -top-32 flex flex-col items-center overflow-hidden">
                          <svg width="154" height="214" viewBox="0 0 154 288" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M153.005 287.369C153.557 287.366 154.003 286.916 154 286.364C153.997 285.812 153.548 285.366 152.995 285.369L153.005 287.369ZM15.3315 236.84L16.3315 236.839L15.3315 236.84ZM65.5609 286.77L65.5654 287.77L65.5609 286.77ZM14 0.00139951L14.0055 3.94874L16.0055 3.94594L16 -0.00139951L14 0.00139951ZM14.0166 11.8434L14.0276 19.7381L16.0276 19.7353L16.0166 11.8406L14.0166 11.8434ZM14.0387 27.6328L14.0497 35.5274L16.0497 35.5246L16.0387 27.63L14.0387 27.6328ZM14.0608 43.4221L14.0718 51.3168L16.0718 51.314L16.0608 43.4193L14.0608 43.4221ZM14.0829 59.2115L14.0939 67.1062L16.0939 67.1034L16.0829 59.2087L14.0829 59.2115ZM14.105 75.0008L14.116 82.8955L16.116 82.8927L16.105 74.998L14.105 75.0008ZM14.1271 90.7902L14.1381 98.6849L16.1381 98.6821L16.1271 90.7874L14.1271 90.7902ZM14.1492 106.58L14.1602 114.474L16.1602 114.471L16.1492 106.577L14.1492 106.58ZM14.1712 122.369L14.1823 130.264L16.1823 130.261L16.1712 122.366L14.1712 122.369ZM14.1933 138.158L14.2044 146.053L16.2044 146.05L16.1933 138.155L14.1933 138.158ZM14.2155 153.948L14.2265 161.842L16.2265 161.839L16.2154 153.945L14.2155 153.948ZM14.2375 169.737L14.2486 177.632L16.2486 177.629L16.2375 169.734L14.2375 169.737ZM14.2596 185.526L14.2707 193.421L16.2707 193.418L16.2596 185.523L14.2596 185.526ZM14.2817 201.316L14.2928 209.21L16.2928 209.208L16.2817 201.313L14.2817 201.316ZM14.3038 217.105L14.3149 225L16.3149 224.997L16.3038 217.102L14.3038 217.105ZM14.3259 232.894L14.3315 236.842L16.3315 236.839L16.3259 232.892L14.3259 232.894ZM14.3315 236.842C14.3333 238.192 14.3877 239.53 14.4926 240.854L16.4864 240.696C16.3855 239.424 16.3333 238.137 16.3315 236.839L14.3315 236.842ZM15.7521 248.774C16.3857 251.4 17.2224 253.947 18.2446 256.396L20.0903 255.626C19.1085 253.273 18.3049 250.827 17.6964 248.305L15.7521 248.774ZM21.9079 263.531C23.318 265.814 24.903 267.978 26.6441 270.003L28.1606 268.699C26.4874 266.753 24.9644 264.674 23.6096 262.48L21.9079 263.531ZM32.3313 275.656C34.3667 277.385 36.5396 278.957 38.8313 280.353L39.872 278.645C37.6701 277.304 35.5822 275.793 33.6261 274.132L32.3313 275.656ZM45.9877 283.974C48.4436 284.981 50.9954 285.803 53.6254 286.421L54.0827 284.474C51.5567 283.88 49.1058 283.091 46.7468 282.124L45.9877 283.974ZM61.5524 287.633C62.8769 287.73 64.2152 287.776 65.5654 287.77L65.5563 285.77C64.2579 285.776 62.9714 285.731 61.6984 285.638L61.5524 287.633ZM65.5654 287.77L69.9374 287.75L69.9282 285.75L65.5563 285.77L65.5654 287.77ZM78.6813 287.71L87.4252 287.669L87.4161 285.67L78.6721 285.71L78.6813 287.71ZM96.1691 287.629L104.913 287.589L104.904 285.589L96.16 285.629L96.1691 287.629ZM113.657 287.549L122.401 287.509L122.392 285.509L113.648 285.549L113.657 287.549ZM131.145 287.469L139.889 287.429L139.88 285.429L131.136 285.469L131.145 287.469ZM148.633 287.389L153.005 287.369L152.995 285.369L148.623 285.389L148.633 287.389Z" fill="#4F378A" stroke="#4F378A" strokeWidth="2"/>
                            <circle cx="15" cy="252" r="16" fill="white" stroke="#4F378A" strokeWidth="3"/>
                              {isCompleted && (
                                <g transform="translate(9, 246)">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="#4F378A"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M3 6l3 3 6-6" />
                                  </svg>
                                </g>
                              )}

                            <circle cx="151" cy="283" r="6" fill="#4F378A" stroke="#4F378A" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

            
          </div>

          <div className="actionable-steps w-4/12 space-y-4 p-4 p h-full    fixed right-0" style={{ backgroundColor: 'rgba(204, 191, 205, 0.11)' }}>
            <div className='w-full bg-[#ECE6F0]   rounded-lg p-2 flex justify-center items-center'>
              <p className="text-lg text-[#1D1B20] font-medium">Start working on your goal today!</p>
            </div>
           
            <div className="text-lg container w-full p-4 rounded-xl h-[80vh] bg-[#ECE6F0] relative">
              {isVisible ? (<Confetti />) : 
              (
                  <>
                  <p className="text-lg flex items-center m-2 gap-2 w-full bg-[#ECE6F0] text-[#00000] font-normal">
                  <GoDotFill className='text-[#B3B3B3]' /> {activeTask ? `Steps for: ${activeTask.title}` : "Select a task"}
                </p>
                <Divider orientation="horizontal" sx={{ borderColor: "#767676", opacity: 0.8 }} />
                <div className='flex mt-4 items-center justify-end gap-4'>
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#65558F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#65558F]"
                >
                  <rect x="3" y="4" width="18" height="5" fill="#65558F" stroke="#65558F"></rect>
                  <rect x="3" y="10" width="18" height="12" stroke="#65558F" fill="none" strokeWidth="2" />
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <circle cx="10" cy="16" r="1" fill="#65558F"></circle>
                </svg>
                <span className='flex items-center border border-[#4F378A] border-[2px] rounded-md py-1 px-4'>
                  <p className="text-sm text-[#4F378A] font-normal">{activeTask ? activeTask.task_timeline : ''}</p>
                </span>
              </div>
              <div className='space-y-6 mt-4'>
                {activeTask && activeTask.actionable_steps.map((step, stepIndex) => {
                  const {timeline, cleanedDetails } = extractTimeline(step.details); // Extract cleaned details for each step
              
                  return (
                    <div key={stepIndex} className="step bg-[#FFFFFF] p-4 rounded-xl flex items-center gap-4">
                    <label className="custom-checkbox">
                        <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={() => handleStepCheck(stepIndex)} // Call the new handler
                        
                        />

                        </label>
                        
                      <div className="flex w-full ">
                       <div className="flex flex-col w-10/12">
                       <span className='text-md text-[#1D1B20] text-md font-normal'>{step.subtask_title}</span>
                       <span className='text-[#49454F] text-sm'>{cleanedDetails}</span>
                        </div>

                        <span className='text-[#49454F] h-6 flex justify-center items-center  border border-[#4F378A] rounded-xl w-3/12 text-sm '>{timeline}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className='flex fixed  bottom-8 right-0 w-4/12 justify-center  '>
              <button className='bg-[#4F378A] w-full relative max-w-sm  text-white py-2 px-8 rounded-lg'>
                Add to List
              </button>
              </div>
                </>
              )
              }
             
            

            </div>

            
          </div>
  
          
        </div>
      </div>
    </div>
  );
  };
  
  export default Goal;