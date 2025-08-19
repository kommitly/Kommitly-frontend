import React from "react";
import { IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import moment from "moment-timezone";
import Snackbar from '@mui/material/Snackbar';
import { AuthContext } from '../../../context/AuthContext';
import { useState, useEffect, useRef, useContext } from "react";
import {fetchTasks, fetchGoals, updateAiSubtaskById, updateTaskById } from "../../../utils/Api";
import { DialogContent, TextField } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {Box, List, ListItem, ListItemText, Typography, useTheme} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SearchResults from './SearchResults';
import CheckIcon from '@mui/icons-material/Check';
import MuiAlert from '@mui/material/Alert';



const Calender = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentEvents, setCurrentEvents] = useState([]);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const {user, logout} = useContext(AuthContext);
    const [eventData, setEventData] = useState({ title: "", date: "" });
    const searchRef = useRef(null);
    const filterMenuRef = useRef(null);
    const [searchType, setSearchType] = useState(""); // "goal" or "task"
    const [searchQuery, setSearchQuery] = useState(""); // User's search input
    const [title, setTitle] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [filteredResults, setFilteredResults] = useState([]);
    const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isLg = useMediaQuery(theme.breakpoints.only("lg"));
    const isXl = useMediaQuery(theme.breakpoints.only("xl"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
    const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));
    const dropdownRef = useRef(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [selectedDateInfo, setSelectedDateInfo] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dueDate, setDueDate] = useState("");
    const [dueTime, setDueTime] = useState("");
    const goals = [
    ...(user?.goals?.map(goal => ({ ...goal, is_ai_goal: false })) || []),
    ...(user?.ai_goals?.map(goal => ({ ...goal, is_ai_goal: true })) || [])
  ];
  const tasks = [...(user?.tasks || []), ...(user?.ai_goals.ai_tasks || [])];


  const handleDateClick = (selected) => {
  setSelectedDateInfo(selected);
  setOpen(true);
  selected.view.calendar.unselect();
};

// Add this handler inside Calendar
const handleTaskSelect = (task) => {
   if (selectedDateInfo) {
    setSelectedTask(task);
    setDueDate(selectedDateInfo.startStr.split("T")[0]); // just the date part
  }

   

   
  
};

const handleUpdateTask = async () => {
  if (selectedTask && dueDate && dueTime) {
    const localDateTime = `${dueDate}T${dueTime}`;
    const getTimezone = () => {
   return localStorage.getItem('Timezone');
    };

    const userTimezone = getTimezone();

    const finalDueDateTime = moment.tz(localDateTime, userTimezone).utc().format();



    const updatedTask = {
      ...selectedTask,
      due_date: finalDueDateTime,
    };

  

    try {

      console.log("Updating task:", selectedTask.id, finalDueDateTime);


      // 🔹 Call backend API
      await updateTaskById(selectedTask.id, { due_date: finalDueDateTime });

 // ✅ Update instead of adding duplicate
      setCurrentEvents((prev) =>
        prev.map((event) =>
          event.id === `task-${updatedTask.id}`
            ? { ...event, start: finalDueDateTime, end: finalDueDateTime }
            : event
        )
      );


      // Close dialog + reset
      setOpen(false);
      
      setSelectedTask(null);
      setDueDate("");
      setDueTime("");
      setOpenSnackbar(true);

    } catch (error) {
      console.error("Failed to update task:", error);
      // You could show a toast/snackbar here to notify the user
    }
  }
};



