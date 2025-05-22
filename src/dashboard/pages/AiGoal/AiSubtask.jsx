import React from 'react'
import { useEffect, useState, useContext } from "react";
import { TasksContext } from "../../../context/TasksContext";
import PropTypes from 'prop-types';
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



const AiSubtask = () => {
    const location = useLocation();
    const { step } = location.state;
    const theme = useTheme();
    const colors =tokens(theme.palette.mode);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
      };

      const handleDateChange = (date) => {
        setTask((prev) => ({
          ...prev,
          due_date: date?.toISOString(), // Convert date to string for compatibility with backend
        }));
      };
      const [visible, setVisible] = useState(false);

    useEffect(() => {
      setTimeout(() => setVisible(true), 10); // allow initial render before animation
    }, []);


  return (
    <>
    {visible && (
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,0.66)] z-[99]"
        onClick={() => navigate(-1)}
      />
    )}
    
    <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-lg z-[100] transition-transform duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'}`}>

            <div className="w-full p-4">
            
        <div className='flex gap-4 items-center '>
       <span className='flex items-center gap-2'>
       <FaTasks className="text-gray-500" />
       <label className="text-gray-600 w-20 text-sm font-regular">Title</label>
       </span>
        <input
            type="text"
            name="title"
            value={step.title}
            onChange={handleChange}
            style={{
                fontWeight: 'bold',
                color: colors.primary[500],
              }
              }
            className="w-11/12  p-2    text-3xl border-none focus:outline-none focus:ring-none focus:bg-purple-300"
          />
        </div>
    
         
          
    
          <div className="mt-0 w-full">
          <div className="flex items-center justify-center  space-x-2">
            {/* Description Icon */}
            <FaTasks className="text-gray-500" />
            {/* Label */}
            <label htmlFor="description" className="text-gray-700">
              Description
            </label>
            {/* Description Input */}
          
          <div className="relative ml-4 mt-6 w-11/12">
      <textarea
          name="description"
            className="pl-2 rounded w-10/12  focus:outline-none focus:ring-none focus:bg-purple-100"
            value={step.details}
            onChange={handleChange}
          />
          </div>
          </div>
     
    
    <div className="mt-4">
          <div className="flex items-center space-x-2">
            {/* Calendar Icon */}
            <FaCalendarAlt className="text-gray-500" />
            {/* Label */}
            <label htmlFor="due-date" className="text-gray-700">
              Due Date
            </label>
            {/* Date Picker Input */}
            <div className="relative">
               {<DatePicker
                id="due-date"
                selected={step.due_date ? new Date(step.due_date) : null}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="yyyy-MM-dd h:mm aa"
                className="p-2 pl-10  rounded"
              />} 
            </div>
          </div>
        </div>
     
    
    <div className=" mt-4">
      <div className="flex items-center space-x-2">
        {/*Clock icon*/}
        <FaClock className="  text-gray-500" />
        {/*Label*/}
        <label htmlFor="reminder-time" className="text-gray-700">Reminder</label>
        {/*Time Picker Input*/}
        <div className="relative">
      <input
        type="time"
        className="w-full p-2 pl-10  rounded "
        value={step.reminder_time}
        onChange={handleChange}
      />
      </div>
      
    </div>
    
    </div>
    
          <div className="flex gap-4  mt-4">
         <div className='flex w-28 items-center gap-2'>
         <FaClock className="  text-gray-500" />
         <label className="block w-20 text-gray-700">Priority</label>
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
    
          <div className="mt-4">
            <label className="block text-gray-700">Files and Media</label>
         <input
            type="file"
            className="mt-2 bg-[#6246AC] text-white px-4 py-2  border rounded hover:bg-purple-600"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
            
          </div>
    
          <div className="mt-4 p-4 border rounded-lg">
          {/* Subtasks Title & Progress Bar */}
          <div className="flex justify-between items-center">
            <label className="block text-gray-700 text-lg font-semibold">Subtasks</label>
           {/* { <progress value={subTaskProgress} max="100" className="w-2/3 h-2 bg-purple-300 rounded-lg"></progress>} */}
          </div>
    
          
           
    
        {/* {  Add Subtask Button & Input Field
          {showInput ? (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Enter subtask"
                className="w-full border p-2 rounded-md"
              />
              <button onClick={handleAddSubtask} className="bg-[#6246AC] text-white px-3 py-2 rounded-md">
                Add
              </button>
            </div>
          ) : (
            <button
            //  onClick={() => setShowInput(true)}
              className="mt-3 text-[#6246AC] hover:underline"
            >
              + Add Subtask
            </button>
          )}} */}
        </div>
    
          <div className="mt-6 flex gap-4 pl-85">
            <button
          //    onClick={handleDeleteTask}
              className="bg-red-400 text-red-100 px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
            //  onClick={handleUpdateTask}
              className="bg-[#6246AC] text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Update
            </button>
          </div>
        </div>
        </div>
        {/* Modal for Subtask Details */}
        <div className="w-1/2 p-4">
          {/* {  <SubtaskDetails subtask={selectedSubtask} />} */}
          </div>
        </div>
        </>
      );
    }; 

export default AiSubtask