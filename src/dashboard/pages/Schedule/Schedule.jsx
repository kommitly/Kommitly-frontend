import React, { useEffect, useState } from "react";
import {
  createRoutine,
  fetchRoutines,
  fetchRoutineById,
  updateRoutineById,
  deleteRoutineById,
} from "../../../utils/Api";
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

const Schedule = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ title: "", description: "" });
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [open, setOpen] = useState(false);
  const [openRoutine, setOpenRoutine] = useState(false);
  const [formData, setFormData] = useState(selectedRoutine || {});


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
      const routine = await createRoutine(newRoutine);
      setRoutines((prev) => [...prev, routine]);
      setNewRoutine({ title: "", description: "" });
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
      <form onSubmit={handleCreate} className="my-4  gap-2">
        <div className="w-full flex justify-between ">
                   <div className="w-full">
                    <h2 className='text-xl font-semibold mb-4' style={{color: colors.primary[500]}}>Add  Routine</h2>
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
         
        <TextField
          fullWidth
          label='Title'
          name='title'
          value={newRoutine.title}
          onChange={(e) =>
            setNewRoutine((prev) => ({ ...prev, title: e.target.value }))
          }
          className="border px-2 py-1"
          required
          margin='normal'
        />
        <TextField
          fullWidth 
          label='Description' 
          name='description'
          value={newRoutine.description}
          onChange={(e) =>
            setNewRoutine((prev) => ({ ...prev, description: e.target.value }))
          }
          className="border px-2 py-1"
          margin='normal'
        />
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
              <div className="md:w-6/12 w-11/12 p-6 rounded-lg " onClick={(e) => e.stopPropagation()} style={{backgroundColor: colors.menu.primary}} >
            
                  
                  {/* Selected Routine */}
      {selectedRoutine && (
        <div className="  ">
          

         
          <div className=" w-full flex justify-between">

       <div className="w-full text-center">
         <Typography variant="h4" component="h3" fontWeight="bold" mb={2}>
          Routine Details
        </Typography>
        </div>
          <IconButton
          sx={{
            
            color: colors.text.primary,
          }}
          onClick={handleCloseRoutine}
        >
          <CloseIcon />
        </IconButton>
            </div>

         <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ color: colors.text.primary, mb: 1 }}>
            <span style={{ fontWeight: 'bold' }}>Routine Name:</span> {selectedRoutine.name}
          </Typography>

           <Typography variant="body1" sx={{ color: colors.text.primary, mb: 1 }}>
            <span style={{ fontWeight: 'bold' }}>Title:</span> {selectedRoutine.subtask_template_title}
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.primary, mb: 1 }}>
            <span style={{ fontWeight: 'bold' }}>Description:</span> {selectedRoutine.subtask_template_description}
          </Typography>

          <Typography variant="body1" sx={{ color: colors.text.primary, mb: 1 }}>
            <span style={{ fontWeight: 'bold' }}>Start Date:</span> {selectedRoutine.start_date}
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.primary, mb: 1 }}>
            <span style={{ fontWeight: 'bold' }}>End Date:</span> {selectedRoutine.end_date}
          </Typography>
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={formData.end_date ? new Date(formData.end_date) : null}
                onChange={(newValue) => handleChange('end_date', newValue.toISOString().slice(0, 10))}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                minDate={new Date(formData.start_date)}
              />
            </LocalizationProvider>
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
                          Create 
                        </Button>
                    
                </div>

                
    
      
      
    


     

      {/* Routines List */}
      {loading ? (
        <p>Loading routines...</p>
      ) : (
        <ul className="space-y-2 md:flex gap-4 w-full">
          {routines.map((routine) => (
            <li
              key={routine.id}
              className="flex md:w-1/3 w-full  justify-between items-center p-3"
            >
              <div  className="w-full text-left flex  items-center text-lg p-4 font-semibold h-48 gap-4 rounded-4xl transition-opacity duration-200 hover:opacity-80"
            style={{ backgroundColor: colors.primary[500], color: colors.primary[100] }}
             onClick={() => {
      handleFetchById(routine.id);
      setOpenRoutine(true);
    }} >
                <p className="font-semibold">{routine.subtask_template_title}</p>
                <p className="text-sm text-gray-500">{routine.description}</p>
              </div>
          {/* {    <div className="space-x-2">
                <button
                  onClick={() => handleUpdate(routine.id)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(routine.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleFetchById(routine.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  View
                </button>
              </div>} */}
            </li>
          ))}
        </ul>
      )}

     
    </div>
    </div>
    </div>
    
  );
};

export default Schedule;
