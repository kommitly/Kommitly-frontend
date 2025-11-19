import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaCalendarAlt, FaTasks, FaClock } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EastIcon  from "@mui/icons-material/East";
import ReminderTimePicker from "../AiGoal/ReminderTimePicker";
import SubtaskDateTimePicker from '../AiGoal/SubtaskDateTimePicker';
import { button } from "framer-motion/client";
import  { Button, IconButton, colors } from  "@mui/material";
import {useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import dayjs from "dayjs";



const SubtaskDetails = ({
  subtask,
  visible,
  handleClose,
  onUpdateSubtask,
  onDeleteSubtask,
}) => {
  // Local copy of the subtask (editable)
  const [localSubtask, setLocalSubtask] = useState(subtask || {});
  const [showCustomReminderPicker, setShowCustomReminderPicker] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
   const [openSnackbar, setOpenSnackbar] = useState(false);


  // Sync local state when parent changes
  useEffect(() => {
    setLocalSubtask(subtask || {});
  }, [subtask]);

  // 📝 Handle text/field changes
  const handleSubtaskChange = (e) => {
    const { name, value } = e.target;
    setLocalSubtask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 📅 Handle date/time changes
  const handleSubtaskDate = (date) => {
    setLocalSubtask((prev) => ({
      ...prev,
      due_date: date ? date.toISOString() : null,
    }));
  };

  // 🕒 Handle reminder offset
const handleReminderOffsetChange = (e) => {
  const value = e.target.value;
  setLocalSubtask((prev) => ({
    ...prev,
    reminder_offset: value,
  }));
  setShowCustomReminderPicker(value === "custom");
};

// 🕓 Handle custom reminder time
const handleCustomReminderChange = (time) => {
  setLocalSubtask((prev) => ({
    ...prev,
    custom_reminder_time: time,
  }));
};

  // 🧾 No subtask selected
  if (!subtask) {
    return (
      <p className="text-gray-500 mt-10 text-center">
        Click on a subtask to view details.
      </p>
    );
  }

  return (
    <>
      {/* 🌑 Overlay — only visible when drawer is open */}
      {visible && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.66)] z-[99] cursor-pointer"
          onClick={handleClose}
        />
      )}

      {/* 📜 Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-lg z-[100] transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
          {/* 🔙 Header */}
          <div className="flex justify-between items-center mb-2">
    <button
      className="p-2 w-10 h-10 flex justify-center items-center cursor-pointer"
      onClick={handleClose}
    >
      <EastIcon className="text-2xl text-[#4F378A]" />
    </button>
  
  <div className="flex gap-4">
    {/* 🔘 Actions */}
    <div className="mt-2 flex gap-4">
      <FaTrashAlt
        onClick={() => onDeleteSubtask(localSubtask)}
        className="text-red-500 hover:text-red-600 cursor-pointer text-2xl"
        title="Delete subtask"
      />
    </div>

    <Button className="py-2 text-sm cursor-pointer" sx={{border: "1px solid #0D81E0"  , color: colors.primary[400],   '&:hover': {
          opacity: 0.7, // or any other value < 1
        }, textTransform: "none",  gap: "10px"  } }
                 onClick={() => onUpdateSubtask(localSubtask)}
    
                >
                       UPDATE
                </Button>

                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={3000}
                  onClose={() => setOpenSnackbar(false)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                  <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Subtask successfully updated!
                  </MuiAlert>
                </Snackbar>
  
    </div>
    </div>
    <h2 className="text-lg font-semibold">{localSubtask.title}</h2>
          

          {/* 📝 Description */}
          <div className="mt-6 flex flex-col">
            <div className="flex items-center space-x-2 mb-2">
             <span className='bg-[#D6CFFF] p-2 rounded-md'>
                            <FaTasks className="text-[#4F378A] " size={12} />
                          </span>
              <label htmlFor="description" className="text-gray-700 font-semibold">
                Description
              </label>
            </div>
            <textarea
              id="description"
              name="description"
              className="pl-9   outline-none focus:ring-0 focus:outline-none placeholder:text-xm"
              value={localSubtask.description || ""}
              placeholder="Enter Subtask description"
              onChange={handleSubtaskChange}
            />
          </div>
          
           {/* ✅ Status */}
          
                         
          <div className="mt-6 flex items-center space-x-2">
            <span className= 'bg-[#D6CFFF] p-2 rounded-md'> 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={12}
              height={12}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="#4F378A"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2l4-4" />
            </svg>
            </span>
            
            <p className="text-gray-700">
              <strong>Status:</strong>{" "}
              <span
                className={`ml-10 ${
                  localSubtask.completed ? "text-blue-600" : "text-red-600"
                }`}
              >
                {localSubtask.completed ? "Completed" : "Pending"}
              </span>
            </p>
          </div>


          {/* 📅 Due Date */}
          <div className="mt-6 flex gap-4 ">
            <div className="flex items-center space-x-2 mb-2">
              <span className='bg-[#D6CFFF] p-2 rounded-md'>
                         <FaCalendarAlt className="text-[#4F378A] " size={12} />
                             </span>
              <label htmlFor="due-date" className="text-gray-700 font-semibold">
                Due Date
              </label>
            </div>
            <div className="relative pl-4">
           <SubtaskDateTimePicker
  id="due-date"
  value={localSubtask.due_date ? dayjs(localSubtask.due_date) : null}
  onChange={(newValue) =>
    handleSubtaskDate(newValue ? newValue.toDate() : null)
  }
/>

            </div>
          </div>

          {/* ⏰ Reminder */}
<div className="mt-6 flex gap-8">
  <div className="flex items-center space-x-2 mb-2">
    <span className='bg-[#D6CFFF] p-2 rounded-md'>
           <FaClock className="text-[#4F378A] " size={12} />
                </span>
    <label htmlFor="reminder-offset" className="text-gray-700 font-semibold">
      Reminder
    </label>
  </div>

  <div className="flex gap-4 items-center relative">
    <select
      name="reminder_offset"
      className="text-sm border rounded p-2"
      onChange={handleReminderOffsetChange}
      value={localSubtask.reminder_offset || ""}
    >
      <option value="">Select reminder</option>
      <option value="15">15 minutes before</option>
      <option value="30">30 minutes before</option>
      <option value="60">1 hour before</option>
      <option value="1440">1 day before</option>
      <option value="custom">Custom</option>
    </select>

    {showCustomReminderPicker && (
      <div className="mt-2">
        <ReminderTimePicker
          value={localSubtask.custom_reminder_time}
          onChange={handleCustomReminderChange}
        />
      </div>
    )}
  </div>
</div>




         
          
        </div>
      
      </div>
    </>
  );
};

// ✅ Correct prop definitions
SubtaskDetails.propTypes = {
  subtask: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onUpdateSubtask: PropTypes.func.isRequired,
  onDeleteSubtask: PropTypes.func.isRequired,
};

export default SubtaskDetails;
