import React, { useEffect, useState, useContext } from "react";
import { DateTime } from "luxon";
import {
  createRoutine,
  fetchRoutines,
  fetchRoutineById,
  updateRoutineById,
  deleteRoutineById,
  fetchTasks,
  createTask

} from "../../../utils/Api";
import { GoalsContext } from "../../../context/GoalsContext";
import { tokens } from "../../../theme";
import {Box, Backdrop,Typography,TextField,useTheme, IconButton, Select,
  MenuItem,
  InputLabel,
  FormControl} from "@mui/material";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SlidingButton2 from '../../components/SlidingButton2';
import { Divider } from '@mui/material';
import Empty from "../../components/Empty";



const extractTimeline = (description) => {
  if (!description) return { timeline: 'No detail available', cleanedDetails: description };

  //console.log('Details:', description); // Debugging

   // Updated regex to match time ranges and single values even without parentheses
   const match = description.match(/\b(\d+-\d+ (days|weeks|months|years)|\d+ (day|week|month|year)|On-going|Ongoing|\d+\s*(days|weeks|months|years))\b/i);

  //console.log('Match:', match); // Debugging

  const timeline = match ? match[1] : 'No timeline available';
  let cleanedDetails = match ? description.replace(match[0], '').trim() : description;

  // Remove empty parentheses
  cleanedDetails = cleanedDetails.replace(/\s*\(\s*\)\s*/g, '');

  return { timeline, cleanedDetails };
};



const Schedule = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [open, setOpen] = useState(false);
  const [openRoutine, setOpenRoutine] = useState(false);
  const [formData, setFormData] = useState(selectedRoutine || {});
  const [type, setType] = useState("task"); // "task" | "ai_subtask" | "new"
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Add new task");
  const [newRoutine, setNewRoutine] = useState({
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  frequency: "",
  custom_interval: "",
  custom_unit: "",
  reminder_time: "",
  time_of_day: "",
});
  const { goals } = useContext(GoalsContext);
  const aiGoals = goals.ai_goals || [];
  const [selected, setSelected] = useState("");
  const timezone = localStorage.getItem("Timezone");

  const convertToLocalTime = (utcTime) => {
  if (!utcTime) return "";
  return DateTime.fromISO(utcTime, { zone: "utc" })
    .setZone(timezone)
    .toFormat("HH:mm");
};
  

  // helper to find next unfinished subtask
    function findNextAiSubtask(goal) {
      const inProgressTask = goal.ai_tasks?.find((t) => t.status === "in-progress");
      if (!inProgressTask) return null;
  
      const nextSubtask = inProgressTask.ai_subtasks?.find((st) => !st.completed_at);
      if (!nextSubtask) return null;
  
      return {
        goalId: goal.id,
        goalTitle: goal.title,
        taskId: inProgressTask.id,
        taskTitle: inProgressTask.title,
        subtask: nextSubtask,
      };
    }
  
    const recommendations = aiGoals.map(findNextAiSubtask).filter(Boolean);
  
    // load options only when needed
    useEffect(() => {
      if (type === "task") {
        fetchTasks().then(setOptions);
      } else {
        setOptions([]); // reset for ai_subtask since we use recommendations
      }
    }, [type]);



  // Fetch routines on mount
  useEffect(() => {
    loadRoutines();
  }, []);



  const loadRoutines = async () => {
    try {
      setLoading(true);
      const data = await fetchRoutines();
      setRoutines(data);
    } catch (err) {
      console.error("Failed to load routines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (selectedRoutine) {
    setFormData(selectedRoutine);
  }
}, [selectedRoutine]);

