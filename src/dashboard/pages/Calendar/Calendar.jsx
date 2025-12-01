import React from "react";
import { IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogActions } from "@mui/material";
import Button from "../../components/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import moment from "moment-timezone";
import Snackbar from '@mui/material/Snackbar';
import { AuthContext } from '../../../context/AuthContext';
import { useState, useEffect, useRef, useContext, useMemo } from "react";
import {fetchTasks, fetchGoals, updateAiSubtaskById, updateTaskById, createTask, deleteTaskById, deleteAiSubtaskById } from "../../../utils/Api";
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
import Switch from '@mui/material/Switch';
import Empty from "../../components/Empty";
import { FaPlus } from "react-icons/fa6";
import ReusableFormModal from "../../components/ReusableFormModal"


const Calender = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentEvents, setCurrentEvents] = useState([]);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState(null);
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
    const [openCompletedTaskSnackbar, setOpenCompletedTaskSnackbar] = useState(false);
    const [openNewSnackbar, setOpenNewSnackbar] = useState(false);
    
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [selectedDateInfo, setSelectedDateInfo] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dueDate, setDueDate] = useState("");
    const [reminderEnabled, setReminderEnabled] = useState(true); // default ON
 
    const [dueTime, setDueTime] = useState("");
    const goals = [
    ...(user?.goals?.map(goal => ({ ...goal, is_ai_goal: false })) || []),
    ...(user?.ai_goals?.map(goal => ({ ...goal, is_ai_goal: true })) || [])
  ];
  const tasks = [...(user?.tasks || []), ...(user?.ai_goals.ai_tasks || [])];

  const fields = [
  { name: "title", label: "Title", type: "text" },
  { name: "dueDate", label: "Date", type: "date" },
  { name: "dueTime", label: "Time", type: "time" },
 
];
const [formData, setFormData] = useState({
  title: "",
  dueDate: "",
  dueTime: "",
  reminderOption: "",
  customReminderTime: "",
});

  const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};



  const label = { inputProps: { 'aria-label': 'Reminder switch ' } };

