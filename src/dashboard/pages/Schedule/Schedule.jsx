import React, { useEffect, useState, useContext } from "react";
import {
  createRoutine,
  fetchRoutines,
  fetchRoutineById,
  updateRoutineById,
  deleteRoutineById,
  fetchTasks

} from "../../../utils/Api";
import { GoalsContext } from "../../../context/GoalsContext";
import { tokens } from "../../../theme";
import {Box, Button, Backdrop,Typography,TextField,useTheme, IconButton, Select,
  MenuItem,
  InputLabel,
  FormControl} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SlidingButton2 from '../../components/SlidingButton2';
import { Divider } from '@mui/material';



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
  const [selectedOption, setSelectedOption] = useState("Add from collection");
  const [newRoutine, setNewRoutine] = useState({ title: "", description: "" });
  const { goals } = useContext(GoalsContext);
  const aiGoals = goals.ai_goals || [];
  const [selected, setSelected] = useState("");
  

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
    const payload = {
      ...newRoutine,
      linked_task: type === "task" ? selectedOption : null,
      linked_ai_subtask: type === "ai_subtask" ? selectedOption : null,
    };
    const routine = await createRoutine(payload);
    setRoutines((prev) => [...prev, routine]);
    setNewRoutine({ title: "", description: "" });
    setType("new");
    setSelectedOption(null);
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
   <div className='w-full  flex min-h-screen md:px-4 px-0'>
      

      <div className="w-full h-full overflow-y-auto  ">
        
        
        <div className=' mt-4  w-full  p-2'>
       <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={open}
              onClick={handleClose}
            >
              <div className="md:w-4/12 w-11/12 p-6 rounded-lg shadow-lg text-center" onClick={(e) => e.stopPropagation()} style={{backgroundColor: colors.menu.primary}} >
            
                  
                  {/* Create Form */}
      <form onSubmit={handleCreate} className="  gap-2">
        <div className="w-full flex gap-4 items-center justify-between ">
                   <div className="w-full -mt-4">
                     <SlidingButton2
      options={["Add from collection", "Add new task"]}
      selected={selectedOption}
      onChange={setSelectedOption}
    />
                   </div>
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
          <div className="w-full flex justify-center mb-6">
   
  </div>
   <p
          className="w-full mb-1 font-semibold text-lg"
          style={{ color: colors.text.secondary }}
        >
          {selectedOption}
        </p>

          <Divider orientation="horizontal" sx={{ borderColor: "#767676", opacity: 0.8 }} />
        
         
       {selectedOption === "Add new task" ? (
    <>
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={newRoutine.title}
        onChange={(e) => setNewRoutine((prev) => ({ ...prev, title: e.target.value }))}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={newRoutine.description}
        onChange={(e) => setNewRoutine((prev) => ({ ...prev, description: e.target.value }))}
        margin="normal"
      />
    </>
  ) : (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="routine-type-label">Link Routine To</InputLabel>
        <Select
          labelId="routine-type-label"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="task">Task</MenuItem>
          <MenuItem value="ai_subtask">AI Subtask</MenuItem>
        </Select>
      </FormControl>

      <div className="mt-4">
        <label className="block mb-2 text-black capitalize">Select {type}</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full border text-black rounded px-2 py-1"
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
      
    </>
  )}



        <button
          type="submit"
          className="text-white px-4 py-2 mt-4  text-white rounded-lg"
          style={{backgroundColor: colors.primary[500]}}
        >
          Add
        </button>
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
            <span style={{ fontWeight: 'bold' }}>Description:</span> {selectedRoutine.subtask_template_description}
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
            value={formData.reminder_time || ''}
            onChange={(e) => handleChange('reminder_time', e.target.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleUpdate}
            sx={{
              backgroundColor: colors.primary[400],
              color: 'white',
              '&:hover': {
                backgroundColor: colors.primary[400],
                opacity: 0.8
              }
            }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteRoutine(selectedRoutine.id)}
            sx={{
              backgroundColor: colors.background.warning,
              color: 'white',
              '&:hover': {
                backgroundColor: colors.background.warning,
                opacity:50
              }
            }}
          >
            Delete
          </Button>
          </Box>
          </div>
        </div>
      )}
      
              
              
            
              </div>
          
          </Backdrop>
      
             <div className="mb-[30px]  w-full justify-between flex">
                        <Typography 
                        variant="h3" 
                        color={colors.text.primary} 
                        fontWeight="bold" 
                        
                        >Routines</Typography>
                       {/* { <Button variant="contained">
                          View in Calendar
                        </Button>} */}
                         <Button variant="contained"  onClick={()=> {
                                                        setOpen(true)
                                                      }} >
                          Create Routine
                        </Button>
                    
                </div>

                
    
      
      
    


     

      {/* Routines List */}
      {loading ? (
        <p>Loading routines...</p>
      ) : (
        <ul className="space-y-2 md:flex gap-4 w-full">
  {routines.map((routine) => {
    const { timeline, cleanedDetails } = extractTimeline(routine.subtask_template_description);

    const getParts = (desc) => {
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
        className="flex md:w-1/3 w-full justify-between items-center p-3"
      >
        <div
          className="p-5 rounded-xl shadow-md flex flex-col justify-between"
          style={{
            backgroundColor: colors.primary[500],
            color: colors.primary[100],
          }}
        >
          <div className="py-4">
            <h3 className="text-lg font-semibold">
              {routine.subtask_template_title}
            </h3>
            <p className="text-sm mt-2 opacity-90">
              {text} 
            </p>
          </div>
          <button
            onClick={() => {
              handleFetchById(routine.id);
              setOpenRoutine(true);
            }}
            className="rounded-lg mt-4 p-2 border transition-all duration-300 cursor-pointer"
            style={{
              borderColor: colors.background.paper,
              color: colors.background.default,
            }}
            onMouseEnter={(e) => {
              e.target.style.color = colors.background.paper;
              e.target.style.boxShadow = `0 0 12px ${colors.background.default}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = colors.background.default;
              e.target.style.boxShadow = "none";
            }}
            onMouseDown={(e) => {
              e.target.style.boxShadow = `0 0 20px ${colors.background.default}`;
              e.target.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.target.style.boxShadow = `0 0 12px ${colors.background.default}`;
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
