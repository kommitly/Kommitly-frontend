import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGoalById, createTask, fetchTasksByGoalId, deleteGoalById } from '../../../utils/Api';
import { motion } from 'framer-motion';
import survey from '../../../assets/survey.svg';
import flag from '../../../assets/flag-dynamic-color.svg';
import { GoalsContext } from '../../../context/GoalsContext';
import Loading from '../../components/Loading';
import ReusableFormModal from '../../components/ReusableFormModal';
import { FaPlus } from "react-icons/fa6";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TextField, Typography, useTheme
} from '@mui/material';
import Button from '../../components/Button';
import { tokens } from "../../../theme";
import Empty from '../../components/Empty';
import aiGoals from '../../../assets/goals.svg';
import { CiCircleMore } from "react-icons/ci";
import { RiProgress1Line } from "react-icons/ri";
import { AiOutlineCheckCircle } from "react-icons/ai";
import useMediaQuery from '@mui/material/useMediaQuery';
import { BsHourglassTop } from "react-icons/bs";

const StatusIcon = ({ status, color, size = 16 }) => {
  const iconColor = color || "#000";
  switch (status?.toLowerCase().replace(/[-_]/g, " ")) {
  case "pending":
    return <CiCircleMore size={size} color={iconColor} />;
  case "in progress":
    return <RiProgress1Line size={size} color={iconColor} />;
  case "completed":
  case "done":
    return <AiOutlineCheckCircle size={size} color={iconColor} />;
  default:
    return <CiCircleMore size={size} color={iconColor} />;
}

};


