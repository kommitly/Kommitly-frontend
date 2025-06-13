import React from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import { TasksContext } from "../../../context/TasksContext";
import PropTypes from 'prop-types';
import { updateAiSubtaskById, triggerAiSubtaskReminder, deleteAiSubtaskById } from "../../../utils/Api";
import { Modal, Box, Typography, TextField, Button, IconButton, MenuItem, colors } from "@mui/material";
import { CalendarToday, AccessTime, Notifications, AttachFile, PushPin, Add } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { deleteTaskById, updateSingleTaskStatus, fetchTaskById, createSubtask, updateSubtask} from "../../../utils/Api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock, FaFlag, FaTasks  } from "react-icons/fa"; // Calendar icon
import SubtaskDetails from "../Task/Subtask";

import {useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Hand } from 'lucide-react';
import { HiMiniChevronDoubleLeft } from "react-icons/hi2";
import SubtaskDateTimePicker from './SubtaskDateTimePicker';
import ReminderTimePicker from './ReminderTimePicker';

const AiSubtaskPage = () => {

const { goalId, taskId, subtaskId } = useParams();
const { state } = useLocation();
const step = state?.step;
const navigate = useNavigate();
    
    const theme = useTheme();
    const colors =tokens(theme.palette.mode);
    const [selectedFile, setSelectedFile] = useState(null);
    const showCustomReminderPicker = step?.reminder_offset === 'custom';


    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  setStep((prev) => ({
    ...prev,
    due_date: dayjs(date).toISOString(), // this also works
  }));
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
    
    if (!step) {
  return (
    <div className="p-4 text-center text-red-500">
      Subtask data is missing. Please go back and try again.
    </div>
  );
}

    

      const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose(); // calls setSubtaskOpen(false) and setSelectedStep(null)
    }, 300); // match your transition duration
  };

const handleUpdateSubtask = async () => {
  try {
    const reminderTime = step.reminder_offset === "custom"
  ? dayjs(step.custom_reminder_time).format("HH:mm:ss")
  : dayjs(step.due_date).subtract(Number(step.reminder_offset), 'minute').format("HH:mm:ss");
    
    console.log("Reminder Time:", reminderTime); // Debugging line
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

    
    <div >

      <div className="w-full h-full flex flex-col p-4">
  <button
 
  className="group p-2 w-10 h-10 flex justify-center items-center cursor-pointer "
  style={{
    borderColor: colors.primary[500],
  }}
       onClick={handleClose}

>
  <HiMiniChevronDoubleLeft className="text-2xl  text-[#4F378A] group-hover:text-white transition-colors duration-300" onClick={() => navigate(`/dashboard/ai-goal/${goalId}`)} />
</button>

            
        <div className='flex gap-2 mt-8 items-center '>
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
      <SubtaskDateTimePicker value={step.due_date ? dayjs(step.due_date) : null} onChange={handleDateChange}/>
         
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
    
        
    
          
    
          <div className="  item-end flex gap-4 fixed bottom-0 right-0">
            <button
            onClick={() => setShowDeleteModal(true)}
              className="bg-red-400 text-red-100 px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
             onClick={handleUpdateSubtask}
              className="bg-[#6246AC] text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Update
            </button>
          </div>
        </div>
        </div>
        {showDeleteModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-4">Delete Subtask?</h2>
      <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this subtask? This action cannot be undone.</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={confirmDeleteSubtask}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

       
        </div>
     
      );
    }; 

export default AiSubtaskPage