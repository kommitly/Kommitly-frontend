import React from 'react'
import { useEffect, useState, useContext } from "react";
import { TasksContext } from "../../../context/TasksContext";
import PropTypes from 'prop-types';
import { updateAiSubtaskById, triggerAiSubtaskReminder, deleteAiSubtaskById, answerAiSubtask } from "../../../utils/Api";
import { Modal, Box, Typography, TextField, Button, IconButton, MenuItem, colors } from "@mui/material";
import { CalendarToday, AccessTime, Notifications, AttachFile, PushPin, Add } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { deleteTaskById, updateSingleTaskStatus, fetchTaskById, createSubtask, updateSubtask} from "../../../utils/Api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock, FaFlag, FaTasks  } from "react-icons/fa"; // Calendar icon
import SubtaskDetails from "../Task/Subtask";
import { useLocation } from "react-router-dom";
import {useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Hand } from 'lucide-react';
import { HiMiniChevronDoubleLeft } from "react-icons/hi2";
import SubtaskDateTimePicker from './SubtaskDateTimePicker';
import ReminderTimePicker from './ReminderTimePicker';
import  Backdrop  from "@mui/material/Backdrop";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { motion } from "framer-motion";
import AiAssistance from "../../components/AiAssistance";
import EastIcon from '@mui/icons-material/East';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);


const AiSubtask = ({ step, setStep, taskId, onClose }) => {
    
    const theme = useTheme();
    const colors =tokens(theme.palette.mode);
    const [selectedFile, setSelectedFile] = useState(null);
    const showCustomReminderPicker = step.reminder_offset === 'custom';
    const [menuVisible, setMenuVisible] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [aiAnswer, setAiAnswer] = useState(null);

    useEffect(() => {
  if (step?.ai_answer) {
    setAiAnswer(step.ai_answer);
  }
}, [step]);



   const handleCustomReminderChange = (time) => {
  setStep(prev => ({
    ...prev,
    custom_reminder_time: time,
  }));
};





    const handleChange = (e) => {
        const { name, value } = e.target;

      setStep((prev) => ({
    ...prev,
    [name]: value, // this will update `reminder_offset`
  }));
      };

  const handleDateChange = (date) => {
  if (!date || !dayjs(date).isValid()) return;

  const dueDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss"); // format to ISO string with timezone
  console.log("Here is the due date:", dueDate )


  setStep((prev) => {
    const reminderOffset = prev.reminder_offset ?? "15"; // fallback to 15 if not set
    const reminderTime = dayjs(date)
      .subtract(Number(reminderOffset), "minute")
      .format("HH:mm:ss");

    return {
      ...prev,
      due_date: dueDate,
      reminder_offset: reminderOffset,
      reminder_time: reminderTime,
    };
  });
};

      const [visible, setVisible] = useState(false);

    useEffect(() => {
      setTimeout(() => setVisible(true), 10); // allow initial render before animation
    }, []);

   useEffect(() => {
  if (step?.due_date && step?.reminder_time && !step.reminder_offset) {
    const due = dayjs(step.due_date);
    const reminder = dayjs(`${dayjs(step.due_date).format("YYYY-MM-DD")}T${step.reminder_time}`);
    const offset = due.diff(reminder, 'minute');

    if (offset >= 0) {
      setStep(prev => ({
        ...prev,
        reminder_offset: offset.toString(),
      }));
    }
  }
}, [step?.due_date, step?.reminder_time]);

 const openDeletelModal = () => {
    setOpenDelete(true);
  };


      const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose(); // calls setSubtaskOpen(false) and setSelectedStep(null)
    }, 300); // match your transition duration
  };


const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleAnswerAiSubtask = async () => {
  if (aiAnswer) return; // Don't call the API if aiAnswer already exists

  try {
    const res = await answerAiSubtask(step.id); 
    setAiAnswer(res.answer); // Assuming `res.answer` is the correct path
  } catch (error) {
    console.error("Failed to get AI subtask answer:", error);
  }
};