const handleSaveGoal = () => {
  if (selectedDateInfo && title) {
    const calendarApi = selectedDateInfo.view.calendar;
    calendarApi.addEvent({
      id: `${selectedDateInfo.dateStr}-${title}`,
      title,
      start: selectedDateInfo.startStr,
      end: selectedDateInfo.endStr,
      allDay: selectedDateInfo.allDay,
    });
    setTitle("");
    setSelectedDateInfo(null);
    setOpen(false);
  }
};
    
      const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget); // Open the menu
      };
    
      const handleFilterClose = () => {
        setFilterAnchorEl(null); // Close the menu
      };
    
      const handleSearchType = (type) => {
        setSearchType(type); // Set the search type to "goal" or "task"
        setFilterAnchorEl(null); // Close the menu
      };
    
    

  const handleClose = () => {
      setOpen(false);
    };

    const calendarHeight = isSmallScreen ? '50vh' : '75vh';

    useEffect(() => {
  const getEvents = async () => {
    try {
      const [taskList, goalData] = await Promise.all([fetchTasks(), fetchGoals()]);
      console.log("Fetched tasks:", taskList);
        console.log("Fetched goals:", goalData);

      const taskEvents = taskList
        .filter(task => task.status === "pending" && task.due_date)
        .map(task => ({
          id: `task-${task.id}`,
          title: task.title,
          start: task.due_date,
          end: task.due_date,
         
        }));

      const subtaskEvents = goalData.ai_goals.flatMap(goal =>
  (goal.ai_tasks || []).flatMap(task =>
    (task.ai_subtasks || [])
      .filter(subtask => subtask.status === "pending" && subtask.due_date)
      .map(subtask => {
         const localISOString = subtask.due_date.replace(/Z$/, ''); // Remove the 'Z'

  const start = new Date(localISOString);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour


          return {
        id: `subtask-${subtask.id}`,
        title: subtask.title,
        start: start,
        end: end,
        allDay: false,
        extendedProps: {
          taskId: task.id,   // ✅ now in scope
          goalId: goal.id    // ✅ now in scope
        }
      };
      }))
      
  
  
);

        console.log("Task events:", taskEvents);
        console.log("Subtask events:", subtaskEvents);


      setCurrentEvents([...taskEvents, ...subtaskEvents]);
    } catch (err) {
      console.error("Failed to load calendar events:", err);
    }
  };

  getEvents();
}, []);



 useEffect(() => {
  const handleClickOutside = (event) => {
    
  
    const clickedInsideSearch =
      searchRef.current && searchRef.current.contains(event.target);

    const clickedFilterMenu =
      filterMenuRef.current && filterMenuRef.current.contains(event.target);

    // If click is outside both search and filter menus
    if (!clickedInsideSearch && !clickedFilterMenu) {
      // Step 1: Clear the search results
      setFilteredResults([]);

      // Step 2: Collapse search bar after a short delay (e.g., 100ms)
      setTimeout(() => {
        setIsSearchExpanded(false);
      }, 100); 
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


    
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query.");
      return;
    }
  
    let results = [];
  
    if (searchType === "goal") {
      results = goals.filter(goal =>
        goal.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (searchType === "task") {
      results = tasks
        .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(task => ({ ...task, is_task: true })); // Ensure is_task is true
    } 
    else {
      results = [
        ...goals.filter(goal => goal.title.toLowerCase().includes(searchQuery.toLowerCase())),
        ...tasks
          .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(task => ({ ...task, is_task: true })) // Ensure is_task is true for tasks
      ];
    }
  
    if (results.length > 0) {
      setFilteredResults(results);
      
    } else {
      setFilteredResults([]);
      alert("No matching results found.");
    }
  };





  const formatDate = (date) => {
  if (!date) return "No date";
  try {
    const d = new Date(date);
    if (isNaN(d)) return "Invalid date";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch (err) {
    console.error("Date formatting error:", err, date);
    return "Invalid date";
  }
};



// const handleDateClick = (selected) => {
//   setOpen(true);

//   const calendarApi = selected.view.calendar;
//   calendarApi.unselect();

//     if(title) {
//       calendarApi.addEvent({
//         id: `${selected.dateStr}-${title}`,
//         title,
//         start: selected.startStr,
//         end: selected.endStr,
//         allDay: selected.allDay,


//     });
// }
// };

const handleMenuOpen = (event, evt) => {
  setAnchorEl(event.currentTarget);
  setSelectedEvent(evt);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setSelectedEvent(null);
};

const handleMarkAsDone = async () => {
  if (selectedEvent.id.startsWith("task-")) {
    await updateTaskById(selectedEvent.id.split("-")[1], { status: "completed" });
  } else if (selectedEvent.id.startsWith("subtask-")) {
    const [_, taskId, subtaskId] = selectedEvent.id.split("-");
    await updateAiSubtaskById(taskId, subtaskId, { status: "completed" });
  }
  handleMenuClose();
  window.location.reload(); // or refresh data
};


const handleDelete = async () => {
  try {
    if (selectedEvent.id.startsWith("task-")) {
      const taskId = selectedEvent.id.split("-")[1];
      await deleteTaskById(taskId);
    } else if (selectedEvent.id.startsWith("subtask-")) {
      const subtaskId = selectedEvent.id.split("-")[1];
      await deleteAiSubtaskById(subtaskId);
    }

    // Remove the deleted event from local state
    setCurrentEvents((prevEvents) =>
      prevEvents.filter((e) => e.id !== selectedEvent.id)
    );

    handleMenuClose();
  } catch (error) {
    console.error("Failed to delete event:", error);
  }
};

const handleReschedule = () => {
  setShowRescheduleDialog(true);
  handleMenuClose();
};

  const handleEventClick = ({ event }) => {
  const eventId = event.id;

  if (eventId.startsWith('task-')) {
    const taskId = eventId.split('-')[1];
    navigate(`/dashboard/tasks/${taskId}`);
  } else if (eventId.startsWith('subtask-')) {
    const subtaskId = eventId.split('-')[1];
    const taskId = event.extendedProps?.taskId || ''; // taskId must be included in event
    const goalId = event.extendedProps?.goalId || ''; // goalId must be included in event
    navigate(`/dashboard/ai-goal/${goalId}/task/${taskId}/subtask/${subtaskId}`);
  }
};

    return (
        <Box m="20px">
            <Header title="CALENDAR" subtitle="" />
            <div className="flex flex-col-reverse md:flex-row justify-between gap-4">
                {/*CALENDAR SIDEBAR */}
                <Box 
                flex={isSmallScreen ? 'none' : '1 1 40%'}
                backgroundColor = {colors.background.paper}
                p="15px"
                borderRadius="8px"
                width="100%"
                height="auto"
                overflow="hidden"
                >
                    <Typography variant="h4" sx={{color: colors.text.primary}}>Events</Typography>
                    <List overflowY="auto"  sx={{ maxHeight: 'calc(100% - 50px)', overflowY: 'auto', marginTop: '10px' ,   '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
    '-ms-overflow-style': 'none', // IE, Edge
    'scrollbar-width': 'none', // Firefox
    }}
    >
                        {currentEvents.length === 0 ? (
    <Typography sx={{ padding: '10px', color: colors.text.secondary }}>
      No scheduled events
    </Typography>
  ) : (
    currentEvents
  .slice() // make a shallow copy to avoid mutating state directly
  .sort((a, b) => new Date(b.start) - new Date(a.start)) // newest first
  .map((event) => (
  <ListItem
  key={event.id}
  sx={{
    backgroundColor: colors.background.default,
    margin: "10px 0",
    borderRadius: "8px",
    color: colors.text.primary,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: "2px",
    paddingRight: "10px",
  }}
>
  {/* Left section: title, time, and View button */}
  <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
    <ListItemText
      primary={event.title}
      primaryTypographyProps={{
        fontSize: '0.9rem',
        fontWeight: 500,
        color: colors.text.primary,
        margin: "0px"
      }}
      secondaryTypographyProps={{
        fontSize: '0.65rem',
        fontWeight: 400,
        color: colors.text.placeholder,
        marginY: '4px',
      }}
      secondary={formatDate(event.start)}
    />
<div
className="w-full  flex justify-center "
>
      <Button
      size="small"
      sx={{
        alignSelf: 'start',
        marginBottom: '4px',
        textTransform: 'none',
        fontSize: '0.65rem',
        border: "1px solid #4F378A",
        width:"100%"
      }}
     onClick={() => handleEventClick({ event })}

    >
      View Event
    </Button>
</div>
  </Box>

  {/* Right section: More icon */}
  <MoreVertIcon
    sx={{
      color: colors.text.secondary,
      marginLeft: 'auto',
      cursor: 'pointer',
      marginTop: "10px"
    }}
    onClick={(e) => handleMenuOpen(e, event)}
  />
</ListItem>

))
  )}

                    </List>
                    <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
>
  <MenuItem onClick={handleMarkAsDone}>Mark as Done</MenuItem>
  <MenuItem onClick={handleReschedule}>Reschedule</MenuItem>
  <MenuItem onClick={handleDelete}>Delete</MenuItem>
</Menu>

<Dialog open={showRescheduleDialog} onClose={() => setShowRescheduleDialog(false)}>
  <DialogTitle>Reschedule Task</DialogTitle>
  <DialogActions>
    <Button onClick={() => setShowRescheduleDialog(false)}>Cancel</Button>
    <Button onClick={() => {
      console.log("You can now open a date picker here.");
      setShowRescheduleDialog(false);
    }}>Continue</Button>
  </DialogActions>
</Dialog>


                </Box>

                  <Backdrop
                        sx={(theme) => ({ color: colors.menu.primary, zIndex: theme.zIndex.drawer + 1 })}
                        open={open}
                        onClick={handleClose}
                      >
                        <div className=" md:w-4/12 w-11/12  p-6 rounded-lg shadow-lg text-center"
                        style={{backgroundColor: colors.menu.primary,}}
                        onClick={(e) => e.stopPropagation()} // ⬅ stop the click from closing 
                        >
                       
                            
                            
                            <div className="w-full flex justify-between items-center">
                            <div className="w-full">  
                              <h1 className='text-xl font-bold  m-4 flex items-center justify-center gap-2' style={{color: colors.text.secondary}}>
                              Add Task
                            </h1></div>
                            
                             <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="cursor-pointer"
               onClick={handleClose} 
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>  
            </div>
                           
                           

                              <div
                                          className=" col-span-6 md:col-span-6   flex w-full   "
                                          style={{
                                            paddingRight: isXs ? 4: isSm ? 4 : isMd ? 6 : isLg ? 4 : isXl ? 5 : isXxl ? 5 : 4,
                                            marginBottom: isXs ? 16: 8
                                          }
                                          
                                          }
                                         
                                        >
                                          <motion.div
                                            ref={searchRef}
                                            initial={{ justifyContent: "center", alignItems: "center" }}
                                            animate={{
                                              width: isSearchExpanded ? "100%" : undefined,
                                              height: isSearchExpanded ? undefined : undefined,
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                            
                                            transition={{ duration: 0.3 }}
                                            className={`rounded-full bg-[#F4F1FF]  w-8 h-8                    
                                            sm:w-10 sm:h-10            // small
                                            md:w-6 md:h-6            // medium
                                            lg:w-8 lg:h-8            // large
                                            xl:w-9 xl:h-9           // extra large
                                            2xl:w-12 2xl:h-12
                                            3xl:w-12 3xl:h-12
                                             ${isSearchExpanded ? 'w-full' : ''}`}
                                            style={{ backgroundColor: colors.background.paper, overflow:"visible" }}
                                            onMouseEnter={() => setIsSearchExpanded(true)}
                                          
                                            
                                          >
                                        
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: isSearchExpanded ? "100%" : 0, opacity: isSearchExpanded ? 1 : 0, }}
                                            transition={{ duration: 0.3 }}
                                             className="overflow-hidden flex items-center gap-2 flex-grow "
                                          >
                                            <IconButton  onClick={handleFilterClick}>
                                              <FilterListOutlinedIcon sx={{ fontSize: {
                                                         xs: "20px",  // extra-small screens
                                                      sm: "16px",  // small screens
                                                     md: "20px",  // medium screens
                                                      lg: "20px",  // large screens
                                                      xl: "28px",  // extra-large screens
                                                      
                                                    }, color: colors.primary[500] }} />
                                            </IconButton>
                                        
                                            <Menu ref={filterMenuRef} anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose} className="mt-1">
                                                <MenuItem
                                                  onClick={() => handleSearchType("goal")}
                                                  selected={searchType === "goal"}
                                                  className='gap-4 flex items-center '
                                                >
                                                  Goal
                                                  {searchType === "goal" && (
                                                    <CheckIcon sx={{ fontSize: 16, color: colors.primary[500] }} />
                                                  )}
                                                </MenuItem>
                                                <MenuItem
                                                  onClick={() => handleSearchType("task")}
                                                  selected={searchType === "task"}
                                                  className='gap-4 flex items-center '
                                                >
                                                  Task
                                                  {searchType === "task" && (
                                                    <CheckIcon sx={{ fontSize: 16,  color: colors.primary[500] }} />
                                                  )}
                                                </MenuItem>
                                              </Menu>
                                        
                                            <TextField
                                              variant="standard"
                                              placeholder={`Search ${searchType || "goals or tasks"}`}
                                              value={searchQuery}
                                              onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setIsSearchExpanded(true);
                                              }}
                                              onFocus={() => setIsSearchExpanded(true)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  handleSearch();
                                                }
                                              }}
                                              InputProps={{
                                                disableUnderline: true,
                                              sx: { color: colors.text.primary, fontSize: {
                                                        xs: "12px",  // extra-small screens
                                                        sm: "10px",  // small screens
                                                        md: "12px",  // medium screens
                                                        lg: "12px",  // large screens
                                                        xl: "18px",  // extra-large screens
                                                } },
                                              }}
                                              className="bg-transparent  outline-none text-sm  w-full"
                                           
                                            />
                                          </motion.div>
                                            
                                            {/* Search Icon - Always Visible */}
                                         <div className='flex items-center justify-center h-full w-9 md:w-10 2xl:w-12'>
                                            <div className={`${isSearchExpanded ? 'justify-end w-auto ' : 'justify-center w-full' } flex items-center h-full transition-all duration-300 ease-in-out`}
                            >
                                            <SearchIcon  onClick={handleSearch} sx={{fontSize: {
                                                       xs: "20px",  // extra-small screens
                                                      sm: "16px",  // small screens
                                                      md: "20px",  // medium screens
                                                      lg: "20px",  // large screens
                                                      xl: "28px",  // extra-large screens
                                                      
                                                    },
                                                    color: colors.primary[500] }}/>
                            
                                           </div>
                                         </div>
                                              
                                           
                                        
                                          
                                        
                                            <SearchResults
                                                      results={filteredResults || []}
                                                    
                                                      
                                                    
                                                      onClose={() => setFilteredResults([])}
                                                      onSelectTask={handleTaskSelect}
                                                    />
                                          </motion.div>
                                        </div>

                                        {selectedTask && (
  <div className="mb-4 text-left">
    <p className="font-semibold mb-8 " style={{color: colors.text.secondary}}>{selectedTask.title}</p>

    <div className="flex flex-col gap-4 mt-2">
      {/* Date (pre-filled from calendar) */}
      <TextField
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
     
      />

      {/* Time (user sets manually) */}
      <TextField
        label="Due Time"
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
    </div>
  </div>
)}


                            <button 
                                 onClick={handleUpdateTask}
                                className="mt-4 px-4 py-2 bg-[#6200EE] text-white rounded-lg"
                            >
                                UPDATE
                            </button>
                        </div>
                    
                    </Backdrop>
                     <Snackbar
                      open={openSnackbar}
                      autoHideDuration={3000}
                      onClose={() => setOpenSnackbar(false)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                      <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                        Event successfully updated!
                      </MuiAlert>
                    </Snackbar>

                {/*CALENDAR*/}
                <Box flex="1 1 100%" ml={isSmallScreen ? '5px' : '15px'} width={isSmallScreen ? '100%' : '100%'}>
                    <FullCalendar
                    height={calendarHeight}
                    width={isSmallScreen ? '80%' : '100%'} // Adjusted width based on isSmallScreen
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                        listPlugin
                    ]}
                    headerToolbar={{
                        left: isSmallScreen ? '' : "prev,next today", // Hide navigation buttons on small screens
                        center: "title",
                        right: isSmallScreen ? '' : "dayGridMonth,timeGridWeek,timeGridDay,listMonth", // Hide view buttons on small screens
                      }}
                    initialView="dayGridMonth"
                    editable ={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    select={handleDateClick}
                    eventClick={handleEventClick}
                   // eventsSet={(events) => setCurrentEvents(events)}
                    events={currentEvents}
                    
                    />
                </Box>

            </div>
        </Box>
    );

};

export default Calender;