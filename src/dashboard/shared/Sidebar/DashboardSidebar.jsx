import React, { useContext , useEffect, useState} from 'react';
import { Sidebar, Menu, MenuItem , SubMenu, sidebarClasses, menuClasses,useProSidebar } from "react-pro-sidebar";

import {Box, IconButton, Typography, useTheme} from '@mui/material';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import { ColorModeContext, tokens } from "../../../theme";
import { GoalsContext } from '../../../context/GoalsContext';
import { createGoal, createTask, deleteGoalById, deleteAiGoalById, deleteTaskById} from '../../../utils/Api';
import { TasksContext } from '../../../context/TasksContext';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContatcsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MenuIcon from '@mui/icons-material/Menu';
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import  LightModeOutlinedIcon  from "@mui/icons-material/LightModeOutlined";
import  DarkModeOutlinedIcon  from "@mui/icons-material/DarkModeOutlined";
import { color, hover, motion } from "framer-motion";
import { AnimatePresence } from 'framer-motion';
import {  X } from "lucide-react"; // or use any icons you prefer
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import FlagIcon from '@mui/icons-material/Flag';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import logo from '../../../assets/logo.svg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RiCalendarScheduleLine } from "react-icons/ri";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { HiOutlineTemplate } from "react-icons/hi";
import { HiTemplate } from "react-icons/hi";
import { useSidebar } from '../../../context/SidebarContext';


const Item = ({title, to, icon, selected, setSelected}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  

    return (
        <MenuItem
         active={selected===title} 
         style={{color: colors.primary[100],
        }} 
         onClick={()=> setSelected(title)} 
         icon={icon}
         >
        <Typography>{title}</Typography>
        <Link to={to}/>
        </MenuItem>
    );

};