const handleUpdateSubtask = async () => {
  try {
    const reminderTime = step.reminder_offset === "custom"
  ? dayjs(step.custom_reminder_time).format("HH:mm:ss")
  : dayjs(step.due_date).subtract(Number(step.reminder_offset), 'minute').format("HH:mm:ss");
   
   console.log("Selected Date:", step.due_date); // Debugging line
    console.log("Reminder Time:", reminderTime); // Debugging line

    console.log("Updating subtask with data:", {
      title: step.title,
      due_date: step.due_date, // e.g. "2025-06-03T14:00:00Z"
      description: step.description,
      reminder_time: reminderTime,
    });

    // Construct updated fields for PATCH
    const updatedData = {
      title: step.title,
      due_date: step.due_date, // e.g. "2025-06-03T14:00:00Z"
      description: step.description,
      reminder_time: reminderTime,
    };

    // 1. Update the subtask itself
    await updateAiSubtaskById(taskId, step.id, updatedData);

    // 2. Trigger the reminder
    await triggerAiSubtaskReminder({
      subtask_id: step.id,
      due_date: dayjs(step.due_date).format("YYYY-MM-DD"), // API expects "YYYY-MM-DD"
      reminder_time: reminderTime // always "HH:mm"
    });

    console.log("Subtask updated and reminder triggered.");
  } catch (err) {
    console.error("Failed to update subtask:", err);
  }
};


  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

const confirmDeleteSubtask = async () => {
  try {
    await deleteAiSubtaskById(subtaskId);
    console.log("Subtask deleted successfully.");
    setShowDeleteModal(false);
    // Optionally refresh or update state here
  } catch (err) {
    console.error("Failed to delete subtask:", err);
  }
};

    




  return (
      <>
    
    {visible && (
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,0.66)] z-[99] min-h-screen"
        onClick={handleClose}
      />
    )}
    
    <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 shadow-lg z-[100] transition-transform duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'}`} style={{ backgroundColor: colors.background.default }}>

      <div className="w-full  h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <button
 
  className="group p-2 w-10 h-10 flex justify-center items-center cursor-pointer  "
 
       onClick={handleClose}

>
  <EastIcon className="text-2xl  text-[#4F378A]  transition-colors duration-300"   />
</button>



              <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#65558F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer"
                onClick={toggleMenu}
              >
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>

 {menuVisible && (
                  <div className="absolute right-0 mt-2 w-48  rounded-md shadow-lg z-50" style={{ backgroundColor: colors.background.default }}>
                     <button
             onClick={handleUpdateSubtask}
               className="block w-full text-left px-4 py-2 text-xs  " style={{ color: colors.text.primary }}
            >
              Update
            </button>
                    <button
            onClick={openDeletelModal}
              className="block w-full text-left px-4 py-2 text-xs  " style={{color: colors.background.warning }}
            >
              Delete
            </button>
           


                  </div>
                )}
                </div>
                 <Backdrop
                          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                          open={openDelete}// Use openCreateGoal state for backdrop
                          onClick={handleCloseDelete} // Clicking outside should close it
                        >
                          <div 
                            className=" md:w-4/12 xl:w-6/12 p-6  rounded-lg shadow-lg text-center" style={{ backgroundColor: colors.background.default }} 
                            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
                          >
                            <div className='flex w-full mb-4 justify-end'>
                            <div className='flex w-2/3 items-center justify-end'>
                           
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
                              onClick={handleCloseDelete}
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>  
                            
                
                
                
                            </div>
                
                            </div>

                             <h2 className="text-lg font-semibold mb-4" style={{color:colors.text.primary}}>Delete Subtask?</h2>
                              <p className="text-sm text-gray-600 mb-6" style={{color:colors.text.primary}}>Are you sure you want to delete this subtask? This action cannot be undone.</p>
                              
                                
                                <button
                                  onClick={confirmDeleteSubtask}
                                  className="px-4 py-2  text-white rounded cursor-pointer"
                                  style={{ backgroundColor: colors.background.warning}}
                                >
                                  Delete
                                </button>
     
                            
                           
                
                          
                          </div>
                        </Backdrop>




        </div>

        <div className='flex flex-col gap-4 overflow-y-auto h-full no-scrollbar'>
              <div className='flex gap-4 mt-8 items-center '>
       <span className='flex  items-center gap-2'>
        <span className='bg-[#D6CFFF] p-2 rounded-md'>
         <FaTasks className="text-[#4F378A] " size={12} />
        </span>
      
       <label className=" w-30 text-base font-regular">Title</label>
       </span>
        <input
            type="text"
            name="title"
            value={step.title}
            onChange={handleChange}
            style={{
            
                color: colors.primary[500],
              }
              }
            className="w-full   text-xl focus:outline-none focus:ring-none focus:bg-purple-300"
          />
        </div>
    
         
          
    
          <div className="mt-0 w-full">
          <div className="flex items-center justify-center  space-x-2">

               <span className='flex  items-center gap-2'>
                 {/* Description Icon */}
             <span className='bg-[#D6CFFF] p-2 rounded-md'>
               <FaTasks className="text-[#4F378A] " size={12} />
             </span>
           
            {/* Label */}
            <label htmlFor="description" className="w-30  text-base">
              Description
            </label>
            {/* Description Input */}
          


               </span>
           
          <div className="relative mt-6 w-11/12">
      <textarea
          name="description"
            className=" rounded w-full text-sm  focus:outline-none focus:ring-none focus:bg-purple-100"
            value={step.description}
            onChange={handleChange}
          />
          </div>
          </div>
     
    
    <div className="mt-2">
          <div className="flex items-center space-x-2">
               <span className='flex  items-center gap-2'>
                  {/* Calendar Icon */}
                <span className='bg-[#D6CFFF] p-2 rounded-md'>
            <FaCalendarAlt className="text-[#4F378A] " size={12} />
                </span>
         
            {/* Label */}
            <label htmlFor="due-date" className="text-base w-30">
              Due Date
            </label>
            {/* Date Picker Input */}

               </span>
        
            <div className="relative">
      <SubtaskDateTimePicker value={step.due_date ? dayjs.utc(step.due_date) : null}
 onChange={handleDateChange}/>
         
            </div>
          </div>
        </div>
     
    
    <div className=" mt-4">
      <div className="flex items-center space-x-2">
        <span className='flex  items-center gap-2'>  
                 {/*Clock icon*/}
             <span className='bg-[#D6CFFF] p-2 rounded-md'>
        <FaClock className="text-[#4F378A] " size={12} />
             </span>
     
        {/*Label*/}
        <label htmlFor="reminder-time" className="text-base w-30">Reminder</label>

        </span>
       
        {/*Time Picker Input*/}
        <div className="flex gap-4 items-center relative">
              <select name="reminder_offset" className="text-sm" onChange={handleChange} value={step.reminder_offset}>

  <option value="15">15 minutes before</option>
  <option value="30">30 minutes before</option>
  <option value="60">1 hour before</option>
  <option value="1440">1 day before</option>
  <option value="custom">Custom</option>
