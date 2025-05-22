import React, { useContext , useEffect, useState} from 'react';
import { Sidebar, Menu, MenuItem , SubMenu, sidebarClasses, menuClasses,useProSidebar } from "react-pro-sidebar";

import {Box, IconButton, Typography, useTheme} from '@mui/material';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import { ColorModeContext, tokens } from "../../../theme";
import { GoalsContext } from '../../../context/GoalsContext';
import { createGoal, createTask, deleteGoalById, deleteAiGoalById, deleteTaskById} from '../../../utils/Api';
import { TasksContext } from '../../../context/TasksContext';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
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
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import  LightModeOutlinedIcon  from "@mui/icons-material/LightModeOutlined";
import  DarkModeOutlinedIcon  from "@mui/icons-material/DarkModeOutlined";
import { motion } from "framer-motion";
import { AnimatePresence } from 'framer-motion';


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
    const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } = useProSidebar();
 
    const [selected, setSelected] = useState("Dashboard");
    const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isLg = useMediaQuery(theme.breakpoints.only("lg"));
    const isXl = useMediaQuery(theme.breakpoints.only("xl"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
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

    useEffect(() => {
        setIsCollapsed(isSm);
      }, [isSm]);


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

>


    
            
<Sidebar
  collapsed={isCollapsed}
  rootStyles={{
    [`.${sidebarClasses.container}`]: {
      backgroundColor: `${colors.primary[500]} !important`,
      height: isCollapsed ? "98vh" : "98vh",
      borderRadius: isCollapsed ? '20px' : '24px',
      border: 'none',
      padding: isCollapsed ? '0px' : '10px',
      position: 'fixed',
      top: '0',
      left: isCollapsed ? '0' : '0',
      zIndex: 1000,
      transition: 'width 0.3s ease-in-out',
      width: isCollapsed
      ? (isXs ? "80px" : isSm ? "80px" : isMd ? "80px" : isLg ? "80px" : isXl ? "80px" : "80px")
      : (isXs ? "220px" : isSm ? "220px" : isMd ? "230px" : isLg ? "240px" : isXl ? "260px" : "220px"),
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

            <Menu iconShape="square"
            rootStyles={{
              [`.${menuClasses.button}`]: {
                color: colors.primary[100],
                backgroundColor: colors.primary[500],
                
                '&:hover': {
                  backgroundColor: colors.primary[400],
                },
              },
              [`.${menuClasses.subMenu}`]: {
                backgroundColor: colors.primary[500],
                color: colors.primary[100],
                '&:hover': {
                  backgroundColor: colors.primary[400],
                },
              },
              [`.${menuClasses.subMenuArrow}`]: {
                color: colors.primary[100],
              },
              [`.${menuClasses.subMenuIcon}`]: {
                color: colors.primary[100],
              },
              [`.${menuClasses.buttonActive}`]: {
                backgroundColor: colors.primary[600],
                color: colors.primary[100],
              },
              [`.${menuClasses.buttonDisabled}`]: {
                backgroundColor: colors.primary[500],
                color: colors.primary[100],
              },
              [`.${menuClasses.buttonIcon}`]: {
                color: colors.primary[100],
              },  
            }}

  menuItemStyles={{
    button: ({ level, active, disabled }) => {
      if (level !== 0) {
        return { 
          color: disabled ? '#ffffff' : '#ffffff',
          backgroundColor: active ? '#000000' : '#4F378A', 
          borderRadius: '5px',
          margin: '5px',
          
        };
      } else {
        return {
          margin: '5px',
          borderRadius: '5px',
          color: disabled ? '#ffffff' : '#ffffff',// submenu text color
          backgroundColor: active ? '#000000' : '#4F378A', // submenu bg color (adjust as needed)
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
  icon={isCollapsed ? <MapOutlinedIcon /> : undefined}
  style={{
    margin: "5px 0 20px 0",
    color: colors.primary[100],
  }}
>

                        {!isCollapsed && (
                            <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width={"100%"}
                            >
                                <Typography variant="h3" color={colors.primary[100]}>
                                    Kommitly

                                </Typography>
                                <IconButton onClick={()=> setIsCollapsed(!isCollapsed)} sx={{alignItems: "center", border: "2px solid white",  color: colors.primary[100]}}>
                                    <MenuOutlinedIcon/>
                                </IconButton>

                            </Box>
                        )}
                    </MenuItem>
               
                    {/*MENU ITEMS */}
                    <Box paddingLeft={isCollapsed ? undefined : "0%"}>
                      <MenuItem 
                      onClick={() => {
                        navigate("/dashboard/home");
                        setSelected("Home");
                      }}
                      title='Home'
                      icon={<HomeOutlinedIcon/>}
                      active={selected === "Home"}>
                      Home
                      </MenuItem>
                       
                        <SubMenu 
                            icon={<PersonOutlinedIcon/>}
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
                            icon={<PeopleOutlinedIcon/>}
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
                            title="Stats"
                            
                            onClick={() => {
                                navigate("/dashboard/analytics");
                                setSelected("Stats");
                            }}
                            icon={<ReceiptOutlinedIcon/>}
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
     width: "100px",
     height: "40px",
     padding: "5px",
     borderRadius: "100px",
     backgroundColor: colors.primary[400],
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
       top: "25%",
       left: 8,
       transform: "translateY(-50%)",
     }}
   >
     {theme.palette.mode === "dark" ? (
       <DarkModeOutlinedIcon />
     ) : (
       <LightModeOutlinedIcon />
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
                      left: "15%",
                    }}>

                 <IconButton onClick = {colorMode.toggleColorMode}>
                 {theme.palette.mode === "dark" ? (
                     <DarkModeOutlinedIcon/>
                 ): (
                     <LightModeOutlinedIcon/>
 
                 )}
                 
             </IconButton>
             </Box>
               )}
            </Sidebar>

          
            

        </Box>
    )
}

export default DashboardSidebar;