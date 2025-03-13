import React, { useContext , useState} from 'react';
import { GoalsContext } from '../../../context/GoalsContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom";
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { createGoal, createTask, deleteGoalById, deleteAiGoalById, deleteTaskById} from '../../../utils/Api';
import { TasksContext } from '../../../context/TasksContext';



const Sidebar = () => {
  const { goalId } = useParams();
  const { taskId } = useParams();
  const location = useLocation();
  const {goals, setGoals} = useContext(GoalsContext);
  const {pinnedGoals, hiddenGoals, removeGoalFromSidebar } = useContext(GoalsContext);
  const [isGoalInputVisible, setIsGoalInputVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isTaskInputVisible, setIsTaskInputVisible] = useState(false);
  const {tasks,  pinnedTasks, setTasks,  hiddenTasks,  removeTaskFromSidebar,  addTaskToSidebar, removeTask } = useContext(TasksContext);
  const { removeGoal } = useContext(GoalsContext);
  const [menuVisible, setMenuVisible] = useState({});
  const [taskMenuVisible, setTaskMenuVisible] = useState({});








  const isActive = (path) => (location.pathname === path ? "bg-black dark:bg-blue-700 text-white" : "text-black dark:text-white");
 
  const handleAddGoal = async () => {
    if (newGoalTitle.trim() === '') return;
    try {
      const newGoal = await createGoal(newGoalTitle, '');
      setGoals((prevGoals) => ({
        ...prevGoals,
        goals: [...prevGoals.goals, newGoal], // ✅ Correct way to update
      }));
      setNewGoalTitle('');
      setIsGoalInputVisible(false);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };
  

  const handleAddTask = async () => {
    if (newTaskTitle.trim() === '') return;
    try {
      const newTask = await createTask({ goal: 0, title: newTaskTitle }); 
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setIsTaskInputVisible(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
  const toggleMenu = (goalId) => {
    setMenuVisible((prev) => ({ 
      ...prev,
      [goalId]: !prev[goalId]
    }));
  };

  const toggleTaskMenu = (taskId) => {
    setTaskMenuVisible((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };



  const handleDelete = async (goalId) => {
    try {
      await deleteGoalById(goalId);

      removeGoal(goalId);
    } catch (error) {
      console.error(`Error deleting goal with ID ${goalId}:`, error.response?.data || error.message );    
    } 
  }

  const handleDeleteAiGoal = async (goalId) => {
    try {
      await deleteAiGoalById(goalId);
      removeGoal(goalId); 
    }
    catch (error) {
      console.error(`Error deleting goal with ID ${goalId}:`, error.response?.data || error.message );
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTaskById(taskId);
      removeTask(taskId);
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId}:`, error.response?.data || error.message);
    }
  }

    // Get the last two AI goals that are not hidden
  const recentAiGoals = goals.ai_goals
  ?.filter(goal => !hiddenGoals.has(goal.id))
  .slice(-2);

  // Get pinned goals
  const pinnedAiGoals = goals.ai_goals.filter(goal => pinnedGoals.has(goal.id));

  // Merge pinned goals and recent AI goals (avoid duplicates)
  const displayedAiGoals = [...new Set([...pinnedAiGoals, ...recentAiGoals])];

  const recentTasks = tasks
  ?.filter(task => !hiddenTasks.has(task.id))
  .slice(-2);

  const pinnedTasksList = tasks.filter(task => pinnedTasks.has(task.id));

  const displayedTasks = [...new Set([...pinnedTasksList, ...recentTasks])];

  const handleRemoveGoalFromSidebar = (goalId) => {
    removeGoalFromSidebar(goalId);
    setMenuVisible((prev) => {
      const newState = { ...prev };
      delete newState[goalId]; // Remove the goalId from menuVisible
      return newState;
    });
  };

  const handleRemoveTaskFromSidebar = (taskId) => {
    removeTaskFromSidebar(taskId);
    setTaskMenuVisible((prev) => {
        const newState = { ...prev };
        delete newState[taskId]; 
        return newState;
    });
};


  return (
    <div className='fixed inset-y-0 transition-width duration-300 min-h-screen  '>
        <div className=' md:w-64 lg:w-60 xl:w-56 2xl:w-66  h-full  bg-[#F4F1FF]  flex flex-col px-2 py-4  '>
        <div className='w-10/12 p-2 inset-y-2 mb-2'>
        <h1 className='text-black fredoka-bold xl:text-2xl lg:text-xl ml-3 mt-2 '>Kommitly</h1>
            </div>

            <div className="flex flex-col flex-grow mt-4 overflow-y-auto no-scrollbar">
        <nav className="flex flex-col">

              <Link
                to="/dashboard/home"
                className={`flex items-center group p-3 md:text-sm xl:text-xs  font-medium rounded-lg transition-300 hover:bg-[#E8DEF8]  ${isActive(
                  "/home"
                )}`}
              >
                <div className='flex items-center px-1 justify-center '>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#65558F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#65558F] icon-small"
                    >
                    <path d="M3 9.5L12 3l9 6.5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-11z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#65558F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#65558F] icon-large"
                >
                  <path d="M3 9.5L12 3l9 6.5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-11z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>

                <span
                  className="ml-4 flex items-center justify-center"
                >
                  <p className='text-[#4A4459] md:text-sm xl:text-sm 2xl:text-lg  text-center font-normal group-hover:text-[#FFFFFF]'>
                  Home
                  </p>
                </span>

                </div>
               
              </Link>

              <ul className='mb-2 '>
              <li className='w-full h-12'>
                <Link to="/dashboard/goals" className="group  flex items-center p-2 text-sm font-medium rounded-lg hover:bg-[#E8DEF8] ">
                  <div className='flex w-full px-2 justify-between'>
                    <div className='flex items-center'>
                      <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#65558F"
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="icon-small"
                      >
                    
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 3H8v4h8V3z"></path>
                      <path d="M9 7v14"></path>
                      <path d="M15 7v14"></path>
                      </svg>
                      <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#65558F"
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="icon-large"
                      >
                      
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 3H8v4h8V3z"></path>
                        <path d="M9 7v14"></path>
                        <path d="M15 7v14"></path>
                      </svg>

                      <span className="ml-4  md:text-sm xl:text-sm 2xl:text-lg  text-[#4A4459] font-normal group-hover:text-[#FFFFFF]">
                        Goals
                      </span> 
                    </div>
                    <div className='flex  items-center rounded-full  p-2 hover:bg-[#F7F2FA]' 
                 style={{ boxShadow: '2px 2px 8.5px rgba(13, 39, 80, 0.16), -8px -8px 13.5px rgba(255,255,255,1) ' }}
                 onClick={() => setIsGoalInputVisible(!isGoalInputVisible)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="#65558F"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#65558F] icon-small"
                    >
                      <path d="M9 2v16" strokeLinecap="round"></path>
                      <path d="M2 9h16" strokeLinecap="round"></path>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="#65558F"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#65558F] icon-large"
                    >
                      <path d="M9 2v16" strokeLinecap="round"></path>
                      <path d="M2 9h16" strokeLinecap="round"></path>
                    </svg>



                 </div>
                  </div>
                </Link>
              </li>
              {isGoalInputVisible && (
                <li className='w-full h-12'>
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                    className="w-full ml-2 px-3 py-3 md:text-xs xl:text-xs 2xl:text-xs font-normal text-[#4A4459] border-none focus:outline-none"
                    placeholder="Enter new goal"
                  />
                </li>
              )}

                {goals.goals?.slice(-2).filter(goal => !hiddenGoals.has(goal.id)).map((goal) => (
                  <li key={goal.id} className="w-full relative group ">
                    <Link
                      to={`/dashboard/goal/${goal.id}`}
                      className="flex items-center text-sm font-medium rounded-lg hover:bg-[#E8DEF8] w-full z-0"
                    >
                      <span className="ml-2 px-3 py-3 z-0 md:text-xs xl:text-xs 2xl:text-sm text-[#4A4459] font-normal truncate max-w-[180px] block group-hover:text-[#FFFFFF]">
                         {goal.title}
                      </span>
                    </Link>

                    {/* Three-dot menu icon */}
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 z-1000">
                      <button
                        className="p-1 text-[#4A4459] z-1000 hover:text-[#000000] opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents clicking the menu from triggering other actions
                          toggleMenu(goal.id);
                        }}
                      >
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
                        >
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </button>

                      {/* Dropdown Menu (Only Shows When Clicked) */}
                      {menuVisible[goal.id] && (
                        <div className="absolute right-0 mt-2 w-42 bg-white shadow-lg rounded-md z-[100]">
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-black hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveGoalFromSidebar(goal.id);
                            }}
                          >
                            Remove from Sidebar
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-[#E60178] hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(goal.id);
                            }}
                          >
                            Delete Goal
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}

              {displayedAiGoals.map((goal)=> (
                <li key={goal.id} className="w-full relative group">
                  <Link to={`/dashboard/ai-goal/${goal.id}`} className="flex items-center text-sm font-medium rounded-lg hover:bg-[#E8DEF8] w-full z-0">
                  <span className="ml-2 px-3 py-3 z-0 md:text-xs xl:text-xs 2xl:text-sm text-[#4A4459] font-normal truncate max-w-[180px] block group-hover:text-[#FFFFFF]">
                      {goal.title}
                    </span>
                  </Link>

               
                   <div className="absolute right-1 top-1/2 transform -translate-y-1/2 z-1000">
                      <button
                        className="p-1 text-[#4A4459] z-1000 hover:text-[#000000] opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents clicking the menu from triggering other actions
                          toggleMenu(goal.id);
                        }}
                      >
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
                        >
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </button>

                      {/* Dropdown Menu (Only Shows When Clicked) */}
                      {menuVisible[goal.id] && (
                        <div className="absolute right-0 mt-2 w-42 bg-white shadow-lg rounded-md z-[100]">
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-black hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveGoalFromSidebar(goal.id);
                            }}
                          >
                            Remove from Sidebar
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-[#E60178] hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAiGoal(goal.id);
                            }}
                          >
                            Delete Goal
                          </button>
                        </div>
                      )}

                      </div>




                </li>
              ))}

            </ul>
            
            {/* {<li className='w-full  h-12'>
              <Link
                to="/goals"
                className={`flex items-center p-2 text-sm font-medium rounded-full transition-300 hover:bg-[#E8DEF8] ${isActive(
                  "/goals"
                )}`}
              >
                <div className='flex w-full px-2 justify-between'>
                    <div className='flex items-center '>
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
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 3H8v4h8V3z"></path>
                    <path d="M9 7v14"></path>
                    <path d="M15 7v14"></path>
                </svg>

                <span
                  className="ml-4  "
                >
                  <p className='text-base  text-[#4A4459] font-normal'>
                  Goals
                  </p>
                </span> 
                 </div>
                 <div className='flex  items-center rounded-full p-2 hover:bg-[#F7F2FA]' 
                 style={{ boxShadow: '4px 8px 16.5px rgba(13, 39, 80, 0.16), -8px -9px 23.5px rgba(255,255,255,1), 0px 4px 4px rgba(0,0,0,0.25) ' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="#65558F"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#65558F]"
                    >
                      <path d="M9 2v16" strokeLinecap="round"></path>
                      <path d="M2 9h16" strokeLinecap="round"></path>
                    </svg>



                 </div>



                </div>
               
              </Link>
            </li>} */}
            <ul> 
            <li className='w-full mb-4 h-12'>
              <Link
                to="/dashboard/tasks"
                className={`flex items-center group p-2 text-sm font-medium rounded-lg transition-300 hover:bg-[#E8DEF8] ${isActive(
                    "/tasks"
                  )}`}
                >
                  <div className='flex w-full px-2 justify-between'>
                   <div className='flex items-center '>
                   <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#65558F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#65558F] icon-small"
                >
                    <path d="M12 6h14"></path>
                    <path d="M12 12h14"></path>
                    <path d="M12 18h14"></path>
                    <path d="M1 6l2 2 4-4"></path>
                    <path d="M1 12l2 2 4-4 "></path>
                    <circle cx="3" cy="19" r="1"></circle>
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#65558F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#65558F] icon-large"
                >
                    <path d="M12 6h14"></path>
                    <path d="M12 12h14"></path>
                    <path d="M12 18h14"></path>
                    <path d="M1 6l2 2 4-4"></path>
                    <path d="M1 12l2 2 4-4 "></path>
                    <circle cx="3" cy="19" r="1"></circle>
                </svg>
                <span
                  className="ml-4  "
                >
                  <p className='md:text-sm xl:text-sm 2xl:text-lg  text-[#4A4459] font-normal group-hover:text-[#FFFFFF]'>
                  Tasks
                  </p>
                </span>
                   </div>
                   
                   <div className='flex items-center rounded-full p-2 hover:bg-[#F7F2FA] ' 
                  style={{ boxShadow: '2px 2px 8.5px rgba(13, 39, 80, 0.16), -8px -8px 13.5px rgba(255,255,255,1) ' }} 
                  onClick={() => setIsTaskInputVisible(!isTaskInputVisible)}>
                  
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="#65558F"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#65558F] icon-small"
                    >
                      <path d="M9 2v16" strokeLinecap="round"></path>
                      <path d="M2 9h16" strokeLinecap="round"></path>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="#65558F"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#65558F] icon-large"
                    >
                      <path d="M9 2v16" strokeLinecap="round"></path>
                      <path d="M2 9h16" strokeLinecap="round"></path>
                    </svg>


                 </div>

                </div>
               
              </Link>

            </li>
            {isTaskInputVisible && (
                <li className='w-full h-12'>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    className="w-full ml-2 px-3 py-3 md:text-xs xl:text-xs 2xl:text-xs font-normal text-[#4A4459] border-none focus:outline-none"
                    placeholder="Enter new task"
                  />
                </li>
              )}


                {displayedTasks.map((task)  => (
                <li key={task.id} className="w-full relative group ">
                  <Link to={`/dashboard/tasks/${task.id}`} className="flex group items-center text-sm font-medium rounded-lg hover:bg-[#E8DEF8]">
                  <span className="ml-2 px-3 py-3 md:text-xs xl:text-xs 2xl:text-sm  text-[#4A4459] font-normal truncate max-w-[200px] block group-hover:text-[#FFFFFF]">
                    {task.title}
                </span>

                  </Link>
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 z-1000">
                      <button
                        className="p-1 text-[#4A4459] z-1000 hover:text-[#000000] opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents clicking the menu from triggering other actions
                          toggleTaskMenu(task.id);
                        }}
                      >
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
                        >
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </button>

                      {/* Dropdown Menu (Only Shows When Clicked) */}
                      {taskMenuVisible[task.id]  && (
                        <div className="absolute right-0 mt-2 w-42 bg-white shadow-lg rounded-md z-[100]">
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-black text-light hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTaskFromSidebar(task.id);
                            }}
                          >
                            Remove from Sidebar
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-[#E60178] font-light hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                          >
                            Delete Task
                          </button>
                        </div>
                      )}

                      </div>

                </li>
              ))}

            </ul>

          
            {/* {
            <Divider variant="middle" />} */}
            <ul>

            <li className='w-full h-12 mt-4'>
              <Link
                to="/dashboard/analytics"
                className={`flex items-center group  p-3 text-sm font-medium rounded-lg transition-300 hover:bg-[#E8DEF8]  ${isActive(
                  "/analytics"
                )}`}
              >
                <div className='flex px-1 items-center '>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#65558F" 
                  stroke="#65558F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#65558F] icon-small"
                >
                  <rect x="4" y="10" width="2" height="10" rx="1" ry="1"></rect>
                  <rect x="10" y="6" width="2" height="14" rx="1" ry="1"></rect>
                  <rect x="16" y="2" width="2" height="18" rx="1" ry="1"></rect>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#65558F" 
                  stroke="#65558F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#65558F] icon-large"
                >
                  <rect x="4" y="10" width="2" height="10" rx="1" ry="1"></rect>
                  <rect x="10" y="6" width="2" height="14" rx="1" ry="1"></rect>
                  <rect x="16" y="2" width="2" height="18" rx="1" ry="1"></rect>
                </svg>

                <span
                  className="ml-4  "
                >
                  <p className='mmd:text-sm xl:text-sm 2xl:text-lg text-[#4A4459] font-normal group-hover:text-[#FFFFFF]'>
                  Stats
                  </p>
                </span>

                </div>
               
              </Link>
            </li>
          {/* {<li className='w-full h-12'>
            <Link
              to="/dashboard/calendar"
              className={`flex items-center group  p-3 text-sm font-medium rounded-lg transition-300 hover:bg-[#E8DEF8]  ${isActive(
                  "/calendar"
              )}`}
            >
              <div className='flex px-1 items-center '>
                  <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#65558F"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#65558F] icon-small"
              >
              <rect x="3" y="4" width="18" height="5"  fill="#65558F" stroke="#65558F"></rect>
              <rect x="3" y="10" width="18" height="12" stroke="#65558F" fill="none" strokeWidth="2" />
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              
              <circle cx="10" cy="16" r="1" fill="#65558F"></circle>
              </svg>
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#65558F"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#65558F] icon-large"
              >
              <rect x="3" y="4" width="18" height="5"  fill="#65558F" stroke="#65558F"></rect>
              <rect x="3" y="10" width="18" height="12" stroke="#65558F" fill="none" strokeWidth="2" />
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              
              <circle cx="10" cy="16" r="1" fill="#65558F"></circle>
              </svg>


              <span
                className="ml-4  "
              >
                <p className='md:text-sm xl:text-sm 2xl:text-lg  text-[#4A4459] font-normal group-hover:text-[#FFFFFF]'>
                Calendar
                </p>
              </span>

              </div>
              
            </Link>
          </li>
          <li className='w-full h-12 mb-4'>
            <Link
              to="/dashboard/notifications"
              className={`flex items-center  group p-3 text-sm font-medium rounded-lg transition-300 hover:bg-[#E8DEF8]  ${isActive(
                  "/notifications"
              )}`}
            >
              <div className='flex px-1 items-center '>
                              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#65558F"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#65558F] icon-small"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#65558F"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#65558F] icon-large"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>

              <span
                className="ml-4  "
              >
                <p className='md:text-sm xl:text-sm 2xl:text-lg  text-[#4A4459] font-normal group-hover:text-[#FFFFFF]'>
                Notifications
                </p>
              </span>

              </div>
              
            </Link>
          </li>}
           <Divider variant="middle" component="li" /> */}

           

            <li className='w-full h-12 mt-4'>
              <Link
                to="/dashboard/settings"
                className={`flex items-center group p-3 text-sm font-medium rounded-lg transition-300 hover:bg-[#E8DEF8]  ${isActive(
                    "/settings"
                )}`}
              >
                <div className='flex px-1 items-center '>
                    
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#65558F"
                        strokeWidth="3"
                        strokeLinecap="bevel"
                        strokeLinejoin="bevel"
                        className="text-[#65558F] icon-small"
                    >
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#65558F"
                        strokeWidth="3"
                        strokeLinecap="bevel"
                        strokeLinejoin="bevel"
                        className="text-[#65558F] icon-large"
                    >
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>

                
              
                <span
                  className="ml-4  "
                >
                  <p className='md:text-sm xl:text-sm 2xl:text-lg  text-[#4A4459] font-normal group-hover:text-[#FFFFFF]'>
                  Settings
                  </p>
                </span>

                </div>
               
              </Link>
            </li>
            
            

            </ul>
            <div className='flex justify-center w-11/12  2xl:mt-28 xl:mt-16 mb-8'>
              
                 <Button className='w-7/12 flex gap-2  text-[#4A4459]' size="large"  style={{ height: '48px',  borderRadius: '8px', boxShadow: '6px 6px 12px rgba(13, 39, 80, 0.26), -6px -6px 16px rgba(255,255,255,1) ' }}>
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
                className="text-[#65558F]"
                >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
    
               <span className='text-[#4A4459] md:text-sm font-semibold'>
               Logout

               </span>


            </Button>

             
            </div>
            
        </nav>
        </div>

        </div>
    </div>
  )
}

export default Sidebar