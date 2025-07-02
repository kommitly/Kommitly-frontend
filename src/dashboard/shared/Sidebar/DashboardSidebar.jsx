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


const DashboardSidebar = ({ isCollapsed, setIsCollapsed }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const { goalId } = useParams();
    const { taskId } = useParams();
    const location = useLocation();
  
    const [selected, setSelected] = useState("Home");
    const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isLg = useMediaQuery(theme.breakpoints.only("lg"));
    const isXl = useMediaQuery(theme.breakpoints.only("xl"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const isXxl = useMediaQuery(theme.breakpoints.only("2xl"));




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
      backgroundColor: `#4F378A !important`,
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
      ? (isXs ? "0px" : isSm ? "80px" : isMd ? "70px" : isLg ? "80px" : isXl ? "120px" : "80px")
      : (isXs ? "220px" : isSm ? "158px" : isMd ? "215px" : isLg ? "230px" : isXl ? "320px" : isXxl ? "200px" : "280px"),
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

           <div className=' flex flex-col '>
             <Menu iconShape="square"
            rootStyles={{
              [`.${menuClasses.SubMenu}`]: {
                backgroundColor: "#4F378A",
              },
              [`.${menuClasses.subMenuContent}`]: {
                backgroundColor:" #4F378A",
              },

              [`.${menuClasses.button}`]: {
                color: colors.primary[100],
                backgroundColor: "#4F378A",
                width: "96%",
                marginBottom: isCollapsed ? (
                  isXs ? "0px" : isSm ? "0px" : isMd ? "0px" : isLg ? "0px" : isXl ? "20px" : "0px"
                ) : (   
                  isXs ? "0px" : isSm ? "0px" : isMd ? "0px" : isLg ? "0px" : isXl ? "20px" : "0px"
                ),
               

                
                '&:hover': {
                  backgroundColor: "#6D5BA6",
                 
                },
              },
              [`.${menuClasses.icon}`]: {
                color: colors.primary[100],
                marginRight: isCollapsed ? (
                  isXs ? "0px" : isSm ? "0px" : isMd ? "0px" : isLg ? "0px" : isXl ? "100px" : "100px"
                ) : (
                  isXs ? "10px" : isSm ? "10px" : isMd ? "10px" : isLg ? "10px" : isXl ? "10px" : isXxl ? "10px" : "10px"
                ),
          
              marginLeft: isCollapsed ? (
                isXs ? "0px" : isSm ? "0px" : isMd ? "0px" : isLg ? "0px" : isXl ? "16px" : "0px"
              ) : (
                isXs ? "10px" : isSm ? "10px" : isMd ? "0px" : isLg ? "0px" : isXl ? "10px" : isXxl ? "10px" : "10px"
              ),
             
            },

              [`.${menuClasses.label}`]: {
                color: colors.primary[100],
                 fontSize: "0.8rem", // base font size
                [theme.breakpoints.up("md")]: {
                  fontSize: "0.8rem",
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
  icon={isCollapsed ?  <div style={{backgroundColor: colors.primary[100], padding: "5px", borderRadius: "24%"}}>
                                    <img src={logo} alt="Kommitly Logo" style={{ width: "20px", height: "20px" }} />
                                  </div> : undefined}
  sx={{
    backgroundColor: hover ? "transparent" : "transparent",
    margin: "0rem",
    marginTop: "1rem",
    marginBottom: {
      xs: "1.4rem",
      sm: "1.4rem",
      md: "1.4rem",
      lg: "0.4rem",
      xl: "0.4rem",
      
    }
    

   


  

  }}
>

                        {!isCollapsed && (
                            <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width={"100%"}
                            
                         
                            >
                                <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                  <div style={{backgroundColor: colors.primary[100], padding: "5px", borderRadius: "24%"}}>
                                    <img src={logo} alt="Kommitly Logo" className='md:w-4 md:h-4 xl:w-4 xl:h-4 2xl:w-8 2xl:h-8  w-4 h-4' />
                                  </div>
                                  <p className=' 2xl:text-3xl lg:text-xl ' style={{ fontFamily: "Fredoka", color:colors.primary[100], fontWeight: 500,  }}>
                                    Kommitly

                                </p>
                                </div>
                                <button onClick={()=> setIsCollapsed(!isCollapsed)} sx={{alignItems: "center", color: colors.primary[100]}}>
                                    {isCollapsed ? (
                                        <MenuOutlinedIcon/>
                                    ) : (
                                        <ArrowBackIcon  color={"#F6F3F3"} sx={{
  cursor: "pointer",

 }} />
                                    )}
                                </button>

                            </Box>
                        )}
                    </MenuItem>
               
                    {/*MENU ITEMS */}
                    <Box paddingLeft={isCollapsed ? "4%" : "4%"}>
                      <MenuItem 
                      onClick={() => {
                        navigate("/dashboard/home");
                        setSelected("Home");
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
                            title="Stats"
                           
                            
                            onClick={() => {
                                navigate("/dashboard/analytics");
                                setSelected("Stats");
                            }}
                            icon={selected === "Stats" ? <LeaderboardIcon sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",
  md: "1.5rem",     
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} /> : <LeaderboardOutlinedIcon sx={{fontSize:{
  xs: "1.5rem",
  sm: "1.5rem",   
  md: "1.5rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "1.5rem",
  },
 }} />}
                            
                            active={selected === "Stats"}
                        >
                          Stats
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
                 top: '80%',
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