const handleDateClick = (selected) => {
  setSelectedDateInfo(selected);

  const dateStr = selected.startStr || selected.dateStr;   // <-- FIX
  if (dateStr) {
    setDueDate(dateStr.split("T")[0]);
  }

  setDueTime("");
  setOpen(true);

  if (selected.view?.calendar) {
    selected.view.calendar.unselect();
  }
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


const handleAddNewTask = async () => {
  const { title, dueDate, dueTime, reminderOption, customReminderTime } = formData;

  // VALIDATION
  if (!title) {
    alert("Please enter title!");
    return;
  }

  if (!dueDate) {
    alert("Please select a due date!");
    return;
  }

  try {
    // 1. DUE DATE: Combine date and time into a local ISO-like string (e.g., "2025-12-01T16:46")
    // This string does not contain 'Z' or a timezone offset, so the backend interprets it
    // based on its default settings (often as UTC, or as a naive local timestamp).
    const dueDateTime = `${dueDate}T${dueTime || "00:00"}`; 

    // REMINDER
    let reminderTime = null;

    if (reminderEnabled) {
      if (reminderOption !== "custom") {
        const [hrs, mins] = reminderOption.split(":").map(Number);
        
        // 2. REMINDER TIME (BEFORE/OFFSET): Calculate the time by subtracting the offset locally.
        // We use the basic moment object and manipulate it to get the resulting time string.
        // NOTE: This assumes the subtraction logic is solely concerned with hours/minutes.
        // This relies on Moment.js parsing the string as local time.
        const reminderMoment = moment(dueDateTime) // Parse as local time
          .subtract(hrs, "hours")
          .subtract(mins, "minutes");

        // Format only the time component (HH:mm:ss)
        reminderTime = reminderMoment.format("HH:mm:ss"); 
      } else {
        // 3. REMINDER TIME (CUSTOM): The custom time is already a local time string.
        // We just need to ensure it's in the correct 'HH:mm:ss' format.
        // Since customReminderTime is from a <TextField type="time">, it's already 'HH:mm'.
        reminderTime = `${customReminderTime}:00`; 
      }
    }

    // CREATE TASK
    const newTask = await createTask({
      title,
      due_date: dueDateTime, // Sending the local ISO string
      reminder_time: reminderTime // Sending the local time string
    });

    console.log("Task created:", newTask);

    addTask(newTask);

    // Update current events using the local date string for the calendar display
    setCurrentEvents((prev) => [
      ...prev,
      {
        id: `task-${newTask.id}`,
        title: newTask.title,
        start: dueDateTime, // Use the local date string for the calendar
        end: dueDateTime,
        allDay: false,
      },
    ]);

    // RESET
    setOpen(false);
    setFormData({
      title: "",
      dueDate: "",
      dueTime: "",
      reminderOption: "00:30",
      customReminderTime: "09:00"
    });
    setReminderEnabled(true);

    setOpenNewSnackbar(true);

  } catch (error) {
    console.error("Error creating task:", error);
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
  try {
    if (selectedEvent.id.startsWith("task-")) {
      await updateTaskById(selectedEvent.id.split("-")[1], { status: "completed" });
    } else if (selectedEvent.id.startsWith("subtask-")) {
      const subtaskId = selectedEvent.id.split("-")[1];
      await updateAiSubtaskById(subtaskId, { status: "completed" });
    }
   // ✅ Remove event from state instead of reloading
    setCurrentEvents(prevEvents =>
      prevEvents.filter(event => event.id !== selectedEvent.id)
    );

    handleMenuClose();
    setOpenCompletedTaskSnackbar(true);
  } catch (err) {
    console.error("Failed to mark as done:", err);
  }
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


const selectedDayEvents = React.useMemo(() => {
  if (!selectedDateInfo) return [];

  const selectedDate = moment(selectedDateInfo.startStr).format("YYYY-MM-DD");

  return currentEvents.filter(evt => {
    const evtDate = moment(evt.start).format("YYYY-MM-DD");
    return evtDate === selectedDate;
  });
}, [selectedDateInfo, currentEvents]);


    return (
        <div className="m-[20px] pt-4">
             <div className="mb-[30px]  w-full justify-between flex">
                        <Typography 
                        variant="h3" 
                        color={colors.text.primary} 
                        fontWeight="bold" 
                        
                        >CALENDAR</Typography>
                       {/* { <Button text="  View Routines" onClick={() => navigate("/dashboard/schedule")}/>
                        } */}

                        <Button text="Add event"
                       onClick={handleDateClick}
                       ><FaPlus /></Button>
                      


                        
                    
                </div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
               
                  <Backdrop
                        sx={(theme) => ({ color: colors.menu.primary, zIndex: theme.zIndex.drawer + 1 })}
                        open={open}
                        onClick={handleClose}
                      >
                        <div className=" md:w-4/12 w-11/12 h-auto p-6 rounded-lg shadow-lg text-center"
                        style={{backgroundColor: colors.menu.primary,}}
                        onClick={(e) => e.stopPropagation()} // ⬅ stop the click from closing 
                        >
                       
                      
 
// In Calender.jsx, where you render ReusableFormModal

<ReusableFormModal
  open={open}
  onClose={handleClose}
  title="New Event"
  fields={fields} // This only contains title, date, time now
  formData={formData}
  onChange={handleChange}
  onSubmit={handleAddNewTask}
  colors={colors}
>
  {/* 1. REMINDER TOGGLE (Your desired TOP element) */}
  <div className="flex justify-between items-center mt-2">
    <span style={{ color: colors.text.primary }}>Reminder</span>
    <Switch
      checked={reminderEnabled}
      onChange={(e) => setReminderEnabled(e.target.checked)}
    />
  </div>

  {/* 2. REMINDER OPTION DROPDOWN (Now rendered after the Toggle) */}
  {reminderEnabled && ( // Optionally hide the select if reminder is disabled
    <TextField
      select
      fullWidth
      label="Reminder Time" // This was the label of your old fields item
      name="reminderOption"
      value={formData.reminderOption || "00:30"} // Ensure a default value is set
      onChange={handleChange}
      margin="normal"
    >
      {/* Recreate the options from your original fields array */}
      <MenuItem value="00:05">5 minutes before</MenuItem>
      <MenuItem value="00:10">10 minutes before</MenuItem>
      <MenuItem value="00:30">30 minutes before</MenuItem>
      <MenuItem value="01:00">1 hour before</MenuItem>
      <MenuItem value="custom">Custom…</MenuItem>
    </TextField>
  )}

  {/* 3. CUSTOM REMINDER */}
  {reminderEnabled && formData.reminderOption === "custom" && (
    <TextField
      fullWidth
      type="time"
      label="Custom Reminder"
      name="customReminderTime"
      value={formData.customReminderTime}
      onChange={handleChange}
      margin="normal"
      InputLabelProps={{ shrink: true }}
    />
  )}
</ReusableFormModal>

    






                            
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
                     <Snackbar
                      open={openNewSnackbar}
                      autoHideDuration={3000}
                      onClose={() => setOpenNewSnackbar(false)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                      <MuiAlert onClose={() => setOpenNewSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                        Event successfully updated!
                      </MuiAlert>
                    </Snackbar>

                     <Snackbar
                      open={openCompletedTaskSnackbar}
                      autoHideDuration={3000}
                      onClose={() => setOpenCompletedTaskSnackbar(false)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                      <MuiAlert onClose={() => setOpenCompletedTaskSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                        Event marked as completed!
                      </MuiAlert>
                    </Snackbar>

                {/*CALENDAR*/}
                <Box flex="1 1 100%" mr={isSmallScreen ? '5px' : '15px'} width={isSmallScreen ? '100%' : '100%'}>
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
                   // select={handleDateClick}
                    eventClick={handleEventClick}
                   // eventsSet={(events) => setCurrentEvents(events)}
                    events={currentEvents}
                    
                    />
                </Box>

                 {/*CALENDAR SIDEBAR */}
                <Box 
                flex={isSmallScreen ? 'none' : '1 1 50%'}
                mt={isSmallScreen ? '15px' : '0px'}
                backgroundColor = {colors.background.paper}
                p="15px"
                borderRadius="8px"
                width="100%"
                height="auto"
                overflow="hidden"
                >
                    <Typography variant="h4" sx={{color: colors.text.primary}}>Upcoming Events</Typography>
                    <List overflowY="auto"  sx={{ height: '100%', maxHeight: 'calc(100% - 50px)', overflowY: 'auto', marginTop: '10px' ,   '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
    '-ms-overflow-style': 'none', // IE, Edge
    'scrollbar-width': 'none', // Firefox
    }}
    >
                        {currentEvents.length === 0 ? (
    <div className="w-full flex justify-center items-center h-full">
      <div className="w-1/2 h-full">
      <Empty/>
    </div>
    </div>
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
  <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}  onClick={() => handleEventClick({ event })}>
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
  {/* {<MenuItem onClick={handleReschedule}>Reschedule</MenuItem>} */}
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


            </div>
        </div>
    );

};

export default Calender;