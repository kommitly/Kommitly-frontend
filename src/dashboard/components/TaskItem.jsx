
import PropTypes from 'prop-types';
import { FaCalendarAlt, FaClock, FaTasks, } from "react-icons/fa"; // Calendar icon
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const TaskItem = ({
  task,
  setTask,
  setSelectedFile,
  newSubtask,
  setNewSubtask,
  showInput,
  setShowInput,
  handleAddSubtask,
  handleSubtaskToggle,
  totalSubtasks,
  setSelectedSubtask,
  subTaskProgress = 0, // Default progress value




 
})=> {
 


//change in task properties
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTask((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleDueDateChange = (date) => {
      setTask((prev) => ({
        ...prev,
        due_date: date?.toISOString(), // Convert date to string for compatibility with backend
      }));
    };
    const handleReminderTimeChange = (date) => {
  setTask((prev) => ({
    ...prev,
    reminder_time: date instanceof Date && !isNaN(date) ? date.toISOString() : null,
  }));
};


return (
<div className="w-full  flex flex-wrap  ">
<div className="flex  gap-4 mt-2">
      <div className="flex items-center  space-x-2">
        {/* Description Icon */}
        <FaTasks className="text-gray-500" />
        {/* Label */}
        <label htmlFor="description" className="text-gray-700">
          Description
        </label>
        </div>
        {/* Description Input */}
      
      <div className="w-full flex flex-wrap  ">
      <textarea
      name="description"
        className="pl-2 w-full flex flex-wrap rounded "
        value={task.description || ''} 
        onChange={handleChange}
      />
      
      </div>
      </div>

<div className="mt-4 flex gap-8">
      <div className="flex items-center space-x-2">
        {/* Calendar Icon */}
        <FaCalendarAlt className="text-gray-500" />
        {/* Label */}
        <label htmlFor="due-date" className="text-gray-700">
          Due Date
        </label>
        </div>
        {/* Date Picker Input */}
        <div className="relative">
          <DatePicker
            id="due-date"
            selected={task.due_date ? new Date(task.due_date) : null}
            onChange={handleDueDateChange}
            showTimeSelect
            dateFormat="yyyy-MM-dd h:mm aa"
            className="p-2 pl-10  rounded"
          />
        
      </div>
    </div>

    
<div className="flex gap-7 mt-4">
  <div className="flex items-center space-x-2">
    {/*Clock icon*/}
    <FaClock className="  text-gray-500" />
    {/*Label*/}
    <label htmlFor="reminder-time" className="text-gray-700">Reminder</label>
    </div>
    {/*Time Picker Input*/}
    <div className="relative">
  <DatePicker
    id="reminder-time"
    selected={
    task.reminder_time && !isNaN(new Date(task.reminder_time))
      ? new Date(task.reminder_time)
      : null
  }
    onChange={handleReminderTimeChange}
    showTimeSelect
    showTimeSelectOnly
    timeIntervals={15}
    timeCaption="Time"
    dateFormat="h:mm aa" // Or "HH:mm" for 24-hour format
    placeholderText=""
    className="p-2 pl-10 rounded border-gray-300 w-full"
  />
  
  
</div>

</div> 

<div className="flex mt-4 gap-14">
      <div className="flex items-center space-x-2 ">
        {/* Description Icon */}
        <FaTasks className="text-gray-500" />
        <label className="block text-gray-700">Priority</label>
        </ div>
        <div className="relative">
        <select
  value={task.priority || ''}
  onChange={(e) => setTask((prev) => ({ ...prev, priority: e.target.value }))}
  className="w-full p-2  rounded-md"
>
  <option value="Low">🟢 Low</option>
  <option value="Medium">🟡 Medium</option>
  <option value="High">🔴 High</option>
</select>
      </div>
      </div>

<div className="mt-4  w-full gap-4">
        <label className="block text-gray-700">Files and Media</label>
      <input
        type="file"
        className="mt-2 bg-[#6246AC] text-white px-4 py-2  border rounded hover:bg-purple-600"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
        </div>

   <div className="mt-4 p-4 w-full border rounded-lg">
      {/* Subtasks Title & Progress Bar */}
      <div className="flex justify-between  items-center">
        <label className="block text-gray-700 text-lg font-semibold">Subtasks</label>
        <progress value={subTaskProgress} max="100" className="w-2/3 h-2 bg-purple-300 rounded-lg"></progress>
      </div>

      {/* Subtask List */}
      {totalSubtasks > 0 ? (
        <ul className="mt-2">
          {task.subtasks.map((subtask, index) => (
            <li key={index} className="flex items-center gap-2 mt-1"
            onClick={() => setSelectedSubtask(subtask)}
            >
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleSubtaskToggle(index)}
                className="w-4 h-4"
              />
              <span className={subtask.completed ? "line-through text-gray-500" : ""}>
                {subtask.title}
               
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-2">No subtasks available</p>
      )}

       

      {/* Add Subtask Button & Input Field */}
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
          onClick={() => setShowInput(true)}
          className="mt-3 text-[#6246AC] hover:underline"
        >
          + Add Subtask
        </button>
      )}
   
   
    </div>        

    </div>
      );
    
    
  }; 
  
  TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  setTask: PropTypes.func.isRequired,
  setSelectedFile: PropTypes.func,
  newSubtask: PropTypes.string.isRequired,
  setNewSubtask: PropTypes.func.isRequired,
  showInput: PropTypes.bool.isRequired,
  setShowInput: PropTypes.func.isRequired,
  handleAddSubtask: PropTypes.func.isRequired,
  handleSubtaskToggle: PropTypes.func.isRequired,
  totalSubtasks: PropTypes.number.isRequired,
  setSelectedSubtask: PropTypes.func.isRequired,
  subTaskProgress: PropTypes.number, // Optional, default is 0

  
};

export default TaskItem;