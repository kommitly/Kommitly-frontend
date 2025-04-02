import { useContext, useEffect, useState, useRef } from "react";
import { TasksContext} from '../../../context/TasksContext';
import { GoalsContext } from '../../../context/GoalsContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoSearch } from "react-icons/io5";  // Correct module for IoSearch
import Backdrop from '@mui/material/Backdrop'; // Import Backdrop from MUI
import analysis from '../../../assets/analyze-data.svg'; // Adjust the path as necessary
import { createTask } from "../../../utils/Api";
import aiGoals from '../../../assets/goals.svg';
import CalendarComponent from './Calendar';
import dayjs from "dayjs";




const Tasks = () => {
  const navigate = useNavigate();
  const {tasks, addTask} = useContext(TasksContext); // Use the TasksContext
  const {goals, ai_goals} = useContext(GoalsContext); // Use the GoalsContext
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedAiCategory, setSelectedAiCategory] = useState('recentlyAdded');
  const [selectedCategory, setSelectedCategory] = useState('recentlyAdded');
  const tasksContainerRef = useRef(null);
  const [title, setTitle] = useState('');
  const aiTasksContainerRef = useRef(null);
  const [open, setOpen] = useState(false);



  useEffect(() => {
    if (tasks.length > 0) { // Check if tasks array has items
      setLoading(false);
      console.log("tasks", tasks);
    }
    if (goals.goals && goals.ai_goals) {
      setLoading(false);
      console.log("ai goals", goals.ai_goals);
    }
  }, [tasks, goals]);
  
  

  // Filter tasks based on selected date
  const filteredTasksByDate = tasks.filter((task) => {
    if (!task.due_date) return false; // Ensure task has a due date
  
    const taskDate = new Date(task.due_date).toISOString().split("T")[0]; // Extract "YYYY-MM-DD"
    const selectedDateFormatted = selectedDate.format("YYYY-MM-DD"); // Ensure consistency
  
    return taskDate === selectedDateFormatted;
  });
  
  //filter ai tasks
  const filterAiTasks = (category) => {
    if (!goals.ai_goals || goals.ai_goals.length === 0) return [];
  
    const aiTasks = goals.ai_goals.flatMap(goal => goal.ai_tasks) ?? [];
    console.log("AI Tasks:", aiTasks);
  
    switch (category) {
      case 'recentlyAdded':
        return [...aiTasks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'inProgress':
        return aiTasks.filter(task => task.progress > 0 && task.progress < 100);
      case 'pending':
        return aiTasks.filter(task => task.progress === 0);
      case 'completed':
        return aiTasks.filter(task => task.progress === 100);
      default:
        return [];
    }
  };
  
  
  
  const filterTasks = (category) => {
    switch (category) {
      case 'recentlyAdded':
        return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'inProgress':
        return tasks.filter(task => task.progress > 0 && task.progress < 100);
      case 'pending':
        return tasks.filter(task => task.progress === 0);
      case 'completed':
        return tasks.filter(task => task.progress === 100);
      default:
        return [];
    }
  };
  

  const openModal = () => {
    setOpen(true);
  }


  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTask = async () => {
      if (!title) {
        alert("Please enter title !");
        return;
      }
    
      try {
        const newTask = await createTask({title: title}); // Ensure this returns the goal object with an ID
        addTask(newTask); // Add the new task to the context
        setOpen(false);
        alert("New task created")
        //navigate(`/dashboard/task/${newTask.id}`); // Use newTask.id instead of undefined goal.id
      } catch (error) {
        console.error("Error creating task:", error);
      }
    };
    
    const scrollTasks = (direction) => {
      if (tasksContainerRef.current) {
        const scrollAmount = direction === 'left' ? -300 : 300;
        tasksContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };
    const scrollAiTasks = (direction) => {
      if (aiTasksContainerRef.current) {
        const scrollAmount = direction === 'left' ? -300 : 300;
        aiTasksContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

  const filteredTasks = filterTasks(selectedCategory);
  const filteredAiTasks = filterAiTasks(selectedAiCategory);

  const toggleTaskMenu = (taskId) => {
    console.log(`Toggled task menu for task ID: ${taskId}`);
  };
  
  
    if (loading) {
      return (
        <div className='w-full mt-8 flex min-h-screen'>
          <div className="w-11/12 p-8 mt-8 py-8 flex-1 flex justify-center items-center overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
            <motion.div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[#65558F] rounded-full"
                  initial={{ y: -10 }}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      );
    }
  
    return (
<div className="w-full  grid gap-1 grid-cols-12  flex min-h-screen">
    <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={open}
          onClick={handleClose} // Clicking outside should close it
        >
          <div 
            className="bg-white w-4/12 p-6 rounded-lg shadow-lg text-center" 
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
            <div className='flex w-full mb-4 justify-end'>
            <div className='flex w-2/3 items-center justify-between'>
            <h1 className='text-xl font-bold text-[#6F2DA8] mt-4 flex items-center justify-center gap-2'>
              New Task
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
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

            </div>
            
           

            <div className="flex items-center mb-4 gap-4">
              <p className='text-sm text-start w-20 text-[#000000]'>Title</p>
              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border text-black border-gray-200 rounded-lg focus:outline-none"
              />
            </div>
            <button onClick={handleAddTask} className="mt-4 px-4 py-2 bg-[#6200EE] text-white rounded-lg">
              Add Task
            </button>
          
          </div>
    </Backdrop>

    <div className="col-span-8 flex-1 overflow-y-auto scrollbar-hide  no-scrollbar"> 
        <div className='flex items-center justify-between '>
       <div>
       <h1 className='mt-8 text-[#4F378A] space-x-1 font-semibold text-xl'>
        <span className='text-black'>
        Hello

        </span>
        <span>
        Marie

        </span>
        <span role="img" aria-label="waving hand" className='ml-2'>
    👋
        </span>
       </h1>
        <p className='text-[#2C2C2C] font-light text-xs'>
          Let's take a dive into your tasks
        </p>

      
       </div>

      <div className='p-3 rounded-full bg-[#F4F1FF] flex items-center justify-center '
        >
          <IoSearch size={20} className='text-[#4A4459]' />
        </div>
        </div>
        <div className='w-full container h-40 flex items-center justify-between rounded-2xl bg-[#F4F1FF] p-8 mt-4'>
                  <div className='space-y-4'>
                    <h1 className='text-2xl font-semibold'>Manage your Tasks</h1>
                    <button onClick={openModal}  className='bg-[#6246AC] flex items-center text-sm font-light text-white px-4 gap-2 py-2 rounded-md'>
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
                        style={{ stroke: '#FFFFFF' }} // Inline style to ensure white stroke
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add New Task
                    </button>
                  </div>
                  <img src={analysis} alt='Analysis' className='h-36' />
                </div>

  <div>
        <h1 className='text-lg font-medium mt-8'>AI Tasks</h1>
       <div className='flex space-x-4 mt-4'>
        <button onClick={() => setSelectedAiCategory('recentlyAdded')} className={`px-4 font-light cursor-pointer py-2 rounded-md ${selectedAiCategory === 'recentlyAdded' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Recently Added</button>
        <button onClick={() => setSelectedAiCategory('inProgress')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedAiCategory === 'inProgress' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>In Progress</button>
        <button onClick={() => setSelectedAiCategory('pending')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedAiCategory === 'pending' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Pending</button>
        <button onClick={() => setSelectedAiCategory('completed')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedAiCategory === 'completed' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Completed</button>
       </div>
      </div>

      <div className='relative mt-4'>
        <button 
        onClick={() => scrollAiTasks('left')} 
        className='absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center'
        >  
        <svg xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
       <polyline points="15 18 9 12 15 6" />
        </svg>
        </button>
      <div ref={aiTasksContainerRef} className='flex gap-2 overflow-x-auto no-scrollbar  w-full'>
        {filteredAiTasks.map((task) => (
          <Link key={task.id} to={`/dashboard/ai-task/${task.id}`}>
          <li className='bg-[#F4F1FF] w-1/3 min-w-[300px] min-h-[100px] list-none rounded-lg'>
          <div className='flex w-full items-center gap-2 p-2'>
            <div className='w-1/3 bg-white rounded-lg p-4'>
              <img src={aiGoals} alt="goals" className='h-20'/>
            </div>
            <div className='w-2/3 h-24 flex flex-col gap-2'>
              <div className='flex items-start h-10 mb-4 justify-between'>
                <span className='w-full h-auto font-medium'>
                  {task.title}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65558F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer" onClick={() => toggleTaskMenu(task.id)}>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </div>
              <div className="flex items-center">
                  <p className="w-20 md:text-xs xl:text-xs 2xl:text-sm font-medium text-[#65558F]">Timeline:</p>
                  <span className="px-3 py-0.5 border border-[#65558F] 2xl:text-sm  rounded-sm md:text-xs xl:text-xs text-[#65558F]">
                  {task.task_timeline}
                  </span>
                  </div>
            </div>
          </div>
          </li>
          </Link>
        ))}
     </div>
     <button onClick={() => scrollAiTasks('right')} className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 w-10 h-10 p-2 rounded-full cursor-pointer'>
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <polyline points="9 18 15 12 9 6" />
       </svg>
     </button>
    </div>

    <div>
      <h1 className='text-lg font-medium mt-8'>Tasks</h1>
      <div className='flex space-x-4 mt-4'>
        <button onClick={() => setSelectedCategory('recentlyAdded')} className={`px-4 font-light cursor-pointer py-2 rounded-md ${selectedCategory === 'recentlyAdded' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Recently Added</button>
        <button onClick={() => setSelectedCategory('inProgress')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedCategory === 'inProgress' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>In Progress</button>
        <button onClick={() => setSelectedCategory('pending')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedCategory === 'pending' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Pending</button>
        <button onClick={() => setSelectedCategory('completed')} className={`px-4 py-2 font-light cursor-pointer rounded-md ${selectedCategory === 'completed' ? 'bg-[#6246AC] text-white' : 'bg-gray-200'}`}>Completed</button>
      </div>
    </div>
    <div className='relative mt-4'>
        <button onClick={() => scrollTasks('left')} className='absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center'
        >  <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
           </svg>
        </button>
          <div ref={tasksContainerRef} className='flex gap-2 overflow-x-auto no-scrollbar  w-full'>
            {filteredTasks.map((task) => (
              <Link key={task.id} to={`/dashboard/task/${task.id}`}> 
              <li className='bg-[#F4F1FF] w-1/3 min-w-[300px] min-h-[100px] list-none  rounded-lg'>
                <div className='flex w-full items-center gap-2 p-2'>
                  <div className='w-1/3 bg-white rounded-lg p-4'>
                   <img src={aiGoals} alt="goals"  className='h-20'/>
                  </div>
                  <div className='w-2/3 h-24  flex flex-col '>
                    <div className='flex h-10 mb-4 items-center  justify-between'>
                    <span className='w-full h-auto font-medium'>
                    {task.title}
                    </span>
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
                              onClick={() => toggleTaskMenu(task.id)} 
                            >
                              <circle cx="12" cy="5" r="1"></circle>
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                    </div>
                  </div>  
                    
                </div>
              </li>
              </Link>
            ))}
          </div>
        <button onClick={() => scrollTasks('right')} className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 w-10 h-10 p-2 rounded-full cursor-pointer'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
              >
               <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
    </div>

       

      
</div> 
<div className=' mt-6 col-span-4 bg-[#F4F1FF] space-y-4 mx-4 rounded-2xl  p-6'>

      {/* Calendar Component */}
      <div className="calendar">
      <CalendarComponent onDateChange={setSelectedDate} />
      </div>

      {/* Task List */}
      <h3 className="text-lg font-medium pl-2 text-gray-800">
          Tasks for {selectedDate.format("YYYY-MM-DD")}
        </h3>
      <div className="mt-4  bg-white rounded-xl  p-4">
        {filteredTasksByDate.length ? (
          filteredTasksByDate.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white  p-4 my-3 md:space-y-2 xl:space-y-2 rounded-xl border-l-[#4F378A] xl:border-l-[2px] 2xl:border-l-[2.5px] lg:border-l-[2.5px] md:border-l-[2.5px] 2xl:w-10/12 md:w-11/12" style={{ boxShadow: '2px 3px 8px 2px rgba(101, 85, 143, 0.2), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}
            >
              <div>
                <p className=" h-auto text-1g font-medium text-gray-900">{task.title}</p>
                <p className="text-sm text-gray-600">{task.duration}</p>
              </div>
              <button className="px-3 py-1 bg-[#6246AC] text-white text-sm rounded-lg hover:bg-purple-600">
                Time
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No tasks for this day</p>
        )}

<button onClick={openModal}  className='bg-[#6246AC] flex items-center text-sm font-light text-white px-4 gap-2 py-2 rounded-md'>
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
                        style={{ stroke: '#FFFFFF' }} // Inline style to ensure white stroke
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add New Task
                    </button>
      </div>
    



  
  </div> 
</div>
    
  );
};

export default Tasks;
