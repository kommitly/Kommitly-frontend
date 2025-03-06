import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { fetchGoalById } from '../../../utils/Api'
import { motion } from 'framer-motion'

const Goal = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskCompletionStatus, setTaskCompletionStatus] = useState([]); // Track completion of each task
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [newTask, setNewTask] = useState(''); // Track new task input
  const [tasks, setTasks] = useState([]); // Track manually added tasks


  const loadGoal = useCallback(async () => {
    try {
      const fetchedGoal = await fetchGoalById(goalId);
      setGoal(fetchedGoal);

      // Check if ai_tasks is defined and is an array
      if (Array.isArray(fetchedGoal.ai_tasks)) {
        // Update taskCompletionStatus based on fetched goal data
        setTaskCompletionStatus(fetchedGoal.ai_tasks.map(task => task.status === 'completed'));

        const inProgressTaskIndex = fetchedGoal.ai_tasks.findIndex(task => task.status === 'in-progress');
        setActiveTaskIndex(inProgressTaskIndex !== -1 ? inProgressTaskIndex : 0);
      } else {
        setTaskCompletionStatus([]);
        setActiveTaskIndex(0);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    loadGoal();
  }, [loadGoal]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: tasks.length + 1, title: newTask }]);
      setNewTask('');
    }
  };


  console.log('Goal:', goal); // Debugging

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!goal) {
    return (
      <div className='w-full mt-8 flex min-h-screen'>
        <div className="w-11/12 p-8 mt-8 py-8 flex-1 overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
          Goal not found
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-lg font-medium text-[#00000]'>
      {goal.title}
      </h1>

      <div className='flex items-center gap-4 mt-4'>
        <p>Category</p>
        <p>{goal.category}</p>

      </div>

      <div className='gap-4 mt-4'>
        <form onSubmit={handleAddTask} className='flex items-center gap-4'>
          <input
            type='text'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder='Add a task'
            className='p-2 border border-gray-300 rounded-md'
          />
          <button type='submit' className='bg-[#6246AC] text-white px-4 py-2 rounded-md'>
            Add Task
          </button>
        </form>

        <div className='mt-4'>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className='flex items-center gap-4'>
                <input
                  type='radio'
                  id={`task-${task.id}`}
                  name='task'
                  value={task.id}
                />

<label htmlFor={`task-${task.id}`} className='text-[#1D1B20]'>
                  {task.title}
                </label>
              </div>
            ))
          ) : (
            <p>No tasks added yet</p>
          )}
        </div>
      </div>

     
    
      </div>
  )
}

export default Goal