</select>

{showCustomReminderPicker && (
  <div className="mt-2">
    <ReminderTimePicker
      value={step.custom_reminder_time}
      onChange={handleCustomReminderChange}
    />
  </div>
)}


 
      </div>
      
    </div>
    
    </div>

       <div className=" mt-4">
      <div className="flex items-center space-x-2">
        <span className='flex  items-center gap-2'>  
                 {/*Clock icon*/}
             <span className='bg-[#D6CFFF] p-2 rounded-md'>
        <FaClock className="text-[#4F378A] " size={12} />
             </span>
     
        {/*Label*/}
        <label htmlFor="reminder-time" className="text-base w-30">Repeat</label>

        </span>
       
        {/*Time Picker Input*/}
        <div className="flex gap-4 items-center relative">
          <select   className='text-sm' >

  <option value="no-repeat">No Repeat</option>
  <option value="daily">Daily</option>
  <option value="weekly">Weekly</option>
  <option value="monthly">Monthly</option>
  <option value="custom">Custom</option>
</select>



 
      </div>
      
    </div>
    
    </div>
    
          <div className="flex gap-4  mt-4">
         <div className='flex  items-center gap-2'>
           <span className='flex  items-center gap-2'> 
             <span className='bg-[#D6CFFF] p-2 rounded-md'>
          <FaFlag className="text-[#4F378A] " size={12} />
               </span>
        
         <label className=" w-30 text-base">Priority</label>
            </span>
              
            </div >
            <div className='bg-purple-200 px-2 py-1 rounded-full'>
            <select
              className="  border-none text-purple-900 px-2  rounded-full focus:outline-none focus:ring-none focus:bg-purple-200"
              value={step.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            </div>

          </div>




         
<div className="w-full  flex justify-end">
          <IconButton
            className="text-[#4F378A] hover:text-white "
            style={{ backgroundColor: colors.primary[500], width: '40px', height: '40px' }}
            onClick={handleAnswerAiSubtask} 
          
          >
              <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <EmojiObjectsIcon
        sx={{ fontSize: 20 }}
        className="text-white hover:text-white"
      />
    </motion.div>
            
          </IconButton>
         </div>


         <AiAssistance answer={aiAnswer} onClose={() => setAiAnswer(null)} />

         

        </div>
        </div>
  
            
    
    
        
    
          
    
         
        </div>
        </div>

         
      
        {/* Modal for Subtask Details */}
        <div className="w-1/2 p-4">
          {/* {  <SubtaskDetails subtask={selectedSubtask} />} */}
          </div>
       
        </>
        
      );
    }; 

export default AiSubtask