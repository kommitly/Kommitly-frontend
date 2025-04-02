import React from "react";
import PropTypes from "prop-types";
import { FaCalendarAlt, FaClock, FaFlag, FaTasks  } from "react-icons/fa"; // Calendar icon

const SubtaskDetails = ({ subtask }) => {


  if (!subtask) {
    return <p className="text-gray-500 mt-30 align-centre">Click on a subtask to view details.</p>;
  }

  return (
    <div className="bg-white mt-20 p-6 rounded-lg shadow-md">
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
        className="pl-6 rounded "
        value={subtask.description}
        onChange={handleChange}
      />
      </div>
      </div>
      </div>

      <div className="mt-4 ">
      <div className="flex items-center  space-x-2">
        {/* Description Icon */}
        <FaTasks className="text-gray-500" />
        {/* Label */}
        <label htmlFor="description" className="text-gray-700">
          Due Date
        </label>
        {/* Description Input */}
      
      <div className="relative mt-6 ">
      <textarea
      name="description"
        className="pl-6 rounded "
        value={subtask.due_date}
        onChange={handleChange}
      />
      </div>
      </div>
      </div>
      <p className="text-gray-600 mt-2">
        <strong>Status:</strong> {subtask.completed ? "Completed" : "Pending"}
      </p>
    </div>
  );
};
SubtaskDetails.propTypes = {
  subtask: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    completed: PropTypes.bool,
  }),
};

export default SubtaskDetails;