const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

   const handleClose = () => {
    setOpen(false);
  };
   const handleCloseRoutine = () => {
    setOpenRoutine(false);
  };


  const handleCreate = async (e) => {
  e.preventDefault();

  try {
    let title = newRoutine.title?.trim() || null;
    let description = newRoutine.description?.trim() || null;

    if (type === "ai_subtask" && selected) {
      const selectedSubtask = recommendations
        .map((r) => r.subtask)
        .find((st) => st.id === Number(selected));

      if (selectedSubtask) {
        title = selectedSubtask.title || title;
        description = selectedSubtask.description || description;
      }
    }

    const payload = {
      subtask_template_title: title,
      subtask_template_description: description,
      start_date: newRoutine.start_date,
      end_date: newRoutine.end_date || null,
      frequency: newRoutine.frequency,
      custom_interval: newRoutine.custom_interval || null,
      custom_unit: newRoutine.custom_unit || null,
      reminder_time: newRoutine.reminder_time || null,
      time_of_day: newRoutine.time_of_day || null,
      ai_subtasks:
        type === "ai_subtask" && selected
          ? [selected]
          : [],
      subtasks: [],
      name: "Daily Routine",
      is_active: true,
    };

    console.log("FINAL PAYLOAD:", payload);
    const routine = await createRoutine(payload);

    setRoutines((prev) => [
      ...prev,
      {
        ...routine,
        linked_task_name: title,
        linked_ai_subtask_name: null,
      },
    ]);

    // reset form
    setNewRoutine({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      frequency: "",
      custom_interval: "",
      custom_unit: "",
      reminder_time: "",
      time_of_day: "",
    });
    setSelectedOption("Add new task");
    setType("task");
    setSelected("");
    setOpen(false);
  } catch (err) {
    console.error("Failed to create routine:", err);
  }
};




  const handleUpdate = async () => {
  try {
    await updateRoutineById(formData.id, formData); // your API
    setSelectedRoutine(formData); // update local detail
    // optionally reload routines list
  } catch (error) {
    console.error("Failed to update routine:", error);
  }
};


  const handleDelete = async (id) => {
    try {
      await deleteRoutineById(id);
      setRoutines((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete routine:", err);
    }
  };

  const handleFetchById = async (id) => {
    try {
      const routine = await fetchRoutineById(id);
      setSelectedRoutine(routine);
    } catch (err) {
      console.error("Failed to fetch routine by id:", err);
    }
  };

  return (
   <div className='w-full  flex min-h-screen md:px-2 px-2'>
      

      <div className="w-full h-full overflow-y-auto  ">
        
        
        <div className=' mt-4  w-full h-full p-2'>
       <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={open}
              onClick={handleClose}
            >
              <div className="md:w-8/12 w-11/12 h-10/12 md:h-auto md:ml-18  p-6 rounded-lg shadow-lg text-center" onClick={(e) => e.stopPropagation()} style={{backgroundColor: colors.menu.primary}} >
            
                    <div className="w-full -mt-4" style={{color: colors.text.primary}}>
                     <SlidingButton2
      options={["Add new task", "Add from collection"]}
      selected={selectedOption}
      onChange={setSelectedOption}
    />
                   </div>
                  {/* Create Form */}
      <form onSubmit={handleCreate} className="  gap-2">
      
          
   <p
          className="w-full mt-4 mb-1 font-semibold text-lg"
          style={{ color: colors.text.secondary }}
        >
          {selectedOption}
        </p>

          <Divider orientation="horizontal" sx={{ borderColor: "#767676", opacity: 0.8 }} />
        
         
       {selectedOption === "Add new task" ? (
    <>
     <div className="mb-2 gap-4 h-[50vh] md:h-auto overflow-y-auto flex flex-col md:flex-row w-full items-start justify-start mt-4">
      <div className="flex flex-col md:pr-8 md:border-r  w-full items-start justify-start" style={{borderColor: "#767676"}}>
      <label className="block mb-2 " style={{color: colors.text.primary}}>Task Title</label>
    <input
      value={newRoutine.title}
      onChange={(e) => setNewRoutine((prev) => ({ ...prev, title: e.target.value }))}
      placeholder="Enter new task title..."
      className="w-full border   rounded px-2 py-1"
      style={{borderColor: "#767676", color: colors.text.primary}}
    />
      <label className="block mb-2 mt-4" style={{color: colors.text.primary}}>Description</label>
    <textarea
      value={newRoutine.description}
      onChange={(e) => setNewRoutine((prev) => ({ ...prev, description: e.target.value }))}
      placeholder="Enter task description..."
      className="w-full border  rounded px-2 py-1"
      style={{borderColor: "#767676", color: colors.text.primary }}
    />
    <div className="w-full gap-4 flex">
       {/* Start Date */}
            <div className="w-full flex flex-col justify-start items-start">
              <label className="block mb-2 mt-4" style={{color: colors.text.primary}}>Start Date</label>
            <input
              type="date"
              value={newRoutine.start_date}
              onChange={(e) =>
                setNewRoutine((prev) => ({
                  ...prev,
                  start_date: e.target.value,
                }))
              }
              className="w-full border  rounded  py-1"
              style={{borderColor: "#767676", color: colors.text.primary}}
            />
            </div>
             {/* End Date */}
           <div className="w-full flex flex-col justify-start items-start">
             <label className="block  mb-2 mt-4" style={{color: colors.text.primary}}>End Date</label>
            <input
              type="date"
              value={newRoutine.end_date}
              onChange={(e) =>
                setNewRoutine((prev) => ({
                  ...prev,
                  end_date: e.target.value,
                }))
              }
              className="w-full  border rounded  py-1"
              style={{borderColor: "#767676", color: colors.text.primary}}
            />
           </div>
    </div>
    </div>
      <div className="flex flex-col  md:ml-4 w-full items-start justify-start">

             {/* Frequency */}
          <div className="w-full flex flex-col justift-start items-start ">
              <label className="block  mb-2" style={{color: colors.text.primary}}>Frequency</label>
            <select
              value={newRoutine.frequency}
              onChange={(e) =>
                setNewRoutine((prev) => ({
                  ...prev,
                  frequency: e.target.value,
                }))
              }
              className="w-full border rounded px-2"
              style={{borderColor: "#767676", color: colors.text.primary}}
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>

          </div>
            {/* Custom Interval (only show if frequency === custom) */}
            {newRoutine.frequency === "custom" && (
              <div className="flex gap-2 mt-2 w-full">
                <input
                  type="number"
                  min="1"
                  placeholder="Every..."
                  value={newRoutine.custom_interval || ""}
                  onChange={(e) =>
                    setNewRoutine((prev) => ({
                      ...prev,
                      custom_interval: e.target.value,
                    }))
                  }
                  className="w-1/2 border border-black rounded px-2 py-1"
                  style={{borderColor: "#767676", color: colors.text.primary}}
                />
                <select
                  value={newRoutine.custom_unit || ""}
                  onChange={(e) =>
                    setNewRoutine((prev) => ({
                      ...prev,
                      custom_unit: e.target.value,
                    }))
                  }
                  className="w-1/2  border rounded px-2 py-1"
                  style={{borderColor: "#767676", color: colors.text.primary}}
                >
                  <option value="">Select unit</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            )}

            {/* Reminder Time */}
            <label className="block  mb-2 mt-4" style={{color: colors.text.primary}}>Reminder Time</label>
            <input
              type="time"
              value={newRoutine.reminder_time}
              onChange={(e) =>
                setNewRoutine((prev) => ({
                  ...prev,
                  reminder_time: e.target.value,
                }))
              }
              className="w-full  border rounded px-2 py-1"
              style={{borderColor: "#767676", color: colors.text.primary}}
            />
             {/* Time of Day (optional) */}
            <label className="block  mb-2 mt-4" style={{color: colors.text.primary}}>Time of Day (Optional)</label>
            <input
              type="time"
              value={newRoutine.time_of_day || ""}
              onChange={(e) =>
                setNewRoutine((prev) => ({
                  ...prev,
                  time_of_day: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
              style={{borderColor: "#767676", color: colors.text.primary}}
            />

</div>
    </div>
     
    </>
  ) : (
    <>
    <div className="mb-2 gap-4 h-[50vh] md:h-auto overflow-y-auto flex flex-col md:flex-row w-full items-start justify-start mt-4">
      <div className="flex flex-col md:pr-8 md:border-r  w-full items-start justify-start" style={{borderColor: "#767676"}}>
      <div className="flex flex-col  w-full items-start justify-start" style={{color: colors.text.primary}}>

        <label className="block mb-2" >Link Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border mb-4 rounded px-2 py-1"
      >
        <option value="task">Task</option>
        <option value="ai_subtask">AI Subtask</option>
      </select>
    </div>

    <div className="flex flex-col w-full justify-start items-start mb-2 " style={{color: colors.text.primary}}>
      <label className="block mb-2 capitalize">Select {type}</label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full border mb-4 rounded px-2 py-1"
      >
        <option value="">None</option>
        {type === "ai_subtask"
          ? recommendations.map((r) => (
              <option key={r.subtask.id} value={r.subtask.id}>
                {r.goalTitle} → {r.taskTitle} → {r.subtask.title}
              </option>
            ))
          : options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.title}
              </option>
            ))}
      </select>
    </div>

    <div className="w-full gap-4 flex">
       {/* Start Date */}
            <div className="w-full flex flex-col justify-start items-start">
              <label className="block  mb-2 " style={{color: colors.text.primary}}>Start Date</label>
            <input
              type="date"
              value={newRoutine.start_date}
              onChange={(e) =>
                setNewRoutine((prev) => ({
                  ...prev,
                  start_date: e.target.value,
                }))
              }
              className="w-full border rounded  py-1"
              style={{borderColor: "#767676", color: colors.text.primary}}
            />
            </div>
             {/* End Date */}
           <div className="w-full flex flex-col justify-start items-start">
             <label className="block  mb-2" style={{color: colors.text.primary}}>End Date</label>
            <input
              type="date"
              value={newRoutine.end_date}
              onChange={(e) =>
                setNewRoutine((prev) => ({
                  ...prev,
                  end_date: e.target.value,
                }))
              }
              className="w-full border rounded  py-1"
              style={{borderColor: "#767676", color: colors.text.primary}}
            />
           </div>
           </div>

      </div>




     <div className="flex flex-col  md:ml-4 w-full items-start justify-start">

             {/* Frequency */}
          <div className="w-full flex flex-col justift-start items-start ">
              <label className="block  mb-2" style={{color: colors.text.primary}}>Frequency</label>
            <select
              value={newRoutine.frequency}
              onChange={(e) =>
                setNewRoutine((prev) => ({
                  ...prev,
                  frequency: e.target.value,
                }))
              }
              className="w-full  border rounded px-2"
              style={{borderColor: "#767676", color: colors.text.primary}}
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>

          </div>
            {/* Custom Interval (only show if frequency === custom) */}
            {newRoutine.frequency === "custom" && (
              <div className="flex gap-2 mt-2 w-full">
                <input
                  type="number"
                  min="1"
                  placeholder="Every..."
                  value={newRoutine.custom_interval || ""}
                  onChange={(e) =>
                    setNewRoutine((prev) => ({
                      ...prev,
                      custom_interval: e.target.value,
                    }))
                  }
                  className="w-1/2  border border-black rounded px-2 py-1"
                  style={{borderColor: "#767676", color: colors.text.primary}}
                />
                <select
                  value={newRoutine.custom_unit || ""}
                  onChange={(e) =>
                    setNewRoutine((prev) => ({
                      ...prev,
                      custom_unit: e.target.value,
                    }))
                  }
                  className="w-1/2  border rounded px-2 py-1"
                  style={{borderColor: "#767676", color: colors.text.primary}}
                >
                  <option value="">Select unit</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            )}

            {/* Reminder Time */}
            <label className="block  mb-2 mt-4" style={{color: colors.text.primary}}>Reminder Time</label>
            <input
              type="time"
              value={newRoutine.reminder_time}
              onChange={(e) =>
                setNewRoutine((prev) => ({
                  ...prev,
                  reminder_time: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
              style={{borderColor: "#767676", color: colors.text.primary}}
            />
             {/* Time of Day (optional) */}
            <label className="block  mb-2 mt-4" style={{color: colors.text.primary}}>Time of Day (Optional)</label>
            <input
              type="time"
              value={newRoutine.time_of_day || ""}
              onChange={(e) =>
                setNewRoutine((prev) => ({
                  ...prev,
                  time_of_day: e.target.value,
                }))
              }
              className="w-full  border rounded px-2 py-1"
              style={{borderColor: "#767676", color: colors.text.primary}}
            />

</div>




      </div>
  </>
  )}



       <div className="flex gap-4 mt-8 w-full">
         <button
          type="submit"
          className=" w-1/2 py-1 mt-4  text-white rounded-lg"
          style={{backgroundColor: colors.primary[500]}}
        >
          Add
        </button>
         <button
        
         onClick={handleClose}
          className=" border w-1/2 py-1 mt-4  rounded-lg"
          style={{color: colors.primary[500],
         
          borderColor: colors.primary[500],  textTransform: "none",
          "&:hover": {
            backgroundColor: colors.primary[500],
            color: colors.background.default,
          }
        }}
        >
          Close
        </button>
       </div>
      </form>
              
              
            
              </div>
          
          </Backdrop>

            <Backdrop
              sx={(theme) => ({  zIndex: theme.zIndex.drawer + 1 })}
              open={openRoutine}
              onClick={handleCloseRoutine}
            >
              <div className="md:w-6/12 w-11/12  rounded-lg " onClick={(e) => e.stopPropagation()} style={{backgroundColor: colors.menu.primary}} >
            
                  
                  {/* Selected Routine */}
      {selectedRoutine && (
        <div className="  ">
          

         
          <div className=" w-full flex py-2 justify-between items-center rounded-lg px-4" style={{backgroundColor: colors.background.default}}>

       <div className="w-full " >
         <p className="font-light" style={{color:colors.text.secondary}}>
          Routine Details
        </p>
        </div>
          <IconButton
          sx={{
            
            color: colors.text.subtitle,
          }}
          onClick={handleCloseRoutine}
        >
          <CloseIcon />
        </IconButton>
            </div>

        <div className="p-6">
           <Box >


            <Typography variant="h3" sx={{ color: colors.text.secondary, mb: 3 }}>
           {selectedRoutine.subtask_template_title}
          </Typography>

          {/* {<Typography variant="body1" sx={{ color: colors.text.primary, mb: 2 }}>
            <span style={{ fontWeight: 'bold' }}>Description:</span> {selectedRoutine.subsubtask_template_description}
          </Typography>} */}

          <Typography variant="body1" sx={{ color: colors.text.primary, mb: 2 }}>
            <span style={{ fontWeight: 'bold' }}>Routine Name:</span> {selectedRoutine.name}
          </Typography>

           
          

          <Typography variant="body1" sx={{ color: colors.text.primary, mb: 2 }}>
            <span style={{ fontWeight: 'bold' }}>Start Date:</span> {selectedRoutine.start_date}
          </Typography>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={formData.end_date || ''}
            onChange={(e) => handleChange('end_date', e.target.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

         <FormControl fullWidth margin="normal">
            <InputLabel>Frequency</InputLabel>
            <Select
              value={formData.frequency || ''}
              label="Frequency"
              onChange={(e) => handleChange('frequency', e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {formData.frequency === "custom" && (
  <Box>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="End Date"
        value={formData.end_date ? new Date(formData.end_date) : null}
        onChange={(newValue) => handleChange('end_date', newValue.toISOString().slice(0, 10))}
        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        minDate={new Date(formData.start_date)}
      />
    </LocalizationProvider>

    <TextField
      fullWidth
      label="Custom Interval (e.g., every X days)"
      type="number"
      value={formData.custom_interval || ''}
      onChange={(e) => handleChange('custom_interval', e.target.value)}
      margin="normal"
      sx={{ mt: 2 }}
    />

    <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
      <InputLabel>Custom Unit</InputLabel>
      <Select
        value={formData.custom_unit || ''}
        label="Custom Unit"
        onChange={(e) => handleChange('custom_unit', e.target.value)}
      >
        <MenuItem value="days">Days</MenuItem>
        <MenuItem value="weeks">Weeks</MenuItem>
        <MenuItem value="months">Months</MenuItem>
      </Select>
    </FormControl>
  </Box>
)}
          
           <TextField
            fullWidth
            label="Reminder Time"
            type="time"
            value={convertToLocalTime(formData.reminder_time) || ''}
            onChange={(e) => handleChange('reminder_time', e.target.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          <Button
          
            text="Update"
            onClick={handleUpdate}
           
          >
            <EditIcon />
          
          </Button>
          <Button
           
            onClick={(e) => {
            e.stopPropagation();
            handleDelete(selectedRoutine.id);
          }}

          className="bg-[#E60178] hover:bg-[#E60178]"
           

            text="Delete"
          >
            <DeleteIcon />
        
          </Button>
          </Box>
          </div>
        </div>
      )}
      
              
              
            
              </div>
          
          </Backdrop>
      
             <div className="    w-full justify-between flex">
                        <Typography 
                        variant="h2" 
                        color={colors.text.primary} 
                        fontWeight="bold" 
                        
                        >Routines</Typography>
                       {/* { <Button variant="contained">
                          View in Calendar
                        </Button>} */}
                         <Button  text="Create Routine" onClick={()=> {
                                                        setOpen(true)
                                                      }}  >
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
                          
                      
                    
                </div>

                
    
      
      
    


     

      {/* Routines List */}
      {loading ? (
        <div>
          <Loading/>
          </div>
      ) : routines.length === 0 ? (
  <div className="w-full  flex flex-col items-center justify-center h-[80vh] text-center">
   <Empty/>
   
  </div>
) : (
        <ul className="space-y-2 mt-10 md:flex gap-4  w-full">
  {routines.map((routine) => {
    const { timeline, cleanedDetails } = extractTimeline(
  routine.subsubtask_template_description || ""
);
    const getParts = (desc) => {
        if (!desc) return { text: "", timeline: "" }; // safety check
        const match = desc.split("**Timeline:**");
        return {
          text: match[0]?.trim(),
          timeline: match[1]?.trim() || "",
        };
      };

    const { text } = getParts(cleanedDetails);


    return (
      <li
        key={routine.id}
        className="flex md:w-1/3 w-full justify-between items-center"
      >
        <div
          className="p-5 rounded-4xl  w-full h-full shadow-md flex flex-col justify-between"
          style={{
            backgroundColor: colors.primary[500],
            color: colors.primary[100],
          }}
        >
          <div className="py-4">
            <h3 className="text-lg font-semibold">
              {routine.subtask_template_title}
            </h3>
            <p className="text-xs mt-2 opacity-90">
              {text || "No description"} 
            </p>
          </div>
          <button
            onClick={() => {
              handleFetchById(routine.id);
              setOpenRoutine(true);
            }}
            className="rounded-4xl mb-2 mt-4 p-2 border transition-all duration-300 cursor-pointer"
  style={{
    borderColor: "#D6CFFF",
    color: "#D6CFFF",
  }}
  onMouseEnter={(e) => {
    e.target.style.color = colors.background.paper;
    e.target.style.boxShadow = "0 0 12px #D6CFFF";
  }}
  onMouseLeave={(e) => {
    e.target.style.color = "#D6CFFF";
    e.target.style.boxShadow = "none";
  }}
  onMouseDown={(e) => {
    e.target.style.boxShadow = "0 0 20px #D6CFFF";
    e.target.style.transform = "scale(0.98)";
  }}
  onMouseUp={(e) => {
    e.target.style.boxShadow = "0 0 12px #D6CFFF";
    e.target.style.transform = "scale(1)";
  }}
>
  View
</button>
        </div>
      </li>
    );
  })}
</ul>

      )}

     
    </div>
    </div>
    </div>
    
  );
};

export default Schedule;
