import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGoalById, createTask, fetchTasksByGoalId, deleteGoalById } from '../../../utils/Api';
import { motion } from 'framer-motion';
import survey from '../../../assets/survey.svg';
import flag from '../../../assets/flag-dynamic-color.svg';
import { GoalsContext } from '../../../context/GoalsContext';

import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TextField, Button, Typography
} from '@mui/material';

const Goal = () => {
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isGoalRenaming, setIsGoalRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { removeGoal, addGoalToSidebar } = useContext(GoalsContext);
  const inputGoalRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [taskMenuVisible, setTaskMenuVisible] = useState(null);



  const loadGoal = useCallback(async () => {
    try {
      const fetchedGoal = await fetchGoalById(goalId);
      setGoal(fetchedGoal);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  const loadTasks = useCallback(async () => {
    try {
      const fetchedTasks = await fetchTasksByGoalId(goalId);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [goalId]);

  useEffect(() => {
    setGoal(null);
    setTasks([]);
    setLoading(true);
    loadGoal();
    loadTasks();
  }, [goalId, loadGoal, loadTasks]);
  
  useEffect(() => {
    if (isGoalRenaming) {
      inputGoalRef.current?.focus();
    }
  }, [isGoalRenaming]);
  
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask) return;

    try {
      const createdTask = await createTask({ goal: goalId, title: newTask });
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setNewTask('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDelete = async () => {
      try {
        await deleteGoalById(goalId);
        
        removeGoal(goalId); // Remove from state immediately
        navigate('/dashboard/goals');
      } catch (error) {
        setError(error.message);
      }
    };
    

  if (loading) {
    return (
      <div className='w-full mt-8 flex min-h-screen'>
        <div className="w-11/12 p-8 mt-8 py-8 flex-1 flex justify-center items-center overflow-y-auto max-h-[75vh]">
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

  if (error) return <div>Error: {error}</div>;
  if (!goal) return <div>Goal not found</div>;


  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleTaskMenu = (id) => {
    setTaskMenuVisible(prevId => (prevId === id ? null : id));
  };

  
  

  const handleUpdate = async () => {
    if (!newTitle.trim() || newTitle === goal.title) {
      setIsGoalRenaming(false); // Cancel rename if empty or unchanged
      return;
    }

     try {
          await updateGoalById(goalId, newTitle, goal.description);
          setGoal((prevGoal) => ({ ...prevGoal, title: newTitle }));
          setIsGoalRenaming(false);
          setMenuVisible(false);
        } catch (error) {
          setError(error.message);
        }
  };

  return (
    <div className='w-full  min-h-screen p-6'>
      <div className='w-full'>
        <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
        🚩
        {isGoalRenaming ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate()} // Only update on Enter key
                      onBlur={handleUpdate} // Update when clicking away
                      ref={inputGoalRef}
                      className="md:text-md font-semibold border-b border-b-[#6246AC] p-1 focus:outline-none"
                    />
                  ) : (
                    <h1 className='md:text-lg  xl:text-lg 2xl:text-xl font-medium'>{goal.title}</h1>
                  )}
        </div>


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
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button 
                      onClick={() => {
                        setIsGoalRenaming(true);
                        setTimeout(() => inputGoalRef.current?.focus(), 0); // Ensure focus on input
                      }} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F4F1FF]"
                    >
                      Rename
                    </button>
                    <button onClick={() => addGoalToSidebar(goal.id)}  className="block w-full text-left px-4 py-2 text-sm text-[#006FDB] hover:bg-[#F4F1FF]">
                      Pin to Sidebar
                    </button>

                    <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-[#E60178] hover:bg-[#F4F1FF]">Delete</button>
                  </div>
                )}
              </div>




        </div>
        

      








{/* {
        <Typography variant="subtitle1" color="textSecondary">
          Category: {goal.category}
        </Typography>} */}

        <Typography variant="h6" mt={4}>Tasks</Typography>

        {/* Add Task Form */}
        <Box component="form" onSubmit={handleAddTask} display="flex" gap={2} mt={2}>
          <TextField
            label="New Task"
            variant="outlined"
            size="small"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Task
          </Button>
        </Box>

        {/* Task Table */}
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F4F1FF' }}>
                <TableCell><strong>Task</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Due date</strong></TableCell>
                <TableCell><strong>Last Updated</strong></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.due_date ? new Date(task.due_date).toLocaleString() : 'Not set'}</TableCell>
                    <TableCell>{new Date(task.last_updated).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">No tasks added yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    
    </div>
  );
};

export default Goal;