const DashboardSidebar = () => {
    const { isCollapsed, setIsCollapsed} = useSidebar();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const { goalId } = useParams();
    const { taskId } = useParams();
    const location = useLocation();
  
    const [selected, setSelected] = useState("Home");
    const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isLg = useMediaQuery(theme.breakpoints.only("lg"));
    const isXl = useMediaQuery(theme.breakpoints.down("xl"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const isXxl = useMediaQuery(theme.breakpoints.only("xxl"));
    const isXxxl = useMediaQuery(theme.breakpoints.up("xxl"));




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
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  // {  useEffect(() => {
  //       setIsCollapsed(isSm);
  //     }, [isSm]);


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
<Box
className=""
sx={{
  width: isCollapsed
    ? (isXs ? "0px" : isSm ? "80px" : isMd ? "80px" : isLg ? "80px" : isXl ? "80px" : "80px")
    : (isXs ? "220px" : isSm ? "220px" : isMd ? "230px" : isLg ? "240px" : isXl ? "280px" : "220px")

}}

>


    
            
<Sidebar
  collapsed={isCollapsed}
  rootStyles={{
    [`.${sidebarClasses.container}`]: {
      backgroundColor: `${colors.background.sidebar} !important`,
      height: isCollapsed ? "98vh" : "98vh",
      borderRadius: isCollapsed ? '12px' : '12px',
      border: 'none',
      paddingTop: isCollapsed ? (
        isXs ? "0px" : isSm ? "0px" : isMd ? "0px" : isLg ? "0px" : isXl ? "20px" : "0px"
      ) : (
        isXs ? "0px" : isSm ? "0px" : isMd ? "0px" : isLg ? "0px" : isXl ? "20px" : "0px" 

      ),
    
      position: isMobile ? 'absolute' : 'fixed',
      top: '0',
      left: isMobile ? (isCollapsed ? '-100%' : '0') : '0',
      zIndex: 2000,
      transition: 'left 0.3s ease-in-out, width 0.3s ease-in-out',
      width: isCollapsed
      ? (isXs ? "0px" : isSm ? "80px" : isMd ? "80px" : isLg ? "80px" : isXl ? "80px" : "110px")
      : (isXs ? "220px" : isSm ? "220px" : isMd ? "215px" : isLg ? "230px" : isXl ? "300px" : isXxl ? "300px" : isXxxl ? "400px" :   "300px"),
      overflow: 'hidden',
      margin: '8px',
      boxShadow: isCollapsed
        ? `
          inset 0px 4px 4px rgba(43, 24, 89, 0.15),
          -8px 0px 12px rgba(43, 24, 89, 0.10),
          0px 8px 12px rgba(43, 24, 89, 0.50)
        `
        : 'none',
    },
  }}
>

           <div className='md:mt-4 mt-2 p-4  md:p-0 flex flex-col '>
             <Menu iconShape="square"
            rootStyles={{
              [`.${menuClasses.SubMenu}`]: {
                backgroundColor: `${colors.background.sidebar} `,
              },
              [`.${menuClasses.subMenuContent}`]: {
                backgroundColor:`${colors.background.sidebar} `,
                borderRadius: "12px",
                marginLeft: isCollapsed ? (
                isXs ? "0px" : isSm ? "0px" : isMd ? "4px" : isLg ? "0px" : isXl ? "0px" : "0px"
              ) : (
                isXs ? "20px" : isSm ? "10px" : isMd ? "0px" : isLg ? "0px" : isXl ? "0px" : isXxl ? "0px" : "0px"
              ),
                inset: "0px auto auto 10px !important",

              },

              [`.${menuClasses.button}`]: {
                color: colors.primary[100],
                backgroundColor: `${colors.background.sidebar} `,
                width: "100%",
                marginBottom: isCollapsed ? (
                  isXs ? "0px" : isSm ? "0px" : isMd ? "0px" : isLg ? "0px" : isXl ? "20px" : "20px"
                ) : (   
                  isXs ? "0px" : isSm ? "0px" : isMd ? "0px" : isLg ? "0px" : isXl ? "20px" : "20px"
                ),
                paddingY: "4px",
                paddingLeft: isCollapsed ? (
                  isXs ? "0px" : isSm ? "20px" : isMd ? "10px" : isLg ? "10px" : isXl ? "20px" : isXxl ? "20px":  isXxxl ? "20px": "20px"
                ) : (   
                  isXs ? "0px" : isSm ? "20px" : isMd ? "10px" : isLg ? "20px" : isXl ? "20px" : "20px"
                ),

                
                '&:hover': {
                  backgroundColor: "#6D5BA6",
                 
                },
              },
              [`.${menuClasses.icon}`]: {
                color: colors.primary[100],
                marginRight: isCollapsed ? (
                  isXs ? "0px" : isSm ? "0px" : isMd ? "0px" : isLg ? "0px" : isXl ? "10px" : "10px"
                ) : (
                  isXs ? "0px" : isSm ? "0px" : isMd ? "10px" : isLg ? "10px" : isXl ? "10px" : isXxl ? "10px" : "10px"
                ),
          
              marginLeft: isCollapsed ? (
                isXs ? "0px" : isSm ? "0px" : isMd ? "4px" : isLg ? "0px" : isXl ? "10px" : "10px"
              ) : (
                isXs ? "10px" : isSm ? "10px" : isMd ? "0px" : isLg ? "0px" : isXl ? "10px" : isXxl ? "10px" : "10px"
              ),
             
            },

              [`.${menuClasses.label}`]: {
                color: colors.primary[100],
                 fontSize: "0.8rem", // base font size
                [theme.breakpoints.up("md")]: {
                  fontSize: "0.9rem",
                },
                [theme.breakpoints.up("xl")]: {
                  fontSize: "1.2rem",
                },
            
                '&:hover': {
                  backgroundColor: "transparent",
                },
              },
              
              
            }}

  menuItemStyles={{
    button: ({ level, active, disabled }) => {
      if (level !== 0) {
        return { 
          color: disabled ? '#ffffff' : '#ffffff',
          backgroundColor: active ? '#000000' : 'transparent', // submenu background color
          borderRadius: '5px',
        
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          justifyItems: 'center',
          
        };
      } else {
        return {
        
          borderRadius: '5px',
          color: disabled ? '#ffffff' : '#ffffff',// submenu text color
          backgroundColor: active ? '#000000' : 'transparent', // submenu background color
        };
      }
    },
  }}>
                    {/* LOGO AND MENU ICON */}
                    <MenuItem 
  onClick={() => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    console.log("isCollapsed:", newValue);
  }}
  icon={isCollapsed ?  <div>
                                    <svg width="32" height="54" viewBox="0 0 64 109" fill="none" xmlns="http://www.w3.org/2000/svg">
     
                                            <path d="M31.3536 23.1342C34.3679 23.1342 37.323 24.3064 39.7619 26.4697L58.6992 43.2663C61.2882 45.5627 61.723 49.9273 59.6425 52.7347L47.2048 69.5176L1.9344 25.0352C1.2727 24.385 1.63573 23.1344 2.48617 23.1344L31.3536 23.1342Z" fill='#10D3F1'/>
                                            <path d="M43.4496 73.9714C44.652 72.3814 44.4661 69.8997 43.0416 68.5204L28.0595 54.0145L2.18288 88.8602C1.92488 89.2077 2.14331 89.7605 2.53851 89.7605L12.0044 89.7609L28.486 89.761C30.4094 89.761 32.2284 88.8057 33.4972 87.1284L43.4496 73.9714Z" fill='#20A0E6' stroke= '#10D3F1'/>
                                          </svg>
                                  </div> : undefined}
  style={{
    backgroundColor: hover ? "transparent" : "transparent",
    marginLeft: isCollapsed ? (
      isXs ? "0px" : isSm ? "10px" : isMd ? "10px" : isLg ? "12px" : isXl ? "10px" : "10px"
    ) : (
      isXs ? "0px" : isSm ? "0px" : isMd ? "0px" : isLg ? "2px" : isXl ? "0px" : "0px"
    ),
   
   
 
    
    marginBottom: isCollapsed ? (
      isXs ? "0px" : isSm ? "20px" : isMd ? "20px" : isLg ? "20px" : isXl ? "20px" : "20px"
    ) : (
      isXs ? "0px" : isSm ? "20px" : isMd ? "20px" : isLg ? "20px" : isXl ? "20px" : "20px"
    ),  

    

   


  

  }}
>

                        {!isCollapsed && (
                            <div
                            className='flex justify-between items-center w-full'
                          
                            
                            
                         
                            >
                                <div  style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                  <div  >
                                    <svg width="32" height="54" viewBox="0 0 64 109" fill="none" xmlns="http://www.w3.org/2000/svg">
     
                                            <path d="M31.3536 23.1342C34.3679 23.1342 37.323 24.3064 39.7619 26.4697L58.6992 43.2663C61.2882 45.5627 61.723 49.9273 59.6425 52.7347L47.2048 69.5176L1.9344 25.0352C1.2727 24.385 1.63573 23.1344 2.48617 23.1344L31.3536 23.1342Z" fill='#10D3F1'/>
                                            <path d="M43.4496 73.9714C44.652 72.3814 44.4661 69.8997 43.0416 68.5204L28.0595 54.0145L2.18288 88.8602C1.92488 89.2077 2.14331 89.7605 2.53851 89.7605L12.0044 89.7609L28.486 89.761C30.4094 89.761 32.2284 88.8057 33.4972 87.1284L43.4496 73.9714Z" fill='#20A0E6' stroke= '#10D3F1'/>
                                          </svg>
                                  </div>
                                  <p className=' 2xl:text-2xl xl:text-lg lg:text-lg text-lg ' style={{ color:colors.primary[100], fontWeight: 500,  }}>
                                    Kommitly

                                </p>
                                </div>
                                <button onClick={()=> setIsCollapsed(!isCollapsed)} sx={{alignItems: "center", color: colors.primary[100]}}>
                                    {isCollapsed ? (
                                        <MenuOutlinedIcon/>
                                    ) : (
                                        <ArrowBackIcon  sx={{
                                          color: colors.primary[300],
                                        cursor: "pointer",

                                      }} />
                                    )}
                                </button>

                            </div>
                        )}
                    </MenuItem>
               
                    {/*MENU ITEMS */}
                    <Box sx={{marginTop: "1rem ", margin: "0.6rem"}} >
                      <MenuItem 
                      onClick={() => {
                        navigate("/dashboard/home");
                        setSelected("Home");
                        if (!isCollapsed) setIsCollapsed(true);
                        
                      }}
                      title='Home'
                      icon={selected === "Home" ? <HomeIcon  sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",
  md: "1.5rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },

 }}  /> : <HomeOutlinedIcon sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",
  md: "1.5rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }}/>}
                      active={selected === "Home"} >
                      Home
                      </MenuItem>
                      
                       
                        <SubMenu 
                        
                            icon={selected === "Goals" ? <FlagIcon sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",
  md: "1.5rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} /> : <OutlinedFlagIcon sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",
  md: "1.5rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} />}
                            title="Goals"
                            label="Goals"
                            active={selected === "Goals"}
                            onClick={() => {
                              navigate("/dashboard/goals"); // navigate to the goals page
                              setSelected("Goals");
                              setMenuVisible(!menuVisible); // optionally keep this if you want to toggle the submenu
                             
                            }}
                    
                            style={{ color: colors.primary[100] }}
                          
                            >
                            {recentAiGoals?.map((goal)=> (
                                <MenuItem
                                    key={goal.id}
                                    onClick={() => {
                                        navigate(`/dashboard/ai-goal/${goal.id}`);
                                        setSelected(goal.title);
                                        if (!isCollapsed) setIsCollapsed(true);
                                    }}

                                    active={selected === goal.title}
                                    style={{ color: colors.primary[100] }}
                                >
                                    {goal.title}
                                </MenuItem>
                            ))}
                       

                        </SubMenu>
                        <SubMenu
                            icon={ selected === "Tasks" ? <AssignmentIcon sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",
  md: "1.5rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} /> : <AssignmentOutlinedIcon sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",
  md: "1.5rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} />}
                            title="Tasks"
                            label="Tasks"
                            active={selected === "Tasks"}
                            onClick={() => {
                              navigate("/dashboard/tasks"); // navigate to the tasks page
                              setSelected("Tasks");
                              setTaskMenuVisible(!taskMenuVisible); // optionally keep this if you want to toggle the submenu
                            }}
                    
                            style={{ color: colors.primary[100] }}
                         
                        >
                            {displayedTasks?.map((task) => (
                                <MenuItem
                                    key={task.id}
                                    onClick={() => {
                                        navigate(`/dashboard/tasks/${task.id}`);
                                        setSelected(task.title); // optionally track specific task
                                        if (!isCollapsed) setIsCollapsed(true);
                                    }}
                                    active={selected === task.title}
                                    style={{ color: colors.primary[100] }}
                                >
                                    {task.title}
                                </MenuItem>
                            ))}

                        </SubMenu>


                        <MenuItem 
                            title="Calendar"
                            
                            onClick={() => {
                                navigate("/dashboard/calendar");
                                setSelected("Calendar");
                                if (!isCollapsed) setIsCollapsed(true);
                            }}
                            icon={selected === "Calendar" ? <CalendarMonthIcon sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",
  md: "1.5rem",     
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} /> : <CalendarMonthOutlinedIcon sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",   
  md: "1.5rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} />}
                            
                            active={selected === "Calendar"}
                          
                        >
                          Calendar
                          </MenuItem>

                             <MenuItem 
                            title="Routine"
                           
                            
                            onClick={() => {
                                navigate("/dashboard/routine");
                                setSelected("Routine");
                                if (!isCollapsed) setIsCollapsed(true);
                            }}
                            icon={selected === "Routine" ? <RiCalendarScheduleFill size={24}  sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",
  md: "1.5rem",     
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} /> : <RiCalendarScheduleLine size={24}  sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",   
  md: "1.5rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} />}
                            
                            active={selected === "Routine"}
                        >
                         Routine
                          </MenuItem>

                           <MenuItem 
                            title="Templates"
                           
                            
                            onClick={() => {
                                navigate("/dashboard/templates");
                                setSelected("Templates");
                                if (!isCollapsed) setIsCollapsed(true);
                            }}
                            icon={selected === "Templates" ? <HiTemplate size={24}  sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",
  md: "1.5rem",     
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} /> : <HiOutlineTemplate size={24}  sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",   
  md: "1.5rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} />}
                            
                            active={selected === "Templates"}
                        >
                          Templates
                          </MenuItem>
                    
                       
                  
                     
                       

                    
                       
                  

                    </Box>

                </Menu>
             {!isCollapsed ?  (
               <Box 
               sx={{justifyContent: "center",
                 display: "flex",
                 alignItems: "center",
                 padding: "10px 15px",
                 marginBottom: "15px",
                 position: "absolute", 
                 top: '85%',
                 left: "25%",
               }}>
         <Box
   sx={{
     position: "relative",
     marginRight: "10px",
     width: "80px",
     height: "32px",
     padding: "5px",
     borderRadius: "100px",
     backgroundColor: "#6D5BA6",
     color: colors.primary[100],
     cursor: "pointer",
     overflow: "hidden",
     transition: "background-color 0.3s",
     "&:hover": {
       backgroundColor: colors.primary[500],
     },
   }}
   onClick={colorMode.toggleColorMode}
 >
   <motion.div
     key={theme.palette.mode}
     initial={{ x: theme.palette.mode === "dark" ? 0 : 0 }} // start at position
     animate={{ x: theme.palette.mode === "dark" ? 50 : 0 }} // move to right or left
     transition={{ type: "spring", stiffness: 300, damping: 25 }}
     style={{
       position: "absolute",
       top: "15%",
       left: 8,
       transform: "translateY(-50%)",
     }}
   >
     {theme.palette.mode === "dark" ? (
       <DarkModeOutlinedIcon />
     ) : (
       <LightModeOutlinedIcon className='text-[#FFF82A]' />
     )}
   </motion.div>
 </Box>
 
 
               </Box>) : (
                    <Box 
                    sx={{justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 15px",
                      marginBottom: "15px",
                      position: "absolute", 
                      top: '80%',
                      left: {
                        xs: "8%",
                        sm: "8%",
                        md: "8%",
                        lg: "8%",
                        xl: "22%",
                      
                      },
                    }}>

                 <IconButton onClick = {colorMode.toggleColorMode}>
                 {theme.palette.mode === "dark" ? (
                     <DarkModeOutlinedIcon/>
                 ): (
                     <LightModeOutlinedIcon className='text-[#FFF82A]'/>
 
                 )}
                 
             </IconButton>
             </Box>
               )}
           </div>
            </Sidebar>

          
            

        </Box>
    )
}

export default DashboardSidebar;