const Goal = () => {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const [menuVisible, setMenuVisible] = useState(false);
  const [isGoalRenaming, setIsGoalRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { removeGoal, addGoalToSidebar } = useContext(GoalsContext);
  const inputGoalRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [taskMenuVisible, setTaskMenuVisible] = useState(null);
  const [taskOpen, setTaskOpen] = useState(false);
  const [formData, setFormData] = useState({
      title: "",
      
    });




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 


  const loadGoal = useCallback(async () => {
    try {
      const fetchedGoal = await fetchGoalById(goalId);
      setGoal(fetchedGoal);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  const loadTasks = useCallback(async () => {
    try {
      const fetchedTasks = await fetchTasksByGoalId(goalId);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [goalId]);

  useEffect(() => {
    setGoal(null);
    setTasks([]);
    setLoading(true);
    loadGoal();
    loadTasks();
  }, [goalId, loadGoal, loadTasks]);
  
  useEffect(() => {
    if (isGoalRenaming) {
      inputGoalRef.current?.focus();
    }
  }, [isGoalRenaming]);
  
  const handleAddTask = async (e) => {
  e.preventDefault();

  if (!formData.title.trim()) return;

  try {
    const createdTask = await createTask({
      goal: goalId,
      title: formData.title,
    });

    setTasks((prev) => [...prev, createdTask]);

    setFormData({ title: "" });
    setTaskOpen(false);
  } catch (error) {
    console.error("Error creating task:", error);
  }
};


  const handleDelete = async () => {
      try {
        await deleteGoalById(goalId);
        
        removeGoal(goalId); // Remove from state immediately
        navigate('/dashboard/goals');
      } catch (error) {
        setError(error.message);
      }
    };
    

if (loading) {
    return (
         <>
         <Loading/>
         </>
      
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!goal) return <div>Goal not found</div>;


  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleTaskMenu = (id) => {
    setTaskMenuVisible(prevId => (prevId === id ? null : id));
  };

  
  

  const handleUpdate = async () => {
    if (!newTitle.trim() || newTitle === goal.title) {
      setIsGoalRenaming(false); // Cancel rename if empty or unchanged
      return;
    }

     try {
          await updateGoalById(goalId, newTitle, goal.description);
          setGoal((prevGoal) => ({ ...prevGoal, title: newTitle }));
          setIsGoalRenaming(false);
          setMenuVisible(false);
        } catch (error) {
          setError(error.message);
        }
  };

  return (
    <div className=' flex  h-screen p-6'>
      <div className='w-full'>
        <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
        <div className='  font-semibold  flex justify-center items-center'
        >

        {isGoalRenaming ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate()} // Only update on Enter key
                      onBlur={handleUpdate} // Update when clicking away
                      ref={inputGoalRef}
                      className="md:text-2xl font-semibold border-b border-b-[#6246AC] p-1 focus:outline-none"
                    />
                  ) : (
                    <h1 className='md:text-2xl  xl:text-2xl 2xl:text-xl font-medium'> {goal.title}</h1>
                  )}
        </div>
        </div>


         {tasks.length === 0 ? (
            <Button
              
              onClick={() => setTaskOpen(true)}
              text="Add Task"

            >
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
                                        className=""
                                          style={{ stroke: '#FFFFFF' }} // Inline style to ensure white stroke
                                        >
                                          <line x1="12" y1="5" x2="12" y2="19" />
                                          <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
          
            </Button>
          ) : (
            /* ORIGINAL 3 DOT MENU */
            <div className="relative">
              <svg
                width="24" height="24"
                fill="none" stroke="#65558F" strokeWidth="2"
                onClick={() => setMenuVisible(!menuVisible)}
                className="cursor-pointer"
              >
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>

              {menuVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      setIsGoalRenaming(true);
                      setTimeout(() => inputGoalRef.current?.focus(), 0);
                    }}
                    className="block w-full px-4 py-2 text-sm hover:bg-[#F4F1FF]"
                  >
                    Rename
                  </button>

                  <button
                    onClick={() => addGoalToSidebar(goal.id)}
                    className="block w-full px-4 py-2 text-sm text-[#006FDB] hover:bg-[#F4F1FF]"
                  >
                    Pin to Sidebar
                  </button>

                  <button
                    onClick={handleDelete}
                    className="block w-full px-4 py-2 text-sm text-[#E60178] hover:bg-[#F4F1FF]"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
       



        </div>
        

      








{/* {
        <Typography variant="subtitle1" color="textSecondary">
          Category: {goal.category}
        </Typography>} */}

      

          <ReusableFormModal
                        open={taskOpen}
                        onClose={() => setTaskOpen(false)}
                        title="Add Task"
                        colors={colors}
                        formData={formData}
                        onChange={handleChange}
                        onSubmit={handleAddTask}
                        fields={[
                          { name: "title", label: "Title" },
                        
                        ]}
                      />
        


   {tasks.length > 0 ? (
  <div className="mt-6 flex flex-col gap-4">
    {tasks.map((task, index) => {
      const isActive = false; // or your active logic
      return (
        <div
          key={task.id}
          onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
          className="flex transition-transform duration-300 hover:scale-[0.98] cursor-pointer justify-between gap-2 relative border-l md:p-4 p-2 md:space-y-2 rounded-2xl"
          style={{
            backgroundColor: theme.palette.background.paper,
            borderLeftColor: theme.palette.primary.main,
          }}
        >
          {/* LEFT ICON BOX */}
          <div
            className="md:w-1/4 w-24 rounded-lg p-4"
            style={{
              backgroundColor: colors.menu.primary,
            }}
          >
             <img src={aiGoals} alt="goals"  className='h-20 object-cover'/>
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full">
            <div className="flex items-center justify-between w-full mb-2">
                <h3 className="md:text-sm text-sm xl:text-sm 2xl:text-base font-medium" style={{color: isActive ? colors.primary[100] : colors.text.primary}}>
                                    {task.title}
                                  </h3>

             
            </div>

            {/* STATUS + TIMELINE */}

          
                            <div className="flex gap-2 mb-1 mt-2 items-center">
                              {isXs ? (<BsHourglassTop fontSize='small' style={{color: isActive ? colors.primary[100] : colors.text.secondary }}/>
                                
):( <p className="w-16 md:text-xs xl:text-xs 2xl:text-sm  text-xs font-medium " style={{color: isActive ? colors.primary[100] : colors.text.secondary }}>Timeline:</p>)}

                              <span
                                  className="  2xl:text-sm text-xs rounded-sm md:text-xs xl:text-xs"
                                  style={{
                                    color: isActive ? colors.primary[100] : colors.text.secondary,
                                    borderColor: isActive ? colors.primary[100] : colors.text.secondary,
                                  }}
                                >
                                  {task.task_timeline || "No timeline"}
                                </span>

                            </div>

             <div className="flex gap-2 items-center">
                                                               {isXs ? (<StatusIcon 
              status={task.status} 
              color={isActive ? "#F6F3F3" : colors.text.secondary} 
            />):( <p className="w-16 md:text-xs xl:text-xs 2xl:text-sm text-xs  font-medium " style={{color: isActive ? colors.primary[100] : colors.text.secondary }}>Status:</p>)}
                                                                <span className="  2xl:text-sm  text-center  text-xs rounded-sm md:text-xs xl:text-xs  flex items-center " style={{color: isActive ? colors.primary[100] : colors.text.secondary , borderColor: isActive ? colors.primary[100] : colors.text.secondary}}>
                                                                  {task.status}
                                                                </span>
                                                              </div>
            

            
           
          </div>
        </div>
      );
    })}
  </div>
) : (
  <>
    <div className='w-full flex justify-center items-center h-[50vh] '>
      <div className='h-24'>
        <Empty />
      </div>
    </div>
  </>
)}

            
          
      </div>

    
    </div>
  );
};

export default Goal;
