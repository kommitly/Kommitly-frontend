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
import { useSidebar } from '../../../context/SidebarContext';



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
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebar();
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
          className="w-full flex justify-start mt-4 mb-1 font-semibold text-lg"
          style={{ color: colors.text.secondary }}
        >
          {selectedOption}
        </p>

        
         
       {selectedOption === "Add new task" ? (
    <>
     <div className="mb-2 gap-4 h-[54vh] md:h-auto overflow-y-auto flex flex-col md:flex-row w-full items-start justify-start mt-4">
      <div className="flex flex-col md:pr-8 md:border-r  w-full items-start justify-start" style={{borderColor: "#767676"}}>
      
      <TextField
      fullWidth
      label="Task Title"
      value={newRoutine.title}
      onChange={(e) => setNewRoutine((prev) => ({ ...prev, title: e.target.value }))}
      variant="outlined"
      InputLabelProps={{ style: { color: colors.text.primary } }}
      sx={{
        mt: 1,
        "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
        input: { color: colors.text.primary },
        mb: 1
      }}
    />
     
    <TextField
  fullWidth
  multiline
  minRows={2}
  label="Description"
  value={newRoutine.description}
  onChange={(e) =>
    setNewRoutine((prev) => ({ ...prev, description: e.target.value }))
  }
  variant="outlined"
  InputLabelProps={{ style: { color: colors.text.primary } }}
  sx={{
    mt: 1,
    "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
    textarea: { color: colors.text.primary },
    mb: 1
  }}
/>

    <div className="w-full gap-4 flex">
       {/* Start Date */}
         
           <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={newRoutine.start_date}
            onChange={(e) =>
              setNewRoutine((prev) => ({ ...prev, start_date: e.target.value }))
            }
            InputLabelProps={{ shrink: true, style: { color: colors.text.primary } }}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
              input: { color: colors.text.primary },
            }}
          />

          
             {/* End Date */}
          
            <TextField
            fullWidth
            type="date"
            label="End Date"
            value={newRoutine.end_date}
            onChange={(e) =>
              setNewRoutine((prev) => ({ ...prev, end_date: e.target.value }))
            }
            InputLabelProps={{ shrink: true, style: { color: colors.text.primary } }}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
              input: { color: colors.text.primary },
            }}
          />
         
    </div>
    </div>
      <div className="flex flex-col mb-2 md:ml-4 w-full items-start justify-start">

             {/* Frequency */}
          <div className="w-full flex flex-col justift-start items-start ">
              
            <TextField
              fullWidth
              select
              label="Frequency"
              value={newRoutine.frequency}
              onChange={(e) =>
                setNewRoutine((prev) => ({ ...prev, frequency: e.target.value }))
              }
              variant="outlined"
              InputLabelProps={{ style: { color: colors.text.primary } }}
              sx={{
            
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
                "& .MuiSelect-select": { color: colors.text.primary },
                mb:1
              }}
            >
              <MenuItem value="">Select frequency</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </TextField>


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
                <TextField
                fullWidth
                select
                label="Custom Unit"
                value={formData.custom_unit || ''}
                onChange={(e) => handleChange('custom_unit', e.target.value)}
                variant="outlined"
                InputLabelProps={{ style: { color: colors.text.primary } }}
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
                  "& .MuiSelect-select": { color: colors.text.primary },
                }}
              >
                <MenuItem value="">Select unit</MenuItem>
                <MenuItem value="days">Days</MenuItem>
                <MenuItem value="weeks">Weeks</MenuItem>
                <MenuItem value="months">Months</MenuItem>
              </TextField>

              </div>
            )}

          
            <TextField
            fullWidth
            type="time"
            label="Reminder Time"
            value={newRoutine.reminder_time}
            onChange={(e) =>
              setNewRoutine((prev) => ({ ...prev, reminder_time: e.target.value }))
            }
            InputLabelProps={{ shrink: true, style: { color: colors.text.primary } }}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
              input: { color: colors.text.primary },
              mb:1
            }}
          />

             {/* Time of Day (optional) */}
            
            <TextField
          fullWidth
          type="time"
          label="Time of Day (Optional)"
          value={newRoutine.time_of_day}
          onChange={(e) =>
            setNewRoutine((prev) => ({ ...prev, time_of_day: e.target.value }))
          }
          InputLabelProps={{ shrink: true, style: { color: colors.text.primary } }}
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
            input: { color: colors.text.primary },
          }}
        />


