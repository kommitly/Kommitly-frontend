import React, { useContext , useEffect, useState} from 'react';
import { GoalsContext } from '../../../context/GoalsContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom";
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { createGoal, createTask, deleteGoalById, deleteAiGoalById, deleteTaskById} from '../../../utils/Api';
import { TasksContext } from '../../../context/TasksContext';
import { HiOutlineHome } from "react-icons/hi";
import { GoGoal } from "react-icons/go";


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
  const navigate = useNavigate();







  console.log("Goals from Sidebar:", goals);
  const isActive = (path) => (location.pathname === path ? "bg-[#4F378A] dark:bg-blue-700 text-white " : "text-[#2C2640] dark:text-white");
 
  const handleAddGoal = async () => {
    if (newGoalTitle.trim() === '') return;
    try {
      const newGoal = await createGoal(newGoalTitle);
      setGoals((prevGoals) => ({
        ...prevGoals,
        goals: [...prevGoals.goals, newGoal], // ✅ Correct way to update
      }));
      setNewGoalTitle('');
      setIsGoalInputVisible(false);
      navigate(`/dashboard/goal/${newGoal.id}`);
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

  const recentAiGoals = goals?.ai_goals
  ?.filter(goal => !hiddenGoals.has(goal.id))
  .slice(-2);


useEffect(() => {
  console.log("Recent AI Goals:", recentAiGoals);
}, [goals, hiddenGoals]); // Removed recentAiGoals from dependencies

  

  // Get pinned goals
  //const pinnedAiGoals = goals.ai_goals.filter(goal => pinnedGoals.has(goal.id));
  //console.log("Pinned AI Goals:", pinnedAiGoals);

  // Merge pinned goals and recent AI goals (avoid duplicates)
  //const displayedAiGoals = [...new Set([...pinnedAiGoals, ...recentAiGoals])];

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
    <div className='fixed inset-y-0 transition-width duration-300 min-h-screen border-r  border-[#CFC8FF] '>
        <div className=' md:w-64 lg:w-60 xl:w-56 2xl:w-66  h-full  bg-[#FBF9FF]  flex flex-col px-2 py-2  '>
        <div className='w-10/12 p-2 inset-y-2 mb-2'>
        <h1 className='text-black fredoka-bold xl:text-2xl lg:text-xl ml-3  '>Kommitly</h1>
            </div>

            <div className="flex flex-col flex-grow mt-4 overflow-y-auto no-scrollbar">
        <nav className="flex flex-col">

              <Link
                to="/dashboard/home"
                className={`flex items-center group p-3 md:text-sm xl:text-xs  font-medium rounded-lg transition-300 hover:bg-[#E8DEF8]  ${isActive(
                  "/dashboard/home"
                )}`}
              >
                <div className='flex items-center px-1 justify-center '>
                <HiOutlineHome  size={16} className={`icon-small group-hover:text-[#4F378A]  ${location.pathname === "/dashboard/home" ? "#FFFFFF" : "#65558F"}`}/>
                <HiOutlineHome  size={20} className={`icon-large group-hover:text-[#4F378A]  ${location.pathname === "/dashboard/home" ? "#FFFFFF" : "#65558F"}`}/>
               

                <span
                  className="ml-4 flex items-center justify-center"
                >
                  <p className=' md:text-sm xl:text-sm 2xl:text-lg  text-center font-normal group-hover:text-[#4F378A]'>
                  Home
                  </p>
                </span>

                </div>
               
              </Link>

              {goals?.ai_goals?.length > 0 && (
                <>
                

              <ul className='mb-2 '>
              <li className='w-full h-12'>
                <Link to="/dashboard/goals" className={`group  flex items-center p-2 text-sm font-medium rounded-lg hover:bg-[#E8DEF8] ${isActive(
                  "/dashboard/goals"
                )}`} >
                  <div className='flex w-full px-2 justify-between'>
                    <div className='flex items-center'>
                    <GoGoal size={16}  className={`icon-small group-hover:text-[#4F378A]  ${location.pathname === "/dashboard/goals" ? "#FFFFFF" : "#65558F"}`}/> 
                    <GoGoal size={20} className={`icon-large group-hover:text-[#4F378A]  ${location.pathname === "/dashboard/goals" ? "#FFFFFF" : "#65558F"}`}/> 


                      <span className="ml-4  md:text-sm xl:text-sm 2xl:text-lg   font-normal group-hover:text-[#4F378A]">
                        Goals
                      </span> 
                    </div>
                   {/* <div className='flex  items-center rounded-full  p-2 hover:bg-[#F7F2FA]' 
                 style={{ boxShadow: '2px 2px 8.5px rgba(13, 39, 80, 0.16), -8px -8px 13.5px rgba(255,255,255,1) ' }}
                 onClick={() => setIsGoalInputVisible(!isGoalInputVisible)}>
                   
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke={location.pathname === "/dashboard/goals" ? "#FFFFFF" : "#65558F"}
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
                      stroke={location.pathname === "/dashboard/goals" ? "#FFFFFF" : "#65558F"}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#65558F] icon-large"
                    >
                      <path d="M9 2v16" strokeLinecap="round"></path>
                      <path d="M2 9h16" strokeLinecap="round"></path>
                    </svg>



                 </div>
                 */}
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
                      className={`flex items-center text-sm font-medium rounded-lg hover:bg-[#E8DEF8] w-full z-0 ${isActive(`/dashboard/goal/${goal.id}`)}`}>
                      <span className="ml-2 px-3 py-3 z-0 md:text-xs xl:text-xs 2xl:text-sm  font-normal truncate max-w-[180px] block group-hover:text-[#4F378A]">
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
                          stroke={location.pathname === `/dashboard/goal/${goal.id}` ? "#FFFFFF" : "#65558F"}

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

              {recentAiGoals?.map((goal)=> (
                <li key={goal.id} className="w-full relative group">
                 <Link
                      to={`/dashboard/ai-goal/${goal.id}`}
                      className={`flex items-center text-sm font-medium rounded-lg hover:bg-[#E8DEF8] w-full z-0 ${isActive(`/dashboard/ai-goal/${goal.id}`)}`}
                    >

                  <span className="ml-2 px-3 py-3 z-0 md:text-xs xl:text-xs 2xl:text-sm  font-normal truncate max-w-[180px] block group-hover:text-[#4F378A]">
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
                          stroke={location.pathname === `/dashboard/ai-goal/${goal.id}` ? "#FFFFFF" : "#65558F"}

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
            
            
            <ul> 
            <li className='w-full mb-4 h-12'>
              <Link
                to="/dashboard/tasks"
                className={`flex items-center group p-2 text-sm font-medium rounded-lg transition-300 hover:bg-[#E8DEF8] ${isActive(
                    "/dashboard/tasks"
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
                    stroke={location.pathname === "/dashboard/tasks" ? "#FFFFFF" : "#65558F"}

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
                    stroke={location.pathname === "/dashboard/tasks" ? "#FFFFFF" : "#65558F"}

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
                  <p className='md:text-sm xl:text-sm 2xl:text-lg font-normal group-hover:text-[#4F378A]'>
                  Tasks
                  </p>
                </span>
                   </div>
                   
                   {/* Add Task Button 
                   <div className='flex items-center rounded-full p-2 hover:bg-[#F7F2FA] ' 
                  style={{ boxShadow: '2px 2px 8.5px rgba(13, 39, 80, 0.16), -8px -8px 13.5px rgba(255,255,255,1) ' }} 
                  onClick={() => setIsTaskInputVisible(!isTaskInputVisible)}>
                  
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke={location.pathname === "/dashboard/tasks" ? "#FFFFFF" : "#65558F"}

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
                      stroke={location.pathname === "/dashboard/tasks" ? "#FFFFFF" : "#65558F"}

                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#65558F] icon-large"
                    >
                      <path d="M9 2v16" strokeLinecap="round"></path>
                      <path d="M2 9h16" strokeLinecap="round"></path>
                    </svg>


                 </div>
                 */}

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
                  <Link to={`/dashboard/tasks/${task.id}`} className={`flex group items-center text-sm font-medium rounded-lg hover:bg-[#E8DEF8] ${isActive(
                  `/dashboard/tasks/${task.id}`
                )}`}>
                  <span className="ml-2 px-3 py-3 md:text-xs xl:text-xs 2xl:text-sm   font-normal truncate max-w-[200px] block group-hover:text-[#4F378A]">
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
                          stroke={location.pathname === `/dashboard/tasks/${task.id}` ? "#FFFFFF" : "#65558F"}

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

        
            <ul>

            <li className='w-full h-12 mt-4'>
              <Link
                to="/dashboard/analytics"
                className={`flex items-center group  p-3 text-sm font-medium rounded-lg transition-300 hover:bg-[#E8DEF8]  ${isActive(
                  "/dashboard/analytics"
                )}`}
              >
                <div className='flex px-1 items-center '>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#65558F" 
                  stroke={location.pathname === "/dashboard/analytics" ? "#FFFFFF" : "#65558F"}

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
                  stroke={location.pathname === "/dashboard/analytics" ? "#FFFFFF" : "#65558F"}
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
                  <p className='mmd:text-sm xl:text-sm 2xl:text-lg  font-normal group-hover:text-[#4F378A]'>
                  Stats
                  </p>
                </span>

                </div>
               
              </Link>
            </li>
        

            
            

            </ul>
            </>
            )}
          
            
        </nav>
        </div>

        </div>
    </div>
  )
}

export default Sidebar