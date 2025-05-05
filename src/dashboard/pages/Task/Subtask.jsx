
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaCalendarAlt, FaClock, FaFlag, FaTasks  } from "react-icons/fa"; // Calendar icon
import DatePicker from "react-datepicker";


const SubtaskDetails = ({ subtask, taskId, onUpdateSubtask, onDeleteSubtask }) => {
  if (!subtask) {
    return <p className="text-gray-500 mt-30 align-centre">Click on a subtask to view details.</p>;
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
    <div className="bg-[#F4F1FF] mt-20 p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">{subtask.title}</h2>
      
      <div className="mt-4 ">
      <div className="flex items-center  space-x-2">
        {/* Description Icon */}
        <FaTasks className="text-gray-500" />
        {/* Label */}
        <label htmlFor="description" className="text-gray-700">
          Description
        </label>
        {/* Description Input */}
      
      <div className="relative mt-6 ">
      <textarea
      name="description"
      className="pl-6 rounded"
      value={localSubtask.description || ""}
      onChange={handleSubtaskChange}
    />
      </div>
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
                  className="p-2 pl-10  rounded"
                />
              </div>
            </div>
          </div>
      <p className="text-gray-600 mt-2">
        <strong>Status:</strong> {localSubtask.completed ? "Completed" : "Pending"}
      </p>

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

