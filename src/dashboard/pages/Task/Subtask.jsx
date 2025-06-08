
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaCalendarAlt, FaClock, FaFlag, FaTasks  } from "react-icons/fa"; // Calendar icon
import DatePicker from "react-datepicker";


const SubtaskDetails = ({ subtask, taskId, onUpdateSubtask, onDeleteSubtask }) => {
  if (!subtask) {
    return <p className="text-gray-500 mt-20 align-centre"></p>;
  }
//all logic and state management is handled in the parent component. In this page, we just pass functions and objects as props

const [localSubtask, setLocalSubtask] = useState(subtask);


useEffect(() => {
  setLocalSubtask(subtask);
}, [subtask]);

  //change in subtask properties
  const handleSubtaskChange = (e) => {
    const { name, value } = e.target;
    setLocalSubtask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubtaskDate = (date) => {
    setLocalSubtask((prev) => ({
      ...prev,
      due_date: date?.toISOString(),
    }));
  };

   


  if (!subtask) {
    return <p className="text-gray-500 mt-30 align-centre">Click on a subtask to view details.</p>;
  }

return (
  <div> 

    <div className=" mt-12 p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-2">
       <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="#65558F"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="relative"
  >
    <rect x="3" y="3" width="14" height="4" rx="2" />
    <path d="M7 7v6a2 2 0 002 2h4a2 2 0 012 2v4" />
    <rect x="11" y="17" width="6" height="4" rx="2" />
  </svg>

      <h2 className="text-lg font-semibold">{subtask.title}</h2>
      </div>
      
      <div className="mt-6 gap-8 flex ">
      <div className="flex items-center  space-x-2">
        {/* Description Icon */}
        <FaTasks className="text-gray-500" />
        {/* Label */}
        <label htmlFor="description" className="text-gray-700">
          Description
        </label>
        </div>
        {/* Description Input */}
      
      <div className="w-full relative ">
      <textarea
      name="description"
      className="pl-6 w-full flex flex-wrap rounded"
      value={localSubtask.description || ""}
      onChange={handleSubtaskChange}
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
                <DatePicker
                  id="due-date"
                  selected={localSubtask.due_date ? new Date(localSubtask.due_date) : null}
                  onChange={handleSubtaskDate}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd h:mm aa"
                  className="p-2 pl-9  rounded"
                />
              </div>
            </div>
          </div>
          
          <div className=" mt-4  gap-1 flex">
            <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="#65558F"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2l4 -4" />
  </svg>
  <p className="text-gray-600  ">
  <strong>Status:</strong>{" "}
         <span className={`ml-12 ${localSubtask.completed ? "text-blue-600" : "text-red-600"}`}>
         {localSubtask.completed ? "Completed" : "Pending"}
         </span>
      </p>
      </div>
     

      <div className="mt-6 flex gap-4 pl-85">
        <button
          onClick={() => onDeleteSubtask(localSubtask)}
          className="bg-red-400 text-red-100 px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={() => onUpdateSubtask(localSubtask)}
          className="bg-[#6246AC] text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Update
        </button>
      </div>
    </div>

    </div>
  );
};

//Here, we are receiving the subtask as a prop instead of fetching it
SubtaskDetails.propTypes = {
  task: PropTypes.object,
  subtask: PropTypes.object,
  taskId: PropTypes.string.isRequired, // Added taskId validation
  onUpdateSubtask: PropTypes.func,
  onDeleteSubtask: PropTypes.func,
};
export default SubtaskDetails;

