import React from "react";
import { IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from "react";
import {fetchTasks, fetchGoals, updateAiSubtaskById, updateSingleTaskStatus } from "../../../utils/Api";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {Box, List, ListItem, ListItemText, Typography, useTheme} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import useMediaQuery from "@mui/material/useMediaQuery";



const Calender = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentEvents, setCurrentEvents] = useState([]);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
    const navigate = useNavigate();


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
          allDay: true,
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



    const handleDateClick = (selected) => {
        const title =prompt("Please enter a new title for your event");
        const calendarApi = selected.view.calendar;
        calendarApi.unselect();

        if(title) {
            calendarApi.addEvent({
                id: `${selected.dateStr}-${title}`,
                title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.allDay,


            });
        }
    };
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
    await updateSingleTaskStatus(selectedEvent.id.split("-")[1], { status: "completed" });
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
                    <List overflowY="auto"  sx={{ maxHeight: 'calc(100% - 50px)', overflowY: 'auto', marginTop: '10px' }}>
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
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
className="w-full flex justify-center "
>
      <Button
      size="small"
      sx={{
        alignSelf: 'start',
        marginBottom: '4px',
        textTransform: 'none',
        fontSize: '0.85rem',
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
                {/*CALENDAR*/}
                <Box flex="1 1 100%" ml={isSmallScreen ? '5px' : '15px'}>
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