</div>
    </div>
     
    </>
  ) : (
    <>
    <div className="mb-2 gap-4 h-[50vh] md:h-auto overflow-y-auto flex flex-col md:flex-row w-full items-start justify-start mt-4">
      <div className=" pt-4 flex flex-col md:pr-8 md:border-r  w-full items-start justify-start" style={{borderColor: "#767676"}}>
     <TextField
  fullWidth
  select
  label="Link Type"
  value={type}
  onChange={(e) => setType(e.target.value)}
  variant="outlined"
  InputLabelProps={{ style: { color: colors.text.primary } }}
  sx={{
    mb: 2,
    "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
    "& .MuiSelect-select": { color: colors.text.primary },
  }}
>
  <MenuItem value="task">Task</MenuItem>
  <MenuItem value="ai_subtask">AI Subtask</MenuItem>
</TextField>


   <TextField
  fullWidth
  select
  label={`Select ${type}`}
  value={selected}
  onChange={(e) => setSelected(e.target.value)}
  variant="outlined"
  InputLabelProps={{ style: { color: colors.text.primary } }}
  sx={{
    mb: 2,
    "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
    "& .MuiSelect-select": { color: colors.text.primary },
  }}
>
  <MenuItem value="">None</MenuItem>
  {type === "ai_subtask"
    ? recommendations.map((r) => (
        <MenuItem key={r.subtask.id} value={r.subtask.id}>
          {r.goalTitle} → {r.taskTitle} → {r.subtask.title}
        </MenuItem>
      ))
    : options.map((opt) => (
        <MenuItem key={opt.id} value={opt.id}>
          {opt.title}
        </MenuItem>
      ))}
</TextField>


    <div className="w-full space-x-4 flex">
       {/* Start Date */}
            <div className="w-full flex flex-col justify-start items-start">
             
            <TextField
  fullWidth
  type="date"
  label="Start Date"
  value={newRoutine.start_date}
  onChange={(e) =>
    setNewRoutine((prev) => ({ ...prev, start_date: e.target.value }))
  }
  InputLabelProps={{ shrink: true, style: { color: colors.text.primary } }}
  sx={{
  
    "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
    input: { color: colors.text.primary },
  }}
/>

            </div>
             {/* End Date */}
       
            <TextField
            fullWidth
            type="date"
            label="End Date"
            value={newRoutine.end_date}
            onChange={(e) =>
              setNewRoutine((prev) => ({ ...prev, end_date: e.target.value }))
            }
            InputLabelProps={{ shrink: true, style: { color: colors.text.primary } }}
            sx={{
           
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
              input: { color: colors.text.primary },
            }}
          />
           </div>
          

      </div>




     <div className="flex flex-col  md:ml-4 w-full items-start justify-start">

             {/* Frequency */}
          <div className="w-full mb-2 flex flex-col justift-start items-start ">
             
            <TextField
                fullWidth
                select
                label="Frequency"
                value={newRoutine.frequency}
                onChange={(e) =>
                  setNewRoutine((prev) => ({ ...prev, frequency: e.target.value }))
                }
                variant="outlined"
                InputLabelProps={{ style: { color: colors.text.primary } }}
                sx={{
              
                  "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
                  "& .MuiSelect-select": { color: colors.text.primary },
                }}
              >
                <MenuItem value="">Select frequency</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </TextField>


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
                <TextField
                fullWidth
                select
                label="Custom Unit"
                value={formData.custom_unit || ''}
                onChange={(e) => handleChange('custom_unit', e.target.value)}
                variant="outlined"
                InputLabelProps={{ style: { color: colors.text.primary } }}
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
                  "& .MuiSelect-select": { color: colors.text.primary },
                }}
              >
                <MenuItem value="">Select unit</MenuItem>
                <MenuItem value="days">Days</MenuItem>
                <MenuItem value="weeks">Weeks</MenuItem>
                <MenuItem value="months">Months</MenuItem>
              </TextField>

              </div>
            )}

              <TextField
            fullWidth
            type="time"
            label="Reminder Time"
            value={newRoutine.reminder_time}
            onChange={(e) =>
              setNewRoutine((prev) => ({ ...prev, reminder_time: e.target.value }))
            }
            InputLabelProps={{ shrink: true, style: { color: colors.text.primary } }}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
              input: { color: colors.text.primary },
              mb: 1
            }}

          />
           
            <TextField
          fullWidth
          type="time"
          label="Time of Day (Optional)"
          value={newRoutine.time_of_day}
          onChange={(e) =>
            setNewRoutine((prev) => ({ ...prev, time_of_day: e.target.value }))
          }
          InputLabelProps={{ shrink: true, style: { color: colors.text.primary } }}
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
            input: { color: colors.text.primary },
            mb: 2
          }}
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
      <TextField
  fullWidth
  select
  label="Custom Unit"
  value={formData.custom_unit || ''}
  onChange={(e) => handleChange('custom_unit', e.target.value)}
  variant="outlined"
  InputLabelProps={{ style: { color: colors.text.primary } }}
  sx={{
    mt: 1,
    "& .MuiOutlinedInput-root fieldset": { borderColor: "#767676" },
    "& .MuiSelect-select": { color: colors.text.primary },
  }}
>
  <MenuItem value="">Select unit</MenuItem>
  <MenuItem value="days">Days</MenuItem>
  <MenuItem value="weeks">Weeks</MenuItem>
  <MenuItem value="months">Months</MenuItem>
</TextField>

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
                        
                        >My Routines</Typography>
                       {/* { <Button variant="contained">
                          View in Calendar
                        </Button>} */}

                          <div className="">
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
  routine.subtask_template_description || ""
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
        className={`flex grid justify-between items-center ${
    !isMobile
      ? isCollapsed
        ? "md:grid-cols-4"
        : "md:grid-cols-3"
      : "grid-cols-1"
  }`}

      >
        <div
          className="p-5 rounded-4xl  w-full h-full shadow-md flex flex-col justify-between"
           style={{ backgroundColor: colors.background.sidebar,  color: colors.primary[100] }}
        >
          <div className="py-4">
            <h3 className="text-lg font-semibold">
              {routine.subtask_template_title}
            </h3>
            <p className="text-xs mt-2 w-10/12 opacity-90">
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
    borderColor: "#4F378A",
    color: "#4F378A",
  }}
  onMouseEnter={(e) => {
    e.target.style.color = colors.text.secondary;
    e.target.style.boxShadow = "0 0 12px #4F378A";
  }}
  onMouseLeave={(e) => {
    e.target.style.color = "#4F378A";
    e.target.style.boxShadow = "none";
  }}
  onMouseDown={(e) => {
    e.target.style.boxShadow = "0 0 20px #4F378A";
    e.target.style.transform = "scale(0.98)";
  }}
  onMouseUp={(e) => {
    e.target.style.boxShadow = "0 0 12px #4F378A";
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
